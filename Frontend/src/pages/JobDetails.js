import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { jobsAPI } from '../services/api';
import { MapPin, Clock, Truck, DollarSign, Star, User, MessageSquare, ArrowLeft } from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();

  const { data: jobData, isLoading, error } = useQuery(
    ['job', id],
    () => jobsAPI.getById(id),
    {
      enabled: !!id,
    }
  );

  const job = jobData?.data?.data;

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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">İlan bulunamadı veya yüklenirken hata oluştu.</p>
            <Link to="/jobs" className="btn-primary mt-4 inline-block">
              İlanlara Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/jobs"
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          İlanlara Dön
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      job.jobType === 'employer-seeking-driver'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {job.jobType === 'employer-seeking-driver' ? 'Şirket Tırcı Arıyor' : 'Tırcı İş Arıyor'}
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{job.route?.from?.city} → {job.route?.to?.city}</span>
                  </div>
                </div>
                {job.payment?.amount && (
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary-600">
                      {formatAmount(job.payment.amount)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {job.payment.paymentType === 'fixed' ? 'Sabit' : 
                       job.payment.paymentType === 'per-km' ? 'Km başı' : 'Pazarlıklı'}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="text-sm">
                    <span className="font-medium">Başlangıç:</span> {formatDate(job.schedule?.startDate)}
                  </span>
                </div>
                {job.loadDetails?.type && (
                  <div className="flex items-center text-gray-600">
                    <Truck className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      <span className="font-medium">Yük:</span> {job.loadDetails.type}
                    </span>
                  </div>
                )}
                <div className="flex items-center text-gray-600">
                  <span className="text-sm">
                    <span className="font-medium">Görüntülenme:</span> {job.views || 0}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Açıklama</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
              </div>
            </div>

            {/* Load Details */}
            {job.loadDetails && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Yük Detayları
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {job.loadDetails.type && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Yük Tipi:</span>
                      <p className="text-gray-900">{job.loadDetails.type}</p>
                    </div>
                  )}
                  {job.loadDetails.weight && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Ağırlık:</span>
                      <p className="text-gray-900">{job.loadDetails.weight}</p>
                    </div>
                  )}
                  {job.vehicleRequirements?.type && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Araç Tipi:</span>
                      <p className="text-gray-900">{job.vehicleRequirements.type}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bids */}
            {job.bids && job.bids.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Teklifler ({job.bids.length})
                </h3>
                <div className="space-y-4">
                  {job.bids.map((bid) => (
                    <div key={bid._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <User className="h-5 w-5 mr-2 text-gray-400" />
                          <span className="font-medium">
                            {bid.bidder?.profile?.firstName} {bid.bidder?.profile?.lastName}
                          </span>
                          {bid.bidder?.rating?.average > 0 && (
                            <div className="flex items-center ml-3">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600 ml-1">
                                {bid.bidder.rating.average}
                              </span>
                            </div>
                          )}
                        </div>
                        <span className="text-lg font-bold text-primary-600">
                          {formatAmount(bid.amount)}
                        </span>
                      </div>
                      {bid.message && (
                        <p className="text-gray-600 text-sm">{bid.message}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Poster Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                İlan Sahibi
              </h3>
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
                <h4 className="font-semibold text-gray-900">
                  {job.postedBy?.profile?.firstName} {job.postedBy?.profile?.lastName}
                </h4>
                {job.postedBy?.rating?.average > 0 && (
                  <div className="flex items-center justify-center mt-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm font-medium">
                      {job.postedBy.rating.average} ({job.postedBy.rating.count} değerlendirme)
                    </span>
                  </div>
                )}
                <div className="mt-4">
                  <button className="btn-primary w-full flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Mesaj Gönder
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">İşlemler</h3>
              <div className="space-y-3">
                <button className="btn-primary w-full">
                  Teklif Ver
                </button>
                <button className="btn-secondary w-full">
                  Favorilere Ekle
                </button>
                <button className="btn-secondary w-full">
                  Paylaş
                </button>
              </div>
            </div>

            {/* Job Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">İlan Bilgileri</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">İlan No:</span>
                  <span className="font-medium">{job._id.slice(-8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Yayın Tarihi:</span>
                  <span className="font-medium">{formatDate(job.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Durum:</span>
                  <span className={`font-medium ${
                    job.status === 'active' ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {job.status === 'active' ? 'Aktif' : job.status}
                  </span>
                </div>
                {job.expiresAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Son Tarih:</span>
                    <span className="font-medium">{formatDate(job.expiresAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;

