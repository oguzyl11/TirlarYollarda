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

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Bu email adresi zaten kullanılıyor'
            });
        }

        // Create new user
        const userData = {
            email,
            password,
            userType,
            profile,
            ...(userType === 'driver' && driverDetails && { driverDetails }),
            ...(userType === 'employer' && employerDetails && { employerDetails })
        };

        const user = new User(userData);
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'Kayıt başarılı',
            token,
            user: {
                id: user._id,
                email: user.email,
                userType: user.userType,
                profile: user.profile,
                driverDetails: user.driverDetails,
                employerDetails: user.employerDetails,
                rating: user.rating
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Kayıt sırasında hata oluştu'
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

        // Find user by email
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email veya şifre hatalı'
            });
        }

        // Check if user is active
        if (!user.active) {
            return res.status(401).json({
                success: false,
                message: 'Hesabınız deaktif durumda'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Email veya şifre hatalı'
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.json({
            success: true,
            message: 'Giriş başarılı',
            token,
            user: {
                id: user._id,
                email: user.email,
                userType: user.userType,
                profile: user.profile,
                driverDetails: user.driverDetails,
                employerDetails: user.employerDetails,
                rating: user.rating
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Giriş sırasında hata oluştu'
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
                message: 'Token bulunamadı'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
        
        // Find user in database
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Kullanıcı bulunamadı'
            });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                userType: user.userType,
                profile: user.profile,
                driverDetails: user.driverDetails,
                employerDetails: user.employerDetails,
                rating: user.rating,
                verified: user.verified,
                createdAt: user.createdAt
            }
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