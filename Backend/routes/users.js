const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profiles/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Sadece resim dosyaları kabul edilir!'), false);
    }
  }
});

// @route   GET /api/users/companies
// @desc    Get all companies (employers)
// @access  Public
router.get('/companies', async (req, res) => {
    try {
        console.log('Get companies request');
        
        // Mock companies data for development (MongoDB not connected)
        const mockCompanies = [
            {
                _id: 'company_1',
                email: 'info@logistikas.com',
                userType: 'employer',
                verified: true,
                rating: 4.8,
                reviewCount: 156,
                jobCount: 23,
                profile: {
                    firstName: 'Ahmet',
                    lastName: 'Yılmaz',
                    phone: '05551234567',
                    city: 'İstanbul',
                    bio: 'Profesyonel lojistik hizmetleri'
                },
                employerDetails: {
                    companyName: 'Logistikas Lojistik A.Ş.',
                    companyType: 'Nakliyat',
                    establishedYear: 2015,
                    employeeCount: '50-100',
                    website: 'www.logistikas.com',
                    description: 'Türkiye genelinde güvenilir nakliyat hizmetleri sunuyoruz.'
                },
                createdAt: '2023-01-15T10:00:00Z',
                updatedAt: '2024-01-15T10:00:00Z'
            },
            {
                _id: 'company_2',
                email: 'info@hizlinakliyat.com',
                userType: 'employer',
                verified: true,
                rating: 4.6,
                reviewCount: 89,
                jobCount: 18,
                profile: {
                    firstName: 'Mehmet',
                    lastName: 'Demir',
                    phone: '05559876543',
                    city: 'Ankara',
                    bio: 'Hızlı ve güvenilir nakliyat'
                },
                employerDetails: {
                    companyName: 'Hızlı Nakliyat Ltd.',
                    companyType: 'Nakliyat',
                    establishedYear: 2018,
                    employeeCount: '20-50',
                    website: 'www.hizlinakliyat.com',
                    description: 'Ankara merkezli hızlı nakliyat hizmetleri.'
                },
                createdAt: '2023-03-20T14:30:00Z',
                updatedAt: '2024-01-10T14:30:00Z'
            },
            {
                _id: 'company_3',
                email: 'info@guvennakliyat.com',
                userType: 'employer',
                verified: false,
                rating: 4.3,
                reviewCount: 45,
                jobCount: 12,
                profile: {
                    firstName: 'Fatma',
                    lastName: 'Kaya',
                    phone: '05555555555',
                    city: 'İzmir',
                    bio: 'Güvenilir nakliyat çözümleri'
                },
                employerDetails: {
                    companyName: 'Güven Nakliyat',
                    companyType: 'Nakliyat',
                    establishedYear: 2020,
                    employeeCount: '10-20',
                    website: 'www.guvennakliyat.com',
                    description: 'İzmir ve çevre illerde nakliyat hizmetleri.'
                },
                createdAt: '2023-06-10T09:15:00Z',
                updatedAt: '2024-01-05T09:15:00Z'
            },
            {
                _id: 'company_4',
                email: 'info@megaulastirma.com',
                userType: 'employer',
                verified: true,
                rating: 4.9,
                reviewCount: 234,
                jobCount: 35,
                profile: {
                    firstName: 'Ali',
                    lastName: 'Özkan',
                    phone: '05551111111',
                    city: 'Bursa',
                    bio: 'Mega ulaştırma çözümleri'
                },
                employerDetails: {
                    companyName: 'Mega Ulaştırma A.Ş.',
                    companyType: 'Lojistik',
                    establishedYear: 2012,
                    employeeCount: '100+',
                    website: 'www.megaulastirma.com',
                    description: 'Büyük ölçekli lojistik ve nakliyat hizmetleri.'
                },
                createdAt: '2023-02-28T16:45:00Z',
                updatedAt: '2024-01-12T16:45:00Z'
            },
            {
                _id: 'company_5',
                email: 'info@expresskargo.com',
                userType: 'employer',
                verified: true,
                rating: 4.4,
                reviewCount: 67,
                jobCount: 15,
                profile: {
                    firstName: 'Zeynep',
                    lastName: 'Arslan',
                    phone: '05552222222',
                    city: 'Antalya',
                    bio: 'Express kargo hizmetleri'
                },
                employerDetails: {
                    companyName: 'Express Kargo Ltd.',
                    companyType: 'Kargo',
                    establishedYear: 2019,
                    employeeCount: '30-50',
                    website: 'www.expresskargo.com',
                    description: 'Hızlı kargo ve nakliyat hizmetleri.'
                },
                createdAt: '2023-04-15T11:20:00Z',
                updatedAt: '2024-01-08T11:20:00Z'
            },
            {
                _id: 'company_6',
                email: 'info@turknakliyat.com',
                userType: 'employer',
                verified: false,
                rating: 4.1,
                reviewCount: 23,
                jobCount: 8,
                profile: {
                    firstName: 'Mustafa',
                    lastName: 'Çelik',
                    phone: '05553333333',
                    city: 'Gaziantep',
                    bio: 'Türk nakliyat güvencesi'
                },
                employerDetails: {
                    companyName: 'Türk Nakliyat',
                    companyType: 'Nakliyat',
                    establishedYear: 2021,
                    employeeCount: '5-10',
                    website: 'www.turknakliyat.com',
                    description: 'Güneydoğu Anadolu bölgesi nakliyat hizmetleri.'
                },
                createdAt: '2023-08-22T13:10:00Z',
                updatedAt: '2024-01-03T13:10:00Z'
            }
        ];

        console.log('Mock companies returned:', mockCompanies.length);

        res.json({
            success: true,
            data: mockCompanies
        });
    } catch (error) {
        console.error('Get companies error:', error);
        res.status(500).json({
            success: false,
            message: 'Şirketler getirilirken hata oluştu'
        });
    }
});

