import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// Automatically inject JWT token into all outgoing API headers
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api
