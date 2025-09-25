import axios from 'axios';

const api = axios.create({
  baseURL: 'https://sijgeriaucssangha.vercel.app/api/v1',
  // baseURL: 'http://localhost:5000/api/v1',
  // withCredentials is no longer needed for localStorage auth
});

// Interceptor to add the token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
