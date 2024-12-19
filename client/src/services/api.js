import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5003',
  headers: {
    'Content-Type': 'application/json'
  }
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
  register: (data) => api.post('/api/users/register', data),
  login: (data) => api.post('/api/users/login', data),
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (data) => api.patch('/api/users/profile', data),
  uploadAvatar: (data) => api.post('/api/users/profile/avatar', data),
};

// Property API
export const properties = {
  getAll: (params) => api.get('/api/properties', { params }),
  getById: (id) => api.get(`/api/properties/${id}`),
  getOwnerProperties: () => api.get('/api/properties/owner'),
  create: (data) => api.post('/api/properties', data),
  update: (id, data) => api.patch(`/api/properties/${id}`, data),
  delete: (id) => api.delete(`/api/properties/${id}`),
  getStats: (id) => api.get(`/api/properties/${id}/stats`),
};

// Booking API
export const bookings = {
  create: (data) => api.post('/api/bookings', data),
  getAll: () => api.get('/api/bookings/user'),
  getById: (id) => api.get(`/api/bookings/${id}`),
  updateStatus: (id, status) => api.patch(`/api/bookings/${id}/status`, { status }),
  cancel: (id) => api.delete(`/api/bookings/${id}`),
};

// Review API
export const reviews = {
  getByProperty: (propertyId, params) => api.get(`/api/reviews/property/${propertyId}`, { params }),
  create: (propertyId, data) => api.post(`/api/reviews/property/${propertyId}`, data),
  update: (id, data) => api.patch(`/api/reviews/${id}`, data),
  delete: (id) => api.delete(`/api/reviews/${id}`),
  addResponse: (id, response) => api.post(`/api/reviews/${id}/response`, { response }),
  toggleHelpful: (id) => api.post(`/api/reviews/${id}/helpful`),
  report: (id, data) => api.post(`/api/reviews/${id}/report`, data),
};

// Analytics API
export const analytics = {
  getOwnerStats: () => api.get('/api/analytics/owner'),
  getPropertyStats: (id) => api.get(`/api/analytics/property/${id}`),
};

export default api;
