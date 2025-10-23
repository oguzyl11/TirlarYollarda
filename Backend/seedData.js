const mongoose = require('mongoose');
const User = require('./models/User');

// MongoDB bağlantısı
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tirlaryollarda', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedData = async () => {
  try {
    console.log('Veritabanına örnek veriler ekleniyor...');

    // Mevcut verileri temizle
    await User.deleteMany({});
    console.log('Mevcut veriler temizlendi');

    // Şifreleri hash'le
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Örnek şirketler (employer)
    const companies = [
      {
        email: 'mega@lojistik.com',
        password: hashedPassword,
        userType: 'employer',
        profile: {
          firstName: 'Mega',
          lastName: 'Lojistik',
          phone: '02121234567',
          city: 'İstanbul',
          bio: 'Profesyonel lojistik hizmetleri'
        },
        employerDetails: {
          companyName: 'Mega Lojistik A.Ş.',
          taxNumber: '1234567890',
          companyAddress: 'İstanbul, Türkiye'
        },
        rating: 4.8,
        reviewCount: 156,
        jobCount: 45,
        verified: true
      },
      {
        email: 'hizli@tasima.com',
        password: hashedPassword,
        userType: 'employer',
        profile: {
          firstName: 'Hızlı',
          lastName: 'Taşıma',
          phone: '03121234567',
          city: 'Ankara',
          bio: 'Hızlı ve güvenilir taşımacılık'
        },
        employerDetails: {
          companyName: 'Hızlı Taşıma Ltd.',
          taxNumber: '0987654321',
          companyAddress: 'Ankara, Türkiye'
        },
        rating: 4.6,
        reviewCount: 89,
        jobCount: 32,
        verified: true
      },
      {
        email: 'guven@nakliyat.com',
        password: hashedPassword,
        userType: 'employer',
        profile: {
          firstName: 'Güven',
          lastName: 'Nakliyat',
          phone: '02321234567',
          city: 'İzmir',
          bio: 'Güvenilir nakliyat hizmetleri'
        },
        employerDetails: {
          companyName: 'Güven Nakliyat',
          taxNumber: '1122334455',
          companyAddress: 'İzmir, Türkiye'
        },
        rating: 4.9,
        reviewCount: 203,
        jobCount: 67,
        verified: true
      }
    ];

    // Örnek şoförler (driver)
    const drivers = [
      {
        email: 'mehmet@driver.com',
        password: hashedPassword,
        userType: 'driver',
        profile: {
          firstName: 'Mehmet',
          lastName: 'Yılmaz',
          phone: '05321234567',
          city: 'İstanbul',
          bio: '15 yıllık tecrübeli şoför'
        },
        driverDetails: {
          licenseType: 'C+E',
          experience: '15',
          vehicleType: 'Mega Tır',
          availability: 'immediate'
        },
        rating: 4.9,
        reviewCount: 245,
        completedJobs: 380,
        verified: true
      },
      {
        email: 'ali@driver.com',
        password: hashedPassword,
        userType: 'driver',
        profile: {
          firstName: 'Ali',
          lastName: 'Demir',
          phone: '05331234567',
          city: 'Ankara',
          bio: 'Güvenilir ve deneyimli şoför'
        },
        driverDetails: {
          licenseType: 'C',
          experience: '10',
          vehicleType: 'Kamyon',
          availability: 'within-week'
        },
        rating: 4.7,
        reviewCount: 156,
        completedJobs: 220,
        verified: true
      },
      {
        email: 'hasan@driver.com',
        password: hashedPassword,
        userType: 'driver',
        profile: {
          firstName: 'Hasan',
          lastName: 'Kaya',
          phone: '05341234567',
          city: 'İzmir',
          bio: 'Profesyonel nakliyat şoförü'
        },
        driverDetails: {
          licenseType: 'C+E',
          experience: '12',
          vehicleType: 'Çekici',
          availability: 'immediate'
        },
        rating: 4.8,
        reviewCount: 189,
        completedJobs: 295,
        verified: true
      },
      {
        email: 'mustafa@driver.com',
        password: hashedPassword,
        userType: 'driver',
        profile: {
          firstName: 'Mustafa',
          lastName: 'Arslan',
          phone: '05351234567',
          city: 'Bursa',
          bio: 'Yeni nesil şoför'
        },
        driverDetails: {
          licenseType: 'C',
          experience: '8',
          vehicleType: 'Tır',
          availability: 'within-month'
        },
        rating: 4.6,
        reviewCount: 98,
        completedJobs: 167,
        verified: false
      }
    ];

    // Verileri veritabanına ekle
    const createdCompanies = await User.insertMany(companies);
    console.log(`${createdCompanies.length} şirket eklendi`);

    const createdDrivers = await User.insertMany(drivers);
    console.log(`${createdDrivers.length} şoför eklendi`);

    console.log('Veritabanına örnek veriler başarıyla eklendi!');
    process.exit(0);
  } catch (error) {
    console.error('Veri ekleme hatası:', error);
    process.exit(1);
  }
};

seedData();
