const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Job = require('../models/Job');
const auth = require('../middleware/auth');

// Global mock data storage - Tüm ilanlar
let mockAllJobs = [
    {
        _id: 'job_1',
        title: 'İstanbul-Ankara Kargo Taşıma',
        description: 'Acil kargo taşıma işi. Güvenli ve hızlı teslimat gerekiyor.',
        jobType: 'employer-seeking-driver',
        route: { from: { city: 'İstanbul' }, to: { city: 'Ankara' } },
        loadDetails: { type: 'Kargo', weight: '2' },
        payment: { amount: 2500, currency: 'TL' },
        schedule: { startDate: '2024-01-15T08:00:00Z' },
        status: 'active',
        views: 45,
        createdAt: '2024-01-10T10:00:00Z',
        postedBy: 'mega_lojistik',
        bids: []
    },
    {
        _id: 'job_2',
        title: 'İzmir-Bursa Parsiyel Yük',
        description: 'Parsiyel yük taşıma işi. Ekonomik çözüm aranıyor.',
        jobType: 'employer-seeking-driver',
        route: { from: { city: 'İzmir' }, to: { city: 'Bursa' } },
        loadDetails: { type: 'Parsiyel', weight: '5' },
        payment: { amount: 1800, currency: 'TL' },
        schedule: { startDate: '2024-01-18T09:00:00Z' },
        status: 'active',
        views: 32,
        createdAt: '2024-01-12T14:30:00Z',
        postedBy: 'hizli_tasima',
        bids: []
    },
    {
        _id: 'job_3',
        title: 'Ankara-İstanbul Konteyner Taşıma',
        description: '40 feet konteyner taşıma işi. Profesyonel şoför aranıyor.',
        jobType: 'employer-seeking-driver',
        route: { from: { city: 'Ankara' }, to: { city: 'İstanbul' } },
        loadDetails: { type: 'Konteyner', weight: '25' },
        payment: { amount: 3500, currency: 'TL' },
        schedule: { startDate: '2024-01-20T07:00:00Z' },
        status: 'active',
        views: 28,
        createdAt: '2024-01-14T11:15:00Z',
        postedBy: 'guven_nakliyat',
        bids: []
    },
    {
        _id: 'job_4',
        title: 'Bursa-İzmir Frigo Taşıma',
        description: 'Soğuk zincir taşıma işi. Frigo araç gerekiyor.',
        jobType: 'employer-seeking-driver',
        route: { from: { city: 'Bursa' }, to: { city: 'İzmir' } },
        loadDetails: { type: 'Frigo', weight: '8' },
        payment: { amount: 2200, currency: 'TL' },
        schedule: { startDate: '2024-01-22T06:00:00Z' },
        status: 'active',
        views: 19,
        createdAt: '2024-01-16T09:45:00Z',
        postedBy: 'mega_lojistik',
        bids: []
    },
    {
        _id: 'job_5',
        title: 'İstanbul-Gaziantep Dorse Taşıma',
        description: 'Dorse taşıma işi. Uzun mesafe tecrübesi gerekiyor.',
        jobType: 'employer-seeking-driver',
        route: { from: { city: 'İstanbul' }, to: { city: 'Gaziantep' } },
        loadDetails: { type: 'Dorse', weight: '15' },
        payment: { amount: 4200, currency: 'TL' },
        schedule: { startDate: '2024-01-25T05:00:00Z' },
        status: 'active',
        views: 67,
        createdAt: '2024-01-18T16:20:00Z',
        postedBy: 'hizli_tasima',
        bids: []
    },
    {
        _id: 'job_6',
        title: 'Ankara-Antalya Genel Yük',
        description: 'Genel yük taşıma işi. Güvenilir şoför aranıyor.',
        jobType: 'employer-seeking-driver',
        route: { from: { city: 'Ankara' }, to: { city: 'Antalya' } },
        loadDetails: { type: 'Genel', weight: '12' },
        payment: { amount: 2800, currency: 'TL' },
        schedule: { startDate: '2024-01-28T08:30:00Z' },
        status: 'active',
        views: 41,
        createdAt: '2024-01-20T13:10:00Z',
        postedBy: 'guven_nakliyat',
        bids: []
    }
];

