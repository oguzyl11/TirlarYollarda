'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Footer from '../../components/Footer';
import { 
  User, 
  Save, 
  ArrowLeft,
  Camera,
  Edit3,
  Check,
  X,
  AlertCircle,
  Star,
  Calendar,
  Award
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { userAPI } from '../../lib/api';
import toast, { Toaster } from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, initAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    profile: {
      firstName: '',
      lastName: '',
      phone: '',
      city: '',
      bio: ''
    },
    driverDetails: {
      licenseType: '',
      experience: '',
      vehicleType: '',
      availability: 'immediate'
    },
    employerDetails: {
      companyName: '',
      taxNumber: '',
      companyAddress: ''
    }
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    initAuth();
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadUserData();
  }, [isAuthenticated, router]);

  const loadUserData = () => {
    if (user) {
      setFormData({
        profile: {
          firstName: user.profile?.firstName || '',
          lastName: user.profile?.lastName || '',
          phone: user.profile?.phone || '',
          city: user.profile?.city || '',
          bio: user.profile?.bio || ''
        },
        driverDetails: {
          licenseType: user.driverDetails?.licenseType || '',
          experience: user.driverDetails?.experience || '',
          vehicleType: user.driverDetails?.vehicleType || '',
          availability: user.driverDetails?.availability || 'immediate'
        },
        employerDetails: {
          companyName: user.employerDetails?.companyName || '',
          taxNumber: user.employerDetails?.taxNumber || '',
          companyAddress: user.employerDetails?.companyAddress || ''
        }
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.profile.firstName.trim()) {
      newErrors.firstName = 'Ad gereklidir';
    }
    if (!formData.profile.lastName.trim()) {
      newErrors.lastName = 'Soyad gereklidir';
    }
    if (!formData.profile.phone.trim()) {
      newErrors.phone = 'Telefon gereklidir';
    } else if (!/^[0-9]{10,11}$/.test(formData.profile.phone)) {
      newErrors.phone = 'Geçerli bir telefon numarası giriniz';
    }
    if (!formData.profile.city.trim()) {
      newErrors.city = 'Şehir gereklidir';
    }

    if (user?.userType === 'driver') {
      if (!formData.driverDetails.licenseType) {
        newErrors.licenseType = 'Ehliyet tipi gereklidir';
      }
      if (!formData.driverDetails.vehicleType.trim()) {
        newErrors.vehicleType = 'Araç tipi gereklidir';
      }
    } else if (user?.userType === 'employer') {
      if (!formData.employerDetails.companyName.trim()) {
        newErrors.companyName = 'Şirket adı gereklidir';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const response = await userAPI.updateProfile(formData);
      
      // AuthStore'u güncelle
      const { updateUser } = useAuthStore.getState();
      updateUser(response.data.data);
      
      toast.success('Profil başarıyla güncellendi');
      setEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.message || 'Profil güncellenirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
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
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleCancel = () => {
    loadUserData(); // Reset form data
    setEditing(false);
    setErrors({});
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-blue-600">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Dashboard&apos;a Dön
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Düzenle
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCancel}
                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-4 h-4 mr-2" />
                    İptal
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Kaydediliyor...' : 'Kaydet'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {/* Avatar */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  {editing && (
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {formData.profile.firstName} {formData.profile.lastName}
                </h1>
                <p className="text-gray-600 capitalize">
                  {isDriver ? 'Şoför' : 'İşveren'}
                </p>
                {formData.profile.bio && (
                  <p className="text-gray-500 text-sm mt-2">{formData.profile.bio}</p>
                )}
              </div>

              {/* Stats */}
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 mr-2" />
                    <span className="text-sm text-gray-600">Değerlendirme</span>
                  </div>
                  <span className="font-semibold text-gray-900">4.8/5</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="text-sm text-gray-600">Üyelik</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center">
                    <Award className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm text-gray-600">Tamamlanan İş</span>
                  </div>
                  <span className="font-semibold text-gray-900">0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Profil Bilgileri</h2>
              
              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Kişisel Bilgiler</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ad</label>
                      <input
                        type="text"
                        name="profile.firstName"
                        value={formData.profile.firstName}
                        onChange={handleChange}
                        disabled={!editing}
                        className={`input-field ${errors.firstName ? 'border-red-500' : ''} ${!editing ? 'bg-gray-50' : ''}`}
                        placeholder="Adınız"
                      />
                      {errors.firstName && (
                        <div className="flex items-center space-x-1 text-red-600 text-sm mt-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.firstName}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Soyad</label>
                      <input
                        type="text"
                        name="profile.lastName"
                        value={formData.profile.lastName}
                        onChange={handleChange}
                        disabled={!editing}
                        className={`input-field ${errors.lastName ? 'border-red-500' : ''} ${!editing ? 'bg-gray-50' : ''}`}
                        placeholder="Soyadınız"
                      />
                      {errors.lastName && (
                        <div className="flex items-center space-x-1 text-red-600 text-sm mt-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.lastName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                      <input
                        type="tel"
                        name="profile.phone"
                        value={formData.profile.phone}
                        onChange={handleChange}
                        disabled={!editing}
                        className={`input-field ${errors.phone ? 'border-red-500' : ''} ${!editing ? 'bg-gray-50' : ''}`}
                        placeholder="5XXXXXXXXX"
                      />
                      {errors.phone && (
                        <div className="flex items-center space-x-1 text-red-600 text-sm mt-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.phone}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Şehir</label>
                      <input
                        type="text"
                        name="profile.city"
                        value={formData.profile.city}
                        onChange={handleChange}
                        disabled={!editing}
                        className={`input-field ${errors.city ? 'border-red-500' : ''} ${!editing ? 'bg-gray-50' : ''}`}
                        placeholder="İstanbul"
                      />
                      {errors.city && (
                        <div className="flex items-center space-x-1 text-red-600 text-sm mt-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.city}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hakkımda</label>
                    <textarea
                      name="profile.bio"
                      value={formData.profile.bio}
                      onChange={handleChange}
                      disabled={!editing}
                      rows="3"
                      className={`input-field ${!editing ? 'bg-gray-50' : ''}`}
                      placeholder="Kendiniz hakkında kısa bir açıklama..."
                    />
                  </div>
                </div>

                {/* Driver Details */}
                {isDriver && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Şoför Bilgileri
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ehliyet Tipi</label>
                        <select
                          name="driverDetails.licenseType"
                          value={formData.driverDetails.licenseType}
                          onChange={handleChange}
                          disabled={!editing}
                          className={`input-field ${errors.licenseType ? 'border-red-500' : ''} ${!editing ? 'bg-gray-50' : ''}`}
                        >
                          <option value="">Seçiniz</option>
                          <option value="B">B Sınıfı</option>
                          <option value="C">C Sınıfı</option>
                          <option value="C+E">C+E Sınıfı</option>
                          <option value="D">D Sınıfı</option>
                          <option value="E">E Sınıfı</option>
                        </select>
                        {errors.licenseType && (
                          <div className="flex items-center space-x-1 text-red-600 text-sm mt-1">
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.licenseType}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tecrübe (Yıl)</label>
                        <input
                          type="number"
                          name="driverDetails.experience"
                          value={formData.driverDetails.experience}
                          onChange={handleChange}
                          disabled={!editing}
                          className={`input-field ${!editing ? 'bg-gray-50' : ''}`}
                          placeholder="5"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Araç Tipi</label>
                        <input
                          type="text"
                          name="driverDetails.vehicleType"
                          value={formData.driverDetails.vehicleType}
                          onChange={handleChange}
                          disabled={!editing}
                          className={`input-field ${errors.vehicleType ? 'border-red-500' : ''} ${!editing ? 'bg-gray-50' : ''}`}
                          placeholder="Örn: Mega Tır, Kamyon"
                        />
                        {errors.vehicleType && (
                          <div className="flex items-center space-x-1 text-red-600 text-sm mt-1">
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.vehicleType}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Müsaitlik</label>
                        <select
                          name="driverDetails.availability"
                          value={formData.driverDetails.availability}
                          onChange={handleChange}
                          disabled={!editing}
                          className={`input-field ${!editing ? 'bg-gray-50' : ''}`}
                        >
                          <option value="immediate">Hemen</option>
                          <option value="within-week">Bu Hafta</option>
                          <option value="within-month">Bu Ay</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Employer Details */}
                {isEmployer && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Şirket Bilgileri
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Şirket Adı</label>
                        <input
                          type="text"
                          name="employerDetails.companyName"
                          value={formData.employerDetails.companyName}
                          onChange={handleChange}
                          disabled={!editing}
                          className={`input-field ${errors.companyName ? 'border-red-500' : ''} ${!editing ? 'bg-gray-50' : ''}`}
                          placeholder="Şirket adınız"
                        />
                        {errors.companyName && (
                          <div className="flex items-center space-x-1 text-red-600 text-sm mt-1">
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.companyName}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Vergi Numarası</label>
                        <input
                          type="text"
                          name="employerDetails.taxNumber"
                          value={formData.employerDetails.taxNumber}
                          onChange={handleChange}
                          disabled={!editing}
                          className={`input-field ${!editing ? 'bg-gray-50' : ''}`}
                          placeholder="XXXXXXXXXX"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Şirket Adresi</label>
                        <textarea
                          name="employerDetails.companyAddress"
                          value={formData.employerDetails.companyAddress}
                          onChange={handleChange}
                          disabled={!editing}
                          rows="3"
                          className={`input-field ${!editing ? 'bg-gray-50' : ''}`}
                          placeholder="Şirket adresiniz"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Email (Read-only) */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Hesap Bilgileri</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="input-field bg-gray-50"
                      placeholder="Email adresiniz"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email adresi değiştirilemez</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
