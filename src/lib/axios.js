// src/lib/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backend-sgy8.onrender.com/api',
  withCredentials: true, 
});
//new changes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