// Kullanıcıların kendi ilanları için ayrı storage
let mockUserJobs = [];

// @route   GET /api/jobs
// @desc    Get all jobs with filters
// @access  Public
router.get('/', async (req, res) => {
    try {
        const {
            search,
            city,
            loadType,
            vehicleType,
            minAmount,
            maxAmount,
            sortBy = 'newest',
            page = 1,
            limit = 12
        } = req.query;

        console.log('Get jobs request with filters:', req.query);

        // Tüm ilanları al
        let filteredJobs = [...mockAllJobs];

        // Arama filtresi
        if (search) {
            filteredJobs = filteredJobs.filter(job => 
                job.title.toLowerCase().includes(search.toLowerCase()) ||
                job.description.toLowerCase().includes(search.toLowerCase()) ||
                job.route.from.city.toLowerCase().includes(search.toLowerCase()) ||
                job.route.to.city.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Şehir filtresi
        if (city) {
            filteredJobs = filteredJobs.filter(job => 
                job.route.from.city.toLowerCase().includes(city.toLowerCase()) ||
                job.route.to.city.toLowerCase().includes(city.toLowerCase())
            );
        }

        // Yük tipi filtresi
        if (loadType) {
            filteredJobs = filteredJobs.filter(job => 
                job.loadDetails.type.toLowerCase() === loadType.toLowerCase()
            );
        }

        // Araç tipi filtresi
        if (vehicleType) {
            filteredJobs = filteredJobs.filter(job => 
                job.vehicleRequirements?.type?.toLowerCase() === vehicleType.toLowerCase()
            );
        }

        // Ücret filtresi
        if (minAmount) {
            filteredJobs = filteredJobs.filter(job => 
                job.payment.amount >= parseInt(minAmount)
            );
        }
        if (maxAmount) {
            filteredJobs = filteredJobs.filter(job => 
                job.payment.amount <= parseInt(maxAmount)
            );
        }

        // Sıralama
        if (sortBy === 'newest') {
            filteredJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortBy === 'oldest') {
            filteredJobs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        } else if (sortBy === 'highest') {
            filteredJobs.sort((a, b) => b.payment.amount - a.payment.amount);
        } else if (sortBy === 'lowest') {
            filteredJobs.sort((a, b) => a.payment.amount - b.payment.amount);
        } else if (sortBy === 'deadline') {
            filteredJobs.sort((a, b) => new Date(a.schedule.startDate) - new Date(b.schedule.startDate));
        }

        // Sayfalama
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + parseInt(limit);
        const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

        console.log(`Found ${filteredJobs.length} jobs, returning ${paginatedJobs.length}`);

        res.json({
            success: true,
            data: paginatedJobs,
            total: filteredJobs.length,
            page: parseInt(page),
            totalPages: Math.ceil(filteredJobs.length / limit)
        });
    } catch (error) {
        console.error('Get jobs error:', error);
        res.status(500).json({
            success: false,
            message: 'İlanlar getirilirken hata oluştu'
        });
    }
});

// @route   GET /api/jobs/:id
// @desc    Get job by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        // Mock job data for development
        console.log('Get job request for ID:', req.params.id);
        
        // Find job in mock data
        const job = mockAllJobs.find(j => j._id === req.params.id);
        
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'İlan bulunamadı'
            });
        }

        // Increment views
        job.views = (job.views || 0) + 1;
        console.log('Job found and views incremented:', job);

        res.json({
            success: true,
            data: job
        });
    } catch (error) {
        console.error('Get job error:', error);
        res.status(500).json({
            success: false,
            message: 'İlan getirilirken hata oluştu'
        });
    }
});

