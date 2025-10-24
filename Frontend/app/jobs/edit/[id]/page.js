'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '../../../../components/Footer';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Package,
  Clock,
  Save,
  X,
  ChevronDown
} from 'lucide-react';
import { useAuthStore } from '../../../../store/authStore';
import { jobAPI } from '../../../../lib/api';
import toast, { Toaster } from 'react-hot-toast';

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthenticated, initAuth, initialized } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    jobType: 'employer-seeking-driver',
    route: {
      from: { city: '' },
      to: { city: '' }
    },
    loadDetails: {
      type: '',
      weight: '',
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
      paymentType: 'fixed',
      paymentMethod: 'cash'
    }
  });

  const cities = [
    'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya', 'Artvin',
    'Aydın', 'Balıkesir', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa',
    'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan',
    'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Isparta',
    'Mersin', 'İstanbul', 'İzmir', 'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir',
    'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla',
    'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Rize', 'Sakarya', 'Samsun', 'Siirt',
    'Sinop', 'Sivas', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak',
    'Van', 'Yozgat', 'Zonguldak', 'Aksaray', 'Bayburt', 'Karaman', 'Kırıkkale', 'Batman',
    'Şırnak', 'Bartın', 'Ardahan', 'Iğdır', 'Yalova', 'Karabük', 'Kilis', 'Osmaniye', 'Düzce'
  ];

  useEffect(() => {
    initAuth();
  }, []);

  useEffect(() => {
    if (!initialized) return;
    
    if (!isAuthenticated || user?.userType !== 'employer') {
      router.push('/login');
      return;
    }
    
    loadJobDetails();
  }, [isAuthenticated, user, initialized, router, params.id]);

  const loadJobDetails = async () => {
    try {
      setLoading(true);
      const response = await jobAPI.getJobDetails(params.id);
      if (response.data.success) {
        const job = response.data.data;
        setFormData({
          title: job.title || '',
          description: job.description || '',
          jobType: job.jobType || 'employer-seeking-driver',
          route: {
            from: { city: job.route?.from?.city || '' },
            to: { city: job.route?.to?.city || '' }
          },
          loadDetails: {
            type: job.loadDetails?.type || '',
            weight: job.loadDetails?.weight || '',
            description: job.loadDetails?.description || ''
          },
          vehicleRequirements: {
            type: job.vehicleRequirements?.type || '',
            capacity: job.vehicleRequirements?.capacity || '',
            specialRequirements: job.vehicleRequirements?.specialRequirements || ''
          },
          schedule: {
            startDate: job.schedule?.startDate ? job.schedule.startDate.split('T')[0] : '',
            endDate: job.schedule?.endDate ? job.schedule.endDate.split('T')[0] : '',
            flexible: job.schedule?.flexible || false
          },
          payment: {
            amount: job.payment?.amount || '',
            currency: job.payment?.currency || 'TL',
            paymentType: job.payment?.paymentType || 'fixed',
            paymentMethod: job.payment?.paymentMethod || 'cash'
          }
        });
      }
    } catch (error) {
      console.error('İş detayları yüklenemedi:', error);
      toast.error('İş detayları yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleCitySelect = (city, type) => {
    handleInputChange(`route.${type}.city`, city);
    if (type === 'from') {
      setShowFromDropdown(false);
    } else {
      setShowToDropdown(false);
    }
  };

  const filteredCities = (query) => {
    return cities.filter(city => 
      city.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.route.from.city || !formData.route.to.city) {
      toast.error('Lütfen tüm zorunlu alanları doldurun');
      return;
    }

    try {
      setSaving(true);
      await jobAPI.updateJob(params.id, formData);
      toast.success('İş ilanı başarıyla güncellendi');
      router.push('/jobs/my');
    } catch (error) {
      console.error('İş güncelleme hatası:', error);
      toast.error('İş güncellenirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  // Dropdown'ı dışına tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.relative')) {
        setShowFromDropdown(false);
        setShowToDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!initialized || !isAuthenticated || user?.userType !== 'employer') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-50"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-50"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/jobs/my" className="flex items-center text-gray-600 hover:text-blue-600">
                <ArrowLeft className="w-5 h-5 mr-2" />
                İşlerime Dön
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 relative">
                <Image
                  src="/logo.png"
                  alt="LoadING Logo"
                  width={48}
                  height={48}
                  className="rounded-lg"
                  priority
                />
              </div>
              <span className="text-xl font-bold text-gray-900">İş Düzenle</span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Temel Bilgiler */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Temel Bilgiler</h3>
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
                    placeholder="Örn: İstanbul-Ankara Kargo Taşıma"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İş Tipi
                  </label>
                  <select
                    value={formData.jobType}
                    onChange={(e) => handleInputChange('jobType', e.target.value)}
                    className="input-field"
                  >
                    <option value="employer-seeking-driver">İşveren - Şoför Arıyor</option>
                    <option value="driver-seeking-job">Şoför - İş Arıyor</option>
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
                  className="input-field"
                  rows={4}
                  placeholder="İş hakkında detaylı bilgi verin..."
                  required
                />
              </div>
            </div>

            {/* Güzergah */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Güzergah</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kalkış Şehri *
                  </label>
                  <input
                    type="text"
                    value={formData.route.from.city}
                    onChange={(e) => {
                      handleInputChange('route.from.city', e.target.value);
                      setShowFromDropdown(true);
                    }}
                    onFocus={() => setShowFromDropdown(true)}
                    className="input-field"
                    placeholder="Şehir seçin..."
                    required
                  />
                  
                  {showFromDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredCities(formData.route.from.city).map((city) => (
                        <div
                          key={city}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-black"
                          onClick={() => handleCitySelect(city, 'from')}
                        >
                          {city}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Varış Şehri *
                  </label>
                  <input
                    type="text"
                    value={formData.route.to.city}
                    onChange={(e) => {
                      handleInputChange('route.to.city', e.target.value);
                      setShowToDropdown(true);
                    }}
                    onFocus={() => setShowToDropdown(true)}
                    className="input-field"
                    placeholder="Şehir seçin..."
                    required
                  />
                  
                  {showToDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredCities(formData.route.to.city).map((city) => (
                        <div
                          key={city}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-black"
                          onClick={() => handleCitySelect(city, 'to')}
                        >
                          {city}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Yük Detayları */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Yük Detayları</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yük Tipi
                  </label>
                  <select
                    value={formData.loadDetails.type}
                    onChange={(e) => handleInputChange('loadDetails.type', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Seçiniz</option>
                    <option value="Parsiyel">Parsiyel</option>
                    <option value="Konteyner">Konteyner</option>
                    <option value="Dorse">Dorse</option>
                    <option value="Frigo">Frigo</option>
                    <option value="Tanker">Tanker</option>
                    <option value="Kargo">Kargo</option>
                    <option value="Tam Yük">Tam Yük</option>
                    <option value="Diğer">Diğer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ağırlık (Ton)
                  </label>
                  <input
                    type="text"
                    value={formData.loadDetails.weight}
                    onChange={(e) => handleInputChange('loadDetails.weight', e.target.value)}
                    className="input-field"
                    placeholder="Örn: 5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Özel Açıklama
                  </label>
                  <input
                    type="text"
                    value={formData.loadDetails.description}
                    onChange={(e) => handleInputChange('loadDetails.description', e.target.value)}
                    className="input-field"
                    placeholder="Özel gereksinimler..."
                  />
                </div>
              </div>
            </div>

            {/* Araç Gereksinimleri */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Araç Gereksinimleri</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Araç Tipi
                  </label>
                  <select
                    value={formData.vehicleRequirements.type}
                    onChange={(e) => handleInputChange('vehicleRequirements.type', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Seçiniz</option>
                    <option value="Tır">Tır</option>
                    <option value="Kamyon">Kamyon</option>
                    <option value="Çekici">Çekici</option>
                    <option value="Kamyonet">Kamyonet</option>
                    <option value="Frigo">Frigo</option>
                    <option value="Tanker">Tanker</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kapasite
                  </label>
                  <input
                    type="text"
                    value={formData.vehicleRequirements.capacity}
                    onChange={(e) => handleInputChange('vehicleRequirements.capacity', e.target.value)}
                    className="input-field"
                    placeholder="Örn: 7.5 Ton"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Özel Gereksinimler
                </label>
                <input
                  type="text"
                  value={formData.vehicleRequirements.specialRequirements}
                  onChange={(e) => handleInputChange('vehicleRequirements.specialRequirements', e.target.value)}
                  className="input-field"
                  placeholder="Örn: GPS, Sıcaklık kontrolü..."
                />
              </div>
            </div>

            {/* Tarih ve Saat */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tarih ve Saat</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Başlangıç Tarihi
                  </label>
                  <input
                    type="date"
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
                    type="date"
                    value={formData.schedule.endDate}
                    onChange={(e) => handleInputChange('schedule.endDate', e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Ödeme */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ödeme</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tutar (TL)
                  </label>
                  <input
                    type="number"
                    value={formData.payment.amount}
                    onChange={(e) => handleInputChange('payment.amount', e.target.value)}
                    className="input-field"
                    placeholder="Örn: 2500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Para Birimi
                  </label>
                  <select
                    value={formData.payment.currency}
                    onChange={(e) => handleInputChange('payment.currency', e.target.value)}
                    className="input-field"
                  >
                    <option value="TL">TL</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
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
                    <option value="bank_transfer">Banka Transferi</option>
                    <option value="check">Çek</option>
                    <option value="other">Diğer</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Butonlar */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Link
                href="/jobs/my"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4 inline mr-2" />
                İptal
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline mr-2"></div>
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 inline mr-2" />
                    Güncelle
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