// @route   GET /api/users/companies/:id
// @desc    Get company details by ID
// @access  Public
router.get('/companies/:id', async (req, res) => {
    try {
        console.log('Get company details request for ID:', req.params.id);
        
        // Mock company details data for development (MongoDB not connected)
        const mockCompanyDetails = {
            _id: req.params.id,
            email: 'info@logistikas.com',
            userType: 'employer',
            verified: true,
            rating: { average: 4.8, count: 156 },
            reviewCount: 156,
            jobCount: 23,
            profile: {
                firstName: 'Ahmet',
                lastName: 'Yılmaz',
                phone: '05551234567',
                city: 'İstanbul',
                bio: 'Profesyonel lojistik hizmetleri sunuyoruz. 10 yıllık deneyimimizle güvenilir nakliyat çözümleri.',
                avatar: '/logo.png'
            },
            employerDetails: {
                companyName: 'Logistikas Lojistik A.Ş.',
                companyType: 'Nakliyat',
                establishedYear: 2015,
                employeeCount: '50-100',
                website: 'www.logistikas.com',
                description: 'Türkiye genelinde güvenilir nakliyat hizmetleri sunuyoruz. Modern filomuz ve deneyimli ekibimizle müşteri memnuniyetini ön planda tutuyoruz.',
                address: 'Maslak Mahallesi, Büyükdere Caddesi No:123, Sarıyer/İstanbul',
                workingHours: 'Pazartesi-Cuma: 08:00-18:00',
                specialties: ['Konteyner Taşımacılığı', 'Parsiyel Yük', 'Frigo Taşımacılığı', 'Express Kargo']
            },
            socialMedia: {
                instagram: '@logistikas',
                linkedin: 'logistikas-lojistik',
                twitter: '@logistikas'
            },
            stats: {
                totalJobs: 23,
                completedJobs: 892,
                activeDrivers: 45,
                yearsExperience: 9
            },
            createdAt: '2023-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z'
        };

        // Mock jobs for this company
        const mockJobs = [
            {
                _id: 'job_1',
                title: 'İstanbul-Ankara Konteyner Taşımacılığı',
                description: 'Acil konteyner taşımacılığı işi. Deneyimli şoför aranıyor.',
                jobType: 'employer-seeking-driver',
                route: { from: { city: 'İstanbul' }, to: { city: 'Ankara' } },
                loadDetails: { type: 'Konteyner', weight: '20' },
                payment: { amount: 3500, currency: 'TL' },
                schedule: { startDate: '2024-01-20T08:00:00Z' },
                status: 'active',
                views: 45,
                createdAt: '2024-01-15T10:00:00Z',
                postedBy: req.params.id,
                bids: []
            },
            {
                _id: 'job_2',
                title: 'Ankara-İzmir Parsiyel Yük',
                description: 'Parsiyel yük taşıma işi. Güvenilir şoför aranıyor.',
                jobType: 'employer-seeking-driver',
                route: { from: { city: 'Ankara' }, to: { city: 'İzmir' } },
                loadDetails: { type: 'Parsiyel', weight: '8' },
                payment: { amount: 2200, currency: 'TL' },
                schedule: { startDate: '2024-01-22T09:00:00Z' },
                status: 'active',
                views: 32,
                createdAt: '2024-01-16T14:30:00Z',
                postedBy: req.params.id,
                bids: []
            }
        ];

        // Mock reviews for this company
        const mockReviews = [
            {
                _id: 'review_1',
                rating: 5,
                comment: 'Çok profesyonel ve güvenilir bir şirket. Yükümü zamanında ve güvenli bir şekilde teslim ettiler.',
                reviewer: {
                    name: 'Mehmet Kaya',
                    avatar: '/logo.png'
                },
                createdAt: '2024-01-10T10:00:00Z'
            },
            {
                _id: 'review_2',
                rating: 4,
                comment: 'İletişimleri çok iyi, fiyatları makul. Tavsiye ederim.',
                reviewer: {
                    name: 'Ayşe Demir',
                    avatar: '/logo.png'
                },
                createdAt: '2024-01-08T15:30:00Z'
            }
        ];

        console.log('Mock company details returned for ID:', req.params.id);

        res.json({
            success: true,
            data: {
                company: mockCompanyDetails,
                jobs: mockJobs,
                reviews: mockReviews
            }
        });
    } catch (error) {
        console.error('Get company details error:', error);
        res.status(500).json({
            success: false,
            message: 'Şirket detayları getirilirken hata oluştu'
        });
    }
});

