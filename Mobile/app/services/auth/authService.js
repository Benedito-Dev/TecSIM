import api from '../../api/api'; // Importa a instância configurada do axios
import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = async (email, senha) => {
  try {
    const response = await api.post('/auth/login', { email, senha });
    
    await AsyncStorage.setItem('@Auth:token', response.data.token);
    await AsyncStorage.setItem('@Auth:user', JSON.stringify(response.data.usuario));
    
    return response.data;
  } catch (error) {
    let errorMessage = 'Erro ao fazer login';
    let cooldown = 0;
    console.log(cooldown);

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

export const resetPassword = async (email, novaSenha) => {
  try {
    const response = await api.patch('/pacientes/esqueci-senha', { email, novaSenha });
    return response.data;
  } catch (error) {
    let errorMessage = 'Erro ao redefinir senha';

    if (error.response) {
      errorMessage = error.response.data?.error || errorMessage;
    } else if (error.request) {
      errorMessage = 'Sem resposta do servidor';
    } else {
      errorMessage = error.message || errorMessage;
    }

    throw new Error(errorMessage);
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