const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET || 'your-secret-key-change-in-production',
        { expiresIn: '7d' }
    );
};

// Email transporter (mock for development)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'test@example.com',
        pass: process.env.EMAIL_PASS || 'test-password'
    }
});

// Mock email sending for development
const sendEmail = async (to, subject, html) => {
    console.log('Mock Email Sent:');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('HTML:', html);
    return true;
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

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', [
    body('email').isEmail().normalizeEmail()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { email } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            // Don't reveal if email exists or not for security
            return res.json({
                success: true,
                message: 'Eğer bu email adresi sistemimizde kayıtlıysa, şifre sıfırlama linki gönderilecektir'
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

        // Save reset token to user
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiry = resetTokenExpiry;
        await user.save();

        // Create reset URL
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

        // Send email
        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563eb;">LoadING - Şifre Sıfırlama</h2>
                <p>Merhaba ${user.profile?.firstName || 'Kullanıcı'},</p>
                <p>Şifrenizi sıfırlamak için aşağıdaki linke tıklayın:</p>
                <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
                    Şifremi Sıfırla
                </a>
                <p>Bu link 1 saat geçerlidir.</p>
                <p>Eğer bu işlemi siz yapmadıysanız, bu emaili görmezden gelebilirsiniz.</p>
                <hr style="margin: 30px 0;">
                <p style="color: #666; font-size: 12px;">
                    LoadING - Nakliyat Platformu<br>
                    Bu email otomatik olarak gönderilmiştir.
                </p>
            </div>
        `;

        await sendEmail(email, 'LoadING - Şifre Sıfırlama', emailHtml);

        res.json({
            success: true,
            message: 'Eğer bu email adresi sistemimizde kayıtlıysa, şifre sıfırlama linki gönderilecektir'
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Şifre sıfırlama linki gönderilirken hata oluştu'
        });
    }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post('/reset-password', [
    body('token').notEmpty(),
    body('password').isLength({ min: 6 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { token, password } = req.body;

        // Find user by reset token
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Geçersiz veya süresi dolmuş şifre sıfırlama linki'
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update user password and clear reset token
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiry = undefined;
        await user.save();

        res.json({
            success: true,
            message: 'Şifreniz başarıyla sıfırlandı'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Şifre sıfırlanırken hata oluştu'
        });
    }
});

module.exports = router;