// @route   GET /api/users/drivers/:id
// @desc    Get driver details by ID
// @access  Public
router.get('/drivers/:id', async (req, res) => {
    try {
        console.log('Get driver details request for ID:', req.params.id);
        
        // Mock driver details data for development (MongoDB not connected)
        const mockDriverDetails = {
            _id: req.params.id,
            email: 'mehmet.kaya@email.com',
            userType: 'driver',
            verified: true,
            rating: { average: 4.9, count: 89 },
            reviewCount: 89,
            completedJobs: 156,
            profile: {
                firstName: 'Mehmet',
                lastName: 'Kaya',
                phone: '05551234567',
                city: 'İstanbul',
                bio: '15 yıllık deneyimli şoför. Güvenilir ve profesyonel hizmet sunuyorum. Modern araçlarım ve deneyimimle müşteri memnuniyetini ön planda tutuyorum.',
                avatar: '/logo.png'
            },
            driverDetails: {
                licenseNumber: 'A123456789',
                licenseType: 'B+E',
                experienceYears: 15,
                vehicleType: 'Tır',
                vehicleCapacity: '40 Ton',
                vehicleModel: 'Mercedes Actros',
                vehicleYear: 2020,
                specialties: ['Konteyner Taşımacılığı', 'Parsiyel Yük', 'Frigo Taşımacılığı', 'Ağır Yük'],
                languages: ['Türkçe', 'İngilizce', 'Almanca'],
                availability: 'Hafta içi',
                workingHours: '08:00-20:00',
                certifications: ['ADR Sertifikası', 'Frigo Sertifikası', 'Güvenlik Sertifikası'],
                insurance: 'Tam Kasko + Trafik Sigortası',
                gpsTracking: true,
                temperatureControl: true
            },
            stats: {
                totalJobs: 156,
                completedJobs: 156,
                rating: 4.9,
                yearsExperience: 15,
                onTimeDelivery: 98,
                customerSatisfaction: 96
            },
            createdAt: '2022-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z'
        };

        // Mock completed jobs for this driver
        const mockJobs = [
            {
                _id: 'completed_job_1',
                title: 'İstanbul-Ankara Konteyner Taşımacılığı',
                description: 'Başarıyla tamamlanan konteyner taşımacılığı işi.',
                route: { from: { city: 'İstanbul' }, to: { city: 'Ankara' } },
                loadDetails: { type: 'Konteyner', weight: '20' },
                payment: { amount: 3500, currency: 'TL' },
                completedAt: '2024-01-10T15:30:00Z',
                rating: 5,
                status: 'completed',
                driverId: req.params.id
            },
            {
                _id: 'completed_job_2',
                title: 'Ankara-İzmir Parsiyel Yük',
                description: 'Parsiyel yük taşıma işi başarıyla tamamlandı.',
                route: { from: { city: 'Ankara' }, to: { city: 'İzmir' } },
                loadDetails: { type: 'Parsiyel', weight: '8' },
                payment: { amount: 2200, currency: 'TL' },
                completedAt: '2024-01-08T12:15:00Z',
                rating: 5,
                status: 'completed',
                driverId: req.params.id
            },
            {
                _id: 'completed_job_3',
                title: 'İzmir-Bursa Frigo Taşımacılığı',
                description: 'Frigo ürünleri güvenli şekilde teslim edildi.',
                route: { from: { city: 'İzmir' }, to: { city: 'Bursa' } },
                loadDetails: { type: 'Frigo', weight: '15' },
                payment: { amount: 2800, currency: 'TL' },
                completedAt: '2024-01-05T18:45:00Z',
                rating: 4,
                status: 'completed',
                driverId: req.params.id
            }
        ];

        // Mock reviews for this driver
        const mockReviews = [
            {
                _id: 'review_1',
                rating: 5,
                comment: 'Çok profesyonel ve güvenilir bir şoför. Yükümü zamanında ve güvenli bir şekilde teslim etti. Kesinlikle tavsiye ederim.',
                reviewer: {
                    name: 'Ahmet Yılmaz',
                    company: 'Logistikas Lojistik',
                    avatar: '/logo.png'
                },
                jobTitle: 'İstanbul-Ankara Konteyner Taşımacılığı',
                createdAt: '2024-01-10T16:00:00Z',
                driverId: req.params.id
            },
            {
                _id: 'review_2',
                rating: 5,
                comment: 'İletişimi çok iyi, araçları modern ve temiz. Fiyatları da makul. Tekrar çalışmak isterim.',
                reviewer: {
                    name: 'Fatma Demir',
                    company: 'Hızlı Nakliyat',
                    avatar: '/logo.png'
                },
                jobTitle: 'Ankara-İzmir Parsiyel Yük',
                createdAt: '2024-01-08T14:30:00Z',
                driverId: req.params.id
            },
            {
                _id: 'review_3',
                rating: 4,
                comment: 'Güvenilir şoför, zamanında teslim etti. Küçük bir gecikme oldu ama iletişimi iyiydi.',
                reviewer: {
                    name: 'Mehmet Özkan',
                    company: 'Mega Ulaştırma',
                    avatar: '/logo.png'
                },
                jobTitle: 'İzmir-Bursa Frigo Taşımacılığı',
                createdAt: '2024-01-05T20:15:00Z',
                driverId: req.params.id
            }
        ];

        console.log('Mock driver details returned for ID:', req.params.id);

        res.json({
            success: true,
            data: {
                driver: mockDriverDetails,
                jobs: mockJobs,
                reviews: mockReviews
            }
        });
    } catch (error) {
        console.error('Get driver details error:', error);
        res.status(500).json({
            success: false,
            message: 'Şoför detayları getirilirken hata oluştu'
        });
    }
});

