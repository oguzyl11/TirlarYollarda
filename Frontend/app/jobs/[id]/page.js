'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { MapPin, Package, Clock, DollarSign, Star, Building2, Phone, Mail, AlertCircle, Send, CheckCircle, User } from 'lucide-react';
import { jobAPI, bidAPI } from '../../../lib/api';
import { useAuthStore } from '../../../store/authStore';
import toast, { Toaster } from 'react-hot-toast';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidData, setBidData] = useState({
    amount: '',
    message: ''
  });

  useEffect(() => {
    loadJob();
  }, [params.id]);

  const loadJob = async () => {
    try {
      const response = await jobAPI.getJob(params.id);
      setJob(response.data.data);
    } catch (error) {
      console.error('İlan yüklenemedi:', error);
      toast.error('İlan bulunamadı');
    } finally {
      setLoading(false);
    }
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Teklif vermek için giriş yapmalısınız');
      router.push('/login');
      return;
    }

    try {
      await bidAPI.createBid({
        job: params.id,
        amount: Number(bidData.amount),
        message: bidData.message
      });
      toast.success('Teklifiniz başarıyla gönderildi!');
      setShowBidForm(false);
      setBidData({ amount: '', message: '' });
      loadJob();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Teklif gönderilemedi');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-5xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">İlan bulunamadı</h2>
          <button onClick={() => router.push('/jobs')} className="btn-primary">
            İlanlara Dön
          </button>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === job.postedBy?._id;
  const canBid = isAuthenticated && !isOwner && job.status === 'active';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Toaster position="top-right" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <div className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {job.featured && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
                        ÖNE ÇIKAN
                      </span>
                    )}
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      job.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {job.status === 'active' ? 'Aktif' : job.status}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">{job.title}</h1>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Building2 className="w-4 h-4" />
                      <span className="font-medium">{job.postedBy?.profile?.firstName} {job.postedBy?.profile?.lastName}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{job.postedBy?.rating?.average?.toFixed(1) || '0.0'}</span>
                      <span className="text-gray-400">({job.postedBy?.rating?.count || 0} değerlendirme)</span>
                    </div>
                  </div>
                </div>
                {job.payment?.amount && (
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">
                      {job.payment.amount.toLocaleString('tr-TR')} ₺
                    </div>
                    <div className="text-sm text-gray-500">
                      {job.payment.paymentType === 'per-km' ? 'Kilometreye göre' : 'Sabit ücret'}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Güzergah</div>
                  <div className="flex items-center space-x-1 text-sm font-medium">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{job.route?.from?.city} → {job.route?.to?.city}</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Yük Türü</div>
                  <div className="flex items-center space-x-1 text-sm font-medium">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span>{job.loadDetails?.type || 'Belirtilmemiş'}</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Başlangıç</div>
                  <div className="flex items-center space-x-1 text-sm font-medium">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{new Date(job.schedule?.startDate).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Görüntülenme</div>
                  <div className="text-sm font-medium">{job.views || 0} kez</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">İlan Açıklaması</h2>
              <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
            </div>

            {/* Details */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Detaylar</h2>
              <div className="space-y-3">
                {job.loadDetails?.weight && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Yük Ağırlığı</span>
                    <span className="font-medium">{job.loadDetails.weight}</span>
                  </div>
                )}
                {job.vehicleRequirements?.type && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Araç Tipi</span>
                    <span className="font-medium">{job.vehicleRequirements.type}</span>
                  </div>
                )}
                {job.route?.distance && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Mesafe</span>
                    <span className="font-medium">{job.route.distance} km</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Ödeme Yöntemi</span>
                  <span className="font-medium">
                    {job.payment?.paymentMethod === 'cash' ? 'Nakit' : 
                     job.payment?.paymentMethod === 'bank-transfer' ? 'Havale/EFT' : 'Diğer'}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">İlan Tarihi</span>
                  <span className="font-medium">{new Date(job.createdAt).toLocaleDateString('tr-TR')}</span>
                </div>
              </div>
            </div>

            {/* Bids */}
            {job.bids && job.bids.length > 0 && isOwner && (
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Gelen Teklifler ({job.bids.length})
                </h2>
                <div className="space-y-3">
                  {job.bids.map(bid => (
                    <div key={bid._id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">{bid.bidder?.profile?.firstName}</div>
                            <div className="text-sm text-gray-500 flex items-center space-x-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span>{bid.bidder?.rating?.average?.toFixed(1) || '0.0'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">
                            {bid.amount.toLocaleString('tr-TR')} ₺
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${
                            bid.status === 'accepted' ? 'bg-green-100 text-green-700' :
                            bid.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {bid.status === 'accepted' ? 'Kabul Edildi' :
                             bid.status === 'rejected' ? 'Reddedildi' : 'Beklemede'}
                          </span>
                        </div>
                      </div>
                      {bid.message && (
                        <p className="text-sm text-gray-600 mt-2">{bid.message}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="card p-6">
              <h3 className="font-bold text-gray-900 mb-4">İletişim Bilgileri</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">{job.postedBy?.profile?.firstName} {job.postedBy?.profile?.lastName}</div>
                    <div className="text-sm text-gray-500">{job.postedBy?.userType === 'employer' ? 'İşveren' : 'Şoför'}</div>
                  </div>
                </div>
                {job.postedBy?.profile?.phone && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{job.postedBy.profile.phone}</span>
                  </div>
                )}
                {job.postedBy?.email && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{job.postedBy.email}</span>
                  </div>
                )}
                {job.postedBy?.profile?.city && (
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{job.postedBy.profile.city}</span>
                  </div>
                )}
              </div>

              {canBid && (
                <button
                  onClick={() => setShowBidForm(!showBidForm)}
                  className="w-full btn-primary mt-4"
                >
                  <Send className="w-4 h-4 mr-2 inline" />
                  Teklif Ver
                </button>
              )}
            </div>

            {/* Bid Form */}
            {showBidForm && canBid && (
              <div className="card p-6">
                <h3 className="font-bold text-gray-900 mb-4">Teklifinizi Gönderin</h3>
                <form onSubmit={handleBidSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teklif Tutarı (₺)
                    </label>
                    <input
                      type="number"
                      required
                      value={bidData.amount}
                      onChange={(e) => setBidData({ ...bidData, amount: e.target.value })}
                      className="input-field"
                      placeholder="15000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mesaj (Opsiyonel)
                    </label>
                    <textarea
                      rows="3"
                      value={bidData.message}
                      onChange={(e) => setBidData({ ...bidData, message: e.target.value })}
                      className="input-field"
                      placeholder="Ek bilgiler..."
                    />
                  </div>
                  <button type="submit" className="w-full btn-primary">
                    Teklifi Gönder
                  </button>
                </form>
              </div>
            )}

            {/* Safety Tips */}
            <div className="card p-6 bg-blue-50 border-blue-200">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">Güvenlik İpuçları</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Ödeme yapmadan önce mutlaka sözleşme yapın</li>
                    <li>• Şüpheli tekliflere dikkat edin</li>
                    <li>• Kişisel bilgilerinizi paylaşmayın</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}