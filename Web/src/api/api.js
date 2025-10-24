import axios from 'axios';
const IP_HOST = import.meta.env.IP_HOST;

// Usando variáveis de ambiente do Vite

// Para desenvolvimento com backend local
const API_URL = `http://${IP_HOST}:3000`; // Utilizar IP da Maquina ao inves de localhost

// Para Android emulador, use:
// const API_URL = 'http://10.0.2.2:3000';

// Para iOS simulador ou dispositivo físico, use seu IP local:
// const API_URL = 'http://192.168.x.x:3000';

// Utilitário para localStorage
const storage = {
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
    }
  },
  
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Erro ao ler do localStorage:', error);
      return null;
    }
  },
  
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Erro ao remover do localStorage:', error);
    }
  }
};

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token às requisições
api.interceptors.request.use((config) => {
  const token = storage.getItem('@Auth:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido - faz logout
      storage.removeItem('@Auth:token');
      storage.removeItem('@Auth:user');
      
      // Redireciona para a tela de login se estiver no navegador
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
export { storage };