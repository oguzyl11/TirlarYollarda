const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reviewee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    rating: {
        type: Number,
        required: [true, 'Puan gereklidir'],
        min: [1, 'Puan en az 1 olmalýdýr'],
        max: [5, 'Puan en fazla 5 olmalýdýr']
    },
    comment: {
        type: String,
        required: [true, 'Yorum gereklidir'],
        maxlength: [1000, 'Yorum 1000 karakterden uzun olamaz']
    },
    categories: {
        communication: {
            type: Number,
            min: 1,
            max: 5
        },
        professionalism: {
            type: Number,
            min: 1,
            max: 5
        },
        punctuality: {
            type: Number,
            min: 1,
            max: 5
        },
        quality: {
            type: Number,
            min: 1,
            max: 5
        }
    },
    response: {
        text: String,
        createdAt: Date
    },
    helpful: {
        type: Number,
        default: 0
    },
    reported: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// One review per job per user pair
reviewSchema.index({ reviewer: 1, reviewee: 1, job: 1 }, { unique: true });
reviewSchema.index({ reviewee: 1, createdAt: -1 });

// Update user rating after review
reviewSchema.post('save', async function () {
    const Review = this.constructor;
    const User = mongoose.model('User');

    const stats = await Review.aggregate([
        { $match: { reviewee: this.reviewee } },
        {
            $group: {
                _id: null,
                averageRating: { $avg: '$rating' },
                count: { $sum: 1 }
            }
        }
    ]);

    if (stats.length > 0) {
        await User.findByIdAndUpdate(this.reviewee, {
            'rating.average': Math.round(stats[0].averageRating * 10) / 10,
            'rating.count': stats[0].count
        });
    }
});

module.exports = mongoose.model('Review', reviewSchema);