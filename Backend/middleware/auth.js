const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Erişim token bulunamadı'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        // Mock user for development (MongoDB not connected)
        req.user = {
            userId: decoded.userId || 'mock-user-id',
            email: decoded.email || 'test@example.com',
            userType: decoded.userType || 'employer'
        };

        console.log('Auth middleware: User authenticated:', req.user);
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({
            success: false,
            message: 'Geçersiz token'
        });
    }
};

module.exports = auth;