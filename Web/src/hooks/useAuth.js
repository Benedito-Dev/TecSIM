import { useState, useCallback, useEffect } from 'react';
import { API_URL } from '../api/api';
import SecureTokenStorage from '../utils/SecureTokenStorage';

const secureStorage = new SecureTokenStorage();

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState(null);

  // Gera ID único da sessão para rastreamento
  const generateSessionId = () => {
    return crypto.getRandomValues(new Uint32Array(4)).join('-');
  };

  // Validação adicional de segurança
  const validateSession = useCallback(() => {
    const storedSession = secureStorage.getSecureItem('sessionId');
    const currentSession = sessionId;
    
    if (storedSession && currentSession && storedSession !== currentSession) {
      // Possível session hijacking
      console.warn('Sessão inválida detectada');
      logout();
      return false;
    }
    return true;
  }, [sessionId]);

  const checkAuth = useCallback(async () => {
    if (!validateSession()) return false;
    
    const token = secureStorage.getSecureItem('token') || 
                  sessionStorage.getItem('tempToken');
    const refreshToken = secureStorage.getSecureItem('refreshToken') || 
                        sessionStorage.getItem('tempRefreshToken');

    if (!token) {
      setLoading(false);
      return false;
    }

    try {
      console.log('🔍 Verificando autenticação...');
      const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Session-ID': sessionId || 'unknown'
        },
      });

      if (response.ok) {
        const userData = await response.json();
        // Backend já não envia dados sensíveis
        console.log('✅ Usuário autenticado:', userData.nome);
        setUser(userData);
        setIsAuthenticated(true);
        setLoading(false);
        return true;
      }

      if (response.status === 401) {
        console.log('🔄 Token expirado');
        // Só tenta renovar se tiver refresh token E for sessão persistente
        if (refreshToken && secureStorage.getSecureItem('sessionId')) {
          console.log('🔄 Tentando renovar token...');
          return await refreshAccessToken();
        } else {
          console.log('❌ Sessão temporária expirada ou sem refresh token');
          logout();
          return false;
        }
      }

      throw new Error('Token inválido');
    } catch (error) {
      console.error('Erro na verificação de auth:', error);
      logout();
      return false;
    }
  }, [sessionId, validateSession]);

  const refreshAccessToken = useCallback(async () => {
    const refreshToken = secureStorage.getSecureItem('refreshToken');
    
    // Só renova se for sessão persistente (lembrar-me)
    if (!refreshToken || !secureStorage.getSecureItem('sessionId')) {
      console.log('❌ Não é possível renovar: sessão temporária');
      logout();
      return false;
    }

    try {
      console.log('🔄 Renovando access token...');
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': sessionId || 'unknown'
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Refresh token inválido');
      }

      const data = await response.json();
      
      // Salva os novos tokens na sessão persistente
      secureStorage.setSecureItem('token', data.accessToken);
      secureStorage.setSecureItem('refreshToken', data.refreshToken);

      console.log('✅ Tokens renovados com sucesso');
      return await checkAuth();
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      logout();
      return false;
    }
  }, [sessionId, checkAuth]);

  // Login com proteções de segurança
  const login = useCallback(async (email, senha, tipo = 'paciente', rememberMe = false) => {
    setLoading(true);
    
    try {
      const newSessionId = generateSessionId();
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': newSessionId
        },
        body: JSON.stringify({ email, senha, tipo }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro no login');
      }

      // Salva tokens de forma segura apenas se "lembrar-me" estiver ativo
      if (rememberMe) {
        secureStorage.setSecureItem('token', data.token);
        secureStorage.setSecureItem('refreshToken', data.refreshToken);
        secureStorage.setSecureItem('sessionId', newSessionId);
      } else {
        // Sessão temporária (apenas access token na memória)
        sessionStorage.setItem('tempToken', data.token);
        // NÃO salva refresh token para sessões temporárias
      }
      
      setSessionId(newSessionId);
      // Backend já não envia dados sensíveis
      setUser(data.usuario);
      setIsAuthenticated(true);
      
      return data;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout seguro
  const logout = useCallback(async () => {
    const refreshToken = secureStorage.getSecureItem('refreshToken');
    
    // Revoga o refresh token no servidor (apenas se for sessão persistente)
    if (refreshToken) {
      try {
        await fetch(`${API_URL}/auth/revoke`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Session-ID': sessionId || 'unknown'
          },
          body: JSON.stringify({ refreshToken }),
        });
      } catch (error) {
        console.error('Erro ao revogar token:', error);
      }
    }

    // Limpa todos os dados de forma segura
    secureStorage.clearAll();
    sessionStorage.clear();
    
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);
    setSessionId(null);
    
    console.log('✅ Logout realizado com sucesso');
  }, [sessionId]);

  // Interceptor para requisições automáticas
  const authenticatedFetch = useCallback(async (url, options = {}) => {
    if (!validateSession()) {
      throw new Error('Sessão inválida');
    }
    
    const token = secureStorage.getSecureItem('token') || 
                  sessionStorage.getItem('tempToken');
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': sessionId || 'unknown',
        ...options.headers,
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    };

    let response = await fetch(url, config);

    // Se token expirou, tenta renovar e refaz a requisição
    if (response.status === 401 && token) {
      const refreshed = await refreshAccessToken();
      
      if (refreshed) {
        const newToken = secureStorage.getSecureItem('token') || 
                        sessionStorage.getItem('tempToken');
        config.headers['Authorization'] = `Bearer ${newToken}`;
        response = await fetch(url, config);
      }
    }

    return response;
  }, [sessionId, validateSession, refreshAccessToken]);

  // Verifica auth na inicialização
  useEffect(() => {
    const initSession = async () => {
      const storedSessionId = secureStorage.getSecureItem('sessionId');
      if (storedSessionId) {
        setSessionId(storedSessionId);
      }
      await checkAuth();
    };
    
    initSession();
  }, []);

  // Cleanup automático em caso de inatividade (30 minutos)
  useEffect(() => {
    let inactivityTimer;
    
    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        console.log('Sessão expirada por inatividade');
        logout();
      }, 30 * 60 * 1000); // 30 minutos
    };
    
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    if (isAuthenticated) {
      events.forEach(event => {
        document.addEventListener(event, resetTimer, true);
      });
      resetTimer();
    }
    
    return () => {
      clearTimeout(inactivityTimer);
      events.forEach(event => {
        document.removeEventListener(event, resetTimer, true);
      });
    };
  }, [isAuthenticated, logout]);

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    refreshAccessToken,
    authenticatedFetch,
    checkAuth
  };
};