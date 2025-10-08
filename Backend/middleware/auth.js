const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Eriþim token bulunamadý'
            });
        }

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'your-secret-key-change-in-production'
        );

        // Check if user exists
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Kullanýcý bulunamadý'
            });
        }

        if (!user.active) {
            return res.status(403).json({
                success: false,
                message: 'Hesabýnýz aktif deðil'
            });
        }

        // Attach user to request
        req.user = {
            userId: user._id,
            email: user.email,
            userType: user.userType
        };

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Geçersiz token'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token süresi dolmuþ'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Kimlik doðrulama hatasý'
        });
    }
};

module.exports = auth;