'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { 
  Bell, 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Clock,
  Trash2,
  CheckCheck,
  AlertCircle,
  Info,
  Star
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import useNotificationStore from '../../store/notificationStore';
import toast, { Toaster } from 'react-hot-toast';

export default function NotificationsPage() {
  const router = useRouter();
  const { user, isAuthenticated, initAuth, initialized } = useAuthStore();
  const { 
    notifications, 
    unreadCount, 
    loading, 
    error,
    loadNotifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotificationStore();

  useEffect(() => {
    initAuth();
  }, []);

  useEffect(() => {
    if (!initialized) return;
    
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }
    
    console.log('Loading notifications for user:', user);
    // Only load if we don't have recent data (cache will handle this)
    loadNotifications();
  }, [isAuthenticated, user, initialized, router, loadNotifications]);

  const getNotificationIcon = (type, priority) => {
    const iconClass = `w-5 h-5 ${
      priority === 'high' ? 'text-red-500' :
      priority === 'medium' ? 'text-yellow-500' :
      'text-green-500'
    }`;

    switch (type) {
      case 'bid_received':
        return <Star className={iconClass} />;
      case 'bid_accepted':
        return <CheckCircle className={iconClass} />;
      case 'bid_rejected':
        return <XCircle className={iconClass} />;
      case 'job_completed':
        return <CheckCircle className={iconClass} />;
      case 'message_received':
        return <Bell className={iconClass} />;
      case 'system':
        return <Info className={iconClass} />;
      default:
        return <AlertCircle className={iconClass} />;
    }
  };

  const getNotificationTypeText = (type) => {
    switch (type) {
      case 'bid_received':
        return 'Yeni Teklif';
      case 'bid_accepted':
        return 'Teklif Kabul';
      case 'bid_rejected':
        return 'Teklif Red';
      case 'job_completed':
        return 'İş Tamamlandı';
      case 'message_received':
        return 'Yeni Mesaj';
      case 'system':
        return 'Sistem';
      default:
        return 'Bildirim';
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      toast.success('Bildirim okundu olarak işaretlendi');
    } catch (error) {
      toast.error('Bildirim güncellenirken hata oluştu');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      toast.success('Tüm bildirimler okundu olarak işaretlendi');
    } catch (error) {
      toast.error('Bildirimler güncellenirken hata oluştu');
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    if (!confirm('Bu bildirimi silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await deleteNotification(notificationId);
      toast.success('Bildirim silindi');
    } catch (error) {
      toast.error('Bildirim silinirken hata oluştu');
    }
  };

  const handleBidAction = async (bidId, action) => {
    console.log('handleBidAction called with:', { bidId, action });
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token ? 'exists' : 'missing');
      
      const response = await fetch(`http://localhost:5001/api/bids/${bidId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: action })
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const result = await response.json();
        console.log('Success result:', result);
        toast.success(result.message);
        // Reload notifications to show updated status
        loadNotifications();
      } else {
        const error = await response.json();
        console.error('Error response:', error);
        toast.error(error.message || 'İşlem başarısız');
      }
    } catch (error) {
      console.error('Bid action error:', error);
      toast.error('İşlem sırasında hata oluştu');
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <Toaster />
      
      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Bildirimler</h1>
                <p className="text-gray-600 mt-1">
                  {unreadCount > 0 ? `${unreadCount} okunmamış bildirim` : 'Tüm bildirimler okundu'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => loadNotifications(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <span>Yenile</span>
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>Tümünü Okundu İşaretle</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Bildirimler yükleniyor...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <XCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Notifications List */}
        {!loading && !error && (
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz bildirim yok</h3>
                <p className="text-gray-600">
                  Yeni bildirimler geldiğinde burada görünecek.
                </p>
              </div>
            ) : (
              notifications.map((notification) => {
                console.log('Rendering notification:', notification);
                return (
                <div
                  key={notification._id}
                  className={`bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow ${
                    !notification.read ? 'border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        {getNotificationIcon(notification.type, notification.priority)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {notification.title}
                          </h3>
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                            {getNotificationTypeText(notification.type)}
                          </span>
                          {notification.priority === 'high' && (
                            <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-600 rounded-full">
                              Yüksek Öncelik
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-700 mb-3">
                          {notification.message}
                        </p>
                        
                        {/* Bid Action Buttons for bid_received notifications */}
                        {notification.type === 'bid_received' && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-sm font-medium text-blue-900 mb-1">
                                  Teklif Onaylama
                                </h4>
                                <p className="text-xs text-blue-700">
                                  Bu teklife cevap verebilirsiniz
                                </p>
                              </div>
                              {notification.data?.bidId && (
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => handleBidAction(notification.data.bidId, 'accepted')}
                                    className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium flex items-center space-x-1"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Kabul Et</span>
                                  </button>
                                  <button
                                    onClick={() => handleBidAction(notification.data.bidId, 'rejected')}
                                    className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium flex items-center space-x-1"
                                  >
                                    <XCircle className="w-4 h-4" />
                                    <span>Reddet</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(notification.createdAt).toLocaleString('tr-TR')}</span>
                          </span>
                          {!notification.read && (
                            <span className="flex items-center space-x-1 text-blue-600">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span>Okunmamış</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification._id)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Okundu olarak işaretle"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteNotification(notification._id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Bildirimi sil"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
                );
              })
            )}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
