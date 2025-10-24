import axios from 'axios';

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
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Sadece login sayfasında değilsek yönlendir
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const jobAPI = {
  getJobs: (params) => api.get('/jobs', { params }),
  getJob: (id) => api.get(`/jobs/${id}`),
  getJobDetails: (id) => api.get(`/jobs/${id}`),
  createJob: (data) => api.post('/jobs', data),
  updateJob: (id, data) => api.put(`/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  getMyJobs: () => api.get('/jobs/user/my-jobs'),
};

export const bidAPI = {
  createBid: (data) => api.post('/bids', data),
  getMyBids: () => api.get('/bids/my-bids'),
  getJobBids: (jobId) => api.get(`/bids/job/${jobId}`),
  getEmployerBids: () => api.get('/bids/employer-bids'),
  updateBidStatus: (id, status) => api.patch(`/bids/${id}/status`, { status }),
};

export const userAPI = {
  getProfile: (id) => api.get(`/users/${id}`),
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
  getCompanies: () => api.get('/users/companies'),
  getCompanyDetails: (id) => api.get(`/users/companies/${id}`),
  getDrivers: () => api.get('/users/drivers'),
  getDriverDetails: (id) => api.get(`/users/drivers/${id}`),
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