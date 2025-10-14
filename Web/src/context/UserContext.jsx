// src/contexts/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, isAuthenticated, logout } from '../services/auth/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndLoad = () => { // Removido async
      try {
        const authenticated = isAuthenticated(); // Síncrono agora
        if (authenticated) {
          const userData = getCurrentUser(); // Síncrono agora
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoad();
  }, []);

  const login = () => {
    const userData = getCurrentUser(); // Síncrono agora
    setUser(userData);
  };

  const Logout = () => { // Removido async
    try {
      logout(); // Síncrono agora
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const atualizarUsuario = (novosDados) => { // Removido async
    try {
      const usuarioAtualizado = { ...user, ...novosDados };
      setUser(usuarioAtualizado);
      localStorage.setItem('@Auth:user', JSON.stringify(usuarioAtualizado));
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, login, Logout, atualizarUsuario }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar o contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}