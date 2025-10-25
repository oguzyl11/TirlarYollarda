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
            search,
            city,
            loadType,
            vehicleType,
            minAmount,
            maxAmount,
            sortBy = 'newest',
            page = 1,
            limit = 12
        } = req.query;

        console.log('Get jobs request with filters:', req.query);

        // Build query object
        let query = { status: 'active' };

        // Arama filtresi
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { 'route.from.city': { $regex: search, $options: 'i' } },
                { 'route.to.city': { $regex: search, $options: 'i' } }
            ];
        }

        // Şehir filtresi
        if (city) {
            query.$or = [
                { 'route.from.city': { $regex: city, $options: 'i' } },
                { 'route.to.city': { $regex: city, $options: 'i' } }
            ];
        }

        // Yük tipi filtresi
        if (loadType) {
            query['loadDetails.type'] = loadType;
        }

        // Araç tipi filtresi
        if (vehicleType) {
            query['vehicleRequirements.type'] = vehicleType;
        }

        // Fiyat filtresi
        if (minAmount || maxAmount) {
            query['payment.amount'] = {};
            if (minAmount) query['payment.amount'].$gte = parseInt(minAmount);
            if (maxAmount) query['payment.amount'].$lte = parseInt(maxAmount);
        }

        // Sorting
        let sort = {};
        switch (sortBy) {
            case 'newest':
                sort = { createdAt: -1 };
                break;
            case 'oldest':
                sort = { createdAt: 1 };
                break;
            case 'highest':
                sort = { 'payment.amount': -1 };
                break;
            case 'lowest':
                sort = { 'payment.amount': 1 };
                break;
            case 'most_viewed':
                sort = { views: -1 };
                break;
            default:
                sort = { createdAt: -1 };
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Execute query
        const jobs = await Job.find(query)
            .populate('postedBy', 'profile employerDetails')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        const totalJobs = await Job.countDocuments(query);

        console.log(`Found ${jobs.length} jobs out of ${totalJobs} total`);

        res.json({
            success: true,
            data: jobs,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalJobs / parseInt(limit)),
                totalJobs,
                hasNext: skip + jobs.length < totalJobs,
                hasPrev: parseInt(page) > 1
            }
        });
    } catch (error) {
        console.error('Get jobs error:', error);
        res.status(500).json({
            success: false,
            message: 'İlanlar getirilirken hata oluştu'
        });
    }
});

// @route   GET /api/jobs/:id
// @desc    Get single job by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('postedBy', 'profile employerDetails')
            .populate('bids.driver', 'profile driverDetails');

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'İlan bulunamadı'
            });
        }

        // Increment view count
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
            message: 'İlan getirilirken hata oluştu'
        });
    }
});

// @route   POST /api/jobs
// @desc    Create new job
// @access  Private
router.post('/', auth, [
    body('title').trim().notEmpty().withMessage('Başlık gereklidir'),
    body('description').trim().notEmpty().withMessage('Açıklama gereklidir'),
    body('route.from.city').trim().notEmpty().withMessage('Başlangıç şehri gereklidir'),
    body('route.to.city').trim().notEmpty().withMessage('Varış şehri gereklidir')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Lütfen tüm zorunlu alanları doldurun',
                errors: errors.array()
            });
        }

        const jobData = req.body;
        jobData.postedBy = req.user.userId; // Gerçek kullanıcı ID'sini kullan

        // Date string'lerini Date objelerine çevir
        if (jobData.schedule?.startDate) {
            jobData.schedule.startDate = new Date(jobData.schedule.startDate);
        }
        if (jobData.schedule?.endDate) {
            jobData.schedule.endDate = new Date(jobData.schedule.endDate);
        }

        // Boş string'leri undefined yap (MongoDB validation için)
        if (jobData.loadDetails?.type === '') {
            jobData.loadDetails.type = undefined;
        }
        if (jobData.vehicleRequirements?.type === '') {
            jobData.vehicleRequirements.type = undefined;
        }

        console.log('Processed job data:', jobData);

        const job = new Job(jobData);
        await job.save();

        await job.populate('postedBy', 'profile employerDetails');

        console.log('New job created:', job._id);

        res.status(201).json({
            success: true,
            message: 'İlan başarıyla oluşturuldu',
            data: job
        });
    } catch (error) {
        console.error('Create job error:', error);
        res.status(500).json({
            success: false,
            message: 'İlan oluşturulurken hata oluştu'
        });
    }
});

// @route   GET /api/jobs/user/my-jobs
// @desc    Get user's own jobs
// @access  Private
router.get('/user/my-jobs', auth, async (req, res) => {
    try {
        console.log('Get my jobs for user:', req.user.userId);

        const jobs = await Job.find({ postedBy: req.user.userId })
            .populate('postedBy', 'profile employerDetails')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: jobs
        });
    } catch (error) {
        console.error('Get my jobs error:', error);
        res.status(500).json({
            success: false,
            message: 'İşleriniz getirilirken hata oluştu'
        });
    }
});

// @route   PUT /api/jobs/:id
// @desc    Update job
// @access  Private
router.put('/:id', auth, async (req, res) => {
    try {
        const jobId = req.params.id;
        const jobData = req.body;
        console.log('Update job request for ID:', jobId, 'by user:', req.user.userId);

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'İlan bulunamadı'
            });
        }

        // Check if user owns the job
        if (job.postedBy.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: 'Bu işi düzenleme yetkiniz yok'
            });
        }

        // Update job
        Object.assign(job, jobData);
        job.updatedAt = new Date();
        await job.save();

        await job.populate('postedBy', 'profile employerDetails');

        console.log('Job updated successfully');

        res.json({
            success: true,
            message: 'İlan başarıyla güncellendi',
            data: job
        });
    } catch (error) {
        console.error('Update job error:', error);
        res.status(500).json({
            success: false,
            message: 'İlan güncellenirken hata oluştu'
        });
    }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete job
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const jobId = req.params.id;
        console.log('Delete job request for ID:', jobId, 'by user:', req.user.userId);

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'İlan bulunamadı'
            });
        }

        // Check if user owns the job
        if (job.postedBy.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: 'Bu işi silme yetkiniz yok'
            });
        }

        await Job.findByIdAndDelete(jobId);

        console.log('Job deleted successfully');

        res.json({
            success: true,
            message: 'İlan başarıyla silindi'
        });
    } catch (error) {
        console.error('Delete job error:', error);
        res.status(500).json({
            success: false,
            message: 'İlan silinirken hata oluştu'
        });
    }
});

module.exports = router;