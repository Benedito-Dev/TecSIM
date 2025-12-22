import axios from 'axios';
import SecureTokenStorage from '../utils/SecureTokenStorage';

const IP_HOST = import.meta.env.VITE_IP_HOST || 'localhost';
const secureStorage = new SecureTokenStorage();

const API_URL = `http://${IP_HOST}:3000`;

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token às requisições
api.interceptors.request.use((config) => {
  const token = secureStorage.getSecureItem('token') || 
                sessionStorage.getItem('tempToken');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('Token expirado, será renovado pelo useAuth');
    }
    return Promise.reject(error);
  }
);

export default api;
export { API_URL };