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
        
        // Find user in database
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Kullanıcı bulunamadı'
            });
        }

        // Check if user is active
        if (!user.active) {
            return res.status(401).json({
                success: false,
                message: 'Hesabınız deaktif durumda'
            });
        }

        req.user = {
            userId: user._id,
            email: user.email,
            userType: user.userType
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