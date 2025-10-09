import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Clock, Star, Truck, X } from 'lucide-react';

const Favorites = ({ isOpen, onClose }) => {
  const [favoriteJobs] = useState([
    {
      id: 1,
      title: 'İstanbul - Ankara Parsiyel Taşımacılığı',
      from: 'İstanbul',
      to: 'Ankara',
      amount: 2500,
      date: '2024-01-15',
      company: 'ABC Lojistik',
      rating: 4.8,
      distance: '450 km',
      vehicleType: 'Tır'
    },
    {
      id: 2,
      title: 'İzmir - Antalya Konteyner Taşımacılığı',
      from: 'İzmir',
      to: 'Antalya',
      amount: 3200,
      date: '2024-01-14',
      company: 'XYZ Kargo',
      rating: 4.6,
      distance: '350 km',
      vehicleType: 'Konteyner'
    },
    {
      id: 3,
      title: 'Bursa - Gaziantep Frigo Taşımacılığı',
      from: 'Bursa',
      to: 'Gaziantep',
      amount: 2800,
      date: '2024-01-13',
      company: 'DEF Nakliyat',
      rating: 4.9,
      distance: '650 km',
      vehicleType: 'Frigo'
    }
  ]);

  const removeFavorite = (jobId) => {
    // Bu fonksiyon gerçek uygulamada API çağrısı yapacak
    console.log('Remove favorite:', jobId);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={onClose}
        />
      )}

      {/* Modal */}
      <div className={`fixed top-16 right-4 w-[500px] max-h-[600px] bg-white rounded-lg shadow-lg transform transition-all duration-300 z-50 ${
        isOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900">Favori İlanlarım</h3>
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {favoriteJobs.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Favorites List */}
        <div className="max-h-[500px] overflow-y-auto">
          {favoriteJobs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Heart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg mb-2">Henüz favori ilanınız yok</p>
              <p className="text-sm">Beğendiğiniz ilanları favorilere ekleyebilirsiniz</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {favoriteJobs.map((job) => (
                <div key={job.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link
                        to={`/jobs/${job.id}`}
                        className="block"
                        onClick={onClose}
                      >
                        <h4 className="font-semibold text-gray-900 hover:text-primary-600 transition-colors mb-2">
                          {job.title}
                        </h4>
                      </Link>
                      
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center text-gray-600 text-sm">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{job.from} → {job.to}</span>
                          <span className="ml-2 text-gray-400">({job.distance})</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600 text-sm">
                          <Truck className="h-4 w-4 mr-2" />
                          <span>{job.vehicleType}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600 text-sm">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{job.date}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600 text-sm">
                          <span className="mr-2">{job.company}</span>
                          <div className="flex items-center text-yellow-500">
                            <Star className="h-3 w-3 fill-current" />
                            <span className="ml-1 text-xs">{job.rating}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-xl font-bold text-primary-600">
                        ₺{job.amount.toLocaleString()}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => removeFavorite(job.id)}
                      className="ml-4 text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Heart className="h-5 w-5 fill-current text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {favoriteJobs.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            <Link
              to="/favorites"
              className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium block"
              onClick={onClose}
            >
              Tüm Favorileri Görüntüle
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Favorites;
