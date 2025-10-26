import axios from 'axios';
import { rateLimitedApiCall } from './rateLimiter';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 errors
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        console.log('401 error detected, current path:', window.location.pathname);
        
        // Don't auto-redirect for any critical operations
        const criticalPaths = ['/jobs/create', '/jobs/edit', '/bids', '/dashboard', '/profile'];
        const isCriticalPath = criticalPaths.some(path => 
          window.location.pathname.includes(path)
        );
        
        console.log('Is critical path:', isCriticalPath);
        
        // Only redirect if it's NOT a critical path and NOT already on login page
        if (!isCriticalPath && window.location.pathname !== '/login') {
          console.log('Redirecting to login...');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        } else {
          console.log('Skipping redirect for critical path or already on login');
        }
      }
    }
    
    // Handle 429 errors with more aggressive backoff
    if (error.response?.status === 429) {
      const config = error.config;
      if (!config._retry) {
        config._retry = true;
        const delay = 5000; // 5 second delay (increased)
        
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(api(config));
          }, delay);
        });
      }
    }
    
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
};

export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
  createNotification: (data) => api.post('/notifications', data),
};

export const jobAPI = {
  getJobs: (params) => rateLimitedApiCall(
    () => api.get('/jobs', { params }),
    `getJobs_${JSON.stringify(params || {})}`
  ),
  getJob: (id) => rateLimitedApiCall(
    () => api.get(`/jobs/${id}`),
    `getJob_${id}`
  ),
  getJobDetails: (id) => rateLimitedApiCall(
    () => api.get(`/jobs/${id}`),
    `getJobDetails_${id}`
  ),
  createJob: (data) => api.post('/jobs', data),
  updateJob: (id, data) => api.put(`/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  getMyJobs: () => rateLimitedApiCall(
    () => api.get('/jobs/user/my-jobs'),
    'getMyJobs'
  ),
};

export const bidAPI = {
  createBid: (data) => api.post('/bids', data),
  getMyBids: () => api.get('/bids/my-bids'),
  getJobBids: (jobId) => api.get(`/bids/job/${jobId}`),
  getEmployerBids: () => api.get('/bids/employer-bids'),
  updateBidStatus: (id, status) => api.patch(`/bids/${id}/status`, { status }),
};

export const userAPI = {
  getProfile: (id) => rateLimitedApiCall(
    () => api.get(`/users/${id}`),
    `getProfile_${id}`
  ),
  updateProfile: (data) => {
    // Check if data is FormData (for file uploads)
    if (data instanceof FormData) {
      return api.put('/users/profile', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    // Regular JSON data
    return api.put('/users/profile', data);
  },
  getCompanies: () => rateLimitedApiCall(
    () => api.get('/users/companies'),
    'getCompanies'
  ),
  getCompanyDetails: (id) => rateLimitedApiCall(
    () => api.get(`/users/companies/${id}`),
    `getCompanyDetails_${id}`
  ),
  getDrivers: () => rateLimitedApiCall(
    () => api.get('/users/drivers'),
    'getDrivers'
  ),
  getDriverDetails: (id) => rateLimitedApiCall(
    () => api.get(`/users/drivers/${id}`),
    `getDriverDetails_${id}`
  ),
  followUser: (id) => api.post(`/users/${id}/follow`),
  checkFollowing: (id) => rateLimitedApiCall(
    () => api.get(`/users/${id}/following`),
    `checkFollowing_${id}`
  ),
};

export const reviewAPI = {
  createReview: (data) => api.post('/reviews', data),
  getReviews: (userId) => api.get(`/reviews/user/${userId}`),
};

export const messageAPI = {
  getConversations: () => api.get('/messages/conversations/list'),
  getMessages: (conversationId) => api.get(`/messages/${conversationId}`),
  sendMessage: (data) => api.post('/messages', data),
};

export default api;