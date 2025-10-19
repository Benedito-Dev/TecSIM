import api, { storage } from '../api/api';

// 🟡 [POST] Login do farmacêutico
export const login = async (email, senha) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      senha
    });

    const { token, user } = response.data;

    // Salva token e dados do usuário no localStorage
    storage.setItem('@FarmaChat:token', token);
    storage.setItem('@FarmaChat:user', JSON.stringify(user));

    return response.data;
  } catch (error) {
    console.error('Erro ao fazer login:', error.message);
    throw error;
  }
};

// 🔴 [POST] Logout
export const logout = async () => {
  try {
    // Remove dados do localStorage
    storage.removeItem('@FarmaChat:token');
    storage.removeItem('@FarmaChat:user');

    // Opcional: chamar endpoint de logout no backend
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Erro ao fazer logout:', error.message);
    // Mesmo com erro, remove os dados locais
    storage.removeItem('@FarmaChat:token');
    storage.removeItem('@FarmaChat:user');
  }
};

// 🟢 [GET] Verifica se o usuário está autenticado
export const isAuthenticated = () => {
  const token = storage.getItem('@FarmaChat:token');
  return !!token;
};

// 🟢 [GET] Obtém dados do usuário logado
export const getCurrentUser = () => {
  try {
    const userData = storage.getItem('@FarmaChat:user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Erro ao obter dados do usuário:', error);
    return null;
  }
};