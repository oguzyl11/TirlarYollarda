'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '../../components/Footer';
import { 
  Truck, 
  Bell, 
  Settings, 
  LogOut, 
  Plus, 
  Search, 
  Users, 
  MapPin, 
  DollarSign, 
  Calendar,
  Briefcase,
  User,
  Star,
  Eye,
  MessageCircle,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { jobAPI, bidAPI, userAPI } from '../../lib/api';
import toast, { Toaster } from 'react-hot-toast';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, initAuth, initialized } = useAuthStore();
  const [loading, setLoading] = useState(true);
  
  // İşveren için
  const [myJobs, setMyJobs] = useState([]);
  const [jobBids, setJobBids] = useState([]);
  
  // Şoför için
  const [myBids, setMyBids] = useState([]);
  const [availableJobs, setAvailableJobs] = useState([]);

  useEffect(() => {
    initAuth();
  }, []);

  useEffect(() => {
    // Auth durumu henüz initialize edilmemişse bekle
    if (!initialized) {
      return;
    }
    
    // Auth durumu belirlendikten sonra kontrol et
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }
    
    // Kullanıcı authenticated ise dashboard verilerini yükle
    loadDashboardData();
  }, [isAuthenticated, user, initialized, router]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      if (user?.userType === 'employer') {
        // İşveren için: Kendi işleri ve başvurular
        const [jobsResponse, bidsResponse] = await Promise.all([
          jobAPI.getMyJobs(),
          bidAPI.getEmployerBids()
        ]);
        
        setMyJobs(jobsResponse.data.data || []);
        setJobBids(bidsResponse.data.data || []);
        
      } else if (user?.userType === 'driver') {
        // Şoför için: Başvurduğu işler
        const bidsResponse = await bidAPI.getMyBids();
        setMyBids(bidsResponse.data.data || []);
        
        // Başvuru yapabileceği işler (son 10 iş)
        const jobsResponse = await jobAPI.getJobs({ limit: 10 });
        setAvailableJobs(jobsResponse.data.data || []);
      }
      
    } catch (error) {
      console.error('Dashboard verileri yüklenemedi:', error);
      toast.error('Veriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    toast.success('Çıkış yapıldı');
  };

  const handleCancelJob = async (jobId) => {
    try {
      await jobAPI.deleteJob(jobId);
      toast.success('İş ilanı iptal edildi');
      loadDashboardData();
    } catch (error) {
      console.error('İş iptal etme hatası:', error);
      toast.error('İş iptal edilirken hata oluştu');
    }
  };

  const handleAcceptBid = async (bidId) => {
    try {
      await bidAPI.updateBidStatus(bidId, 'accepted');
      toast.success('Teklif kabul edildi');
      loadDashboardData();
    } catch (error) {
      console.error('Teklif kabul etme hatası:', error);
      toast.error('Teklif kabul edilirken hata oluştu');
    }
  };

  const handleRejectBid = async (bidId) => {
    try {
      await bidAPI.updateBidStatus(bidId, 'rejected');
      toast.success('Teklif reddedildi');
      loadDashboardData();
    } catch (error) {
      console.error('Teklif reddetme hatası:', error);
      toast.error('Teklif reddedilirken hata oluştu');
    }
  };

  if (!initialized || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  const isDriver = user.userType === 'driver';
  const isEmployer = user.userType === 'employer';

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="w-16 h-16 relative">
                <Image
                  src="/logo.png"
                  alt="LoadING Logo"
                  width={64}
                  height={64}
                  className="rounded-lg"
                  priority
                />
              </div>
            </Link>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user.profile?.firstName} {user.profile?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {isDriver ? 'Şoför' : 'İşveren'}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Çıkış Yap"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hoş geldin, {user.profile?.firstName}!
          </h1>
          <p className="text-gray-600">
            {isDriver 
              ? 'Başvurduğun işler ve yeni fırsatları buradan takip edebilirsin.'
              : 'İş ilanlarını ve başvuruları buradan yönetebilirsin.'
            }
          </p>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* İşveren Dashboard */}
            {isEmployer && (
              <>
                {/* Başvurular */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Başvurular</h2>
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                      {jobBids.length} Başvuru
                    </span>
                  </div>
                  
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse">
                          <div className="h-24 bg-gray-200 rounded-lg"></div>
                        </div>
                      ))}
                    </div>
                  ) : jobBids.length > 0 ? (
                    <div className="space-y-4">
                      {jobBids.slice(0, 5).map((bid) => (
                        <div key={bid._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <User className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900">
                                    {bid.driver?.profile?.firstName} {bid.driver?.profile?.lastName}
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    {bid.job?.title}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                                <div className="flex items-center">
                                  <DollarSign className="w-4 h-4 mr-1" />
                                  Teklif: {bid.proposedAmount} TL
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {bid.estimatedDays} gün
                                </div>
                                <div className="flex items-center">
                                  <Star className="w-4 h-4 mr-1" />
                                  {bid.driver?.rating || 'N/A'}
                                </div>
                              </div>
                              {bid.message && (
                                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                  {bid.message}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <button
                                onClick={() => handleAcceptBid(bid._id)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Kabul Et
                              </button>
                              <button
                                onClick={() => handleRejectBid(bid._id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reddet
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Henüz başvuru bulunmuyor</p>
                    </div>
                  )}
                </div>

                {/* İşlerim */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">İşlerim</h2>
                    <Link 
                      href="/jobs/create"
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Yeni İş
                    </Link>
                  </div>
                  
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse">
                          <div className="h-20 bg-gray-200 rounded-lg"></div>
                        </div>
                      ))}
                    </div>
                  ) : myJobs.length > 0 ? (
                    <div className="space-y-4">
                      {myJobs.slice(0, 5).map((job) => (
                        <div key={job._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
                              <p className="text-gray-600 text-sm mb-2">{job.description}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  {job.route?.from?.city} → {job.route?.to?.city}
                                </div>
                                <div className="flex items-center">
                                  <DollarSign className="w-4 h-4 mr-1" />
                                  {job.payment?.amount} {job.payment?.currency}
                                </div>
                                <div className="flex items-center">
                                  <Users className="w-4 h-4 mr-1" />
                                  {job.bids?.length || 0} Teklif
                                </div>
                                <div className="flex items-center">
                                  <Eye className="w-4 h-4 mr-1" />
                                  {job.views || 0} Görüntüleme
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <Link
                                href={`/jobs/${job._id}`}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                              >
                                Yönet
                              </Link>
                              <button
                                onClick={() => handleCancelJob(job._id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                              >
                                İptal Et
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">Henüz iş ilanınız yok</p>
                      <Link
                        href="/jobs/create"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        İlk İşinizi Oluşturun
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Şoför Dashboard */}
            {isDriver && (
              <>
                {/* Başvurduğum İşler */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Başvurduğum İşler</h2>
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                      {myBids.length} Başvuru
                    </span>
                  </div>
                  
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse">
                          <div className="h-24 bg-gray-200 rounded-lg"></div>
                        </div>
                      ))}
                    </div>
                  ) : myBids.length > 0 ? (
                    <div className="space-y-4">
                      {myBids.map((bid) => (
                        <div key={bid._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">{bid.job?.title}</h3>
                              <p className="text-gray-600 text-sm mb-2">{bid.job?.description}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                                <div className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  {bid.job?.route?.from?.city} → {bid.job?.route?.to?.city}
                                </div>
                                <div className="flex items-center">
                                  <DollarSign className="w-4 h-4 mr-1" />
                                  Teklifim: {bid.proposedAmount} TL
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {bid.estimatedDays} gün
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  bid.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  bid.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {bid.status === 'pending' ? 'Beklemede' :
                                   bid.status === 'accepted' ? 'Kabul Edildi' : 'Reddedildi'}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(bid.createdAt).toLocaleDateString('tr-TR')}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <Link
                                href={`/jobs/${bid.job?._id}`}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                              >
                                Detay
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">Henüz başvuru yapmadınız</p>
                      <Link
                        href="/jobs"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        <Search className="w-4 h-4 mr-2" />
                        İş İlanlarını Görüntüle
                      </Link>
                    </div>
                  )}
                </div>

                {/* Önerilen İşler */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Önerilen İşler</h2>
                    <Link 
                      href="/jobs"
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      Tümünü Gör
                    </Link>
                  </div>
                  
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse">
                          <div className="h-20 bg-gray-200 rounded-lg"></div>
                        </div>
                      ))}
                    </div>
                  ) : availableJobs.length > 0 ? (
                    <div className="space-y-4">
                      {availableJobs.slice(0, 3).map((job) => (
                        <div key={job._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
                              <p className="text-gray-600 text-sm mb-2">{job.description}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  {job.route?.from?.city} → {job.route?.to?.city}
                                </div>
                                <div className="flex items-center">
                                  <DollarSign className="w-4 h-4 mr-1" />
                                  {job.payment?.amount} {job.payment?.currency}
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {new Date(job.schedule?.startDate).toLocaleDateString('tr-TR')}
                                </div>
                              </div>
                            </div>
                            <div className="ml-4">
                              <Link
                                href={`/jobs/${job._id}`}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                              >
                                Başvur
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Şu anda önerilen iş bulunmuyor</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h3>
              <div className="space-y-3">
                {isDriver ? (
                  <>
                    <Link
                      href="/jobs"
                      className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Search className="w-5 h-5 text-blue-600 mr-3" />
                      <span className="text-gray-700">İş Ara</span>
                    </Link>
                    <Link
                      href="/bids"
                      className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Briefcase className="w-5 h-5 text-blue-600 mr-3" />
                      <span className="text-gray-700">Tekliflerim</span>
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-5 h-5 text-blue-600 mr-3" />
                      <span className="text-gray-700">Profil</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/jobs/create"
                      className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="w-5 h-5 text-blue-600 mr-3" />
                      <span className="text-gray-700">İş İlanı Ver</span>
                    </Link>
                    <Link
                      href="/jobs/my"
                      className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Briefcase className="w-5 h-5 text-blue-600 mr-3" />
                      <span className="text-gray-700">İşlerim</span>
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-5 h-5 text-blue-600 mr-3" />
                      <span className="text-gray-700">Profil</span>
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">İstatistikler</h3>
              <div className="space-y-4">
                {isDriver ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Toplam Başvuru</span>
                      <span className="font-semibold text-gray-900">{myBids.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Kabul Edilen</span>
                      <span className="font-semibold text-green-600">
                        {myBids.filter(bid => bid.status === 'accepted').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Bekleyen</span>
                      <span className="font-semibold text-yellow-600">
                        {myBids.filter(bid => bid.status === 'pending').length}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Aktif İşler</span>
                      <span className="font-semibold text-gray-900">{myJobs.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Toplam Başvuru</span>
                      <span className="font-semibold text-blue-600">{jobBids.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Toplam Görüntüleme</span>
                      <span className="font-semibold text-gray-900">
                        {myJobs.reduce((sum, job) => sum + (job.views || 0), 0)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
