import api from '../../api/api'; // Importa a instância configurada do axios
import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = async (email, senha) => {
  try {
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

export const register = async (nome, email, senha, data_nascimento, peso_kg, genero, aceite_termos) => {
  try {
    const response = await api.post('/usuarios', { nome, email, senha, data_nascimento, peso_kg, genero, aceite_termos });
    mensagem = response.data.message

    // Se o status 201 for retornado corretamente
    if (response.status === 201) {
      return { success: true, message: 'Usuário cadastrado com sucesso!' };
    }

    // Se retornar qualquer outro status
    return { success: false, message: 'Erro desconhecido ao cadastrar usuário.' };
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);

    // Se o back-end retornar uma mensagem de erro
    if (error.response && error.response.data?.error) {
      return { success: false, message: error.response.data.error };
    }

    return { success: false, message: 'Erro ao registrar usuário. Verifique os dados e tente novamente.' };
}};

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