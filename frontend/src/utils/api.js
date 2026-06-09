import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout')
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  listUsers: () => api.get('/users/list')
};

export const fileAPI = {
  upload: (data) => api.post('/files/upload', data),
  download: (fileId) => api.get(`/files/download/${fileId}`)
};

export default api;
