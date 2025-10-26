'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, Truck, Package, Star, TrendingUp, Users, Building2, ChevronRight, Clock, DollarSign, ChevronDown, Briefcase } from 'lucide-react';
import { jobAPI, userAPI } from '../lib/api';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [popularCompanies, setPopularCompanies] = useState([]);
  const [popularDrivers, setPopularDrivers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [activeFilter, setActiveFilter] = useState('');
  const [allJobs, setAllJobs] = useState([]);

  // Türkiye'nin büyük şehirleri
  const cities = [
    'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya', 'Artvin',
    'Aydın', 'Balıkesir', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa',
    'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan',
    'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Isparta',
    'Mersin', 'İstanbul', 'İzmir', 'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir',
    'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla',
    'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Rize', 'Sakarya', 'Samsun', 'Siirt',
    'Sinop', 'Sivas', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak',
    'Van', 'Yozgat', 'Zonguldak', 'Aksaray', 'Bayburt', 'Karaman', 'Kırıkkale', 'Batman',
    'Şırnak', 'Bartın', 'Ardahan', 'Iğdır', 'Yalova', 'Karabük', 'Kilis', 'Osmaniye', 'Düzce'
  ];

  useEffect(() => {
    loadJobs();
    loadPopularData();
  }, []);

  // Dropdown'ı dışına tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.relative')) {
        setShowCityDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadJobs = async () => {
    try {
      const response = await jobAPI.getJobs({ limit: 20 });
      const jobs = response.data.data || [];
      setAllJobs(jobs);
      setRecentJobs(jobs);
      // Featured jobs simülasyonu (gerçekte featured flag'e göre çekilecek)
      setFeaturedJobs(jobs.slice(0, 3));
    } catch (error) {
      console.error('İlanlar yüklenemedi:', error);
    }
  };

  const loadPopularData = async () => {
    try {
      // Popüler şirketleri çek
      const companiesResponse = await userAPI.getCompanies();
      console.log('Companies response:', companiesResponse.data);
      
      // Şirketleri rating'e göre sırala (rating >= 3.5 olanları al, yoksa en yeni yüksek rating'i seç)
      const allCompanies = companiesResponse.data.data || [];
      const topCompanies = allCompanies
        .filter(company => {
          const rating = company.rating?.average || 0;
          const hasRating = company.rating?.count > 0;
          // Rating'i olan veya yeni şirketleri göster
          return rating >= 3.5 || !hasRating;
        })
        .sort((a, b) => {
          // Önce rating'e göre, sonra tarih'e göre sırala
          const ratingDiff = (b.rating?.average || 0) - (a.rating?.average || 0);
          if (ratingDiff !== 0) return ratingDiff;
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        })
        .slice(0, 4);
      
      console.log('Top companies:', topCompanies);
      setPopularCompanies(topCompanies);

      // Popüler şoförleri çek
      const driversResponse = await userAPI.getDrivers();
      console.log('Drivers response:', driversResponse.data);
      
      // Şoförleri rating'e göre sırala (rating >= 3.5 olanları al, yoksa en yeni yüksek rating'i seç)
      const allDrivers = driversResponse.data.data || [];
      const topDrivers = allDrivers
        .filter(driver => {
          const rating = driver.rating?.average || 0;
          const hasRating = driver.rating?.count > 0;
          // Rating'i olan veya yeni şoförleri göster
          return rating >= 3.5 || !hasRating;
        })
        .sort((a, b) => {
          // Önce rating'e göre, sonra tarih'e göre sırala
          const ratingDiff = (b.rating?.average || 0) - (a.rating?.average || 0);
          if (ratingDiff !== 0) return ratingDiff;
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        })
        .slice(0, 4);
      
      console.log('Top drivers:', topDrivers);
      setPopularDrivers(topDrivers);
    } catch (error) {
      console.error('Popüler veriler yüklenemedi:', error);
      // Set empty arrays on error to prevent UI issues
      setPopularCompanies([]);
      setPopularDrivers([]);
    }
  };

  const handleCitySelect = (city) => {
    setSearchCity(city);
    setShowCityDropdown(false);
  };

  const filteredCities = (searchTerm) => {
    return cities.filter(city => 
      city.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Arama sayfasına yönlendir
    window.location.href = `/jobs?search=${searchQuery}&city=${searchCity}`;
  };

  // Filtre değiştirme fonksiyonu
  const handleFilterClick = (filterType) => {
    if (activeFilter === filterType) {
      // Aynı filtrenin tekrar tıklanması filtreyi kaldırır
      setActiveFilter('');
      setFeaturedJobs(allJobs.slice(0, 3));
      setRecentJobs(allJobs);
    } else {
      // Yeni filtre uygula
      setActiveFilter(filterType);
      const filtered = allJobs.filter(job => 
        job.loadDetails?.type?.toLowerCase().includes(filterType.toLowerCase())
      );
      setFeaturedJobs(filtered.slice(0, 3));
      setRecentJobs(filtered);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Hero Section with Search */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Nakliyat Sektörünün <span className="text-blue-600">Buluşma Noktası</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Binlerce şirket ve şoför LoadING&apos;de işbirliği yapıyor
            </p>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col md:flex-row gap-3">
              <div className="flex-1 flex items-center space-x-3 border-r border-gray-200 pr-3">
                <input
                  type="text"
                  placeholder="İş ara... (örn: İstanbul-Ankara)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 outline-none !text-black"
                />
              </div>
              <div className="flex-1 flex items-center space-x-3 pr-3 relative">
                <input
                  type="text"
                  placeholder="Şehir"
                  value={searchCity}
                  onChange={(e) => {
                    setSearchCity(e.target.value);
                    setShowCityDropdown(true);
                  }}
                  onFocus={() => setShowCityDropdown(true)}
                  className="flex-1 outline-none text-black pr-8"
                />
                <ChevronDown className="absolute right-3 w-4 h-4 text-gray-400" />
                
                {showCityDropdown && (
                  <div className="absolute z-10 w-full top-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredCities(searchCity).map((city) => (
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
              <button type="submit" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap">
                İş Ara
              </button>
            </div>
          </form>

          {/* Quick Filters */}
          <div className="max-w-4xl mx-auto mt-6 flex flex-wrap gap-2 justify-center">
            {['Parsiyel', 'Konteyner', 'Dorse', 'Frigo'].map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilterClick(filter)}
                className={`px-4 py-2 rounded-full text-sm transition border ${
                  activeFilter === filter
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 hover:text-blue-600 hover:bg-blue-50 border-gray-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats - Removed fake statistics */}

      {/* Featured Jobs */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Öne Çıkan İlanlar</h2>
              <p className="text-gray-600">En çok görüntülenen ve acil işler</p>
            </div>
            <Link href="/jobs?featured=true" className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1">
              <span>Tümünü Gör</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredJobs.length > 0 ? (
              featuredJobs.map((job) => (
                <JobCard key={job._id} job={job} featured />
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg text-gray-600">Bu filtre için ilan bulunmuyor</p>
                {activeFilter && (
                  <button
                    onClick={() => handleFilterClick('')}
                    className="mt-4 text-blue-600 hover:text-blue-700 underline"
                  >
                    Filtreyi Temizle
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Recent Jobs */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Yeni Eklenen İlanlar</h2>
              <p className="text-gray-600">Son 24 saatte eklenen işler</p>
            </div>
            <Link href="/jobs" className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1">
              <span>Tümünü Gör</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {recentJobs.length > 0 ? (
              recentJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg text-gray-600">Bu filtre için ilan bulunmuyor</p>
                {activeFilter && (
                  <button
                    onClick={() => handleFilterClick('')}
                    className="mt-4 text-blue-600 hover:text-blue-700 underline"
                  >
                    Filtreyi Temizle
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Popular Companies & Drivers */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Popular Companies */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                  <Building2 className="w-6 h-6 text-blue-600" />
                  <span>Popüler Şirketler</span>
                </h2>
                <Link href="/companies" className="text-blue-600 text-sm hover:text-blue-700">
                  Tümü
                </Link>
              </div>
              <div className="space-y-3">
                {popularCompanies.length > 0 ? (
                  popularCompanies.map((company) => (
                    <div key={company._id} className="card p-4 flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{company.employerDetails?.companyName || 'Şirket Adı'}</h3>
                        <div className="flex items-center space-x-3 text-sm text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span>{(company.rating?.average || 0).toFixed(1)}</span>
                          </span>
                          <span>•</span>
                          <span>{company.profile?.city || 'Şehir'}</span>
                          <span>•</span>
                          <span>{company.employerDetails?.postedJobs || 0} iş</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Henüz şirket verisi bulunmuyor</p>
                  </div>
                )}
              </div>
            </div>

            {/* Popular Drivers */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                  <Users className="w-6 h-6 text-blue-600" />
                  <span>Popüler Şoförler</span>
                </h2>
                <Link href="/drivers" className="text-blue-600 text-sm hover:text-blue-700">
                  Tümü
                </Link>
              </div>
              <div className="space-y-3">
                {popularDrivers.length > 0 ? (
                  popularDrivers.map((driver) => (
                    <div key={driver._id} className="card p-4 flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {driver.profile?.firstName || 'Ad'} {driver.profile?.lastName || 'Soyad'}
                        </h3>
                        <div className="flex items-center space-x-3 text-sm text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span>{(driver.rating?.average || 0).toFixed(1)}</span>
                          </span>
                          <span>•</span>
                          <span>{driver.profile?.city || 'Şehir'}</span>
                          <span>•</span>
                          <span>{driver.driverDetails?.experienceYears || 0} yıl tecrübe</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Henüz şoför verisi bulunmuyor</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// Job Card Component
function JobCard({ job, featured = false }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
  };

  return (
    <Link href={`/jobs/${job._id}`} className="card p-6 block hover:border-blue-200">
      {featured && (
        <div className="flex items-center space-x-1 text-yellow-600 text-sm font-medium mb-3">
          <TrendingUp className="w-4 h-4" />
          <span>Öne Çıkan</span>
        </div>
      )}
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg mb-2 hover:text-blue-600 transition">
            {job.title}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
            <Building2 className="w-4 h-4" />
            <span>{job.postedBy?.profile?.firstName || 'Şirket'}</span>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span>{job.postedBy?.rating?.average || 4.5}</span>
            </div>
          </div>
        </div>
        {job.payment?.amount && (
          <div className="text-right">
            <div className="text-lg font-bold text-blue-600">{job.payment.amount.toLocaleString('tr-TR')} ₺</div>
          </div>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{job.route?.from?.city} → {job.route?.to?.city}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Package className="w-4 h-4" />
          <span>{job.loadDetails?.type || 'Genel Yük'}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{formatDate(job.schedule?.startDate)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          {job.views || 0} görüntülenme
        </div>
        <div className="text-blue-600 text-sm font-medium flex items-center space-x-1">
          <span>Detaylar</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}