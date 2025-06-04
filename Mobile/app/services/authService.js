import api from './api'; // Importa a instância configurada do axios
import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = async (email, senha) => {
  try {
    console.log('Tentando login em:', api.defaults.baseURL); // Log da URL
    const response = await api.post('/auth/login', { email, senha });
    
    // Armazena o token e os dados do usuário
    await AsyncStorage.setItem('@Auth:token', response.data.token);
    await AsyncStorage.setItem('@Auth:user', JSON.stringify(response.data.usuario));
    
    return response.data;
  } catch (error) {
    console.error('Detalhes do erro:', {
      message: error.message,
      code: error.code,
      config: error.config, // Mostra a configuração da requisição
      stack: error.stack
    });
    // Tratamento de erro mais robusto
    let errorMessage = 'Erro ao fazer login';
    
    if (error.response) {
      // Erro retornado pelo servidor
      errorMessage = error.response.data?.message || errorMessage;
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      errorMessage = 'Sem resposta do servidor';
    } else {
      // Erro ao configurar a requisição
      errorMessage = error.message || errorMessage;
    }
    
    throw new Error(errorMessage);
  }
};

export const register = async (nome, email, senha, data_nascimento, peso_kg, aceite_termos) => {
  try {
    const response = await api.post('/usuarios', { nome, email, senha, data_nascimento, peso_kg, aceite_termos });
    mensagem = response.data.message

    // Cadastro bem-sucedido, retorna mensagem
    return mensagem;
  } catch (error) {
    // Exibe erro no console (opcional)
    // Captura a mensagem específica vinda do backend
    const mensagem = response?.data?.message || 'Erro ao registrar usuário. Verifique os dados e tente novamente.';

    // Lança o erro para ser tratado no componente
    throw new Error(mensagem);
  }
};

export const getCurrentUser = async () => {
  try {
    const user = await AsyncStorage.getItem('@Auth:user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Erro ao recuperar usuário:', error);
    return null;
  }
};

export const isAuthenticated = async () => {
  try {
    const token = await AsyncStorage.getItem('@Auth:token');
    return !!token;
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error);
    return false;
  }
};

export const logout = async () => {
  try {
    await AsyncStorage.multiRemove(['@Auth:token', '@Auth:user']);
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    throw error;
  }
};

// Opcional: Função para atualizar o token
export const refreshToken = async () => {
  try {
    const response = await api.post('/auth/refresh');
    await AsyncStorage.setItem('@Auth:token', response.data.token);
    return response.data.token;
  } catch (error) {
    await logout();
    throw error;
  }
};