import  axiosInstance from '../api/axiosInstance.js';

export const authService = {
 async login({ email, password }) {
  const response = await axiosInstance.post('/auth/login', { email, password });
  return response.data;
},

  async register({ username, email, password, role = 'user' }) {
    const response = await axiosInstance.post('/auth/register', {
      username,
      email,
      password,
      role,
    });
    console.log("OUTPUT:" , response.data);
    return response.data;
  },

  async verifyEmail(token) {
    const response = await axiosInstance.get(`/auth/verify-email/${token}`);
    return response.data;
  },

  async forgotPassword(email) {
    const response = await axiosInstance.post('/auth/forgot-password', { email });
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export default authService;
