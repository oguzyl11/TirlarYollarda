'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Footer from '../../../components/Footer';
import { 
  Truck, 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Package,
  Clock,
  User,
  Star,
  MessageSquare,
  Send,
  Eye
} from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { jobAPI, bidAPI } from '../../../lib/api';
import toast, { Toaster } from 'react-hot-toast';

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthenticated, initAuth } = useAuthStore();
  const [job, setJob] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidLoading, setBidLoading] = useState(false);
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidData, setBidData] = useState({
    proposedAmount: '',
    message: '',
    estimatedDays: ''
  });

  useEffect(() => {
    initAuth();
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadJobDetails();
  }, [params.id, isAuthenticated, router]);

  const loadJobDetails = async () => {
    try {
      setLoading(true);
      const response = await jobAPI.getJob(params.id);
      setJob(response.data.data);
      
      // Eğer işveren ise teklifleri de yükle
      if (user?.userType === 'employer') {
        const bidsResponse = await bidAPI.getJobBids(params.id);
        setBids(bidsResponse.data.data || []);
      }
    } catch (error) {
      console.error('İş detayları yüklenemedi:', error);
      toast.error('İş detayları yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    
    if (!bidData.proposedAmount || !bidData.message) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }

    try {
      setBidLoading(true);
      const response = await bidAPI.createBid({
        jobId: params.id,
        ...bidData
      });
      
      if (response.data.success) {
        toast.success('Teklifiniz başarıyla gönderildi!');
        setShowBidForm(false);
        setBidData({ proposedAmount: '', message: '', estimatedDays: '' });
      }
    } catch (error) {
      console.error('Teklif gönderme hatası:', error);
      toast.error('Teklif gönderilirken hata oluştu');
    } finally {
      setBidLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">İş detayları yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">İş bulunamadı</h1>
          <Link href="/jobs" className="text-blue-600 hover:text-blue-700">
            İş ilanlarına dön
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user?.userId === job.postedBy?._id;
  const isDriver = user?.userType === 'driver';

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/jobs" className="flex items-center text-gray-600 hover:text-blue-600">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Geri Dön
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">İş Detayı</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">{job.views} görüntüleme</span>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6">{job.description}</p>
              
              {/* Job Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Güzergah</p>
                    <p className="font-medium">{job.route?.from?.city} → {job.route?.to?.city}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Ücret</p>
                    <p className="font-medium">{job.payment?.amount} {job.payment?.currency}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-500">Başlangıç</p>
                    <p className="font-medium">
                      {job.schedule?.startDate ? new Date(job.schedule.startDate).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Package className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-500">Yük Türü</p>
                    <p className="font-medium">{job.loadDetails?.type || 'Belirtilmemiş'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Load Details */}
            {job.loadDetails && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Yük Detayları</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Ağırlık</p>
                    <p className="font-medium">{job.loadDetails.weight || 'Belirtilmemiş'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Boyutlar</p>
                    <p className="font-medium">
                      {job.loadDetails.dimensions ? 
                        `${job.loadDetails.dimensions.length}x${job.loadDetails.dimensions.width}x${job.loadDetails.dimensions.height}` : 
                        'Belirtilmemiş'
                      }
                    </p>
                  </div>
                </div>
                {job.loadDetails.description && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Açıklama</p>
                    <p className="font-medium">{job.loadDetails.description}</p>
                  </div>
                )}
              </div>
            )}

            {/* Posted By */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">İşveren Bilgileri</h2>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {job.postedBy?.profile?.firstName} {job.postedBy?.profile?.lastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {job.postedBy?.profile?.city || 'Şehir belirtilmemiş'}
                  </p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">
                      {job.postedBy?.rating || 'Değerlendirme yok'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {isDriver && !isOwner ? (
                <div className="space-y-4">
                  {!showBidForm ? (
                    <button
                      onClick={() => setShowBidForm(true)}
                      className="w-full btn-primary py-3 flex items-center justify-center"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Teklif Ver
                    </button>
                  ) : (
                    <form onSubmit={handleBidSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Teklif Tutarı (TL)
                        </label>
                        <input
                          type="number"
                          value={bidData.proposedAmount}
                          onChange={(e) => setBidData(prev => ({ ...prev, proposedAmount: e.target.value }))}
                          className="input-field"
                          placeholder="5000"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mesajınız
                        </label>
                        <textarea
                          value={bidData.message}
                          onChange={(e) => setBidData(prev => ({ ...prev, message: e.target.value }))}
                          className="input-field h-24"
                          placeholder="Teklifiniz hakkında bilgi verin..."
                          required
                        />
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowBidForm(false)}
                          className="flex-1 btn-secondary py-2"
                        >
                          İptal
                        </button>
                        <button
                          type="submit"
                          disabled={bidLoading}
                          className="flex-1 btn-primary py-2 flex items-center justify-center"
                        >
                          {bidLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            'Gönder'
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ) : isOwner ? (
                <div className="space-y-3">
                  <button className="w-full btn-secondary py-3">
                    İşi Düzenle
                  </button>
                  <button className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors">
                    İşi İptal Et
                  </button>
                </div>
              ) : null}
            </div>

            {/* Bids (for employers) */}
            {isOwner && bids.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Teklifler ({bids.length})</h3>
                <div className="space-y-4">
                  {bids.slice(0, 3).map((bid) => (
                    <div key={bid._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium">
                            {bid.bidder?.profile?.firstName} {bid.bidder?.profile?.lastName}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-green-600">
                          {bid.proposedAmount} TL
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{bid.message}</p>
                      <div className="flex space-x-2">
                        <button className="flex-1 bg-green-600 text-white py-1 px-3 rounded text-sm hover:bg-green-700 transition-colors">
                          Kabul Et
                        </button>
                        <button className="flex-1 bg-gray-600 text-white py-1 px-3 rounded text-sm hover:bg-gray-700 transition-colors">
                          Reddet
                        </button>
                      </div>
                    </div>
                  ))}
                  {bids.length > 3 && (
                    <button className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Tüm teklifleri gör ({bids.length})
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}