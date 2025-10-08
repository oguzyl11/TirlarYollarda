import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { jobsAPI } from '../services/api';
import { Search, Filter, MapPin, Clock, Truck, Star, Plus } from 'lucide-react';

const Jobs = () => {
  const [filters, setFilters] = useState({
    jobType: '',
    fromCity: '',
    toCity: '',
    loadType: '',
    minAmount: '',
    maxAmount: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const { data: jobsData, isLoading, error } = useQuery(
    ['jobs', filters],
    () => jobsAPI.getAll(filters),
    {
      keepPreviousData: true,
    }
  );

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      jobType: '',
      fromCity: '',
      toCity: '',
      loadType: '',
      minAmount: '',
      maxAmount: '',
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">İş İlanları</h1>
              <p className="mt-2 text-gray-600">
                {jobsData?.data?.pagination?.total || 0} aktif ilan bulundu
              </p>
            </div>
            <Link
              to="/create-job"
              className="mt-4 md:mt-0 btn-primary inline-flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              İlan Ver
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filtreler</h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden text-gray-500 hover:text-gray-700"
                >
                  <Filter className="h-5 w-5" />
                </button>
              </div>

              <div className={`space-y-4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Job Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İlan Tipi
                  </label>
                  <select
                    value={filters.jobType}
                    onChange={(e) => handleFilterChange('jobType', e.target.value)}
                    className="w-full input-field"
                  >
                    <option value="">Tümü</option>
                    <option value="employer-seeking-driver">Şirket Tırcı Arıyor</option>
                    <option value="driver-seeking-job">Tırcı İş Arıyor</option>
                  </select>
                </div>

                {/* From City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nereden
                  </label>
                  <input
                    type="text"
                    value={filters.fromCity}
                    onChange={(e) => handleFilterChange('fromCity', e.target.value)}
                    placeholder="Şehir adı..."
                    className="input-field"
                  />
                </div>

                {/* To City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nereye
                  </label>
                  <input
                    type="text"
                    value={filters.toCity}
                    onChange={(e) => handleFilterChange('toCity', e.target.value)}
                    placeholder="Şehir adı..."
                    className="input-field"
                  />
                </div>

                {/* Load Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yük Tipi
                  </label>
                  <select
                    value={filters.loadType}
                    onChange={(e) => handleFilterChange('loadType', e.target.value)}
                    className="w-full input-field"
                  >
                    <option value="">Tümü</option>
                    <option value="Parsiyel">Parsiyel</option>
                    <option value="Konteyner">Konteyner</option>
                    <option value="Dorse">Dorse</option>
                    <option value="Frigo">Frigo</option>
                    <option value="Tanker">Tanker</option>
                  </select>
                </div>

                {/* Amount Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ücret Aralığı (₺)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={filters.minAmount}
                      onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                      placeholder="Min"
                      className="input-field"
                    />
                    <input
                      type="number"
                      value={filters.maxAmount}
                      onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                      placeholder="Max"
                      className="input-field"
                    />
                  </div>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={clearFilters}
                  className="w-full btn-secondary"
                >
                  Filtreleri Temizle
                </button>
              </div>
            </div>
          </div>

          {/* Jobs List */}
          <div className="lg:col-span-3">
            {error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-600">İlanlar yüklenirken hata oluştu.</p>
              </div>
            ) : jobsData?.data?.data?.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  İlan bulunamadı
                </h3>
                <p className="text-gray-600">
                  Arama kriterlerinize uygun ilan bulunamadı. 
                  Filtreleri değiştirerek tekrar deneyin.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {jobsData?.data?.data?.map((job) => (
                  <div key={job._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {job.title}
                            </h3>
                            <div className="flex items-center text-sm text-gray-600">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                job.jobType === 'employer-seeking-driver'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {job.jobType === 'employer-seeking-driver' ? 'Şirket Tırcı Arıyor' : 'Tırcı İş Arıyor'}
                              </span>
                            </div>
                          </div>
                          {job.payment?.amount && (
                            <div className="text-right">
                              <div className="text-2xl font-bold text-primary-600">
                                {formatAmount(job.payment.amount)}
                              </div>
                              <div className="text-sm text-gray-500">
                                {job.payment.paymentType === 'fixed' ? 'Sabit' : 
                                 job.payment.paymentType === 'per-km' ? 'Km başı' : 'Pazarlıklı'}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="text-sm">
                              {job.route?.from?.city} → {job.route?.to?.city}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="text-sm">
                              {formatDate(job.schedule?.startDate)}
                            </span>
                          </div>
                          {job.loadDetails?.type && (
                            <div className="flex items-center text-gray-600">
                              <Truck className="h-4 w-4 mr-2 text-gray-400" />
                              <span className="text-sm">{job.loadDetails.type}</span>
                            </div>
                          )}
                          {job.postedBy?.rating?.average > 0 && (
                            <div className="flex items-center text-gray-600">
                              <Star className="h-4 w-4 mr-2 text-yellow-400 fill-current" />
                              <span className="text-sm">
                                {job.postedBy.rating.average} ({job.postedBy.rating.count} değerlendirme)
                              </span>
                            </div>
                          )}
                        </div>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {job.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            <span className="font-medium">{job.postedBy?.profile?.firstName} {job.postedBy?.profile?.lastName}</span>
                            {job.views > 0 && (
                              <span className="ml-2">• {job.views} görüntülenme</span>
                            )}
                          </div>
                          <Link
                            to={`/jobs/${job._id}`}
                            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                          >
                            Detayları Gör →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {jobsData?.data?.pagination?.pages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex space-x-2">
                  <button
                    disabled={jobsData.data.pagination.page === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Önceki
                  </button>
                  <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-primary-50 border border-primary-300 rounded-md">
                    {jobsData.data.pagination.page} / {jobsData.data.pagination.pages}
                  </span>
                  <button
                    disabled={jobsData.data.pagination.page === jobsData.data.pagination.pages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sonraki
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;

