'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { authAPI } from '../../lib/api';
import toast, { Toaster } from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Lütfen email adresinizi girin');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Lütfen geçerli bir email adresi girin');
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.forgotPassword(email);
      
      if (response.data.success) {
        setEmailSent(true);
        toast.success('Şifre sıfırlama linki email adresinize gönderildi');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error(error.response?.data?.message || 'Şifre sıfırlama linki gönderilirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

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
              <span className="text-xl font-bold text-gray-900">Şifremi Unuttum</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {!emailSent ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Şifremi Unuttum</h2>
                <p className="text-gray-600">
                  Email adresinizi girin, size şifre sıfırlama linki gönderelim.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Adresi
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    placeholder="ornek@email.com"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Gönderiliyor...
                    </>
                  ) : (
                    'Şifre Sıfırlama Linki Gönder'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Hesabınızı hatırladınız mı?{' '}
                  <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                    Giriş yapın
                  </Link>
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Gönderildi!</h2>
                <p className="text-gray-600 mb-6">
                  <strong>{email}</strong> adresine şifre sıfırlama linki gönderildi.
                  Lütfen email kutunuzu kontrol edin ve spam klasörünü de kontrol etmeyi unutmayın.
                </p>
                
                <div className="space-y-4">
                  <button
                    onClick={() => setEmailSent(false)}
                    className="w-full btn-secondary py-3"
                  >
                    Başka Email Dene
                  </button>
                  
                  <Link
                    href="/login"
                    className="w-full btn-primary py-3 flex items-center justify-center"
                  >
                    Giriş Sayfasına Dön
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
