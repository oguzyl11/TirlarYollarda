const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET || 'your-secret-key-change-in-production',
        { expiresIn: '7d' }
    );
};

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('userType').isIn(['driver', 'employer']),
    body('profile.firstName').trim().notEmpty(),
    body('profile.lastName').trim().notEmpty(),
    body('profile.phone').matches(/^[0-9]{10,11}$/)
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { email, password, userType, profile, driverDetails, employerDetails } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: 'Bu email adresi zaten kayýtlý'
            });
        }

        // Create user
        user = new User({
            email,
            password,
            userType,
            profile,
            ...(userType === 'driver' && { driverDetails }),
            ...(userType === 'employer' && { employerDetails })
        });

        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'Kayýt baþarýlý',
            token,
            user: {
                id: user._id,
                email: user.email,
                userType: user.userType,
                profile: user.profile
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Kayýt sýrasýnda hata oluþtu'
        });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { email, password } = req.body;

        // Find user and include password field
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email veya þifre hatalý'
            });
        }

        // Check if user is active
        if (!user.active) {
            return res.status(403).json({
                success: false,
                message: 'Hesabýnýz askýya alýnmýþ'
            });
        }

        // Verify password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Email veya þifre hatalý'
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.json({
            success: true,
            message: 'Giriþ baþarýlý',
            token,
            user: {
                id: user._id,
                email: user.email,
                userType: user.userType,
                profile: user.profile,
                rating: user.rating
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Giriþ sýrasýnda hata oluþtu'
        });
    }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token bulunamadý'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Kullanýcý bulunamadý'
            });
        }

        res.json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(401).json({
            success: false,
            message: 'Geçersiz token'
        });
    }
});

module.exports = router;