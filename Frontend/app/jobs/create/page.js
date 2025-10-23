'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Truck, 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Package,
  Clock,
  Save,
  X
} from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { jobAPI } from '../../../lib/api';
import toast, { Toaster } from 'react-hot-toast';

export default function CreateJobPage() {
  const router = useRouter();
  const { user, isAuthenticated, initAuth, initialized } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    jobType: 'employer-seeking-driver',
    route: {
      from: { city: '', address: '' },
      to: { city: '', address: '' }
    },
    loadDetails: {
      type: '',
      weight: '',
      dimensions: { length: '', width: '', height: '' },
      description: ''
    },
    vehicleRequirements: {
      type: '',
      capacity: '',
      specialRequirements: ''
    },
    schedule: {
      startDate: '',
      endDate: '',
      flexible: false
    },
    payment: {
      amount: '',
      currency: 'TL',
      paymentMethod: 'cash'
    }
  });

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
  }, [isAuthenticated, user, initialized, router]);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const parts = field.split('.');
      setFormData(prev => {
        const newData = { ...prev };
        let current = newData;
        
        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) {
            current[parts[i]] = {};
          }
          current = current[parts[i]];
        }
        
        current[parts[parts.length - 1]] = value;
        return newData;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.route.from.city || !formData.route.to.city) {
      toast.error('Lütfen tüm zorunlu alanları doldurun');
      return;
    }

    try {
      setLoading(true);
      
      // Form verilerini temizle ve düzenle
      const cleanedData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        jobType: formData.jobType || 'employer-seeking-driver',
        route: {
          from: {
            city: formData.route.from.city.trim(),
            address: formData.route.from.address?.trim() || ''
          },
          to: {
            city: formData.route.to.city.trim(),
            address: formData.route.to.address?.trim() || ''
          }
        },
        loadDetails: {
          type: formData.loadDetails.type || '',
          weight: formData.loadDetails.weight || '',
          dimensions: formData.loadDetails.dimensions || {},
          description: formData.loadDetails.description?.trim() || ''
        },
        vehicleRequirements: {
          type: formData.vehicleRequirements.type || '',
          capacity: formData.vehicleRequirements.capacity || '',
          specialRequirements: formData.vehicleRequirements.specialRequirements?.trim() || ''
        },
        schedule: {
          startDate: formData.schedule.startDate || new Date().toISOString(),
          endDate: formData.schedule.endDate || '',
          flexible: formData.schedule.flexible || false
        },
        payment: {
          amount: formData.payment.amount ? parseFloat(formData.payment.amount) : 0,
          currency: formData.payment.currency || 'TL',
          paymentMethod: formData.payment.paymentMethod || 'cash'
        }
      };

      console.log('Sending job data:', cleanedData);
      const response = await jobAPI.createJob(cleanedData);
      console.log('Job creation response:', response);
      
      if (response.data.success) {
        toast.success('İş ilanı başarıyla oluşturuldu!');
        // Dashboard'a yönlendir
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      }
    } catch (error) {
      console.error('İş oluşturma hatası:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'İş ilanı oluşturulurken hata oluştu');
    } finally {
      setLoading(false);
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
                Geri Dön
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Yeni İş İlanı</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Temel Bilgiler</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İş Başlığı *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="input-field"
                  placeholder="Örn: İstanbul'dan Ankara'ya kargo taşıma"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İş Türü
                </label>
                <select
                  value={formData.jobType}
                  onChange={(e) => handleInputChange('jobType', e.target.value)}
                  className="input-field"
                >
                  <option value="employer-seeking-driver">Şoför Arıyorum</option>
                  <option value="driver-seeking-job">İş Arıyorum</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Açıklama *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="input-field h-32"
                placeholder="İş hakkında detaylı bilgi verin..."
                required
              />
            </div>
          </div>

          {/* Route Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-600" />
              Güzergah Bilgileri
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kalkış Şehri *
                </label>
                <input
                  type="text"
                  value={formData.route.from.city}
                  onChange={(e) => handleInputChange('route.from.city', e.target.value)}
                  className="input-field"
                  placeholder="İstanbul"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Varış Şehri *
                </label>
                <input
                  type="text"
                  value={formData.route.to.city}
                  onChange={(e) => handleInputChange('route.to.city', e.target.value)}
                  className="input-field"
                  placeholder="Ankara"
                  required
                />
              </div>
            </div>
          </div>

          {/* Load Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Package className="w-5 h-5 mr-2 text-green-600" />
              Yük Detayları
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yük Türü
                </label>
                <select
                  value={formData.loadDetails.type}
                  onChange={(e) => handleInputChange('loadDetails.type', e.target.value)}
                  className="input-field"
                >
                  <option value="">Seçiniz</option>
                  <option value="Tam Yük">Tam Yük</option>
                  <option value="Parsiyel">Parsiyel</option>
                  <option value="Kargo">Kargo</option>
                  <option value="Konteyner">Konteyner</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ağırlık (Ton)
                </label>
                <input
                  type="number"
                  value={formData.loadDetails.weight}
                  onChange={(e) => handleInputChange('loadDetails.weight', e.target.value)}
                  className="input-field"
                  placeholder="5"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yük Açıklaması
              </label>
              <textarea
                value={formData.loadDetails.description}
                onChange={(e) => handleInputChange('loadDetails.description', e.target.value)}
                className="input-field h-24"
                placeholder="Yük hakkında detaylı bilgi..."
              />
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-purple-600" />
              Tarih ve Saat
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Başlangıç Tarihi
                </label>
                <input
                  type="datetime-local"
                  value={formData.schedule.startDate}
                  onChange={(e) => handleInputChange('schedule.startDate', e.target.value)}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bitiş Tarihi
                </label>
                <input
                  type="datetime-local"
                  value={formData.schedule.endDate}
                  onChange={(e) => handleInputChange('schedule.endDate', e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-yellow-600" />
              Ödeme Bilgileri
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ücret (TL)
                </label>
                <input
                  type="number"
                  value={formData.payment.amount}
                  onChange={(e) => handleInputChange('payment.amount', e.target.value)}
                  className="input-field"
                  placeholder="5000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ödeme Yöntemi
                </label>
                <select
                  value={formData.payment.paymentMethod}
                  onChange={(e) => handleInputChange('payment.paymentMethod', e.target.value)}
                  className="input-field"
                >
                  <option value="cash">Nakit</option>
                  <option value="bank_transfer">Banka Havalesi</option>
                  <option value="check">Çek</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/dashboard"
              className="btn-secondary px-6 py-3"
            >
              <X className="w-4 h-4 mr-2" />
              İptal
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-6 py-3 flex items-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {loading ? 'Oluşturuluyor...' : 'İlanı Oluştur'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
