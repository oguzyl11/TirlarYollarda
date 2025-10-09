import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Clock, Star, Truck, Heart } from 'lucide-react';
import Navbar from '../components/Layout/Navbar';
import Sidebar from '../components/Layout/Sidebar';
import NotificationsModal from '../components/Layout/NotificationsModal';
import Footer from '../components/Layout/Footer';
import Favorites from './Favorites';

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);

  const categories = [
    { name: 'Parsiyel', count: 150 },
    { name: 'Konteyner', count: 89 },
    { name: 'Frigo', count: 67 },
    { name: 'Tanker', count: 34 },
    { name: 'Kamyon', count: 203 }
  ];

  const featuredJobs = [
    {
      id: 1,
      title: 'İstanbul - Ankara Parsiyel Taşımacılığı',
      from: 'İstanbul',
      to: 'Ankara',
      amount: 2500,
      date: '2024-01-15',
      company: 'ABC Lojistik',
      rating: 4.8,
      distance: '450 km',
      featured: true
    },
    {
      id: 2,
      title: 'İzmir - Antalya Konteyner Taşımacılığı',
      from: 'İzmir',
      to: 'Antalya',
      amount: 3200,
      date: '2024-01-14',
      company: 'XYZ Kargo',
      rating: 4.6,
      distance: '350 km',
      featured: true
    },
    {
      id: 3,
      title: 'Bursa - Gaziantep Frigo Taşımacılığı',
      from: 'Bursa',
      to: 'Gaziantep',
      amount: 2800,
      date: '2024-01-13',
      company: 'DEF Nakliyat',
      rating: 4.9,
      distance: '650 km',
      featured: true
    },
    {
      id: 4,
      title: 'Adana - Mersin Tanker Taşımacılığı',
      from: 'Adana',
      to: 'Mersin',
      amount: 1800,
      date: '2024-01-12',
      company: 'GHI Transport',
      rating: 4.7,
      distance: '200 km',
      featured: true
    }
  ];

  const todayJobs = [
    {
      id: 5,
      title: 'Ankara - Sivas Kamyon Taşımacılığı',
      from: 'Ankara',
      to: 'Sivas',
      amount: 2200,
      date: '2024-01-15',
      company: 'JKL Lojistik',
      rating: 4.5,
      distance: '400 km'
    },
    {
      id: 6,
      title: 'İzmir - Denizli Parsiyel Taşımacılığı',
      from: 'İzmir',
      to: 'Denizli',
      amount: 1600,
      date: '2024-01-15',
      company: 'MNO Kargo',
      rating: 4.3,
      distance: '250 km'
    },
    {
      id: 7,
      title: 'İstanbul - Tekirdağ Konteyner Taşımacılığı',
      from: 'İstanbul',
      to: 'Tekirdağ',
      amount: 1200,
      date: '2024-01-15',
      company: 'PQR Transport',
      rating: 4.8,
      distance: '150 km'
    },
    {
      id: 8,
      title: 'Bursa - Balıkesir Frigo Taşımacılığı',
      from: 'Bursa',
      to: 'Balıkesir',
      amount: 1900,
      date: '2024-01-15',
      company: 'STU Lojistik',
      rating: 4.6,
      distance: '180 km'
    },
    {
      id: 9,
      title: 'Antalya - Muğla Parsiyel Taşımacılığı',
      from: 'Antalya',
      to: 'Muğla',
      amount: 2100,
      date: '2024-01-15',
      company: 'VWX Kargo',
      rating: 4.4,
      distance: '300 km'
    },
    {
      id: 10,
      title: 'Gaziantep - Şanlıurfa Tanker Taşımacılığı',
      from: 'Gaziantep',
      to: 'Şanlıurfa',
      amount: 2400,
      date: '2024-01-15',
      company: 'YZA Transport',
      rating: 4.7,
      distance: '350 km'
    },
    {
      id: 11,
      title: 'Trabzon - Rize Kamyon Taşımacılığı',
      from: 'Trabzon',
      to: 'Rize',
      amount: 1400,
      date: '2024-01-15',
      company: 'BCD Lojistik',
      rating: 4.2,
      distance: '120 km'
    },
    {
      id: 12,
      title: 'Konya - Afyon Konteyner Taşımacılığı',
      from: 'Konya',
      to: 'Afyon',
      amount: 1700,
      date: '2024-01-15',
      company: 'EFG Kargo',
      rating: 4.5,
      distance: '220 km'
    }
  ];

  const truckerJobs = [
    {
      id: 13,
      title: 'İstanbul - Berlin Uluslararası Taşımacılık',
      from: 'İstanbul',
      to: 'Berlin',
      amount: 8500,
      date: '2024-01-16',
      company: 'International Transport Ltd.',
      rating: 4.9,
      distance: '2000 km'
    },
    {
      id: 14,
      title: 'Ankara - Moskova Frigo Taşımacılığı',
      from: 'Ankara',
      to: 'Moskova',
      amount: 12000,
      date: '2024-01-17',
      company: 'Euro Logistics',
      rating: 4.8,
      distance: '2800 km'
    },
    {
      id: 15,
      title: 'İzmir - Roma Konteyner Taşımacılığı',
      from: 'İzmir',
      to: 'Roma',
      amount: 9500,
      date: '2024-01-18',
      company: 'Mediterranean Shipping',
      rating: 4.7,
      distance: '1800 km'
    },
    {
      id: 16,
      title: 'Bursa - Amsterdam Parsiyel Taşımacılığı',
      from: 'Bursa',
      to: 'Amsterdam',
      amount: 7800,
      date: '2024-01-19',
      company: 'North Sea Logistics',
      rating: 4.6,
      distance: '2200 km'
    }
  ];

  const companyJobs = [
    {
      id: 17,
      title: 'Lojistik Operatör Aranıyor',
      company: 'ABC Lojistik A.Ş.',
      location: 'İstanbul',
      salary: '15,000 - 25,000',
      type: 'Tam Zamanlı',
      date: '2024-01-15'
    },
    {
      id: 18,
      title: 'Nakliye Şoförü',
      company: 'XYZ Transport Ltd.',
      location: 'Ankara',
      salary: '12,000 - 18,000',
      type: 'Tam Zamanlı',
      date: '2024-01-14'
    },
    {
      id: 19,
      title: 'Lojistik Koordinatörü',
      company: 'DEF Kargo A.Ş.',
      location: 'İzmir',
      salary: '18,000 - 30,000',
      type: 'Tam Zamanlı',
      date: '2024-01-13'
    },
    {
      id: 20,
      title: 'Depo Operatörü',
      company: 'GHI Lojistik Ltd.',
      location: 'Bursa',
      salary: '10,000 - 15,000',
      type: 'Tam Zamanlı',
      date: '2024-01-12'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar 
        onSidebarToggle={() => setSidebarOpen(true)}
        onNotificationsToggle={() => setNotificationsOpen(!notificationsOpen)}
        onFavoritesToggle={() => setFavoritesOpen(!favoritesOpen)}
      />
      
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <NotificationsModal 
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
      
      <Favorites 
        isOpen={favoritesOpen}
        onClose={() => setFavoritesOpen(false)}
      />

      {/* Main Content */}
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                SANA UYGUN TESLİMATI KEŞFET
              </h1>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto relative">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full pl-12 pr-4 py-4 text-lg rounded-lg border-0 focus:ring-2 focus:ring-primary-300"
                  />
                </div>
              </div>
              
              {/* Category Buttons */}
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Advertisement Banner */}
        <section className="py-8 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg h-32 flex items-center justify-center text-white">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Reklam Alanı</h3>
                <p className="text-blue-100">Burada kayan reklamlar gösterilecek</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Jobs */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">ÖNE ÇIKAN İLANLAR</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredJobs.map((job) => (
                <div key={job.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1">
                      {job.title}
                    </h3>
                    <div className="flex items-center text-yellow-500 ml-2">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="ml-1 text-sm font-medium">{job.rating}</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">{job.from} → {job.to}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="text-sm">{job.date}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {job.company}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xl font-bold text-primary-600">
                      ₺{job.amount.toLocaleString()}
                    </div>
                    <Link
                      to={`/jobs/${job.id}`}
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                      Detay →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Today's Jobs */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">BUGÜN YAYINLANANLAR</h2>
              <Link
                to="/jobs"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Tüm İlanlar →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {todayJobs.map((job) => (
                <div key={job.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1">
                      {job.title}
                    </h3>
                    <div className="flex items-center text-yellow-500 ml-2">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="ml-1 text-xs font-medium">{job.rating}</span>
                    </div>
                  </div>

                  <div className="space-y-1 mb-3">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-3 w-3 mr-2" />
                      <span className="text-xs">{job.from} → {job.to}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-3 w-3 mr-2" />
                      <span className="text-xs">{job.date}</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {job.company}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-primary-600">
                      ₺{job.amount.toLocaleString()}
                    </div>
                    <Link
                      to={`/jobs/${job.id}`}
                      className="text-primary-600 hover:text-primary-700 font-medium text-xs"
                    >
                      Detay →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trucker Jobs */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Tırcıların İş İlanları</h2>
              <Link
                to="/jobs?type=trucker"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Tüm İlanlar →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {truckerJobs.map((job) => (
                <div key={job.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1">
                      {job.title}
                    </h3>
                    <div className="flex items-center text-yellow-500 ml-2">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="ml-1 text-xs font-medium">{job.rating}</span>
                    </div>
                  </div>

                  <div className="space-y-1 mb-3">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-3 w-3 mr-2" />
                      <span className="text-xs">{job.from} → {job.to}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-3 w-3 mr-2" />
                      <span className="text-xs">{job.date}</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {job.company}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-primary-600">
                      ₺{job.amount.toLocaleString()}
                    </div>
                    <Link
                      to={`/jobs/${job.id}`}
                      className="text-primary-600 hover:text-primary-700 font-medium text-xs"
                    >
                      Detay →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Company Jobs */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Şirketlerin İş İlanları</h2>
              <Link
                to="/jobs?type=company"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Tüm İlanlar →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {companyJobs.map((job) => (
                <div key={job.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1">
                      {job.title}
                    </h3>
                    <div className="flex items-center text-yellow-500 ml-2">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="ml-1 text-xs font-medium">4.5</span>
                    </div>
                  </div>

                  <div className="space-y-1 mb-3">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-3 w-3 mr-2" />
                      <span className="text-xs">{job.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-3 w-3 mr-2" />
                      <span className="text-xs">{job.date}</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {job.company}
                    </div>
                    <div className="text-xs text-gray-500">
                      {job.type}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-primary-600">
                      ₺{job.salary}
                    </div>
                    <Link
                      to={`/jobs/${job.id}`}
                      className="text-primary-600 hover:text-primary-700 font-medium text-xs"
                    >
                      Detay →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;

