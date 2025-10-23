'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { User, Star, MapPin, Truck, Award, Search, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { userAPI } from '../../lib/api';
import toast, { Toaster } from 'react-hot-toast';

export default function DriversPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getDrivers();
      setDrivers(response.data.data);
    } catch (error) {
      console.error('Şoförler yüklenemedi:', error);
      toast.error('Şoförler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const filteredDrivers = drivers.filter(driver =>
    `${driver.profile?.firstName || ''} ${driver.profile?.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.profile?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.driverDetails?.vehicleType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Toaster position="top-right" />
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Truck className="w-6 h-6 text-blue-600" /> Şoförler
        </h1>

        {/* Arama kutusu */}
        <div className="flex items-center bg-white rounded-xl shadow-sm border px-4 py-2 w-full sm:w-96 mb-8">
          <Search className="w-5 h-5 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Şoför, şehir veya araç türü ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full outline-none text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Şoför listesi */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white p-5 rounded-2xl shadow animate-pulse">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-200 rounded"></div>
                    <div className="h-5 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="space-y-1">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDrivers.map((driver) => (
              <Link
                key={driver._id}
                href={`/drivers/${driver._id}`}
                className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <User className="w-6 h-6 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-800">
                      {driver.profile?.firstName || ''} {driver.profile?.lastName || ''}
                    </h2>
                    {driver.verified && (
                      <CheckCircle className="w-4 h-4 text-green-500" title="Doğrulanmış" />
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{driver.profile?.city || 'Şehir'}</span>
                </div>

                <div className="flex items-center gap-2 text-yellow-500 mb-2">
                  <Star className="w-4 h-4" />
                  <span className="font-medium text-gray-800">{driver.rating || '4.5'}</span>
                  <span className="text-sm text-gray-500">({driver.reviewCount || 0} yorum)</span>
                </div>

                <div className="text-sm text-gray-600 space-y-1">
                  <p className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-blue-600" /> 
                    {driver.driverDetails?.experience || '0'} yıl tecrübe
                  </p>
                  <p className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-gray-600" /> 
                    {driver.driverDetails?.vehicleType || 'Araç Tipi'}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-600" /> 
                    {driver.completedJobs || 0} tamamlanan iş
                  </p>
                </div>
              </Link>
            ))}

            {!loading && filteredDrivers.length === 0 && (
              <p className="text-gray-500 text-center col-span-full">Eşleşen şoför bulunamadı.</p>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
