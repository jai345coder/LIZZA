import axios from 'axios';

// 1. Check if the environment variable exists. 
// 2. If it doesn't, automatically pick the right raw domain based on mode.
const baseURL = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV ? 'http://localhost:3000/api' : 'https://lizza.onrender.com'); // 🟢 Fixed: Removed /api

const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized request - session may have expired or login required.');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
