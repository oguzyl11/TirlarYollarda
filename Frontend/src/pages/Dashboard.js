import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Truck, Briefcase, MessageSquare, Star, TrendingUp, Users, MapPin, Clock } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Aktif İlanlarım',
      value: '5',
      change: '+2 bu hafta',
      icon: <Briefcase className="h-8 w-8" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Tekliflerim',
      value: '12',
      change: '+3 bu hafta',
      icon: <MessageSquare className="h-8 w-8" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Değerlendirmelerim',
      value: '4.8',
      change: 'Toplam 24 yorum',
      icon: <Star className="h-8 w-8" />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Toplam Kazanç',
      value: '₺45,000',
      change: '+15% bu ay',
      icon: <TrendingUp className="h-8 w-8" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'job',
      title: 'İstanbul - Ankara Parsiyel Taşımacılığı',
      description: 'Yeni iş ilanı oluşturuldu',
      time: '2 saat önce',
      status: 'active',
    },
    {
      id: 2,
      type: 'bid',
      title: 'İzmir - Antalya Konteyner',
      description: 'Teklifiniz kabul edildi',
      time: '1 gün önce',
      status: 'accepted',
    },
    {
      id: 3,
      type: 'review',
      title: 'ABC Lojistik A.Ş.',
      description: 'Yeni değerlendirme aldınız',
      time: '2 gün önce',
      status: 'review',
    },
  ];

  const quickActions = [
    {
      title: 'Yeni İlan Oluştur',
      description: 'İş ilanı yayınla',
      icon: <Briefcase className="h-6 w-6" />,
      link: '/create-job',
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      title: 'İlan Ara',
      description: 'Size uygun işleri bul',
      icon: <Truck className="h-6 w-6" />,
      link: '/jobs',
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      title: 'Mesajlar',
      description: 'Konuşmalarınızı görüntüle',
      icon: <MessageSquare className="h-6 w-6" />,
      link: '/messages',
      color: 'bg-purple-500 hover:bg-purple-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Hoş geldiniz, {user?.profile?.firstName}!
          </h1>
          <p className="mt-2 text-gray-600">
            Dashboard'unuzda son aktivitelerinizi ve istatistiklerinizi görüntüleyebilirsiniz.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor} ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.change}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h3>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <a
                    key={index}
                    href={action.link}
                    className={`${action.color} text-white p-4 rounded-lg block transition-colors`}
                  >
                    <div className="flex items-center">
                      {action.icon}
                      <div className="ml-3">
                        <p className="font-medium">{action.title}</p>
                        <p className="text-sm opacity-90">{action.description}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Son Aktiviteler</h3>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === 'job' ? 'bg-blue-100' :
                        activity.type === 'bid' ? 'bg-green-100' :
                        'bg-yellow-100'
                      }`}>
                        {activity.type === 'job' ? <Briefcase className="h-4 w-4 text-blue-600" /> :
                         activity.type === 'bid' ? <MessageSquare className="h-4 w-4 text-green-600" /> :
                         <Star className="h-4 w-4 text-yellow-600" />}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        activity.status === 'active' ? 'bg-green-100 text-green-800' :
                        activity.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {activity.status === 'active' ? 'Aktif' :
                         activity.status === 'accepted' ? 'Kabul' :
                         'Değerlendirme'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <a href="#" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Tüm aktiviteleri görüntüle →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Completion */}
        {user?.userType === 'driver' && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Profilinizi Tamamlayın</h3>
                <p className="text-gray-600 mt-1">
                  Profilinizi tamamlayarak daha fazla iş fırsatına erişin.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Profil Tamamlanma</p>
                  <p className="text-2xl font-bold text-gray-900">75%</p>
                </div>
                <div className="w-16 h-16 relative">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-gray-200"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray="175.9"
                      strokeDashoffset="44"
                      className="text-primary-600"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <a href="/profile" className="btn-primary">
                Profili Tamamla
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

