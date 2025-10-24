'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  MapPin, 
  Star, 
  Truck, 
  Calendar,
  Award,
  CheckCircle,
  User,
  Phone,
  Mail,
  Clock,
  Briefcase
} from 'lucide-react';

export default function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const cities = [
    'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep',
    'Şanlıurfa', 'Kocaeli', 'Mersin', 'Diyarbakır', 'Hatay', 'Manisa', 'Kayseri',
    'Samsun', 'Balıkesir', 'Kahramanmaraş', 'Van', 'Denizli', 'Sakarya', 'Muğla',
    'Tekirdağ', 'Eskişehir', 'Trabzon', 'Ordu', 'Afyon', 'Malatya', 'Erzurum', 'Zonguldak'
  ];

  useEffect(() => {
    fetchDrivers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.relative')) {
        setShowCityDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      // Mock drivers data for development
      const mockDrivers = [
        {
          _id: 'driver_1',
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
            bio: '15 yıllık deneyimli şoför. Güvenilir ve profesyonel hizmet.',
            avatar: '/logo.png'
          },
          driverDetails: {
            licenseNumber: 'A123456789',
            licenseType: 'B+E',
            experienceYears: 15,
            vehicleType: 'Tır',
            vehicleCapacity: '40 Ton',
            specialties: ['Konteyner Taşımacılığı', 'Parsiyel Yük', 'Frigo Taşımacılığı'],
            languages: ['Türkçe', 'İngilizce'],
            availability: 'Hafta içi',
            workingHours: '08:00-20:00'
          },
          stats: {
            totalJobs: 156,
            completedJobs: 156,
            rating: 4.9,
            yearsExperience: 15
          },
          createdAt: '2022-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        },
        {
          _id: 'driver_2',
          email: 'ahmet.demir@email.com',
          userType: 'driver',
          verified: true,
          rating: { average: 4.7, count: 67 },
          reviewCount: 67,
          completedJobs: 98,
          profile: {
            firstName: 'Ahmet',
            lastName: 'Demir',
            phone: '05559876543',
            city: 'Ankara',
            bio: 'Ankara merkezli deneyimli şoför. Hızlı ve güvenilir.',
            avatar: '/logo.png'
          },
          driverDetails: {
            licenseNumber: 'B987654321',
            licenseType: 'C+E',
            experienceYears: 12,
            vehicleType: 'Kamyon',
            vehicleCapacity: '25 Ton',
            specialties: ['Parsiyel Yük', 'Express Kargo'],
            languages: ['Türkçe'],
            availability: 'Tam zamanlı',
            workingHours: '06:00-22:00'
          },
          stats: {
            totalJobs: 98,
            completedJobs: 98,
            rating: 4.7,
            yearsExperience: 12
          },
          createdAt: '2022-03-20T14:30:00Z',
          updatedAt: '2024-01-10T14:30:00Z'
        },
        {
          _id: 'driver_3',
          email: 'fatma.yilmaz@email.com',
          userType: 'driver',
          verified: false,
          rating: { average: 4.5, count: 34 },
          reviewCount: 34,
          completedJobs: 45,
          profile: {
            firstName: 'Fatma',
            lastName: 'Yılmaz',
            phone: '05555555555',
            city: 'İzmir',
            bio: 'İzmir ve çevre illerde nakliyat hizmetleri.',
            avatar: '/logo.png'
          },
          driverDetails: {
            licenseNumber: 'C456789123',
            licenseType: 'B+E',
            experienceYears: 8,
            vehicleType: 'Kamyonet',
            vehicleCapacity: '7.5 Ton',
            specialties: ['Şehir İçi Nakliyat', 'Küçük Yük'],
            languages: ['Türkçe'],
            availability: 'Esnek',
            workingHours: '09:00-18:00'
          },
          stats: {
            totalJobs: 45,
            completedJobs: 45,
            rating: 4.5,
            yearsExperience: 8
          },
          createdAt: '2022-06-10T09:15:00Z',
          updatedAt: '2024-01-05T09:15:00Z'
        },
        {
          _id: 'driver_4',
          email: 'ali.ozkan@email.com',
          userType: 'driver',
          verified: true,
          rating: { average: 4.8, count: 123 },
          reviewCount: 123,
          completedJobs: 189,
          profile: {
            firstName: 'Ali',
            lastName: 'Özkan',
            phone: '05551111111',
            city: 'Bursa',
            bio: 'Büyük ölçekli lojistik ve nakliyat hizmetleri.',
            avatar: '/logo.png'
          },
          driverDetails: {
            licenseNumber: 'D789123456',
            licenseType: 'C+E',
            experienceYears: 18,
            vehicleType: 'Tır',
            vehicleCapacity: '44 Ton',
            specialties: ['Ağır Yük', 'Konteyner', 'Frigo'],
            languages: ['Türkçe', 'Almanca'],
            availability: 'Hafta içi',
            workingHours: '07:00-19:00'
          },
          stats: {
            totalJobs: 189,
            completedJobs: 189,
            rating: 4.8,
            yearsExperience: 18
          },
          createdAt: '2022-02-28T16:45:00Z',
          updatedAt: '2024-01-12T16:45:00Z'
        },
        {
          _id: 'driver_5',
          email: 'zeynep.arslan@email.com',
          userType: 'driver',
          verified: true,
          rating: { average: 4.6, count: 56 },
          reviewCount: 56,
          completedJobs: 78,
          profile: {
            firstName: 'Zeynep',
            lastName: 'Arslan',
            phone: '05552222222',
            city: 'Antalya',
            bio: 'Hızlı kargo ve nakliyat hizmetleri.',
            avatar: '/logo.png'
          },
          driverDetails: {
            licenseNumber: 'E321654987',
            licenseType: 'B+E',
            experienceYears: 10,
            vehicleType: 'Kamyon',
            vehicleCapacity: '20 Ton',
            specialties: ['Express Kargo', 'Parsiyel'],
            languages: ['Türkçe', 'İngilizce'],
            availability: 'Tam zamanlı',
            workingHours: '08:00-20:00'
          },
          stats: {
            totalJobs: 78,
            completedJobs: 78,
            rating: 4.6,
            yearsExperience: 10
          },
          createdAt: '2022-04-15T11:20:00Z',
          updatedAt: '2024-01-08T11:20:00Z'
        },
        {
          _id: 'driver_6',
          email: 'mustafa.celik@email.com',
          userType: 'driver',
          verified: false,
          rating: { average: 4.2, count: 23 },
          reviewCount: 23,
          completedJobs: 32,
          profile: {
            firstName: 'Mustafa',
            lastName: 'Çelik',
            phone: '05553333333',
            city: 'Gaziantep',
            bio: 'Güneydoğu Anadolu bölgesi nakliyat hizmetleri.',
            avatar: '/logo.png'
          },
          driverDetails: {
            licenseNumber: 'F654987321',
            licenseType: 'B+E',
            experienceYears: 6,
            vehicleType: 'Kamyon',
            vehicleCapacity: '15 Ton',
            specialties: ['Bölgesel Nakliyat', 'Parsiyel'],
            languages: ['Türkçe', 'Kürtçe'],
            availability: 'Esnek',
            workingHours: '10:00-18:00'
          },
          stats: {
            totalJobs: 32,
            completedJobs: 32,
            rating: 4.2,
            yearsExperience: 6
          },
          createdAt: '2022-08-22T13:10:00Z',
          updatedAt: '2024-01-03T13:10:00Z'
        }
      ];

      setDrivers(mockDrivers);
    } catch (error) {
      console.error('Şoförler getirilemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.profile?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.profile?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.profile?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.driverDetails?.vehicleType?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = !selectedCity || driver.profile?.city === selectedCity;
    
    // Rating kontrolü - obje veya sayı olabilir
    let driverRating = driver.rating;
    if (typeof driver.rating === 'object' && driver.rating?.average) {
      driverRating = driver.rating.average;
    }
    const matchesRating = !selectedRating || (driverRating && driverRating >= parseFloat(selectedRating));
    
    return matchesSearch && matchesCity && matchesRating;
  });

  const clearFilters = () => {
    setSelectedCity('');
    setSelectedRating('');
    setSearchTerm('');
  };

  const filteredCities = (searchTerm) => {
    return cities.filter(city => 
      city.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setShowCityDropdown(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-2xl"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-gray-50 to-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Güvenilir Şoförler</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                En deneyimli ve güvenilir şoförlerle tanışın. İşinizi profesyonel ellere teslim edin.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Şoför veya şehir ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                    />
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-2 px-6 py-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                  >
                    <Filter className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700 font-medium">Filtreler</span>
                    <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {showFilters && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Şehir</label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Şehir seçin..."
                            value={selectedCity}
                            onChange={(e) => {
                              setSelectedCity(e.target.value);
                              setShowCityDropdown(true);
                            }}
                            onFocus={() => setShowCityDropdown(true)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                          />
                          
                          {showCityDropdown && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                              {filteredCities(selectedCity).map((city) => (
                                <div
                                  key={city}
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-black"
                                  onClick={() => handleCitySelect(city)}
                                >
                                  {city}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Puan</label>
                        <select
                          value={selectedRating}
                          onChange={(e) => setSelectedRating(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        >
                          <option value="">Tüm Puanlar</option>
                          <option value="4.5">4.5+ Yıldız</option>
                          <option value="4.0">4.0+ Yıldız</option>
                          <option value="3.5">3.5+ Yıldız</option>
                          <option value="3.0">3.0+ Yıldız</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={clearFilters}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                      >
                        Filtreleri Temizle
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Drivers Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredDrivers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDrivers.map((driver) => (
                  <Link key={driver._id} href={`/drivers/${driver._id}`} className="group">
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                          <User className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-bold text-gray-800 truncate text-lg group-hover:text-blue-600 transition-colors">
                              {driver.profile?.firstName} {driver.profile?.lastName}
                            </h3>
                            {driver.verified && (
                              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-blue-600" />
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600 mb-4">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{driver.profile?.city}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="font-semibold text-gray-800">
                                {typeof driver.rating === 'object' ? driver.rating?.average || '4.5' : driver.rating || '4.5'}
                              </span>
                              <span className="text-gray-500 text-sm">
                                ({typeof driver.rating === 'object' ? driver.rating?.count || 0 : driver.reviewCount || 0})
                              </span>
                            </div>
                            <div className="flex items-center space-x-1 text-gray-600">
                              <Briefcase className="w-4 h-4" />
                              <span className="text-sm">{driver.completedJobs || 0} iş</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Şoför Bulunamadı</h3>
                <p className="text-gray-500 mb-6">Arama kriterlerinize uygun şoför bulunamadı.</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Filtreleri Temizle
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}