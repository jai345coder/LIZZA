import axios from 'axios';

// 1. Get the base URL from Vite environment or use the hardcoded production fallback
// 2. Ensure it strictly routes to your backend /api sub-routes
const rawBaseURL = import.meta.env.VITE_API_URL || 'https://lizza.onrender.com';
const baseURL = rawBaseURL.endsWith('/api') ? rawBaseURL : `${rawBaseURL}/api`;

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
