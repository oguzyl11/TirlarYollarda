const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Job = require('../models/Job');
const auth = require('../middleware/auth');

// @route   GET /api/jobs
// @desc    Get all jobs with filters
// @access  Public
router.get('/', async (req, res) => {
    try {
        const {
            jobType,
            fromCity,
            toCity,
            loadType,
            startDate,
            minAmount,
            maxAmount,
            page = 1,
            limit = 10,
            sort = '-createdAt'
        } = req.query;

        const query = { status: 'active' };

        if (jobType) query.jobType = jobType;
        if (fromCity) query['route.from.city'] = new RegExp(fromCity, 'i');
        if (toCity) query['route.to.city'] = new RegExp(toCity, 'i');
        if (loadType) query['loadDetails.type'] = loadType;
        if (startDate) {
            query['schedule.startDate'] = {
                $gte: new Date(startDate)
            };
        }
        if (minAmount || maxAmount) {
            query['payment.amount'] = {};
            if (minAmount) query['payment.amount'].$gte = Number(minAmount);
            if (maxAmount) query['payment.amount'].$lte = Number(maxAmount);
        }

        const skip = (page - 1) * limit;

        const jobs = await Job.find(query)
            .populate('postedBy', 'profile rating')
            .sort(sort)
            .limit(Number(limit))
            .skip(skip);

        const total = await Job.countDocuments(query);

        res.json({
            success: true,
            data: jobs,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get jobs error:', error);
        res.status(500).json({
            success: false,
            message: 'Ýlanlar getirilirken hata oluþtu'
        });
    }
});

// @route   GET /api/jobs/:id
// @desc    Get single job
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('postedBy', 'profile rating verified')
            .populate({
                path: 'bids',
                populate: {
                    path: 'bidder',
                    select: 'profile rating'
                }
            });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Ýlan bulunamadý'
            });
        }

        // Increment views
        job.views += 1;
        await job.save();

        res.json({
            success: true,
            data: job
        });
    } catch (error) {
        console.error('Get job error:', error);
        res.status(500).json({
            success: false,
            message: 'Ýlan getirilirken hata oluþtu'
        });
    }
});

// @route   POST /api/jobs
// @desc    Create new job
// @access  Private
router.post('/', auth, [
    body('title').trim().notEmpty().isLength({ max: 100 }),
    body('description').trim().notEmpty().isLength({ max: 2000 }),
    body('jobType').isIn(['employer-seeking-driver', 'driver-seeking-job']),
    body('route.from.city').notEmpty(),
    body('route.to.city').notEmpty(),
    body('schedule.startDate').isISO8601()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const job = new Job({
            ...req.body,
            postedBy: req.user.userId
        });

        await job.save();

        // Update user's posted jobs count
        const User = require('../models/User');
        if (req.user.userType === 'employer') {
            await User.findByIdAndUpdate(req.user.userId, {
                $inc: { 'employerDetails.postedJobs': 1 }
            });
        }

        const populatedJob = await Job.findById(job._id)
            .populate('postedBy', 'profile rating');

        res.status(201).json({
            success: true,
            message: 'Ýlan baþarýyla oluþturuldu',
            data: populatedJob
        });
    } catch (error) {
        console.error('Create job error:', error);
        res.status(500).json({
            success: false,
            message: 'Ýlan oluþturulurken hata oluþtu'
        });
    }
});

// @route   PUT /api/jobs/:id
// @desc    Update job
// @access  Private
router.put('/:id', auth, async (req, res) => {
    try {
        let job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Ýlan bulunamadý'
            });
        }

        // Check ownership
        if (job.postedBy.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: 'Bu iþlem için yetkiniz yok'
            });
        }

        // Don't allow updating if job is not active
        if (job.status !== 'active') {
            return res.status(400).json({
                success: false,
                message: 'Sadece aktif ilanlar güncellenebilir'
            });
        }

        const allowedUpdates = ['title', 'description', 'route', 'loadDetails',
            'vehicleRequirements', 'schedule', 'payment'];

        const updates = {};
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        job = await Job.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true, runValidators: true }
        ).populate('postedBy', 'profile rating');

        res.json({
            success: true,
            message: 'Ýlan baþarýyla güncellendi',
            data: job
        });
    } catch (error) {
        console.error('Update job error:', error);
        res.status(500).json({
            success: false,
            message: 'Ýlan güncellenirken hata oluþtu'
        });
    }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete/Cancel job
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Ýlan bulunamadý'
            });
        }

        // Check ownership
        if (job.postedBy.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: 'Bu iþlem için yetkiniz yok'
            });
        }

        // Update status to cancelled instead of deleting
        job.status = 'cancelled';
        await job.save();

        res.json({
            success: true,
            message: 'Ýlan baþarýyla iptal edildi'
        });
    } catch (error) {
        console.error('Delete job error:', error);
        res.status(500).json({
            success: false,
            message: 'Ýlan iptal edilirken hata oluþtu'
        });
    }
});

// @route   GET /api/jobs/user/my-jobs
// @desc    Get current user's jobs
// @access  Private
router.get('/user/my-jobs', auth, async (req, res) => {
    try {
        const jobs = await Job.find({ postedBy: req.user.userId })
            .populate('bids')
            .sort('-createdAt');

        res.json({
            success: true,
            data: jobs
        });
    } catch (error) {
        console.error('Get my jobs error:', error);
        res.status(500).json({
            success: false,
            message: 'Ýlanlar getirilirken hata oluþtu'
        });
    }
});

module.exports = router;