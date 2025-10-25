'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { 
  Truck, 
  Search, 
  Star, 
  MapPin, 
  Clock, 
  CheckCircle,
  Filter,
  X,
  User,
  Briefcase,
  TrendingUp,
  Award
} from 'lucide-react';
import { userAPI } from '../../lib/api';

export default function DriversPage() {
  const router = useRouter();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const cities = [
    'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep',
    'Mersin', 'Diyarbakır', 'Kayseri', 'Eskişehir', 'Urfa', 'Malatya', 'Erzurum', 'Van',
    'Batman', 'Elazığ', 'İzmit', 'Manisa', 'Sivas', 'Gebze', 'Balıkesir', 'Kahramanmaraş',
    'Denizli', 'Samsun', 'Sakarya', 'Uşak', 'Düzce', 'Muğla', 'Trabzon', 'Ordu'
  ];

  const ratingOptions = [
    { label: '4.5+ Yıldız', value: '4.5' },
    { label: '4.0+ Yıldız', value: '4.0' },
    { label: '3.5+ Yıldız', value: '3.5' },
    { label: '3.0+ Yıldız', value: '3.0' }
  ];

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getDrivers();
      setDrivers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      setDrivers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = !searchQuery || 
      driver.profile?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.profile?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.driverDetails?.specialties?.some(specialty => 
        specialty.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    const matchesCity = !selectedCity || 
      driver.profile?.city?.toLowerCase().includes(selectedCity.toLowerCase());
    
    const matchesRating = !selectedRating || 
      (driver.rating?.average || 0) >= parseFloat(selectedRating);
    
    return matchesSearch && matchesCity && matchesRating;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCity('');
    setSelectedRating('');
  };

  const getRatingDisplay = (rating) => {
    if (typeof rating === 'object') {
      return rating.average || 0;
    }
    return rating || 0;
  };

  const getReviewCount = (rating) => {
    if (typeof rating === 'object') {
      return rating.count || 0;
    }
    return 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Şoförler yükleniyor...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Şoförler</h1>
              <p className="text-gray-600 mt-1">
                {filteredDrivers.length} şoför bulundu
              </p>
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-5 h-5 text-gray-700" />
              <span className="text-gray-800 font-medium">Filtreler</span>
            </button>
          </div>
        </div>

        {/* Popular Drivers Section */}
        <section className="mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Popüler Şoförler</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drivers
              .filter(driver => (driver.rating?.average || 0) >= 4.5)
              .slice(0, 6)
              .map((driver) => (
                <div key={driver._id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300">
                  <div className="p-6">
                    {/* Driver Info */}
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {driver.profile?.firstName} {driver.profile?.lastName}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{driver.profile?.city || 'Şehir belirtilmemiş'}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span className="text-xs font-medium text-yellow-600">Popüler</span>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-semibold text-gray-800">
                          {getRatingDisplay(driver.rating).toFixed(1)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        ({getReviewCount(driver.rating)} değerlendirme)
                      </span>
                    </div>

                    {/* Driver Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Truck className="w-4 h-4" />
                        <span>{driver.driverDetails?.vehicleType || 'Araç tipi belirtilmemiş'}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{driver.driverDetails?.experienceYears || 0} yıl deneyim</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Briefcase className="w-4 h-4" />
                        <span>{driver.stats?.completedJobs || 0} tamamlanan iş</span>
                      </div>
                    </div>

                    {/* Specialties */}
                    {driver.driverDetails?.specialties && driver.driverDetails.specialties.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {driver.driverDetails.specialties.slice(0, 2).map((specialty, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                              {specialty}
                            </span>
                          ))}
                          {driver.driverDetails.specialties.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{driver.driverDetails.specialties.length - 2} daha
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <Link
                      href={`/drivers/${driver._id}`}
                      className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Profili Görüntüle
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Şoför ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              />
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Şehir</label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  >
                    <option value="">Tüm Şehirler</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Minimum Puan</label>
                  <select
                    value={selectedRating}
                    onChange={(e) => setSelectedRating(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  >
                    <option value="">Tüm Puanlar</option>
                    {ratingOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                >
                  Filtreleri Temizle
                </button>
              </div>
            </div>
          )}
        </div>

        {/* All Drivers Section */}
        <section>
          <div className="flex items-center space-x-3 mb-6">
            <Truck className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Tüm Şoförler</h2>
          </div>

          {/* Drivers Grid */}
          {filteredDrivers.length === 0 ? (
          <div className="text-center py-12">
            <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Şoför bulunamadı</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || selectedCity || selectedRating 
                ? 'Arama kriterlerinize uygun şoför bulunamadı.' 
                : 'Henüz kayıtlı şoför bulunmuyor.'}
            </p>
            {(searchQuery || selectedCity || selectedRating) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Filtreleri Temizle
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDrivers.map((driver) => (
              <div key={driver._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300">
                <div className="p-6">
                  {/* Driver Info */}
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {driver.profile?.firstName} {driver.profile?.lastName}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{driver.profile?.city || 'Şehir belirtilmemiş'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-semibold text-gray-800">
                        {getRatingDisplay(driver.rating).toFixed(1)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      ({getReviewCount(driver.rating)} değerlendirme)
                    </span>
                  </div>

                  {/* Driver Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Truck className="w-4 h-4" />
                      <span>{driver.driverDetails?.vehicleType || 'Araç tipi belirtilmemiş'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{driver.driverDetails?.experienceYears || 0} yıl deneyim</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Briefcase className="w-4 h-4" />
                      <span>{driver.stats?.completedJobs || 0} tamamlanan iş</span>
                    </div>
                  </div>

                  {/* Specialties */}
                  {driver.driverDetails?.specialties && driver.driverDetails.specialties.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {driver.driverDetails.specialties.slice(0, 3).map((specialty, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {specialty}
                          </span>
                        ))}
                        {driver.driverDetails.specialties.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{driver.driverDetails.specialties.length - 3} daha
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Bio */}
                  {driver.profile?.bio && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {driver.profile.bio}
                    </p>
                  )}

                  {/* Action Button */}
                  <Link
                    href={`/drivers/${driver._id}`}
                    className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Profili Görüntüle
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        </section>
      </div>
      
      <Footer />
    </div>
  );
}