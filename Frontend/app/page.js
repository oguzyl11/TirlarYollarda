'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, Truck, Package, Star, TrendingUp, Users, Building2, ChevronRight, Clock, DollarSign } from 'lucide-react';
import { jobAPI, userAPI } from '../lib/api';
import Header from '../components/Header';

export default function Home() {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCity, setSearchCity] = useState('');

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const response = await jobAPI.getJobs({ limit: 6 });
      setRecentJobs(response.data.data);
      // Featured jobs simülasyonu (gerçekte featured flag'e göre çekilecek)
      setFeaturedJobs(response.data.data.slice(0, 3));
    } catch (error) {
      console.error('İlanlar yüklenemedi:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Arama sayfasına yönlendir
    window.location.href = `/jobs?search=${searchQuery}&city=${searchCity}`;
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
              Binlerce şirket ve şoför TırlarYollarda'da işbirliği yapıyor
            </p>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col md:flex-row gap-3">
              <div className="flex-1 flex items-center space-x-3 border-r border-gray-200 pr-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="İş ara... (örn: İstanbul-Ankara)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 outline-none text-gray-600"
                />
              </div>
              <div className="flex-1 flex items-center space-x-3 pr-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Şehir"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="flex-1 outline-none text-gray-600"
                />
              </div>
              <button type="submit" className="btn-primary whitespace-nowrap">
                İş Ara
              </button>
            </div>
          </form>

          {/* Quick Filters */}
          <div className="max-w-4xl mx-auto mt-6 flex flex-wrap gap-2 justify-center">
            {['Parsiyel', 'Konteyner', 'Dorse', 'Frigo'].map((filter) => (
              <Link
                key={filter}
                href={`/jobs?loadType=${filter}`}
                className="px-4 py-2 bg-white rounded-full text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition border border-gray-200"
              >
                {filter}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">15,000+</div>
              <div className="text-gray-600 text-sm">Aktif Kullanıcı</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">8,932</div>
              <div className="text-gray-600 text-sm">Tamamlanan İş</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">4.8/5</div>
              <div className="text-gray-600 text-sm">Memnuniyet</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">1,247</div>
              <div className="text-gray-600 text-sm">Aktif İlan</div>
            </div>
          </div>
        </div>
      </section>

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
            {featuredJobs.map((job) => (
              <JobCard key={job._id} job={job} featured />
            ))}
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
            {recentJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
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
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="card p-4 flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">Örnek Lojistik A.Ş.</h3>
                      <div className="flex items-center space-x-3 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>4.8</span>
                        </span>
                        <span>•</span>
                        <span>250+ İş</span>
                      </div>
                    </div>
                  </div>
                ))}
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
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="card p-4 flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">Mehmet Y.</h3>
                      <div className="flex items-center space-x-3 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>4.9</span>
                        </span>
                        <span>•</span>
                        <span>15 yıl tecrübe</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Truck className="w-6 h-6 text-blue-600" />
                <span className="font-bold text-lg">TırlarYollarda</span>
              </div>
              <p className="text-gray-400 text-sm">
                Nakliyat sektörünün dijital buluşma noktası
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div>İş İlanları</div>
                <div>Şirketler</div>
                <div>Şoförler</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Destek</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div>Yardım Merkezi</div>
                <div>İletişim</div>
                <div>SSS</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Yasal</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div>Gizlilik</div>
                <div>Kullanım Koşulları</div>
                <div>KVKK</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            © 2025 TırlarYollarda. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>
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