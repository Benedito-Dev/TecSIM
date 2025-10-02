import axios from 'axios';
import { IP_HOST } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Para desenvolvimento com backend local
const API_URL = `http://10.0.30.137:3000`; // Utilizar IP da Maquina ao inves de localhost

// Para Android emulador, use:
// const API_URL = 'http://10.0.2.2:3000';

// Para iOS simulador ou dispositivo físico, use seu IP local:
// const API_URL = 'http://192.168.x.x:3000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token às requisições
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@Auth:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token inválido - faz logout
      await AsyncStorage.removeItem('@Auth:token');
      await AsyncStorage.removeItem('@Auth:user');
      // Você pode redirecionar para a tela de login aqui
    }
    return Promise.reject(error);
  }
);

export default api;