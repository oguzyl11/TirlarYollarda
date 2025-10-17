'use client';

import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { User, Star, MapPin, Truck, Award, Search, CheckCircle } from 'lucide-react';

export default function DriversPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const drivers = [
    { id: 1, name: 'Mehmet Y.', city: 'İstanbul', rating: 4.9, reviewCount: 245, experience: 15, vehicleType: 'Mega Tır', completedJobs: 380, verified: true },
    { id: 2, name: 'Ali D.', city: 'Ankara', rating: 4.7, reviewCount: 156, experience: 10, vehicleType: 'Kamyon', completedJobs: 220, verified: true },
    { id: 3, name: 'Hasan K.', city: 'İzmir', rating: 4.8, reviewCount: 189, experience: 12, vehicleType: 'Çekici', completedJobs: 295, verified: true },
    { id: 4, name: 'Mustafa A.', city: 'Bursa', rating: 4.6, reviewCount: 98, experience: 8, vehicleType: 'Tır', completedJobs: 167, verified: false },
    { id: 5, name: 'Ahmet S.', city: 'Antalya', rating: 4.9, reviewCount: 212, experience: 18, vehicleType: 'Frigo', completedJobs: 412, verified: true },
    { id: 6, name: 'Yusuf T.', city: 'Konya', rating: 4.5, reviewCount: 134, experience: 9, vehicleType: 'Kamyon', completedJobs: 198, verified: true },
  ];

  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.vehicleType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDrivers.map((driver) => (
            <div
              key={driver.id}
              className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <User className="w-6 h-6 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-800">{driver.name}</h2>
                  {driver.verified && (
                    <CheckCircle className="w-4 h-4 text-green-500" title="Doğrulanmış" />
                  )}
                </div>
                <span className="text-sm text-gray-500">{driver.city}</span>
              </div>

              <div className="flex items-center gap-2 text-yellow-500 mb-2">
                <Star className="w-4 h-4" />
                <span className="font-medium text-gray-800">{driver.rating}</span>
                <span className="text-sm text-gray-500">({driver.reviewCount} yorum)</span>
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                <p className="flex items-center gap-2"><Award className="w-4 h-4 text-blue-600" /> {driver.experience} yıl tecrübe</p>
                <p className="flex items-center gap-2"><Truck className="w-4 h-4 text-gray-600" /> {driver.vehicleType}</p>
                <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-600" /> {driver.completedJobs} tamamlanan iş</p>
              </div>
            </div>
          ))}

          {filteredDrivers.length === 0 && (
            <p className="text-gray-500 text-center col-span-full">Eşleşen şoför bulunamadı.</p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
