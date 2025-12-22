import api from '../../api/api'; // Importa a instância configurada do axios
import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = async (email, senha, tipo = 'paciente') => {
  try {
    const response = await api.post('/auth/login', { email, senha, tipo });
    
    // Salva ambos os tokens
    await AsyncStorage.setItem('@Auth:token', response.data.token);
    await AsyncStorage.setItem('@Auth:refreshToken', response.data.refreshToken);
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

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem('@Auth:token');
  } catch (error) {
    console.error('Erro ao recuperar token:', error);
    return null;
  }
};

export const getRefreshToken = async () => {
  try {
    return await AsyncStorage.getItem('@Auth:refreshToken');
  } catch (error) {
    console.error('Erro ao recuperar refresh token:', error);
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
    const refreshToken = await getRefreshToken();
    
    // Revoga o refresh token no servidor
    if (refreshToken) {
      try {
        await api.post('/auth/revoke', { refreshToken });
      } catch (error) {
        console.error('Erro ao revogar token:', error);
      }
    }
    
    // Remove tokens locais
    await AsyncStorage.multiRemove(['@Auth:token', '@Auth:refreshToken', '@Auth:user']);
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

// Função para renovar o access token
export const refreshAccessToken = async () => {
  try {
    const refreshToken = await getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('Refresh token não encontrado');
    }
    
    const response = await api.post('/auth/refresh', { refreshToken });
    
    // Salva os novos tokens
    await AsyncStorage.setItem('@Auth:token', response.data.accessToken);
    await AsyncStorage.setItem('@Auth:refreshToken', response.data.refreshToken);
    
    return response.data.accessToken;
  } catch (error) {
    console.error('Erro ao renovar token:', error);
    await logout();
    throw error;
  }
};

// Função para fazer requisições autenticadas com refresh automático
export const authenticatedRequest = async (requestConfig) => {
  try {
    const token = await getToken();
    
    if (!token) {
      throw new Error('Token não encontrado');
    }
    
    // Adiciona o token ao header
    const config = {
      ...requestConfig,
      headers: {
        ...requestConfig.headers,
        'Authorization': `Bearer ${token}`,
      },
    };
    
    let response = await api(config);
    return response;
    
  } catch (error) {
    // Se o token expirou (401), tenta renovar
    if (error.response?.status === 401) {
      try {
        const newToken = await refreshAccessToken();
        
        // Refaz a requisição com o novo token
        const config = {
          ...requestConfig,
          headers: {
            ...requestConfig.headers,
            'Authorization': `Bearer ${newToken}`,
          },
        };
        
        return await api(config);
      } catch (refreshError) {
        console.error('Erro ao renovar token:', refreshError);
        throw refreshError;
      }
    }
    
    throw error;
  }
};

// Função para verificar se o usuário está autenticado (com refresh automático)
export const checkAuthStatus = async () => {
  try {
    const token = await getToken();
    
    if (!token) {
      return false;
    }
    
    // Tenta fazer uma requisição para verificar o token
    const response = await authenticatedRequest({
      method: 'GET',
      url: '/auth/me',
    });
    
    // Atualiza os dados do usuário
    await AsyncStorage.setItem('@Auth:user', JSON.stringify(response.data));
    
    return true;
  } catch (error) {
    console.error('Erro ao verificar status de auth:', error);
    return false;
  }
};