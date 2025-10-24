'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Footer from '../../../components/Footer';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Truck, 
  Building2, 
  ArrowLeft,
  Star,
  Calendar,
  Award,
  Edit3,
  CheckCircle
} from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';

export default function ProfileViewPage() {
  const router = useRouter();
  const { user, isAuthenticated, initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [isAuthenticated, router]);

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
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Back Button */}
            <Link 
              href="/dashboard" 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Dashboard&apos;a Dön</span>
            </Link>

            {/* Edit Button */}
            <Link
              href="/profile"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Düzenle
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-start space-x-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {user.profile?.firstName} {user.profile?.lastName}
                </h1>
                {user.verified && (
                  <div className="flex items-center space-x-1 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Doğrulanmış</span>
                  </div>
                )}
              </div>
              
              <p className="text-lg text-gray-600 mb-4 capitalize">
                {isDriver ? 'Profesyonel Şoför' : 'İşveren'}
              </p>

              {/* Rating */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold text-gray-900">{user.rating?.average || '4.5'}</span>
                  <span className="text-gray-500">({user.rating?.count || 0} değerlendirme)</span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                {user.profile?.phone && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{user.profile.phone}</span>
                  </div>
                )}
                {user.profile?.city && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{user.profile.city}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Kişisel Bilgiler</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
                <p className="text-gray-900">
                  {user.profile?.firstName} {user.profile?.lastName}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900">{user.email}</p>
              </div>
              
              {user.profile?.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                  <p className="text-gray-900">{user.profile.phone}</p>
                </div>
              )}
              
              {user.profile?.city && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Şehir</label>
                  <p className="text-gray-900">{user.profile.city}</p>
                </div>
              )}
              
              {user.profile?.bio && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hakkında</label>
                  <p className="text-gray-900">{user.profile.bio}</p>
                </div>
              )}
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {isDriver ? 'Şoför Bilgileri' : 'Şirket Bilgileri'}
            </h2>
            
            <div className="space-y-4">
              {isDriver ? (
                <>
                  {user.driverDetails?.licenseType && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ehliyet Sınıfı</label>
                      <p className="text-gray-900">{user.driverDetails.licenseType}</p>
                    </div>
                  )}
                  
                  {user.driverDetails?.experience && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tecrübe</label>
                      <p className="text-gray-900">{user.driverDetails.experience} yıl</p>
                    </div>
                  )}
                  
                  {user.driverDetails?.vehicleType && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Araç Tipi</label>
                      <p className="text-gray-900">{user.driverDetails.vehicleType}</p>
                    </div>
                  )}
                  
                  {user.driverDetails?.availability && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Müsaitlik</label>
                      <p className="text-gray-900 capitalize">
                        {user.driverDetails.availability === 'immediate' ? 'Hemen' :
                         user.driverDetails.availability === 'within-week' ? 'Bu hafta içinde' :
                         user.driverDetails.availability === 'within-month' ? 'Bu ay içinde' :
                         user.driverDetails.availability}
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tamamlanan İşler</label>
                    <p className="text-gray-900">{user.driverDetails?.completedJobs || 0}</p>
                  </div>
                </>
              ) : (
                <>
                  {user.employerDetails?.companyName && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Şirket Adı</label>
                      <p className="text-gray-900">{user.employerDetails.companyName}</p>
                    </div>
                  )}
                  
                  {user.employerDetails?.taxNumber && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vergi Numarası</label>
                      <p className="text-gray-900">{user.employerDetails.taxNumber}</p>
                    </div>
                  )}
                  
                  {user.employerDetails?.companyAddress && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Şirket Adresi</label>
                      <p className="text-gray-900">{user.employerDetails.companyAddress}</p>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Yayınlanan İşler</label>
                    <p className="text-gray-900">{user.employerDetails?.postedJobs || 0}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">İstatistikler</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{user.rating?.average || '4.5'}</p>
              <p className="text-sm text-gray-600">Ortalama Puan</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{user.rating?.count || 0}</p>
              <p className="text-sm text-gray-600">Değerlendirme</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {isDriver ? (user.driverDetails?.completedJobs || 0) : (user.employerDetails?.postedJobs || 0)}
              </p>
              <p className="text-sm text-gray-600">
                {isDriver ? 'Tamamlanan İş' : 'Yayınlanan İş'}
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
