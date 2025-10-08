import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Search, Users, Shield, MapPin, Clock, Star } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Search className="h-8 w-8" />,
      title: 'Kolay İş Bulma',
      description: 'Binlerce iş ilanı arasından size uygun olanı kolayca bulun.',
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Güvenilir Şirketler',
      description: 'Doğrulanmış ve güvenilir lojistik şirketleri ile çalışın.',
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Güvenli Platform',
      description: 'Verileriniz güvende, ödemeleriniz korunuyor.',
    },
  ];

  const stats = [
    { label: 'Aktif İlan', value: '2,500+' },
    { label: 'Kayıtlı Tırcı', value: '15,000+' },
    { label: 'Lojistik Şirketi', value: '1,200+' },
    { label: 'Tamamlanan İş', value: '50,000+' },
  ];

  const recentJobs = [
    {
      id: 1,
      title: 'İstanbul - Ankara Parsiyel Taşımacılığı',
      from: 'İstanbul',
      to: 'Ankara',
      amount: 2500,
      date: '2024-01-15',
      company: 'ABC Lojistik',
      rating: 4.8,
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
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Tırcı İş İlanları
              <br />
              <span className="text-primary-200">Tek Platformda</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Türkiye'nin en büyük tırcı ve lojistik şirketi buluşma platformu. 
              İş bulun, tırcı bulun, güvenle taşıyın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/jobs"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
              >
                <Search className="h-5 w-5 mr-2" />
                İş Ara
              </Link>
              <Link
                to="/register"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors inline-flex items-center justify-center"
              >
                <Truck className="h-5 w-5 mr-2" />
                Hemen Başla
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Neden TırlarYollarda?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Sektördeki deneyimimiz ve güvenilir platformumuzla 
              işinizi kolaylaştırıyoruz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center">
                <div className="text-primary-600 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Jobs Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Son İlanlar
            </h2>
            <p className="text-xl text-gray-600">
              En güncel iş ilanlarını inceleyin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentJobs.map((job) => (
              <div key={job.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 line-clamp-2">
                    {job.title}
                  </h3>
                  <div className="flex items-center text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="ml-1 text-sm font-medium">{job.rating}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      {job.from} → {job.to}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm">{job.date}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {job.company}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-primary-600">
                    ₺{job.amount.toLocaleString()}
                  </div>
                  <Link
                    to={`/jobs/${job.id}`}
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                  >
                    Detayları Gör →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/jobs"
              className="btn-primary inline-flex items-center"
            >
              <Search className="h-5 w-5 mr-2" />
              Tüm İlanları Görüntüle
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Hemen Başlayın
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Binlerce iş fırsatı sizi bekliyor. Hemen kayıt olun ve 
            kariyerinizde yeni bir sayfa açın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
            >
              <Users className="h-5 w-5 mr-2" />
              Tırcı Olarak Kayıt Ol
            </Link>
            <Link
              to="/register"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors inline-flex items-center justify-center"
            >
              <Truck className="h-5 w-5 mr-2" />
              Şirket Olarak Kayıt Ol
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

