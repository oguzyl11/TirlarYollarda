const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   GET /api/users/:id
// @desc    Get user profile
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Kullanýcý bulunamadý'
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
            message: 'Kullanýcý getirilirken hata oluþtu'
        });
    }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
    try {
        const allowedUpdates = [
            'profile.firstName',
            'profile.lastName',
            'profile.phone',
            'profile.city',
            'profile.bio',
            'driverDetails',
            'employerDetails'
        ];

        const updates = {};

        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key) || key === 'profile' || key === 'driverDetails' || key === 'employerDetails') {
                updates[key] = req.body[key];
            }
        });

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password');

        res.json({
            success: true,
            message: 'Profil baþarýyla güncellendi',
            data: user
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Profil güncellenirken hata oluþtu'
        });
    }
});

module.exports = router;