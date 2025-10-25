import { create } from 'zustand';
import { authAPI } from '../lib/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  initialized: false,

  initAuth: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (token && user) {
        set({ token, user: JSON.parse(user), isAuthenticated: true, initialized: true });
      } else {
        set({ user: null, token: null, isAuthenticated: false, initialized: true });
      }
    }
  },

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      console.log('AuthStore: Giriş yapılıyor:', credentials);
      const response = await authAPI.login(credentials);
      console.log('AuthStore: API yanıtı:', response.data);
      const { token, user } = response.data;

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        console.log('AuthStore: LocalStorage\'a kaydedildi');
      }

      set({ user, token, isAuthenticated: true, loading: false });
      console.log('AuthStore: State güncellendi');
      return { success: true };
    } catch (error) {
      console.error('AuthStore: Giriş hatası:', error);
      const errorMessage = error.response?.data?.message || 'Giriş başarısız';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  register: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await authAPI.register(data);
      const { token, user } = response.data;

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }

      set({ user, token, isAuthenticated: true, loading: false });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Kayıt başarısız';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    set({ user: null, token: null, isAuthenticated: false, initialized: false });
  },

  // Token validation function
  validateToken: async () => {
    const { token } = get();
    console.log('validateToken called, token exists:', !!token);
    
    if (!token) {
      console.log('No token found, returning false');
      return false;
    }

    try {
      console.log('Making getMe API call to validate token...');
      const response = await authAPI.getMe();
      console.log('getMe response:', response.data);
      
      if (response.data.success) {
        console.log('Token is valid, updating user data');
        set({ user: response.data.user, isAuthenticated: true });
        return true;
      }
    } catch (error) {
      console.error('Token validation failed:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      if (error.response?.status === 401) {
        console.log('401 error in token validation, logging out user');
        // Token is invalid, logout user
        get().logout();
      }
      return false;
    }
    return false;
  },

  clearError: () => set({ error: null }),

  updateUser: (updatedUser) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    set({ user: updatedUser });
  }
}));