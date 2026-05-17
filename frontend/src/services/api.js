import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && error.config.url !== '/auth/login/') {
      // Pour l'instant, on redirige simplement vers le login
      // La logique de refresh token par cookie pourra être ajoutée côté backend
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
  logout: () => api.post('/auth/logout/'),
  getProfile: () => api.get('/auth/profile/'),
  
  // Google OAuth
  getGoogleAuthUrl: () => api.get('/auth/google/authorize/'),
  googleCallback: (code) => api.post('/auth/google/callback/', { code }),
  disconnectGmail: () => api.post('/auth/google/disconnect/'),
  getGmailStatus: () => api.get('/auth/google/status/'),
};

// Subscriptions API
export const subscriptionsAPI = {
  getAll: () => api.get('/subscriptions/'),
  getOne: (id) => api.get(`/subscriptions/${id}/`),
  create: (data) => api.post('/subscriptions/', data),
  update: (id, data) => api.patch(`/subscriptions/${id}/`, data),
  delete: (id) => api.delete(`/subscriptions/${id}/`),
  
  // Actions
  markActive: (id) => api.post(`/subscriptions/${id}/mark_active/`),
  markCancelled: (id) => api.post(`/subscriptions/${id}/mark_cancelled/`),
  
  // Stats & Scan
  getStats: () => api.get('/subscriptions/stats/'),
  scanEmails: () => api.post('/subscriptions/scan/'),
  getScanHistory: () => api.get('/subscriptions/scan/history/'),
  export: (format = 'json') => api.post('/subscriptions/export/', { format }),
};

export default api;
