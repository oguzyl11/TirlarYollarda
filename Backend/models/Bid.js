const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    bidder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: [true, 'Teklif miktarý gereklidir']
    },
    currency: {
        type: String,
        default: 'TRY'
    },
    message: {
        type: String,
        maxlength: [500, 'Mesaj 500 karakterden uzun olamaz']
    },
    proposedStartDate: Date,
    estimatedDuration: {
        value: Number,
        unit: {
            type: String,
            enum: ['hours', 'days']
        }
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes
bidSchema.index({ job: 1, bidder: 1 }, { unique: true });
bidSchema.index({ bidder: 1 });
bidSchema.index({ status: 1 });

module.exports = mongoose.model('Bid', bidSchema);