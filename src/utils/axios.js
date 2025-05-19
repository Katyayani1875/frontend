// utils/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backend-sgy8.onrender.com/api',
});

// Request interceptor to attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // or from cookies/context
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle unauthorized errors (e.g., expired token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid, handle logout here
      console.error('Unauthorized, logging out...');
      localStorage.removeItem('token'); // Clear token
      // Optionally redirect to login page
      window.location.href = '/login'; // Or use router push to redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;
