'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Truck, 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Package,
  Clock,
  Eye,
  Users,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { jobAPI } from '../../../lib/api';
import toast, { Toaster } from 'react-hot-toast';

export default function MyJobsPage() {
  const router = useRouter();
  const { user, isAuthenticated, initAuth, initialized } = useAuthStore();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initAuth();
  }, []);

  useEffect(() => {
    // Auth durumu henüz initialize edilmemişse bekle
    if (!initialized) {
      return;
    }
    
    // Auth durumu belirlendikten sonra kontrol et
    if (!isAuthenticated || user?.userType !== 'employer') {
      router.push('/login');
      return;
    }
    
    // Kullanıcı authenticated ise işlerini yükle
    loadMyJobs();
  }, [isAuthenticated, user, initialized, router]);

  const loadMyJobs = async () => {
    try {
      setLoading(true);
      const response = await jobAPI.getMyJobs();
      setJobs(response.data.data || []);
    } catch (error) {
      console.error('İşlerim yüklenemedi:', error);
      toast.error('İşleriniz yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!confirm('Bu iş ilanını silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await jobAPI.deleteJob(jobId);
      toast.success('İş ilanı başarıyla silindi');
      loadMyJobs();
    } catch (error) {
      console.error('İş silme hatası:', error);
      toast.error('İş silinirken hata oluştu');
    }
  };

  if (!initialized || !isAuthenticated || user?.userType !== 'employer') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
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
                Dashboard'a Dön
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 relative">
                  <Image
                    src="/logo.png"
                    alt="TırlarYollarda Logo"
                    width={32}
                    height={32}
                    className="rounded-lg"
                    priority
                  />
                </div>
                <span className="text-xl font-bold text-gray-900">İşlerim</span>
              </div>
            </div>
            <Link
              href="/jobs/create"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              Yeni İş İlanı
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">İşlerim</h1>
          <p className="text-gray-600">
            Oluşturduğunuz iş ilanlarını buradan yönetebilirsiniz.
          </p>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div className="space-y-6">
            {jobs.map((job) => (
              <div key={job._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          job.status === 'active' ? 'bg-green-100 text-green-800' :
                          job.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          job.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {job.status === 'active' ? 'Aktif' :
                           job.status === 'in-progress' ? 'Devam Ediyor' :
                           job.status === 'completed' ? 'Tamamlandı' : 'İptal'}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{job.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-2" />
                        {job.route?.from?.city} → {job.route?.to?.city}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Package className="w-4 h-4 mr-2" />
                        {job.loadDetails?.type || 'Belirtilmemiş'}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <DollarSign className="w-4 h-4 mr-2" />
                        {job.payment?.amount} {job.payment?.currency}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        {job.schedule?.startDate ? new Date(job.schedule.startDate).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {job.views || 0} Görüntüleme
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {job.bids?.length || 0} Başvuru
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(job.createdAt).toLocaleDateString('tr-TR')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-6">
                    <Link
                      href={`/jobs/${job._id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Görüntüle
                    </Link>
                    <button
                      onClick={() => handleDeleteJob(job._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz iş ilanınız yok</h3>
            <p className="text-gray-600 mb-6">
              İlk iş ilanınızı oluşturarak başlayın.
            </p>
            <Link
              href="/jobs/create"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              İlk İşinizi Oluşturun
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