// @route   POST /api/jobs
// @desc    Create new job
// @access  Private
router.post('/', auth, [
    body('title').trim().notEmpty().withMessage('Başlık gereklidir'),
    body('description').trim().notEmpty().withMessage('Açıklama gereklidir'),
    body('route.from.city').trim().notEmpty().withMessage('Başlangıç şehri gereklidir'),
    body('route.to.city').trim().notEmpty().withMessage('Varış şehri gereklidir')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Lütfen tüm zorunlu alanları doldurun',
                errors: errors.array()
            });
        }

        const jobData = req.body;
        
        // Mock job creation for development (MongoDB not connected)
        const job = {
            _id: 'job_' + Date.now(),
            ...jobData,
            postedBy: req.user.userId,
            status: 'active',
            views: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Add job to mock data
        mockAllJobs.push(job);

        console.log('New job created:', job);
        console.log('Total jobs:', mockAllJobs.length);

        res.status(201).json({
            success: true,
            message: 'İlan başarıyla oluşturuldu',
            data: job
        });
    } catch (error) {
        console.error('Create job error:', error);
        res.status(500).json({
            success: false,
            message: 'İlan oluşturulurken hata oluştu'
        });
    }
});

// @route   GET /api/jobs/user/my-jobs
// @desc    Get user's own jobs
// @access  Private
router.get('/user/my-jobs', auth, async (req, res) => {
    try {
        console.log('Get my jobs request for user:', req.user.userId);
        
        // Filter jobs by current user from mock data
        const userJobs = mockAllJobs.filter(job => 
            job.postedBy === req.user.userId || 
            job.postedBy === req.user.userId.toString() ||
            (typeof job.postedBy === 'object' && job.postedBy.toString() === req.user.userId.toString())
        );
        
        console.log('User jobs found:', userJobs.length);
        
        res.json({
            success: true,
            data: userJobs
        });
    } catch (error) {
        console.error('Get my jobs error:', error);
        res.status(500).json({
            success: false,
            message: 'İlanlar getirilirken hata oluştu'
        });
    }
});

// @route   PUT /api/jobs/:id
// @desc    Update job
// @access  Private
router.put('/:id', auth, async (req, res) => {
    try {
        const jobId = req.params.id;
        const jobData = req.body;
        console.log('Update job request for ID:', jobId, 'by user:', req.user.userId);

        // Find job in mock data
        const jobIndex = mockAllJobs.findIndex(job => job._id === jobId);
        if (jobIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'İlan bulunamadı'
            });
        }

        // Check if user owns the job
        if (mockAllJobs[jobIndex].postedBy !== req.user.userId && 
            mockAllJobs[jobIndex].postedBy !== req.user.userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Bu işi düzenleme yetkiniz yok'
            });
        }

        // Update job
        mockAllJobs[jobIndex] = { 
            ...mockAllJobs[jobIndex], 
            ...jobData,
            updatedAt: new Date().toISOString()
        };

        console.log('Job updated successfully');

        res.json({
            success: true,
            message: 'İlan başarıyla güncellendi',
            data: mockAllJobs[jobIndex]
        });
    } catch (error) {
        console.error('Update job error:', error);
        res.status(500).json({
            success: false,
            message: 'İlan güncellenirken hata oluştu'
        });
    }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete job
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const jobId = req.params.id;
        console.log('Delete job request for ID:', jobId, 'by user:', req.user.userId);

        // Mock job deletion for development (MongoDB not connected)
        const jobIndex = mockAllJobs.findIndex(job => job._id === jobId);
        
        if (jobIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'İlan bulunamadı'
            });
        }

        // Remove job from mock data
        mockAllJobs.splice(jobIndex, 1);

        console.log('Job deleted successfully, remaining jobs:', mockAllJobs.length);

        res.json({
            success: true,
            message: 'İlan başarıyla silindi'
        });
    } catch (error) {
        console.error('Delete job error:', error);
        res.status(500).json({
            success: false,
            message: 'İlan silinirken hata oluştu'
        });
    }
});

module.exports = router;