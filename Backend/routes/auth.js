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

        // Mock register for development (MongoDB not connected)
        const mockUser = {
            id: 'mock-user-id',
            email: email,
            userType: userType,
            profile: profile
        };

        // Generate token
        const token = generateToken(mockUser.id);

        res.status(201).json({
            success: true,
            message: 'Kayit basarili',
            token,
            user: mockUser
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Kayit sirasinda hata olustu'
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

        // Mock login for development (MongoDB not connected)
        const mockUser = {
            id: 'mock-user-id',
            email: email,
            userType: 'employer',
            profile: {
                firstName: 'Test',
                lastName: 'User',
                phone: '05551234567'
            },
            rating: 4.5
        };

        // Generate token
        const token = generateToken(mockUser.id);

        res.json({
            success: true,
            message: 'Giris basarili',
            token,
            user: mockUser
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Giris sirasinda hata olustu'
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
                message: 'Token bulunamadi'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
        
        // Mock user for development
        const mockUser = {
            id: decoded.userId,
            email: 'test@example.com',
            userType: 'employer',
            profile: {
                firstName: 'Test',
                lastName: 'User',
                phone: '05551234567'
            },
            rating: 4.5
        };

        res.json({
            success: true,
            user: mockUser
        });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(401).json({
            success: false,
            message: 'Gecersiz token'
        });
    }
});

module.exports = router;