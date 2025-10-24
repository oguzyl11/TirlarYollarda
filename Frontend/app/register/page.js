'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, Eye, EyeOff, Truck, User, Phone, Building2, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import toast, { Toaster } from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, loading } = useAuthStore();
  
  const [userType, setUserType] = useState('driver');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'driver',
    profile: {
      firstName: '',
      lastName: '',
      phone: '',
      city: ''
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
    const type = searchParams.get('type');
    if (type === 'employer' || type === 'driver') {
      setUserType(type);
      setFormData(prev => ({ ...prev, userType: type }));
    }
  }, [searchParams]);

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email gereklidir';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Geçerli bir email giriniz';
    }
    if (!formData.password) {
      newErrors.password = 'Şifre gereklidir';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalıdır';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifreler eşleşmiyor';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.profile.firstName) newErrors.firstName = 'Ad gereklidir';
    if (!formData.profile.lastName) newErrors.lastName = 'Soyad gereklidir';
    if (!formData.profile.phone) {
      newErrors.phone = 'Telefon gereklidir';
    } else if (!/^[0-9]{10,11}$/.test(formData.profile.phone)) {
      newErrors.phone = 'Geçerli bir telefon numarası giriniz';
    }
    if (!formData.profile.city) newErrors.city = 'Şehir gereklidir';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    if (userType === 'driver') {
      if (!formData.driverDetails.licenseType) newErrors.licenseType = 'Ehliyet tipi gereklidir';
      if (!formData.driverDetails.vehicleType) newErrors.vehicleType = 'Araç tipi gereklidir';
    } else {
      if (!formData.employerDetails.companyName) newErrors.companyName = 'Şirket adı gereklidir';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep3()) return;

    const result = await register(formData);
    if (result.success) {
      toast.success('Kayıt başarılı! Yönlendiriliyorsunuz...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } else {
      toast.error(result.error || 'Kayıt başarısız');
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

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-12 h-12 relative">
              <Image
                src="/logo.png"
                alt="TırlarYollarda Logo"
                width={48}
                height={48}
                className="rounded-xl"
                priority
              />
            </div>
            <span className="text-2xl font-bold text-gray-900">TırlarYollarda</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Hesap Oluştur</h2>
          <p className="text-gray-600">Hemen ücretsiz kayıt olun ve başlayın</p>
        </div>

        {/* User Type Toggle */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => {
                setUserType('driver');
                setFormData(prev => ({ ...prev, userType: 'driver' }));
              }}
              className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                userType === 'driver'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Truck className={`w-8 h-8 mx-auto mb-3 ${userType === 'driver' ? 'text-blue-600' : 'text-gray-400'}`} />
              <div className="text-center">
                <div className={`font-semibold ${userType === 'driver' ? 'text-blue-600' : 'text-gray-900'}`}>
                  Şoför
                </div>
                <div className="text-xs text-gray-500 mt-1">İş arıyorum</div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => {
                setUserType('employer');
                setFormData(prev => ({ ...prev, userType: 'employer' }));
              }}
              className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                userType === 'employer'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Building2 className={`w-8 h-8 mx-auto mb-3 ${userType === 'employer' ? 'text-blue-600' : 'text-gray-400'}`} />
              <div className="text-center">
                <div className={`font-semibold ${userType === 'employer' ? 'text-blue-600' : 'text-gray-900'}`}>
                  İşveren
                </div>
                <div className="text-xs text-gray-500 mt-1">Şoför arıyorum</div>
              </div>
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > s ? <CheckCircle className="w-6 h-6" /> : s}
                </div>
                {s < 3 && (
                  <div className={`flex-1 h-1 mx-2 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 text-xs text-gray-600">
            <span>Hesap Bilgileri</span>
            <span>Kişisel Bilgiler</span>
            <span>Detaylar</span>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Account Info */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Adresi</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`input-field pl-10 ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="ornek@email.com"
                    />
                  </div>
                  {errors.email && (
                    <div className="flex items-center space-x-1 text-red-600 text-sm mt-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Şifre</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                    </button>
                  </div>
                  {errors.password && (
                    <div className="flex items-center space-x-1 text-red-600 text-sm mt-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.password}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Şifre Tekrar</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`input-field pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <div className="flex items-center space-x-1 text-red-600 text-sm mt-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.confirmPassword}</span>
                    </div>
                  )}
                </div>

                <button type="button" onClick={handleNextStep} className="w-full btn-primary py-3">
                  Devam Et
                </button>
              </div>
            )}

            {/* Step 2: Personal Info */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ad</label>
                    <input
                      type="text"
                      name="profile.firstName"
                      value={formData.profile.firstName}
                      onChange={handleChange}
                      className={`input-field ${errors.firstName ? 'border-red-500' : ''}`}
                      placeholder="Adınız"
                    />
                    {errors.firstName && (
                      <div className="text-red-600 text-sm mt-1">{errors.firstName}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Soyad</label>
                    <input
                      type="text"
                      name="profile.lastName"
                      value={formData.profile.lastName}
                      onChange={handleChange}
                      className={`input-field ${errors.lastName ? 'border-red-500' : ''}`}
                      placeholder="Soyadınız"
                    />
                    {errors.lastName && (
                      <div className="text-red-600 text-sm mt-1">{errors.lastName}</div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="profile.phone"
                      value={formData.profile.phone}
                      onChange={handleChange}
                      className={`input-field pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                      placeholder="5XXXXXXXXX"
                    />
                  </div>
                  {errors.phone && (
                    <div className="text-red-600 text-sm mt-1">{errors.phone}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Şehir</label>
                  <input
                    type="text"
                    name="profile.city"
                    value={formData.profile.city}
                    onChange={handleChange}
                    className={`input-field ${errors.city ? 'border-red-500' : ''}`}
                    placeholder="İstanbul"
                  />
                  {errors.city && (
                    <div className="text-red-600 text-sm mt-1">{errors.city}</div>
                  )}
                </div>

                <div className="flex space-x-3">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 btn-secondary py-3">
                    Geri
                  </button>
                  <button type="button" onClick={handleNextStep} className="flex-1 btn-primary py-3">
                    Devam Et
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Details */}
            {step === 3 && (
              <div className="space-y-5">
                {userType === 'driver' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ehliyet Tipi</label>
                      <select
                        name="driverDetails.licenseType"
                        value={formData.driverDetails.licenseType}
                        onChange={handleChange}
                        className={`input-field ${errors.licenseType ? 'border-red-500' : ''}`}
                      >
                        <option value="">Seçiniz</option>
                        <option value="B">B Sınıfı</option>
                        <option value="C">C Sınıfı</option>
                        <option value="C+E">C+E Sınıfı</option>
                        <option value="D">D Sınıfı</option>
                        <option value="E">E Sınıfı</option>
                      </select>
                      {errors.licenseType && (
                        <div className="text-red-600 text-sm mt-1">{errors.licenseType}</div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Araç Tipi</label>
                      <input
                        type="text"
                        name="driverDetails.vehicleType"
                        value={formData.driverDetails.vehicleType}
                        onChange={handleChange}
                        className={`input-field ${errors.vehicleType ? 'border-red-500' : ''}`}
                        placeholder="Örn: Mega Tır, Kamyon"
                      />
                      {errors.vehicleType && (
                        <div className="text-red-600 text-sm mt-1">{errors.vehicleType}</div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tecrübe (Yıl)</label>
                      <input
                        type="number"
                        name="driverDetails.experience"
                        value={formData.driverDetails.experience}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Örn: 5"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Şirket Adı</label>
                      <input
                        type="text"
                        name="employerDetails.companyName"
                        value={formData.employerDetails.companyName}
                        onChange={handleChange}
                        className={`input-field ${errors.companyName ? 'border-red-500' : ''}`}
                        placeholder="Şirket adınız"
                      />
                      {errors.companyName && (
                        <div className="text-red-600 text-sm mt-1">{errors.companyName}</div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Vergi Numarası (Opsiyonel)</label>
                      <input
                        type="text"
                        name="employerDetails.taxNumber"
                        value={formData.employerDetails.taxNumber}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="XXXXXXXXXX"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Şirket Adresi (Opsiyonel)</label>
                      <textarea
                        name="employerDetails.companyAddress"
                        value={formData.employerDetails.companyAddress}
                        onChange={handleChange}
                        className="input-field"
                        rows="3"
                        placeholder="Adres"
                      />
                    </div>
                  </>
                )}

                <div className="flex space-x-3">
                  <button type="button" onClick={() => setStep(2)} className="flex-1 btn-secondary py-3">
                    Geri
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 btn-primary py-3 disabled:opacity-50"
                  >
                    {loading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Zaten hesabınız var mı?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Giriş Yap
            </Link>
          </p>
        </div>

        <div className="text-center mt-4">
          <Link href="/" className="text-gray-600 hover:text-blue-600 text-sm">
            ← Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}