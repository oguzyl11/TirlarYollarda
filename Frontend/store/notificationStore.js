import { create } from 'zustand';
import { notificationAPI } from '../lib/api';

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  pollingInterval: null,

  // Load notifications
  loadNotifications: async () => {
    set({ loading: true, error: null });
    try {
      const response = await notificationAPI.getNotifications();
      set({ 
        notifications: response.data.data || [],
        unreadCount: response.data.unreadCount || 0,
        loading: false 
      });
    } catch (error) {
      console.error('Load notifications error:', error);
      set({ 
        error: error.response?.data?.message || 'Bildirimler yüklenemedi',
        loading: false 
      });
    }
  },

  // Start polling for new notifications
  startPolling: () => {
    const interval = setInterval(() => {
      get().loadNotifications();
    }, 30000); // Poll every 30 seconds
    
    set({ pollingInterval: interval });
  },

  // Stop polling
  stopPolling: () => {
    const { pollingInterval } = get();
    if (pollingInterval) {
      clearInterval(pollingInterval);
      set({ pollingInterval: null });
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      
      // Update local state
      set(state => ({
        notifications: state.notifications.map(notif => 
          notif._id === notificationId 
            ? { ...notif, read: true, readAt: new Date().toISOString() }
            : notif
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      }));
    } catch (error) {
      console.error('Mark as read error:', error);
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      await notificationAPI.markAllAsRead();
      
      // Update local state
      set(state => ({
        notifications: state.notifications.map(notif => ({
          ...notif,
          read: true,
          readAt: new Date().toISOString()
        })),
        unreadCount: 0
      }));
    } catch (error) {
      console.error('Mark all as read error:', error);
    }
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    try {
      await notificationAPI.deleteNotification(notificationId);
      
      // Update local state
      set(state => {
        const notification = state.notifications.find(n => n._id === notificationId);
        const wasUnread = notification && !notification.read;
        
        return {
          notifications: state.notifications.filter(notif => notif._id !== notificationId),
          unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount
        };
      });
    } catch (error) {
      console.error('Delete notification error:', error);
    }
  },

  // Add new notification (for real-time updates)
  addNotification: (notification) => {
    set(state => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1
    }));
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Get notification by ID
  getNotification: (id) => {
    return get().notifications.find(notif => notif._id === id);
  },

  // Get notifications by type
  getNotificationsByType: (type) => {
    return get().notifications.filter(notif => notif.type === type);
  },

  // Get unread notifications
  getUnreadNotifications: () => {
    return get().notifications.filter(notif => !notif.read);
  }
}));

export default useNotificationStore;
