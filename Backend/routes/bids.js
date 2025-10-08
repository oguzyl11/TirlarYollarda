const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Bid = require('../models/Bid');
const Job = require('../models/Job');
const auth = require('../middleware/auth');

// @route   POST /api/bids
// @desc    Create new bid
// @access  Private
router.post('/', auth, [
    body('job').isMongoId(),
    body('amount').isNumeric(),
    body('message').optional().isLength({ max: 500 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { job, amount, message, proposedStartDate, estimatedDuration } = req.body;

        // Check if job exists
        const jobData = await Job.findById(job);
        if (!jobData) {
            return res.status(404).json({
                success: false,
                message: 'Ýlan bulunamadý'
            });
        }

        // Check if job is active
        if (jobData.status !== 'active') {
            return res.status(400).json({
                success: false,
                message: 'Bu ilana teklif verilemez'
            });
        }

        // Can't bid on your own job
        if (jobData.postedBy.toString() === req.user.userId) {
            return res.status(400).json({
                success: false,
                message: 'Kendi ilanýnýza teklif veremezsiniz'
            });
        }

        // Check if already bidded
        const existingBid = await Bid.findOne({
            job,
            bidder: req.user.userId
        });

        if (existingBid) {
            return res.status(400).json({
                success: false,
                message: 'Bu ilana zaten teklif verdiniz'
            });
        }

        // Create bid
        const bid = new Bid({
            job,
            bidder: req.user.userId,
            amount,
            message,
            proposedStartDate,
            estimatedDuration
        });

        await bid.save();

        // Add bid to job
        jobData.bids.push(bid._id);
        await jobData.save();

        const populatedBid = await Bid.findById(bid._id)
            .populate('bidder', 'profile rating')
            .populate('job', 'title');

        res.status(201).json({
            success: true,
            message: 'Teklif baþarýyla gönderildi',
            data: populatedBid
        });
    } catch (error) {
        console.error('Create bid error:', error);
        res.status(500).json({
            success: false,
            message: 'Teklif gönderilirken hata oluþtu'
        });
    }
});

// @route   GET /api/bids/my-bids
// @desc    Get current user's bids
// @access  Private
router.get('/my-bids', auth, async (req, res) => {
    try {
        const bids = await Bid.find({ bidder: req.user.userId })
            .populate('job', 'title route status')
            .populate({
                path: 'job',
                populate: {
                    path: 'postedBy',
                    select: 'profile rating'
                }
            })
            .sort('-createdAt');

        res.json({
            success: true,
            data: bids
        });
    } catch (error) {
        console.error('Get my bids error:', error);
        res.status(500).json({
            success: false,
            message: 'Teklifler getirilirken hata oluþtu'
        });
    }
});

// @route   PATCH /api/bids/:id/status
// @desc    Update bid status (accept/reject)
// @access  Private
router.patch('/:id/status', auth, [
    body('status').isIn(['accepted', 'rejected'])
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const bid = await Bid.findById(req.params.id).populate('job');

        if (!bid) {
            return res.status(404).json({
                success: false,
                message: 'Teklif bulunamadý'
            });
        }

        // Only job owner can accept/reject bids
        if (bid.job.postedBy.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: 'Bu iþlem için yetkiniz yok'
            });
        }

        const { status } = req.body;

        bid.status = status;
        await bid.save();

        // If accepted, update job status and set acceptedBid
        if (status === 'accepted') {
            bid.job.status = 'in-progress';
            bid.job.acceptedBid = bid._id;
            await bid.job.save();

            // Reject all other bids
            await Bid.updateMany(
                { job: bid.job._id, _id: { $ne: bid._id } },
                { status: 'rejected' }
            );
        }

        res.json({
            success: true,
            message: status === 'accepted' ? 'Teklif kabul edildi' : 'Teklif reddedildi',
            data: bid
        });
    } catch (error) {
        console.error('Update bid status error:', error);
        res.status(500).json({
            success: false,
            message: 'Teklif durumu güncellenirken hata oluþtu'
        });
    }
});

// @route   DELETE /api/bids/:id
// @desc    Withdraw bid
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const bid = await Bid.findById(req.params.id);

        if (!bid) {
            return res.status(404).json({
                success: false,
                message: 'Teklif bulunamadý'
            });
        }

        // Only bidder can withdraw
        if (bid.bidder.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: 'Bu iþlem için yetkiniz yok'
            });
        }

        if (bid.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Sadece bekleyen teklifler geri çekilebilir'
            });
        }

        bid.status = 'withdrawn';
        await bid.save();

        res.json({
            success: true,
            message: 'Teklif geri çekildi'
        });
    } catch (error) {
        console.error('Delete bid error:', error);
        res.status(500).json({
            success: false,
            message: 'Teklif geri çekilirken hata oluþtu'
        });
    }
});

module.exports = router;