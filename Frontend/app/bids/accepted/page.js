'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Footer from '../../../components/Footer';
import { 
  CheckCircle, 
  ArrowLeft, 
  Star, 
  Clock, 
  MapPin,
  DollarSign,
  User,
  MessageSquare
} from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { bidAPI } from '../../../lib/api';
import toast, { Toaster } from 'react-hot-toast';

export default function AcceptedBidsPage() {
  const router = useRouter();
  const { user, isAuthenticated, initAuth, initialized } = useAuthStore();
  const [acceptedBids, setAcceptedBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initAuth();
  }, []);

  useEffect(() => {
    if (!initialized) return;
    
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }
    
    loadAcceptedBids();
  }, [isAuthenticated, user, initialized, router]);

  const loadAcceptedBids = async () => {
    try {
      setLoading(true);
      const response = await bidAPI.getMyBids();
      const allBids = response.data.data || [];
      
      // Filter only accepted bids
      const accepted = allBids.filter(bid => bid.status === 'accepted');
      setAcceptedBids(accepted);
    } catch (error) {
      console.error('Accepted bids load error:', error);
      toast.error('Kabul edilen teklifler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (!initialized || !isAuthenticated || !user) {
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Kabul Edilen Teklifler</h1>
                <p className="text-gray-600 mt-1">
                  {acceptedBids.length} kabul edilen teklif
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        )}

        {/* Accepted Bids List */}
        {!loading && (
          <div className="space-y-6">
            {acceptedBids.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Henüz kabul edilen teklif yok
                </h3>
                <p className="text-gray-600 mb-6">
                  Kabul edilen teklifleriniz burada görünecek.
                </p>
                <Link
                  href="/jobs"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  İş İlanlarına Git
                </Link>
              </div>
            ) : (
              acceptedBids.map((bid) => (
                <div key={bid._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {bid.job?.title}
                          </h3>
                          <p className="text-gray-600">
                            {bid.job?.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-700">
                          <MapPin className="w-4 h-4 mr-2" />
                          {bid.job?.route?.from?.city} → {bid.job?.route?.to?.city}
                        </div>
                        <div className="flex items-center text-sm text-gray-700">
                          <DollarSign className="w-4 h-4 mr-2" />
                          {bid.amount} TL
                        </div>
                        <div className="flex items-center text-sm text-gray-700">
                          <Clock className="w-4 h-4 mr-2" />
                          {bid.estimatedDuration?.value || 'Belirtilmemiş'} gün
                        </div>
                        <div className="flex items-center text-sm text-gray-700">
                          <User className="w-4 h-4 mr-2" />
                          {bid.job?.postedBy?.profile?.firstName} {bid.job?.postedBy?.profile?.lastName}
                        </div>
                      </div>
                      
                      {bid.message && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <MessageSquare className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">Teklif Mesajı</span>
                          </div>
                          <p className="text-gray-800">{bid.message}</p>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          Kabul edildi: {new Date(bid.updatedAt).toLocaleDateString('tr-TR')}
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-1" />
                          Durum: Kabul Edildi
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-6">
                      <Link
                        href={`/jobs/${bid.job?._id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        İş Detayları
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
