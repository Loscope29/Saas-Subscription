import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem('access_token', access);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return axios(originalRequest);
      } catch (err) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
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
