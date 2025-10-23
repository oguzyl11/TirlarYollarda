'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import JobCard from '../../components/JobCard';
import { 
  Search, 
  MapPin, 
  Package, 
  Calendar, 
  DollarSign, 
  Filter, 
  SlidersHorizontal,
  X,
  ChevronDown,
  Star,
  Clock,
  Truck
} from 'lucide-react';
import { jobAPI } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import toast, { Toaster } from 'react-hot-toast';

export default function JobsPage() {
  const { isAuthenticated, user } = useAuthStore();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    city: '',
    loadType: '',
    vehicleType: '',
    minAmount: '',
    maxAmount: '',
    dateRange: '',
    sortBy: 'newest'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    loadJobs();
  }, [pagination.page, filters]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        ...filters
      };
      
      const response = await jobAPI.getJobs(params);
      setJobs(response.data.data || []);
      setPagination(prev => ({
        ...prev,
        total: response.data.total || 0,
        totalPages: response.data.totalPages || 0
      }));
    } catch (error) {
      console.error('İlanlar yüklenemedi:', error);
      toast.error('İlanlar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    loadJobs();
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      city: '',
      loadType: '',
      vehicleType: '',
      minAmount: '',
      maxAmount: '',
      dateRange: '',
      sortBy: 'newest'
    });
    setSearchTerm('');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const isDriver = user?.userType === 'driver';

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">İş İlanları</h1>
          <p className="text-gray-600">
            {isDriver 
              ? 'Size uygun iş fırsatlarını keşfedin ve başvurun'
              : 'Tüm iş ilanlarını görüntüleyin ve filtreleyin'
            }
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="İş ara... (örn: İstanbul-Ankara, Parsiyel)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5 mr-2" />
                Filtreler
              </button>
              <button
                type="submit"
                className="btn-primary px-6"
              >
                Ara
              </button>
            </div>
          </form>

          {/* Filters Panel */}
          {showFilters && (
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Şehir</label>
                  <input
                    type="text"
                    placeholder="Şehir ara..."
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Yük Tipi</label>
                  <select
                    value={filters.loadType}
                    onChange={(e) => handleFilterChange('loadType', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Tümü</option>
                    <option value="parsiyel">Parsiyel</option>
                    <option value="konteyner">Konteyner</option>
                    <option value="dorse">Dorse</option>
                    <option value="frigo">Frigo</option>
                    <option value="genel">Genel Yük</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Araç Tipi</label>
                  <select
                    value={filters.vehicleType}
                    onChange={(e) => handleFilterChange('vehicleType', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Tümü</option>
                    <option value="kamyon">Kamyon</option>
                    <option value="tir">Tır</option>
                    <option value="ceki">Çekici</option>
                    <option value="mega-tir">Mega Tır</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sıralama</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="input-field"
                  >
                    <option value="newest">En Yeni</option>
                    <option value="oldest">En Eski</option>
                    <option value="highest">En Yüksek Ücret</option>
                    <option value="lowest">En Düşük Ücret</option>
                    <option value="deadline">Teslim Tarihi</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min. Ücret (TL)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.minAmount}
                    onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max. Ücret (TL)</label>
                  <input
                    type="number"
                    placeholder="100000"
                    value={filters.maxAmount}
                    onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <button
                  onClick={clearFilters}
                  className="text-gray-600 hover:text-gray-800 font-medium"
                >
                  Filtreleri Temizle
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="btn-secondary"
                >
                  Filtreleri Uygula
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {loading ? 'Yükleniyor...' : `${pagination.total} iş ilanı bulundu`}
            </h2>
            <p className="text-sm text-gray-600">
              Sayfa {pagination.page} / {pagination.totalPages}
            </p>
          </div>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Önceki
                  </button>
                  
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          pagination.page === page
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sonraki
                  </button>
                </nav>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">İlan bulunamadı</h3>
            <p className="text-gray-600 mb-6">
              Arama kriterlerinize uygun iş ilanı bulunmuyor. Filtreleri değiştirip tekrar deneyin.
            </p>
            <button
              onClick={clearFilters}
              className="btn-primary"
            >
              Filtreleri Temizle
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}