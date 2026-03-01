import axios from 'axios';

// Use localhost backend when app is opened from localhost; otherwise use env or relative /api
function getApiBaseUrl() {
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:5000/api';
  }
  return process.env.REACT_APP_API_URL || '/api';
}

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Log request data for debugging
    if (config.method === 'post' && config.url === '/slots') {
      console.log('API Request - URL:', config.url);
      console.log('API Request - Data:', JSON.stringify(config.data, null, 2));
      console.log('API Request - Headers:', config.headers);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  loginWithGoogle: (idToken, role) => api.post('/auth/google', { idToken, role }),
  getMe: () => api.get('/auth/me'),
};

// Slots API
export const slotsAPI = {
  getAll: () => api.get('/slots'),
  create: (data) => api.post('/slots', data),
  getMySlots: () => api.get('/slots/my-slots'),
  getBookedDates: (id) => api.get(`/slots/${id}/booked-dates`),
  update: (id, data) => api.put(`/slots/${id}`, data),
  delete: (id) => api.delete(`/slots/${id}`),
};

// Bookings API
export const bookingsAPI = {
  create: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  getStats: () => api.get('/bookings/stats'),
  getPending: () => api.get('/bookings/pending'),
  approve: (id) => api.put(`/bookings/${id}/approve`),
  reject: (id) => api.put(`/bookings/${id}/reject`),
};

export default api;

