import { create } from 'zustand';
import { notificationAPI } from '../lib/api';

// Global request queue to prevent concurrent API calls
let requestQueue = [];
let isProcessingQueue = false;
let lastRequestTime = 0;
let requestCount = 0;
let windowStartTime = Date.now();
const MIN_REQUEST_INTERVAL = 10000; // Minimum 10 seconds between requests
const MAX_REQUESTS_PER_WINDOW = 20; // Maximum 20 requests per 15 minutes
const WINDOW_DURATION = 15 * 60 * 1000; // 15 minutes

// Process request queue with aggressive rate limiting
const processRequestQueue = async () => {
  if (isProcessingQueue || requestQueue.length === 0) {
    return;
  }

  isProcessingQueue = true;
  
  while (requestQueue.length > 0) {
    const now = Date.now();
    
    // Reset window if 15 minutes have passed
    if (now - windowStartTime > WINDOW_DURATION) {
      requestCount = 0;
      windowStartTime = now;
    }
    
    // Check if we've exceeded our request limit
    if (requestCount >= MAX_REQUESTS_PER_WINDOW) {
      const timeUntilReset = WINDOW_DURATION - (now - windowStartTime);
      console.log(`Rate limit exceeded, waiting ${Math.ceil(timeUntilReset / 1000)}s until reset`);
      await new Promise(resolve => setTimeout(resolve, timeUntilReset));
      requestCount = 0;
      windowStartTime = Date.now();
    }
    
    const timeSinceLastRequest = now - lastRequestTime;
    
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      const delay = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
      console.log(`Rate limiting: waiting ${delay}ms before next request`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    const request = requestQueue.shift();
    if (request) {
      lastRequestTime = Date.now();
      requestCount++;
      console.log(`Making request ${requestCount}/${MAX_REQUESTS_PER_WINDOW} in current window`);
      
      try {
        await request();
      } catch (error) {
        console.error('Request in queue failed:', error);
      }
    }
  }
  
  isProcessingQueue = false;
};

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  pollingInterval: null,
  isPolling: false, // Prevent multiple simultaneous requests
  lastFetchTime: null, // Track when we last fetched data
  cacheTimeout: 30000, // 30 seconds cache timeout
  circuitBreakerOpen: false, // Circuit breaker state
  circuitBreakerTimeout: null, // Circuit breaker timeout

  // Load notifications - simplified version
  loadNotifications: async (forceRefresh = false) => {
    const { isPolling, lastFetchTime, cacheTimeout } = get();
    
    // Check if we have recent data and don't need to refresh
    if (!forceRefresh && lastFetchTime && (Date.now() - lastFetchTime) < cacheTimeout) {
      console.log('Using cached notification data');
      return;
    }
    
    // Prevent multiple simultaneous requests
    if (isPolling) {
      console.log('Notification request already in progress');
      return;
    }
    
    try {
      set({ loading: true, error: null, isPolling: true });
      
      console.log('Making API call to get notifications');
      const response = await notificationAPI.getNotifications();
      console.log('Notifications API response:', response);
      
      set({ 
        notifications: response.data.data || [],
        unreadCount: response.data.unreadCount || 0,
        loading: false,
        isPolling: false,
        lastFetchTime: Date.now()
      });
      return response;
    } catch (error) {
      console.error('Load notifications error:', error);
      set({ 
        error: error.response?.data?.message || 'Bildirimler yüklenemedi',
        loading: false,
        isPolling: false
      });
      throw error;
    }
  },

  // Start polling for new notifications - simplified
  startPolling: () => {
    const { pollingInterval } = get();
    
    if (pollingInterval) {
      console.log('Polling already running');
      return;
    }
    
    const interval = setInterval(() => {
      get().loadNotifications(true); // Force refresh for polling
    }, 30000); // Poll every 30 seconds
    
    set({ pollingInterval: interval });
    console.log('Started notification polling');
  },

  // Stop polling
  stopPolling: () => {
    const { pollingInterval } = get();
    if (pollingInterval) {
      clearInterval(pollingInterval);
      set({ pollingInterval: null });
      console.log('Stopped notification polling');
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
      // Don't show error for rate limiting on individual actions
      if (error.response?.status !== 429) {
        set({ error: 'Bildirim okunamadı' });
      }
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
      // Don't show error for rate limiting on individual actions
      if (error.response?.status !== 429) {
        set({ error: 'Bildirimler okunamadı' });
      }
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
      // Don't show error for rate limiting on individual actions
      if (error.response?.status !== 429) {
        set({ error: 'Bildirim silinemedi' });
      }
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

  // Clear cache and force refresh
  refreshNotifications: () => {
    set({ lastFetchTime: null });
    get().loadNotifications(true);
  },

  // Reset circuit breaker and clear queue
  resetCircuitBreaker: () => {
    set({ circuitBreakerOpen: false, error: null });
    requestQueue = [];
    isProcessingQueue = false;
    requestCount = 0;
    windowStartTime = Date.now();
    console.log('Circuit breaker reset and queue cleared');
  },

  // Get rate limit status
  getRateLimitStatus: () => {
    const now = Date.now();
    const timeSinceWindowStart = now - windowStartTime;
    const timeUntilReset = WINDOW_DURATION - timeSinceWindowStart;
    
    return {
      requestsUsed: requestCount,
      requestsRemaining: MAX_REQUESTS_PER_WINDOW - requestCount,
      timeUntilReset: Math.max(0, timeUntilReset),
      queueLength: requestQueue.length,
      isProcessing: isProcessingQueue
    };
  },

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
