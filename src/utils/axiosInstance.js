// frontend/job-ui/src/utils/axiosInstance.js
import axios from 'axios';
// Get the backend API URL from environment variables
const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://backend-sgy8.onrender.com/api';

const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true, // Enable credentials/cookies for all requests
  headers: {
    'Content-Type': 'application/json', // Default content type
    'Accept': 'application/json'       // Preferred response type
  }
});

// Request interceptor for adding auth token and handling errors
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    // Handle request configuration errors
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized request - possibly expired token');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;