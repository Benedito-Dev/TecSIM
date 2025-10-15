import api from '../../api/api'; // Importa a instância configurada do axios

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
  },
  
  multiRemove: (keys) => {
    try {
      keys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Erro ao remover múltiplos itens do localStorage:', error);
    }
  }
};

export const login = async (email, senha, tipo = 'paciente') => {
  try {
    const response = await api.post('/auth/login', { 
      email, 
      senha, 
      tipo 
    });
    
    // Usando localStorage em vez de AsyncStorage
    storage.setItem('@Auth:token', response.data.token);
    storage.setItem('@Auth:user', JSON.stringify(response.data.usuario));
    storage.setItem('@Auth:userType', response.data.usuario.tipo); // Salva o tipo separadamente
    
    return response.data;
  } catch (error) {
    let errorMessage = 'Erro ao fazer login';
    let cooldown = 0;

    if (error.response) {
      errorMessage = error.response.data?.message || errorMessage;
      cooldown = error.response.data?.cooldown || 0;
    } else if (error.request) {
      errorMessage = 'Sem resposta do servidor';
    } else {
      errorMessage = error.message || errorMessage;
    }

    // Lança um objeto com mensagem e cooldown
    const err = new Error(errorMessage);
    err.cooldown = cooldown;
    throw err;
  }
};

export const getCurrentUser = () => { // Removido async pois é síncrono
  try {
    const user = storage.getItem('@Auth:user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Erro ao recuperar usuário:', error);
    return null;
  }
};

export const getCurrentUserType = () => { // Nova função para obter o tipo
  try {
    return storage.getItem('@Auth:userType') || 'paciente';
  } catch (error) {
    console.error('Erro ao recuperar tipo do usuário:', error);
    return 'paciente';
  }
};

export const isAuthenticated = () => { // Removido async pois é síncrono
  try {
    const token = storage.getItem('@Auth:token');
    return !!token;
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error);
    return false;
  }
};

// Nova função para verificar se é enfermeiro
export const isEnfermeiro = () => {
  try {
    const userType = storage.getItem('@Auth:userType');
    return userType === 'enfermeiro';
  } catch (error) {
    console.error('Erro ao verificar tipo de usuário:', error);
    return false;
  }
};

// Nova função para verificar se é paciente
export const isPaciente = () => {
  try {
    const userType = storage.getItem('@Auth:userType');
    return userType === 'paciente';
  } catch (error) {
    console.error('Erro ao verificar tipo de usuário:', error);
    return false;
  }
};

export const logout = () => { // Removido async pois é síncrono
  try {
    storage.multiRemove(['@Auth:token', '@Auth:user', '@Auth:userType']);
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    throw error;
  }
};

// Opcional: Função para atualizar o token
export const refreshToken = async () => {
  try {
    const response = await api.post('/auth/refresh');
    storage.setItem('@Auth:token', response.data.token);
    return response.data.token;
  } catch (error) {
    logout(); // Removido await pois não é mais async
    throw error;
  }
};

// Funções auxiliares para facilitar o uso
export const authService = {
  // Login
  loginPaciente: (email, senha) => login(email, senha, 'paciente'),
  loginEnfermeiro: (email, senha) => login(email, senha, 'enfermeiro'),
  
  // Getters
  getCurrentUser,
  getCurrentUserType,
  isAuthenticated,
  isEnfermeiro,
  isPaciente,
  
  // Logout
  logout,
  
  // Token
  refreshToken,
  
  // Storage
  storage
};

// Exporta o storage para uso em outros lugares se necessário
export { storage };