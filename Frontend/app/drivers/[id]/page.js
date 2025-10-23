'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  User, 
  ArrowLeft, 
  MapPin, 
  Star, 
  Truck, 
  Award, 
  Phone, 
  Mail, 
  Calendar,
  Clock,
  CheckCircle,
  MessageSquare,
  Briefcase,
  DollarSign,
  Filter,
  Search,
  Shield,
  Zap,
  Heart
} from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import toast, { Toaster } from 'react-hot-toast';

export default function DriverDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, initAuth } = useAuthStore();
  const [driver, setDriver] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initAuth();
    loadDriverData();
  }, [params.id]);

  const loadDriverData = async () => {
    try {
      setLoading(true);
      
      // Mock driver data - gerçekte API'den gelecek
      const mockDrivers = {
        1: {
          id: 1,
          name: 'Mehmet Yılmaz',
          city: 'İstanbul',
          rating: 4.9,
          reviewCount: 245,
          experience: 15,
          vehicleType: 'Mega Tır',
          completedJobs: 380,
          verified: true,
          phone: '+90 532 555 0123',
          email: 'mehmet.yilmaz@email.com',
          bio: '15 yıllık deneyimimle güvenilir ve profesyonel taşımacılık hizmeti sunuyorum. Müşteri memnuniyeti her zaman önceliğimdir.',
          specialties: ['Uzun Mesafe Taşımacılığı', 'Kargo Taşımacılığı', 'Parsiyel Yük'],
          languages: ['Türkçe', 'İngilizce'],
          availability: 'Hemen',
          hourlyRate: 150,
          dailyRate: 1200,
          licenseNumber: 'A123456789',
          licenseExpiry: '2026-12-31',
          insurance: 'Aktif',
          vehicleInfo: {
            brand: 'Mercedes',
            model: 'Actros 1845',
            year: 2020,
            capacity: '40 Ton',
            features: ['GPS Takip', 'Klima', 'ABS', 'ESP']
          },
          workingHours: '7/24',
          preferredRoutes: ['İstanbul-Ankara', 'İstanbul-İzmir', 'İstanbul-Bursa'],
          certifications: ['Sürücü Belgesi', 'ADR Sertifikası', 'İlk Yardım Sertifikası']
        },
        2: {
          id: 2,
          name: 'Ali Demir',
          city: 'Ankara',
          rating: 4.7,
          reviewCount: 156,
          experience: 10,
          vehicleType: 'Kamyon',
          completedJobs: 220,
          verified: true,
          phone: '+90 532 555 0456',
          email: 'ali.demir@email.com',
          bio: 'Ankara merkezli şoför. Bölgesel taşımacılıkta uzmanım. Hızlı ve güvenli teslimat garantisi.',
          specialties: ['Bölgesel Taşımacılık', 'Kargo Taşımacılığı'],
          languages: ['Türkçe'],
          availability: '1 Hafta İçinde',
          hourlyRate: 120,
          dailyRate: 1000,
          licenseNumber: 'B987654321',
          licenseExpiry: '2025-08-15',
          insurance: 'Aktif',
          vehicleInfo: {
            brand: 'Volvo',
            model: 'FH 460',
            year: 2019,
            capacity: '26 Ton',
            features: ['GPS Takip', 'Klima']
          },
          workingHours: '6:00 - 22:00',
          preferredRoutes: ['Ankara-İstanbul', 'Ankara-Konya'],
          certifications: ['Sürücü Belgesi']
        },
        3: {
          id: 3,
          name: 'Hasan Kaya',
          city: 'İzmir',
          rating: 4.8,
          reviewCount: 189,
          experience: 12,
          vehicleType: 'Çekici',
          completedJobs: 295,
          verified: true,
          phone: '+90 532 555 0789',
          email: 'hasan.kaya@email.com',
          bio: 'İzmir ve çevre illerde çekici ile taşımacılık hizmeti veriyorum. Konteyner taşımacılığında deneyimli.',
          specialties: ['Konteyner Taşımacılığı', 'Çekici Hizmetleri'],
          languages: ['Türkçe', 'Arapça'],
          availability: '2 Hafta İçinde',
          hourlyRate: 140,
          dailyRate: 1100,
          licenseNumber: 'C456789123',
          licenseExpiry: '2027-03-20',
          insurance: 'Aktif',
          vehicleInfo: {
            brand: 'Scania',
            model: 'R 450',
            year: 2021,
            capacity: '44 Ton',
            features: ['GPS Takip', 'Klima', 'ABS', 'ESP', 'Retarder']
          },
          workingHours: '7/24',
          preferredRoutes: ['İzmir-İstanbul', 'İzmir-Ankara', 'İzmir-Antalya'],
          certifications: ['Sürücü Belgesi', 'ADR Sertifikası']
        }
      };

      const driverData = mockDrivers[params.id];
      if (driverData) {
        setDriver(driverData);
        loadDriverReviews(driverData.id);
      } else {
        toast.error('Şoför bulunamadı');
        router.push('/drivers');
      }
    } catch (error) {
      console.error('Şoför verileri yüklenemedi:', error);
      toast.error('Şoför verileri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const loadDriverReviews = async (driverId) => {
    try {
      // Mock reviews data
      const mockReviews = [
        {
          id: 1,
          reviewer: 'Ahmet Şirket',
          rating: 5,
          comment: 'Çok profesyonel ve güvenilir bir şoför. İşini zamanında ve kaliteli yapıyor.',
          date: '2024-01-10',
          job: 'İstanbul-Ankara Kargo Taşıma'
        },
        {
          id: 2,
          reviewer: 'Mehmet Lojistik',
          rating: 5,
          comment: 'Mükemmel hizmet! Araçları çok temiz ve bakımlı. Kesinlikle tavsiye ederim.',
          date: '2024-01-08',
          job: 'İstanbul-İzmir Parsiyel Yük'
        },
        {
          id: 3,
          reviewer: 'Ali Kargo',
          rating: 4,
          comment: 'İyi bir şoför. İletişim kurması kolay ve esnek.',
          date: '2024-01-05',
          job: 'İstanbul-Bursa Tam Yük'
        }
      ];
      
      setReviews(mockReviews);
    } catch (error) {
      console.error('Değerlendirmeler yüklenemedi:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Şoför bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Şoför bulunamadı</h1>
          <Link href="/drivers" className="text-blue-600 hover:text-blue-700">
            Şoförler listesine dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/drivers" className="flex items-center text-gray-600 hover:text-blue-600">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Geri Dön
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">{driver.name}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Driver Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Driver Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">{driver.name}</h1>
                    {driver.verified && (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{driver.city}</span>
                  </div>
                  <div className="flex items-center space-x-1 mb-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-semibold">{driver.rating}</span>
                    <span className="text-gray-500">({driver.reviewCount} değerlendirme)</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-6">{driver.bio}</p>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{driver.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{driver.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{driver.availability}</span>
                </div>
              </div>

              {/* Driver Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{driver.experience}</div>
                  <div className="text-sm text-gray-600">Yıl Tecrübe</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{driver.completedJobs}</div>
                  <div className="text-sm text-gray-600">Tamamlanan İş</div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Ücretlendirme</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saatlik Ücret</span>
                    <span className="font-medium">{driver.hourlyRate} TL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Günlük Ücret</span>
                    <span className="font-medium">{driver.dailyRate} TL</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full btn-primary py-3 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  İletişime Geç
                </button>
                <button className="w-full btn-secondary py-3 flex items-center justify-center">
                  <Heart className="w-5 h-5 mr-2" />
                  Favorilere Ekle
                </button>
              </div>
            </div>

            {/* Vehicle Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Araç Bilgileri</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Marka/Model</span>
                  <span className="font-medium">{driver.vehicleInfo.brand} {driver.vehicleInfo.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Yıl</span>
                  <span className="font-medium">{driver.vehicleInfo.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Kapasite</span>
                  <span className="font-medium">{driver.vehicleInfo.capacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Araç Türü</span>
                  <span className="font-medium">{driver.vehicleType}</span>
                </div>
              </div>

              {/* Vehicle Features */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Özellikler</h4>
                <div className="flex flex-wrap gap-2">
                  {driver.vehicleInfo.features.map((feature, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sertifikalar</h3>
              <div className="space-y-2">
                {driver.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-700">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Değerlendirmeler ({reviews.length})</h2>
              </div>

              {/* Reviews List */}
              <div className="p-6">
                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{review.reviewer}</h4>
                            <p className="text-sm text-gray-500">{review.job}</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 mb-2">{review.comment}</p>
                        <p className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString('tr-TR')}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Henüz değerlendirme bulunmuyor</p>
                  </div>
                )}
              </div>
            </div>

            {/* Specialties */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Uzmanlık Alanları</h3>
              <div className="flex flex-wrap gap-2">
                {driver.specialties.map((specialty, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            {/* Preferred Routes */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tercih Edilen Güzergahlar</h3>
              <div className="flex flex-wrap gap-2">
                {driver.preferredRoutes.map((route, index) => (
                  <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    {route}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
