import React from 'react';
import { X, Bell, CheckCircle, AlertCircle, Info } from 'lucide-react';

const NotificationsModal = ({ isOpen, onClose }) => {
  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'İlanınız Onaylandı',
      message: 'İstanbul-Ankara taşımacılığı ilanınız başarıyla onaylandı.',
      time: '5 dakika önce',
      read: false
    },
    {
      id: 2,
      type: 'info',
      title: 'Yeni Teklif',
      message: 'İzmir-Antalya rotası için yeni bir teklif aldınız.',
      time: '1 saat önce',
      read: false
    },
    {
      id: 3,
      type: 'warning',
      title: 'Sözleşme Hatırlatması',
      message: 'ABC Lojistik ile olan sözleşmenizin süresi yakında dolacak.',
      time: '2 saat önce',
      read: true
    },
    {
      id: 4,
      type: 'success',
      title: 'Ödeme Alındı',
      message: 'Son taşımacılık işiniz için ödemeniz hesabınıza yatırıldı.',
      time: '1 gün önce',
      read: true
    }
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50';
      case 'warning':
        return 'bg-yellow-50';
      case 'info':
      default:
        return 'bg-blue-50';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

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
      <div className={`fixed top-16 right-4 w-96 bg-white rounded-lg shadow-lg transform transition-all duration-300 z-50 ${
        isOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Bildirimler</h3>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>Henüz bildiriminiz yok</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {getIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            <button className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium">
              Tümünü Görüntüle
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationsModal;
