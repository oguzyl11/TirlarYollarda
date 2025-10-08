const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Review = require('../models/Review');
const Job = require('../models/Job');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');

// @route   POST /api/reviews
// @desc    Create review
// @access  Private
router.post('/', auth, [
    body('reviewee').isMongoId(),
    body('job').isMongoId(),
    body('rating').isInt({ min: 1, max: 5 }),
    body('comment').trim().notEmpty().isLength({ max: 1000 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { reviewee, job, rating, comment, categories } = req.body;

        // Check if job is completed
        const jobData = await Job.findById(job);
        if (!jobData || jobData.status !== 'completed') {
            return res.status(400).json({
                success: false,
                message: 'Sadece tamamlanan iþler için yorum yapýlabilir'
            });
        }

        // Check if already reviewed
        const existingReview = await Review.findOne({
            reviewer: req.user.userId,
            reviewee,
            job
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'Bu iþ için zaten yorum yaptýnýz'
            });
        }

        // Can't review yourself
        if (reviewee === req.user.userId) {
            return res.status(400).json({
                success: false,
                message: 'Kendinize yorum yapamazsýnýz'
            });
        }

        const review = new Review({
            reviewer: req.user.userId,
            reviewee,
            job,
            rating,
            comment,
            categories
        });

        await review.save();

        const populatedReview = await Review.findById(review._id)
            .populate('reviewer', 'profile')
            .populate('reviewee', 'profile');

        res.status(201).json({
            success: true,
            message: 'Yorum baþarýyla oluþturuldu',
            data: populatedReview
        });
    } catch (error) {
        console.error('Create review error:', error);
        res.status(500).json({
            success: false,
            message: 'Yorum oluþturulurken hata oluþtu'
        });
    }
});

// @route   GET /api/reviews/user/:userId
// @desc    Get reviews for a user
// @access  Public
router.get('/user/:userId', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const reviews = await Review.find({ reviewee: req.params.userId })
            .populate('reviewer', 'profile')
            .sort('-createdAt')
            .limit(Number(limit))
            .skip(skip);

        const total = await Review.countDocuments({ reviewee: req.params.userId });

        // Calculate average ratings
        const stats = await Review.aggregate([
            { $match: { reviewee: new mongoose.Types.ObjectId(req.params.userId) } },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' },
                    averageCommunication: { $avg: '$categories.communication' },
                    averageProfessionalism: { $avg: '$categories.professionalism' },
                    averagePunctuality: { $avg: '$categories.punctuality' },
                    averageQuality: { $avg: '$categories.quality' },
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            success: true,
            data: reviews,
            stats: stats[0] || null,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({
            success: false,
            message: 'Yorumlar getirilirken hata oluþtu'
        });
    }
});

module.exports = router;