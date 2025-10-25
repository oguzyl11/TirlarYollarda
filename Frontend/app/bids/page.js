'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Footer from '../../components/Footer';
import { 
  Truck, 
  ArrowLeft, 
  Star, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  MessageSquare
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { bidAPI } from '../../lib/api';
import toast, { Toaster } from 'react-hot-toast';

export default function BidsPage() {
  const router = useRouter();
  const { user, isAuthenticated, initAuth } = useAuthStore();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initAuth();
    if (!isAuthenticated || (user?.userType !== 'driver' && user?.userType !== 'individual')) {
      router.push('/login');
      return;
    }
    loadBids();
  }, [isAuthenticated, user, router]);

  const loadBids = async () => {
    try {
      setLoading(true);
      const response = await bidAPI.getMyBids();
      setBids(response.data.data || []);
    } catch (error) {
      console.error('Teklifler yüklenemedi:', error);
      toast.error('Teklifler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'accepted':
        return 'Kabul Edildi';
      case 'rejected':
        return 'Reddedildi';
      default:
        return 'Beklemede';
    }
  };

  if (!isAuthenticated || user?.userType !== 'driver') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Yükleniyor...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-blue-600">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Geri Dön
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">
                  {user?.userType === 'individual' ? 'Eşya Taşıma Tekliflerim' : 'Tekliflerim'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Teklif</p>
                <p className="text-2xl font-bold text-gray-900">{bids.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bekleyen</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bids.filter(bid => bid.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Kabul Edilen</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bids.filter(bid => bid.status === 'accepted').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bids List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Teklif Geçmişi</h2>
          </div>
          
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-20 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : bids.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {bids.map((bid) => (
                <div key={bid._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{bid.job?.title}</h3>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(bid.status)}
                          <span className="text-sm font-medium text-gray-600">
                            {getStatusText(bid.status)}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3">{bid.job?.description}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Truck className="w-4 h-4 mr-1" />
                          {bid.job?.route?.from?.city} → {bid.job?.route?.to?.city}
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium text-green-600">
                            {bid.amount} TL
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {new Date(bid.createdAt).toLocaleDateString('tr-TR')}
                        </div>
                      </div>
                      
                      {bid.message && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <strong>Mesajınız:</strong> {bid.message}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Link
                        href={`/jobs/${bid.job?._id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="İş Detayı"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                      <button
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                        title="Mesaj Gönder"
                      >
                        <MessageSquare className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz teklif vermediniz</h3>
              <p className="text-gray-500 mb-6">İş ilanlarına göz atın ve teklif vermeye başlayın</p>
              <Link
                href="/jobs"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Truck className="w-5 h-5 mr-2" />
                İş İlanlarını Görüntüle
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
