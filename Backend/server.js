const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());

// Allow multiple frontend origins via comma-separated env
const allowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || 'http://localhost:3000,http://localhost:3001')
    .split(',')
    .map(o => o.trim());

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));

// Handle preflight for all routes
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// Serve static files
app.use('/uploads', express.static('uploads'));

// Rate limiting - More generous limits for development
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Increased from 100 to 1000 requests per window
    message: {
        success: false,
        message: 'Çok fazla istek gönderildi. Lütfen biraz bekleyin.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);

// Database connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB bağlantısı başarılı'))
    .catch(err => {
        console.error('❌ MongoDB bağlantı hatası:', err);
        console.log('⚠️  MongoDB olmadan devam ediliyor...');
    });

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/bids', require('./routes/bids'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/notifications', require('./routes/notifications'));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Sunucu hatası'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint bulunamadı'
    });
});

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
    console.log(`🚀 Server ${PORT} portunda çalışıyor`);
    console.log(`📡 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;