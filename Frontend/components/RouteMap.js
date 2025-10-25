'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Navigation, Clock, Route } from 'lucide-react';

// Leaflet CSS'i dinamik olarak yükle
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

const Polyline = dynamic(
  () => import('react-leaflet').then((mod) => mod.Polyline),
  { ssr: false }
);

export default function RouteMap({ fromCity, toCity, jobDetails }) {
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Türkiye şehir koordinatları
  const cityCoordinates = {
    'İstanbul': [41.0082, 28.9784],
    'Ankara': [39.9334, 32.8597],
    'İzmir': [38.4192, 27.1287],
    'Bursa': [40.1826, 29.0665],
    'Antalya': [36.8969, 30.7133],
    'Adana': [37.0000, 35.3213],
    'Konya': [37.8667, 32.4833],
    'Gaziantep': [37.0662, 37.3833],
    'Şanlıurfa': [37.1591, 38.7969],
    'Kocaeli': [40.8533, 29.8815],
    'Mersin': [36.8000, 34.6333],
    'Diyarbakır': [37.9144, 40.2306],
    'Hatay': [36.4018, 36.3498],
    'Manisa': [38.6191, 27.4289],
    'Kayseri': [38.7312, 35.4787],
    'Samsun': [41.2928, 36.3313],
    'Balıkesir': [39.6484, 27.8826],
    'Kahramanmaraş': [37.5858, 36.9371],
    'Van': [38.4891, 43.4089],
    'Aydın': [37.8560, 27.8416],
    'Tekirdağ': [40.9833, 27.5167],
    'Sakarya': [40.7889, 30.4053],
    'Muğla': [37.2153, 28.3636],
    'Eskişehir': [39.7767, 30.5206],
    'Denizli': [37.7765, 29.0864],
    'Trabzon': [41.0015, 39.7178],
    'Ordu': [40.9839, 37.8764],
    'Afyonkarahisar': [38.7507, 30.5567],
    'Malatya': [38.3552, 38.3095],
    'Elazığ': [38.6810, 39.2264],
    'Erzurum': [39.9334, 41.2767],
    'Sivas': [39.7477, 37.0179],
    'Zonguldak': [41.4564, 31.7987],
    'Çorum': [40.5506, 34.9556],
    'Kırıkkale': [39.8468, 33.4988],
    'Aksaray': [38.3687, 34.0370],
    'Nevşehir': [38.6939, 34.6857],
    'Kırşehir': [39.1425, 34.1709],
    'Yozgat': [39.8181, 34.8147],
    'Çankırı': [40.6013, 33.6134],
    'Kastamonu': [41.3887, 33.7827],
    'Sinop': [42.0231, 35.1531],
    'Samsun': [41.2928, 36.3313],
    'Tokat': [40.3167, 36.5500],
    'Amasya': [40.6499, 35.8353],
    'Giresun': [40.9128, 38.3895],
    'Rize': [41.0201, 40.5234],
    'Artvin': [41.1828, 41.8183],
    'Ardahan': [41.1105, 42.7022],
    'Kars': [40.6013, 43.0975],
    'Iğdır': [39.9200, 44.0048],
    'Ağrı': [39.7191, 43.0503],
    'Muş': [38.9462, 41.7539],
    'Bitlis': [38.3938, 42.1232],
    'Bingöl': [38.8847, 40.4982],
    'Tunceli': [39.1079, 39.5401],
    'Erzincan': [39.7500, 39.5000],
    'Bayburt': [40.2552, 40.2249],
    'Gümüşhane': [40.4603, 39.5086],
    'Bartın': [41.6344, 32.3375],
    'Karabük': [41.2061, 32.6204],
    'Bolu': [40.7310, 31.6087],
    'Düzce': [40.8438, 31.1565],
    'Yalova': [40.6550, 29.2769],
    'Bilecik': [40.1501, 29.9830],
    'Edirne': [41.6771, 26.5557],
    'Kırklareli': [41.7350, 27.2256],
    'Uşak': [38.6823, 29.4082],
    'Burdur': [37.7206, 30.2906],
    'Isparta': [37.7648, 30.5566],
    'Kütahya': [39.4200, 29.9830],
    'Çanakkale': [40.1553, 26.4142],
    'Kırıkkale': [39.8468, 33.4988],
    'Kırşehir': [39.1425, 34.1709],
    'Nevşehir': [38.6939, 34.6857],
    'Aksaray': [38.3687, 34.0370],
    'Niğde': [37.9667, 34.6833],
    'Adıyaman': [37.7636, 38.2786],
    'Batman': [37.8812, 41.1351],
    'Şırnak': [37.4187, 42.4918],
    'Mardin': [37.3212, 40.7245],
    'Siirt': [37.9274, 41.9403],
    'Hakkari': [37.5833, 43.7333],
    'Osmaniye': [37.0682, 36.2616],
    'Kilis': [36.7184, 37.1212]
  };

  useEffect(() => {
    const calculateRoute = async () => {
      try {
        setLoading(true);
        
        const fromCoords = cityCoordinates[fromCity];
        const toCoords = cityCoordinates[toCity];
        
        if (!fromCoords || !toCoords) {
          throw new Error('Şehir koordinatları bulunamadı');
        }

        // Basit mesafe hesaplama (Haversine formülü)
        const R = 6371; // Dünya yarıçapı (km)
        const dLat = (toCoords[0] - fromCoords[0]) * Math.PI / 180;
        const dLon = (toCoords[1] - fromCoords[1]) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(fromCoords[0] * Math.PI / 180) * Math.cos(toCoords[0] * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;

        // Tahmini süre hesaplama (ortalama 80 km/h)
        const estimatedTime = Math.round(distance / 80 * 60); // dakika cinsinden
        const hours = Math.floor(estimatedTime / 60);
        const minutes = estimatedTime % 60;

        // Yol üzerindeki noktaları hesapla (basit interpolasyon)
        const routePoints = [];
        const steps = 10;
        for (let i = 0; i <= steps; i++) {
          const lat = fromCoords[0] + (toCoords[0] - fromCoords[0]) * (i / steps);
          const lng = fromCoords[1] + (toCoords[1] - fromCoords[1]) * (i / steps);
          routePoints.push([lat, lng]);
        }

        setRouteData({
          from: fromCoords,
          to: toCoords,
          distance: Math.round(distance),
          estimatedTime: `${hours}s ${minutes}dk`,
          routePoints: routePoints
        });

      } catch (err) {
        console.error('Rota hesaplama hatası:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (fromCity && toCity) {
      calculateRoute();
    }
  }, [fromCity, toCity]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Harita yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">Harita yüklenemedi: {error}</p>
        </div>
      </div>
    );
  }

  if (!routeData) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Route className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Güzergah Haritası</h2>
      </div>

      {/* Route Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Başlangıç</span>
          </div>
          <p className="text-lg font-semibold text-blue-900">{fromCity}</p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Navigation className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">Mesafe</span>
          </div>
          <p className="text-lg font-semibold text-green-900">{routeData.distance} km</p>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">Tahmini Süre</span>
          </div>
          <p className="text-lg font-semibold text-purple-900">{routeData.estimatedTime}</p>
        </div>
      </div>

      {/* Map Container */}
      <div className="h-96 rounded-lg overflow-hidden border border-gray-200">
        <MapContainer
          center={[
            (routeData.from[0] + routeData.to[0]) / 2,
            (routeData.from[1] + routeData.to[1]) / 2
          ]}
          zoom={7}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Başlangıç noktası */}
          <Marker position={routeData.from}>
            <Popup>
              <div className="text-center">
                <p className="font-semibold text-blue-600">{fromCity}</p>
                <p className="text-sm text-gray-600">Yükleme Noktası</p>
              </div>
            </Popup>
          </Marker>
          
          {/* Varış noktası */}
          <Marker position={routeData.to}>
            <Popup>
              <div className="text-center">
                <p className="font-semibold text-green-600">{toCity}</p>
                <p className="text-sm text-gray-600">Boşaltma Noktası</p>
              </div>
            </Popup>
          </Marker>
          
          {/* Rota çizgisi */}
          <Polyline
            positions={routeData.routePoints}
            color="#3B82F6"
            weight={4}
            opacity={0.8}
          />
        </MapContainer>
      </div>

      {/* Additional Info */}
      {jobDetails && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Ek Bilgiler</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
            <p><span className="font-medium">Yük Türü:</span> {jobDetails.loadType || 'Belirtilmemiş'}</p>
            <p><span className="font-medium">Araç Tipi:</span> {jobDetails.vehicleType || 'Belirtilmemiş'}</p>
            <p><span className="font-medium">Özel Gereksinimler:</span> {jobDetails.specialRequirements || 'Yok'}</p>
            <p><span className="font-medium">Acil Durum:</span> {jobDetails.urgent ? 'Evet' : 'Hayır'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
