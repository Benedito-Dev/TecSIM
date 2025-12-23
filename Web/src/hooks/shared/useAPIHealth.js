import { useState, useEffect, useCallback } from 'react';
import { checkAPIHealth } from '@/services/aiService';

const DEFAULT_CHECK_INTERVAL = 300000; // 5 minutos

export const useAPIHealth = (checkInterval = DEFAULT_CHECK_INTERVAL) => {
  const [apiStatus, setApiStatus] = useState({
    healthy: true,
    checking: true,
    message: '',
    lastCheck: null
  });

  const checkHealth = useCallback(async () => {
    try {
      setApiStatus(prev => ({ ...prev, checking: true }));
      const health = await checkAPIHealth();
      
      setApiStatus({
        healthy: health.healthy,
        checking: false,
        message: health.message || '',
        lastCheck: new Date(),
        models: health.models || 0
      });
      
      return health;
    } catch (error) {
      const errorStatus = {
        healthy: false,
        checking: false,
        message: 'Erro ao verificar API',
        lastCheck: new Date()
      };
      
      setApiStatus(errorStatus);
      return errorStatus;
    }
  }, []);

  useEffect(() => {
    // Verificação inicial
    checkHealth();
    
    // Verificação periódica com validação de entrada
    const validatedInterval = typeof checkInterval === 'number' && checkInterval > 0 ? checkInterval : DEFAULT_CHECK_INTERVAL;
    
    if (validatedInterval > 0) {
      const interval = setInterval(checkHealth, validatedInterval);
      return () => clearInterval(interval);
    }
  }, [checkHealth, checkInterval]);

  return {
    apiStatus,
    checkHealth,
    isHealthy: apiStatus.healthy,
    isChecking: apiStatus.checking
  };
};