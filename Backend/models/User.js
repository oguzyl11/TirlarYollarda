const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email gereklidir'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)@\w+([.-]?\w+)(\.\w{2,3})+$/, 'Ge�erli bir email giriniz']
    },
    password: {
        type: String,
        required: [true, '�ifre gereklidir'],
        minlength: [6, '�ifre en az 6 karakter olmal�d�r'],
        select: false
    },
    userType: {
        type: String,
        enum: ['driver', 'employer', 'individual'],
        required: [true, 'Kullan�c� tipi gereklidir']
    },
    profile: {
        firstName: {
            type: String,
            required: [true, 'Ad gereklidir'],
            trim: true
        },
        lastName: {
            type: String,
            required: [true, 'Soyad gereklidir'],
            trim: true
        },
        phone: {
            type: String,
            required: [true, 'Telefon gereklidir'],
            match: [/^[0-9]{10,11}$/, 'Ge�erli bir telefon numaras� giriniz']
        },
        city: String,
        avatar: {
            type: String,
            default: 'default-avatar.png'
        },
        bio: String
    },
    driverDetails: {
        licenseType: {
            type: String,
            enum: ['B', 'C', 'C+E', 'D', 'E'],
        },
        experience: Number,
        vehicleType: String,
        availability: {
            type: String,
            enum: ['immediate', 'within-week', 'within-month'],
            default: 'immediate'
        },
        preferredRoutes: [String],
        completedJobs: {
            type: Number,
            default: 0
        }
    },
    employerDetails: {
        companyName: String,
        taxNumber: String,
        companyAddress: String,
        postedJobs: {
            type: Number,
            default: 0
        }
    },
    individualDetails: {
        preferredContactMethod: {
            type: String,
            enum: ['phone', 'email', 'whatsapp'],
            default: 'phone'
        },
        address: {
            street: String,
            district: String,
            city: String,
            postalCode: String
        },
        preferences: {
            preferredDriverType: {
                type: String,
                enum: ['any', 'experienced', 'local'],
                default: 'any'
            },
            budgetRange: {
                min: Number,
                max: Number
            },
            specialRequirements: String
        },
        shipmentHistory: {
            totalShipments: {
                type: Number,
                default: 0
            },
            completedShipments: {
                type: Number,
                default: 0
            },
            cancelledShipments: {
                type: Number,
                default: 0
            }
        }
    },
    rating: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        count: {
            type: Number,
            default: 0
        }
    },
    verified: {
        email: {
            type: Boolean,
            default: false
        },
        phone: {
            type: Boolean,
            default: false
        },
        identity: {
            type: Boolean,
            default: false
        }
    },
    active: {
        type: Boolean,
        default: true
    },
    lastLogin: Date,
    resetPasswordToken: String,
    resetPasswordExpiry: Date,
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

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Get full name
userSchema.virtual('fullName').get(function () {
    return `${this.profile.firstName} ${this.profile.lastName}`;

});

// Exclude password from JSON responses
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

module.exports = mongoose.model('User', userSchema);