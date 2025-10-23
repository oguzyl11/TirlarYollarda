const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   GET /api/users/companies
// @desc    Get all companies (employers)
// @access  Public
router.get('/companies', async (req, res) => {
    try {
        console.log('Get companies request');
        
        // Gerçek veritabanından employer tipindeki kullanıcıları getir
        const companies = await User.find({ userType: 'employer' })
            .select('-password')
            .populate('profile')
            .populate('employerDetails')
            .sort({ createdAt: -1 });

        console.log('Companies found in database:', companies.length);

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

// @route   GET /api/users/drivers
// @desc    Get all drivers
// @access  Public
router.get('/drivers', async (req, res) => {
    try {
        console.log('Get drivers request');
        
        // Gerçek veritabanından driver tipindeki kullanıcıları getir
        const drivers = await User.find({ userType: 'driver' })
            .select('-password')
            .populate('profile')
            .populate('driverDetails')
            .sort({ createdAt: -1 });

        console.log('Drivers found in database:', drivers.length);

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

// @route   GET /api/users/:id
// @desc    Get user profile
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

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
            message: 'Kullanıcı getirilirken hata oluştu'
        });
    }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
    try {
        // Mock user update for development
        console.log('Profile update request for user:', req.user.userId);
        console.log('Update data:', req.body);
        
        // Mock user data
        const mockUser = {
            _id: req.user.userId,
            email: req.user.email,
            userType: req.user.userType,
            profile: {
                firstName: req.body.profile?.firstName || 'Test',
                lastName: req.body.profile?.lastName || 'User',
                phone: req.body.profile?.phone || '',
                city: req.body.profile?.city || '',
                bio: req.body.profile?.bio || ''
            },
            driverDetails: req.body.driverDetails || {},
            employerDetails: req.body.employerDetails || {},
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        console.log('Mock user updated:', mockUser);

        res.json({
            success: true,
            message: 'Profil başarıyla güncellendi',
            data: mockUser
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Profil güncellenirken hata oluştu'
        });
    }
});

module.exports = router;