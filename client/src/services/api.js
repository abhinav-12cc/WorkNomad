import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const auth = {
  register: (data) => api.post('/users/register', data),
  login: (data) => api.post('/users/login', data),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.patch('/users/profile', data),
  uploadAvatar: (data) => api.post('/users/profile/avatar', data),
};

// Property API
export const properties = {
  getAll: (params) => api.get('/properties', { params }),
  getById: (id) => api.get(`/properties/${id}`),
  create: (data) => api.post('/properties', data),
  update: (id, data) => api.patch(`/properties/${id}`, data),
  delete: (id) => api.delete(`/properties/${id}`),
  getStats: (id) => api.get(`/properties/${id}/stats`),
};

// Booking API
export const bookings = {
  create: (data) => api.post('/bookings', data),
  getAll: () => api.get('/bookings/user'),
  getById: (id) => api.get(`/bookings/${id}`),
  updateStatus: (id, status) => api.patch(`/bookings/${id}/status`, { status }),
  cancel: (id) => api.delete(`/bookings/${id}`),
};

// Review API
export const reviews = {
  getByProperty: (propertyId, params) => api.get(`/reviews/property/${propertyId}`, { params }),
  create: (propertyId, data) => api.post(`/reviews/property/${propertyId}`, data),
  update: (id, data) => api.patch(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
  addResponse: (id, response) => api.post(`/reviews/${id}/response`, { response }),
  toggleHelpful: (id) => api.post(`/reviews/${id}/helpful`),
  report: (id, data) => api.post(`/reviews/${id}/report`, data),
};

// Analytics API
export const analytics = {
  getOwnerStats: () => api.get('/analytics/owner'),
  getPropertyStats: (id) => api.get(`/analytics/property/${id}`),
};

export default api;
