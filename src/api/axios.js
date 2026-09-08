import axios from 'axios';
import { getToken, clearToken } from '../utils/authToken.js';
import { clearSessionHint } from '../utils/sessionHint.js';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

const isAuthProbe = (url = '') => (
  url.includes('/auth/profile') || url.includes('/auth/login')
);

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.skipAuthRedirect) {
      clearToken();
      if (!isAuthProbe(error.config?.url)) {
        clearSessionHint();
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
