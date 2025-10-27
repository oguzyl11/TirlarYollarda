# 🚀 TırlarYollarda - Yeni Bilgisayarda Çalıştırma

## ⚡ Hızlı Başlangıç (5 Dakika)

### 1️⃣ Gereken Programlar
- **Node.js** → [İndir](https://nodejs.org/) (LTS versiyonu önerilir)
- **MongoDB** → [MongoDB Atlas (ÜCRETSİZ)](https://www.mongodb.com/cloud/atlas/register) - VEYA bilgisayarına kur
- **Git** → Zaten var muhtemelen

---

### 2️⃣ Projeyi İndir
```bash
git clone https://github.com/oguzyl11/TirlarYollarda.git
cd TirlarYollarda
```

---

### 3️⃣ Environment Dosyalarını Oluştur

#### 🔵 Backend için (.env)

`Backend` klasörüne git ve `.env` dosyası oluştur:

```bash
cd Backend
nano .env
```

**İçine bunu yapıştır:**
```env
MONGODB_URI=mongodb://localhost:27017/tirlaryollarda
JWT_SECRET=benim-super-gizli-anahtar-2024-degistir-bunu
FRONTEND_URL=http://localhost:3000
PORT=5001
```

**Eğer MongoDB Atlas kullanıyorsan** (önerilir):
- MongoDB Atlas'ta cluster oluştur
- "Connect" → "Connect your application" 
- Connection string'i kopyala
- MONGODB_URI'ye yapıştır

#### 🟢 Frontend için (.env.local)

`Frontend` klasörüne git ve `.env.local` dosyası oluştur:

```bash
cd ../Frontend
nano .env.local
```

**İçine bunu yapıştır:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=opsiyonel-bos-birakabilirsin
```

---

### 4️⃣ Paketleri Kur

**Backend için:**
```bash
cd Backend
npm install
```

**Frontend için:**
```bash
cd Frontend
npm install
```

---

### 5️⃣ Uploads Klasörü Oluştur
```bash
mkdir -p Backend/uploads/profiles
```

---

### 6️⃣ ÇALIŞTIR! 🎉

**2 TERMİNAL AÇ:**

#### Terminal 1 - Backend:
```bash
cd Backend
npm start
```
✅ `✅ MongoDB bağlantısı başarılı` görmeli

#### Terminal 2 - Frontend:
```bash
cd Frontend
npm run dev
```
✅ `ready - started server on 0.0.0.0:3000` görmeli

---

### 7️⃣ Tarayıcıda Aç
```
http://localhost:3000
```

**BAŞARDI! 🎉🎉🎉**

---

## 🤔 Sorunlar mı var?

### MongoDB bağlanamıyor?
- MongoDB Atlas kullanıyorsan → Network Access'te IP'ni ekle (Connect from anywhere)
- Yerel MongoDB kullanıyorsan → Bilgisayarında MongoDB çalıştığından emin ol

### Port hatası?
- Backend başka port istiyorsa → `Backend/.env` de PORT=5002 yap
- Frontend zaten otomatik 3001'e geçer

### Module bulunamıyor?
```bash
# Backend için
cd Backend
rm -rf node_modules
npm install

# Frontend için  
cd Frontend
rm -rf node_modules
npm install
```

### MongoDB bağlantı hatası?
```env
# Yerel MongoDB için:
MONGODB_URI=mongodb://localhost:27017/tirlaryollarda

# Atlas için:
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/tirlaryollarda?retryWrites=true&w=majority
```

---

## 📁 Proje Yapısı
```
TirlarYollarda/
├── Backend/
│   ├── models/        # Veritabanı modelleri
│   ├── routes/        # API endpoint'leri
│   ├── uploads/       # Yüklenen dosyalar
│   ├── server.js      # Ana dosya
│   └── .env          # Backend ayarları
│
├── Frontend/
│   ├── app/           # Sayfalar
│   ├── components/    # Bileşenler
│   ├── lib/          # Yardımcılar
│   └── .env.local    # Frontend ayarları
│
└── SETUP_GUIDE.md    # Bu dosya
```

---

## 🎯 API Endpoints

- `http://localhost:5001/api/jobs` - İş ilanları
- `http://localhost:5001/api/users/companies` - Şirketler
- `http://localhost:5001/api/users/drivers` - Şoförler
- `http://localhost:5001/api/auth/register` - Kayıt
- `http://localhost:5001/api/auth/login` - Giriş

---

## ✅ Özet - Yapılacaklar Listesi

- [ ] Node.js kuruldu mu?
- [ ] MongoDB Atlas hesabı var mı? (VEYA yerel MongoDB kurulu mu?)
- [ ] Proje klonlandı mı?
- [ ] Backend/.env dosyası oluşturuldu mu?
- [ ] Frontend/.env.local dosyası oluşturuldu mu?
- [ ] npm install Backend'de yapıldı mı?
- [ ] npm install Frontend'de yapıldı mı?
- [ ] uploads klasörü oluşturuldu mu?
- [ ] Backend çalışıyor mu? (Terminal 1)
- [ ] Frontend çalışıyor mu? (Terminal 2)
- [ ] Tarayıcıda localhost:3000 açılıyor mu?

**Hepsini yaptıysan proje çalışıyor demektir! 🚀**

---

## 💡 İpuçları

1. **MongoDB Atlas** kullanmak ücretsiz ve kolay (önerilir)
2. **npm install** ilk çalıştırmada 1-2 dakika sürebilir
3. Backend ve Frontend'i **ayrı terminal pencerelerinde** çalıştır
4. Hata alırsan terminaldeki **kırmızı mesajları** oku
5. Çoğu sorun `.env` dosyalarının eksik/yanlış olmasından kaynaklanır

---

**Başarılar! 🎉**