// @route   GET /api/users/drivers
// @desc    Get all drivers
// @access  Public
router.get('/drivers', async (req, res) => {
    try {
        console.log('Get drivers request');
        
        // Gerçek veritabanından driver tipindeki kullanıcıları getir
        const drivers = await User.find({ userType: 'driver' })
            .select('-password')
            .populate('profile')
            .populate('driverDetails')
            .sort({ createdAt: -1 });

        console.log('Drivers found in database:', drivers.length);

        res.json({
            success: true,
            data: drivers
        });
    } catch (error) {
        console.error('Get drivers error:', error);
        res.status(500).json({
            success: false,
            message: 'Şoförler getirilirken hata oluştu'
        });
    }
});

// @route   GET /api/users/:id
// @desc    Get user profile
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Kullanıcı bulunamadı'
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
            message: 'Kullanıcı getirilirken hata oluştu'
        });
    }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, upload.single('profileImage'), async (req, res) => {
    try {
        console.log('Profile update request for user:', req.user.userId);
        console.log('Update data:', req.body);
        console.log('Profile image:', req.file);
        
        // Parse JSON data
        const profileData = JSON.parse(req.body.profile || '{}');
        const driverDetails = JSON.parse(req.body.driverDetails || '{}');
        const employerDetails = JSON.parse(req.body.employerDetails || '{}');
        
        // Mock user data
        const mockUser = {
            _id: req.user.userId,
            email: req.user.email,
            userType: req.user.userType,
            profile: {
                firstName: profileData.firstName || 'Test',
                lastName: profileData.lastName || 'User',
                phone: profileData.phone || '',
                city: profileData.city || '',
                bio: profileData.bio || '',
                profileImage: req.file ? `/uploads/profiles/${req.file.filename}` : (req.body.existingProfileImage || null)
            },
            driverDetails: driverDetails,
            employerDetails: employerDetails,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        console.log('Mock user updated:', mockUser);

        res.json({
            success: true,
            message: 'Profil başarıyla güncellendi',
            data: mockUser
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Profil güncellenirken hata oluştu'
        });
    }
});

module.exports = router;