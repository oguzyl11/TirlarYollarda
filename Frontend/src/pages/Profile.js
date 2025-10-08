import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Truck, Building, Star, Edit } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mr-6">
                <User className="h-10 w-10 text-gray-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user?.profile?.firstName} {user?.profile?.lastName}
                </h1>
                <p className="text-gray-600">{user?.email}</p>
                <div className="flex items-center mt-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm font-medium">
                    {user?.rating?.average || 0} ({user?.rating?.count || 0} değerlendirme)
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn-primary flex items-center"
            >
              <Edit className="h-4 w-4 mr-2" />
              {isEditing ? 'Kaydet' : 'Düzenle'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Personal Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Kişisel Bilgiler</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ad
                  </label>
                  <input
                    type="text"
                    value={user?.profile?.firstName || ''}
                    disabled={!isEditing}
                    className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Soyad
                  </label>
                  <input
                    type="text"
                    value={user?.profile?.lastName || ''}
                    disabled={!isEditing}
                    className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="input-field pl-10 bg-gray-50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      value={user?.profile?.phone || ''}
                      disabled={!isEditing}
                      className={`input-field pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Şehir
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={user?.profile?.city || ''}
                      disabled={!isEditing}
                      className={`input-field pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hakkımda
                  </label>
                  <textarea
                    rows={4}
                    value={user?.profile?.bio || ''}
                    disabled={!isEditing}
                    className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                    placeholder="Kendiniz hakkında kısa bir açıklama yazın..."
                  />
                </div>
              </div>
            </div>

            {/* Driver Details */}
            {user?.userType === 'driver' && user?.driverDetails && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Tırcı Bilgileri
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ehliyet Tipi
                    </label>
                    <select
                      disabled={!isEditing}
                      className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                    >
                      <option value="B" selected={user.driverDetails.licenseType === 'B'}>B Sınıfı</option>
                      <option value="C" selected={user.driverDetails.licenseType === 'C'}>C Sınıfı</option>
                      <option value="C+E" selected={user.driverDetails.licenseType === 'C+E'}>C+E Sınıfı</option>
                      <option value="D" selected={user.driverDetails.licenseType === 'D'}>D Sınıfı</option>
                      <option value="E" selected={user.driverDetails.licenseType === 'E'}>E Sınıfı</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deneyim (Yıl)
                    </label>
                    <input
                      type="number"
                      value={user.driverDetails.experience || ''}
                      disabled={!isEditing}
                      className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Araç Tipi
                    </label>
                    <input
                      type="text"
                      value={user.driverDetails.vehicleType || ''}
                      disabled={!isEditing}
                      className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Müsaitlik
                    </label>
                    <select
                      disabled={!isEditing}
                      className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                    >
                      <option value="immediate" selected={user.driverDetails.availability === 'immediate'}>Hemen</option>
                      <option value="within-week" selected={user.driverDetails.availability === 'within-week'}>Bu hafta içinde</option>
                      <option value="within-month" selected={user.driverDetails.availability === 'within-month'}>Bu ay içinde</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Employer Details */}
            {user?.userType === 'employer' && user?.employerDetails && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Şirket Bilgileri
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Şirket Adı
                    </label>
                    <input
                      type="text"
                      value={user.employerDetails.companyName || ''}
                      disabled={!isEditing}
                      className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vergi Numarası
                    </label>
                    <input
                      type="text"
                      value={user.employerDetails.taxNumber || ''}
                      disabled={!isEditing}
                      className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Şirket Adresi
                    </label>
                    <textarea
                      rows={3}
                      value={user.employerDetails.companyAddress || ''}
                      disabled={!isEditing}
                      className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Account Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hesap Durumu</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Email Doğrulama</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    user?.verified?.email ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user?.verified?.email ? 'Doğrulandı' : 'Bekliyor'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Telefon Doğrulama</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    user?.verified?.phone ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user?.verified?.phone ? 'Doğrulandı' : 'Bekliyor'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Kimlik Doğrulama</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    user?.verified?.identity ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user?.verified?.identity ? 'Doğrulandı' : 'Bekliyor'}
                  </span>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">İstatistikler</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Üyelik Tarihi</span>
                  <span className="text-sm font-medium">{formatDate(user?.createdAt)}</span>
                </div>
                {user?.userType === 'driver' && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tamamlanan İş</span>
                    <span className="text-sm font-medium">{user.driverDetails?.completedJobs || 0}</span>
                  </div>
                )}
                {user?.userType === 'employer' && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Yayınlanan İlan</span>
                    <span className="text-sm font-medium">{user.employerDetails?.postedJobs || 0}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Son Giriş</span>
                  <span className="text-sm font-medium">
                    {user?.lastLogin ? formatDate(user.lastLogin) : 'Bilinmiyor'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">İşlemler</h3>
              <div className="space-y-3">
                <button className="btn-secondary w-full">
                  Şifre Değiştir
                </button>
                <button className="btn-secondary w-full">
                  Bildirimler
                </button>
                <button className="btn-secondary w-full text-red-600 hover:text-red-700">
                  Hesabı Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

