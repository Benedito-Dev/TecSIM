// src/contexts/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { getCurrentUser, isAuthenticated } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      try {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
          return;
        }

        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Erro:', error);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoad();
  }, [navigation]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}