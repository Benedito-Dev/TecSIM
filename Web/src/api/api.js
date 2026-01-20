import axios from 'axios';

// Configuração da API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://tecsim.vercel.app';
const REQUEST_TIMEOUT = 10000;

// Para Android emulador, use:
// const API_BASE_URL = 'http://10.0.2.2:3000';

// Para iOS simulador ou dispositivo físico, use seu IP local:
// const API_BASE_URL = 'http://192.168.x.x:3000';

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
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token às requisições
api.interceptors.request.use(
  (config) => {
    const token = storage.getItem('@Auth:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Adiciona proteção CSRF para requisições que modificam dados
    if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())) {
      // Gera token CSRF se não existir
      let csrfToken = storage.getItem('@CSRF:token');
      if (!csrfToken) {
        csrfToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
        storage.setItem('@CSRF:token', csrfToken);
      }
      config.headers['X-CSRF-Token'] = csrfToken;
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log do erro para monitoramento
    console.error('API Error:', {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url,
      method: error.config?.method
    });

    if (error.response?.status === 401) {
      // Token inválido - faz logout
      storage.removeItem('@Auth:token');
      storage.removeItem('@Auth:user');
      storage.removeItem('@CSRF:token');
      
      // Redireciona para a tela de login se estiver no navegador
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } else if (error.response?.status >= 500) {
      // Erro do servidor
      console.error('Server error detected:', error.response.status);
    } else if (error.code === 'NETWORK_ERROR' || !error.response) {
      // Erro de rede
      console.error('Network error detected');
    }
    
    return Promise.reject(error);
  }
);

export default api;
export { storage };