// src/contexts/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, isAuthenticated } from '../services/auth/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      try {
        const authenticated = await isAuthenticated();
        if (authenticated) {
          const userData = await getCurrentUser();
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

  const login = async () => {
    const userData = await getCurrentUser();
    setUser(userData);
  };

  const Logout = async () => {
    await AsyncStorage.removeItem('@Auth:user'); // 👈 Correção aqui também
    setUser(null);
  };

  
  const atualizarUsuario = async (novosDados) => {
    const usuarioAtualizado = { ...user, ...novosDados };
    setUser(usuarioAtualizado);
    await AsyncStorage.setItem('@Auth:user', JSON.stringify(usuarioAtualizado));
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, login, Logout, atualizarUsuario }}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ Aqui está a função que faltava
export function useAuth() {
  return useContext(AuthContext);
}
