'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { ArrowLeft, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { authAPI } from '../../lib/api';
import toast, { Toaster } from 'react-hot-toast';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  const [errors, setErrors] = useState({});
  const [token, setToken] = useState('');

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      toast.error('Geçersiz şifre sıfırlama linki');
      router.push('/forgot-password');
    }
  }, [searchParams, router]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.password) {
      newErrors.password = 'Şifre gereklidir';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalıdır';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifre tekrarı gereklidir';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifreler eşleşmiyor';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await authAPI.resetPassword(token, formData.password);
      
      if (response.data.success) {
        setPasswordReset(true);
        toast.success('Şifreniz başarıyla sıfırlandı');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error(error.response?.data?.message || 'Şifre sıfırlanırken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  if (passwordReset) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        
        <Header />
        
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Link href="/login" className="flex items-center text-gray-600 hover:text-blue-600">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Giriş Sayfasına Dön
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
                <span className="text-xl font-bold text-gray-900">Şifre Sıfırlandı</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Şifre Başarıyla Sıfırlandı!</h2>
                <p className="text-gray-600 mb-6">
                  Şifreniz başarıyla sıfırlandı. Artık yeni şifrenizle giriş yapabilirsiniz.
                </p>
                
                <Link
                  href="/login"
                  className="w-full btn-primary py-3 flex items-center justify-center"
                >
                  Giriş Yap
                </Link>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      <Header />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/login" className="flex items-center text-gray-600 hover:text-blue-600">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Giriş Sayfasına Dön
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
              <span className="text-xl font-bold text-gray-900">Yeni Şifre</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Yeni Şifre Belirle</h2>
              <p className="text-gray-600">
                Yeni şifrenizi girin ve tekrar edin.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yeni Şifre
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`input-field ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="En az 6 karakter"
                  required
                />
                {errors.password && (
                  <div className="flex items-center space-x-1 text-red-600 text-sm mt-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.password}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şifre Tekrarı
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`input-field ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  placeholder="Şifrenizi tekrar girin"
                  required
                />
                {errors.confirmPassword && (
                  <div className="flex items-center space-x-1 text-red-600 text-sm mt-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.confirmPassword}</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sıfırlanıyor...
                  </>
                ) : (
                  'Şifreyi Sıfırla'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Şifrenizi hatırladınız mı?{' '}
                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Giriş yapın
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
