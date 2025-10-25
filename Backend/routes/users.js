const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Job = require('../models/Job');
const Review = require('../models/Review');
const multer = require('multer');
const path = require('path');

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profiles/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Sadece resim dosyaları kabul edilir!'), false);
    }
  }
});

// @route   GET /api/users/companies
// @desc    Get all companies (employers)
// @access  Public
router.get('/companies', async (req, res) => {
    try {
        console.log('Get companies request');
        
        const companies = await User.find({ 
            userType: 'employer'
        })
        .select('profile employerDetails rating createdAt')
        .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: companies
        });
    } catch (error) {
        console.error('Get companies error:', error);
        res.status(500).json({
            success: false,
            message: 'Şirketler getirilirken hata oluştu'
        });
    }
});

// @route   GET /api/users/companies/:id
// @desc    Get company details by ID
// @access  Public
router.get('/companies/:id', async (req, res) => {
    try {
        console.log('Get company details for ID:', req.params.id);

        const company = await User.findById(req.params.id)
            .select('profile employerDetails rating createdAt userType');

        if (!company || company.userType !== 'employer') {
            return res.status(404).json({
                success: false,
                message: 'Şirket bulunamadı'
            });
        }

        // Get company's jobs
        const jobs = await Job.find({ postedBy: req.params.id })
            .select('title description route loadDetails payment schedule status createdAt')
            .sort({ createdAt: -1 })
            .limit(10);

        // Get company's reviews
        const reviews = await Review.find({ reviewee: req.params.id })
            .populate('reviewer', 'profile')
            .sort({ createdAt: -1 })
            .limit(10);

        // Calculate stats
        const totalJobs = await Job.countDocuments({ postedBy: req.params.id });
        const completedJobs = await Job.countDocuments({ 
            postedBy: req.params.id, 
            status: 'completed' 
        });

        const companyData = {
            ...company.toObject(),
            stats: {
                totalJobs,
                completedJobs,
                activeDrivers: 0, // This would need to be calculated based on your business logic
                yearsExperience: new Date().getFullYear() - (company.employerDetails?.establishedYear || 2020)
            }
        };

        res.json({
            success: true,
            data: {
                company: companyData,
                jobs: jobs,
                reviews: reviews
            }
        });
    } catch (error) {
        console.error('Get company details error:', error);
        res.status(500).json({
            success: false,
            message: 'Şirket detayları getirilirken hata oluştu'
        });
    }
});

// @route   GET /api/users/drivers
// @desc    Get all drivers
// @access  Public
router.get('/drivers', async (req, res) => {
    try {
        console.log('Get drivers request');
        
        const drivers = await User.find({ 
            userType: 'driver'
        })
        .select('profile driverDetails rating createdAt')
        .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: drivers
        });
    } catch (error) {
        console.error('Get drivers error:', error);
        res.status(500).json({
            success: false,
            message: 'Şoförler getirilirken hata oluştu'
        });
    }
});

// @route   GET /api/users/drivers/:id
// @desc    Get driver details by ID
// @access  Public
router.get('/drivers/:id', async (req, res) => {
    try {
        console.log('Get driver details for ID:', req.params.id);

        const driver = await User.findById(req.params.id)
            .select('profile driverDetails rating createdAt');

        if (!driver || driver.userType !== 'driver') {
            return res.status(404).json({
                success: false,
                message: 'Şoför bulunamadı'
            });
        }

        // Get driver's completed jobs
        const completedJobs = await Job.find({ 
            'bids.driver': req.params.id,
            status: 'completed'
        })
        .select('title route loadDetails payment schedule')
        .sort({ createdAt: -1 })
        .limit(10);

        // Get driver's reviews
        const reviews = await Review.find({ reviewee: req.params.id })
            .populate('reviewer', 'profile')
            .sort({ createdAt: -1 })
            .limit(10);

        const driverData = {
            ...driver.toObject(),
            stats: {
                completedJobs: completedJobs.length,
                totalJobs: completedJobs.length,
                yearsExperience: new Date().getFullYear() - (driver.driverDetails?.licenseYear || 2020)
            },
            recentJobs: completedJobs,
            recentReviews: reviews
        };

        res.json({
            success: true,
            data: driverData
        });
    } catch (error) {
        console.error('Get driver details error:', error);
        res.status(500).json({
            success: false,
            message: 'Şoför detayları getirilirken hata oluştu'
        });
    }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, upload.single('profileImage'), async (req, res) => {
    try {
        console.log('Profile update request for user:', req.user.userId);
        console.log('Update data:', req.body);
        console.log('Profile image:', req.file);
        
        // Parse JSON data
        const profileData = JSON.parse(req.body.profile || '{}');
        const driverDetails = JSON.parse(req.body.driverDetails || '{}');
        const employerDetails = JSON.parse(req.body.employerDetails || '{}');
        
        const updateData = {
            profile: profileData,
            driverDetails: driverDetails,
            employerDetails: employerDetails
        };

        // Add profile image if uploaded
        if (req.file) {
            updateData.profile = {
                ...profileData,
                profileImage: `/uploads/profiles/${req.file.filename}`
            };
        } else if (req.body.existingProfileImage) {
            updateData.profile = {
                ...profileData,
                profileImage: req.body.existingProfileImage
            };
        }

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Kullanıcı bulunamadı'
            });
        }

        console.log('User profile updated successfully');

        res.json({
            success: true,
            message: 'Profil başarıyla güncellendi',
            data: user
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Profil güncellenirken hata oluştu'
        });
    }
});

// @route   GET /api/users/:id
// @desc    Get user profile by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password -resetPasswordToken -resetPasswordExpiry');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Kullanıcı bulunamadı'
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Kullanıcı bilgileri getirilirken hata oluştu'
        });
    }
});

module.exports = router;