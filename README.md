# TırlarYollarda - Tırcı İş İlanları Platformu

![CI](https://github.com/oguzyl11/TirlarYollarda/actions/workflows/ci.yml/badge.svg)

Tırcılar ve lojistik şirketleri için modern bir iş bulma platformu. Bu platform, tırcıların iş bulmasını ve lojistik şirketlerinin güvenilir tırcı bulmasını kolaylaştırır.

## 🚀 Özellikler

### Genel Özellikler
- ✅ Kullanıcı kayıt ve giriş sistemi
- ✅ Tırcı ve şirket profilleri
- ✅ İş ilanı oluşturma ve yönetimi
- ✅ Teklif sistemi
- ✅ Mesajlaşma sistemi
- ✅ Değerlendirme ve yorum sistemi
- ✅ Responsive tasarım

### Tırcılar İçin
- 📝 Profil oluşturma (ehliyet tipi, deneyim, araç bilgileri)
- 🔍 İş ilanlarını filtreleme ve arama
- 💰 Teklif verme
- ⭐ Değerlendirme alma
- 💬 Şirketlerle mesajlaşma

### Şirketler İçin
- 🏢 Şirket profili oluşturma
- 📋 İş ilanı yayınlama
- 🎯 Teklif değerlendirme ve kabul/red
- 👥 Tırcı arama ve filtreleme
- 📊 İstatistikler ve raporlar

## 🛠 Teknolojiler

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Veritabanı
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Şifre hashleme
- **Express Validator** - Validation
- **Socket.io** - Real-time messaging
- **Helmet** - Security
- **Morgan** - Logging

### Frontend
- **React 18** - UI framework
- **React Router** - Routing
- **React Query** - Data fetching
- **React Hook Form** - Form management
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

## 📁 Proje Yapısı

```
TirlarYollarda/
├── Backend/
│   ├── models/          # MongoDB şemaları
│   ├── routes/          # API endpoint'leri
│   ├── middleware/      # Middleware'ler
│   ├── utils/           # Yardımcı fonksiyonlar
│   └── uploads/         # Dosya yüklemeleri
├── Frontend/
│   ├── public/          # Statik dosyalar
│   ├── src/
│   │   ├── components/  # React bileşenleri
│   │   ├── pages/       # Sayfalar
│   │   ├── context/     # React Context
│   │   ├── services/    # API servisleri
│   │   └── styles/      # CSS dosyaları
└── README.md
```

## 🚀 Kurulum

### Backend Kurulumu

1. Backend klasörüne gidin:
```bash
cd Backend
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Environment dosyası oluşturun:
```bash
cp .env.example .env
```

4. `.env` dosyasını düzenleyin:
```env
MONGODB_URI=mongodb://localhost:27017/tirlaryollarda
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
PORT=5000
```

5. MongoDB'yi başlatın (MongoDB kurulu olmalı)

6. Sunucuyu başlatın:
```bash
npm run dev
```

Backend http://localhost:5000 adresinde çalışacak.

### Frontend Kurulumu

1. Frontend klasörüne gidin:
```bash
cd Frontend
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Geliştirme sunucusunu başlatın:
```bash
npm start
```

Frontend http://localhost:3000 adresinde çalışacak.

> Not: Frontend `package.json` içinde proxy `http://localhost:5000` olarak ayarlı olduğu için backend'in 5000 portunda çalışıyor olması gerekir.

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `GET /api/auth/me` - Kullanıcı bilgileri

### Jobs
- `GET /api/jobs` - İş ilanlarını listele
- `GET /api/jobs/:id` - Tek ilan detayı
- `POST /api/jobs` - Yeni ilan oluştur
- `PUT /api/jobs/:id` - İlan güncelle
- `DELETE /api/jobs/:id` - İlan sil

### Bids
- `POST /api/bids` - Teklif ver
- `GET /api/bids/my-bids` - Tekliflerim
- `PATCH /api/bids/:id/status` - Teklif durumu güncelle

### Users
- `GET /api/users/:id` - Kullanıcı profili
- `PUT /api/users/profile` - Profil güncelle

### Messages
- `POST /api/messages` - Mesaj gönder
- `GET /api/messages/:conversationId` - Konuşma mesajları
- `GET /api/messages/conversations/list` - Konuşma listesi

### Reviews
- `POST /api/reviews` - Değerlendirme oluştur
- `GET /api/reviews/user/:userId` - Kullanıcı değerlendirmeleri

## 🔧 Geliştirme

### Backend Geliştirme
```bash
cd Backend
npm run dev  # Nodemon ile otomatik yeniden başlatma
```

### Frontend Geliştirme
```bash
cd Frontend
npm start  # Hot reload ile geliştirme
```

## 📱 Kullanım

1. **Kayıt Ol**: Tırcı veya şirket olarak kayıt olun
2. **Profil Oluştur**: Detaylı bilgilerinizi ekleyin
3. **İlan Ver/Ara**: İş ilanı oluşturun veya mevcut ilanları inceleyin
4. **Teklif Ver**: Uygun ilanlara teklif verin
5. **Mesajlaş**: İş ortaklarıyla iletişim kurun
6. **Değerlendir**: Tamamlanan işler için değerlendirme yapın

## 🔒 Güvenlik

- JWT tabanlı authentication
- Şifre hashleme (bcryptjs)
- Input validation
- Rate limiting
- CORS koruması
- Helmet güvenlik middleware'i

## 🚀 Deployment

### Backend Deployment
1. Environment variables'ları ayarlayın
2. MongoDB connection string'ini güncelleyin
3. Production için JWT secret'ı değiştirin
4. PM2 veya benzeri process manager kullanın

### Frontend Deployment
1. Build alın: `npm run build`
2. Build klasörünü web sunucusuna deploy edin
3. Environment variables'ları ayarlayın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 İletişim

Proje hakkında sorularınız için:
- Email: info@tirlaryollarda.com
- Website: https://tirlaryollarda.com

---

**TırlarYollarda** - Türkiye'nin en güvenilir tırcı iş ilanları platformu 🚛

