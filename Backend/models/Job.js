const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    jobType: {
        type: String,
        enum: ['employer-seeking-driver', 'driver-seeking-job'],
        required: true
    },
    title: {
        type: String,
        required: [true, '�lan ba�l��� gereklidir'],
        trim: true,
        maxlength: [100, 'Ba�l�k 100 karakterden uzun olamaz']
    },
    description: {
        type: String,
        required: [true, 'A��klama gereklidir'],
        maxlength: [2000, 'A��klama 2000 karakterden uzun olamaz']
    },
    route: {
        from: {
            city: {
                type: String,
                required: true
            },
            address: String,
            district: String,
            coordinates: {
                lat: Number,
                lng: Number
            }
        },
        to: {
            city: {
                type: String,
                required: true
            },
            address: String,
            district: String,
            coordinates: {
                lat: Number,
                lng: Number
            }
        },
        distance: Number
    },
    loadDetails: {
        type: {
            type: String
        },
        weight: String,
        dimensions: {
            length: Number,
            width: Number,
            height: Number
        },
        description: String,
        specialRequirements: [String]
    },
    vehicleRequirements: {
        type: {
            type: String
        },
        capacity: String,
        minCapacity: Number,
        specialRequirements: String,
        features: [String]
    },
    schedule: {
        startDate: {
            type: Date,
            required: false
        },
        endDate: Date,
        flexible: {
            type: Boolean,
            default: false
        },
        flexibility: {
            type: String,
            enum: ['exact', 'flexible', 'negotiable'],
            default: 'flexible'
        }
    },
    payment: {
        amount: Number,
        currency: {
            type: String,
            default: 'TL'
        },
        paymentMethod: {
            type: String,
            enum: ['cash', 'bank_transfer', 'check', 'other'],
            default: 'cash'
        }
    },
    status: {
        type: String,
        enum: ['active', 'in-progress', 'completed', 'cancelled', 'expired'],
        default: 'active'
    },
    bids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bid'
    }],
    acceptedBid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bid'
    },
    views: {
        type: Number,
        default: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    expiresAt: {
        type: Date,
        default: function () {
            return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
        }
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

// Indexes for better query performance
jobSchema.index({ 'route.from.city': 1, 'route.to.city': 1 });
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ postedBy: 1 });
jobSchema.index({ expiresAt: 1 });

module.exports = mongoose.model('Job', jobSchema);