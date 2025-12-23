import React, { useState, useEffect, useCallback, useRef } from 'react';
import { checkAPIHealth } from '@/services/aiService';
import { APP_CONFIG } from '../../config/appConfig';

const APIStatus = ({ onStatusChange }) => {
  const [status, setStatus] = useState({ healthy: true, checking: true });

  useEffect(() => {
    let isMounted = true;

    const checkStatus = async () => {
      if (!isMounted) {
        console.warn('[APIStatus] Component unmounted, skipping health check');
        return;
      }

      try {
        console.debug('[APIStatus] Iniciando verificação de saúde da API');
        const health = await checkAPIHealth();
        
        if (!isMounted) {
          console.warn('[APIStatus] Component unmounted after health check');
          return;
        }

        console.info('[APIStatus] API Health Check Result:', { healthy: health.healthy, timestamp: new Date().toISOString() });
        setStatus({ ...health, checking: false });
        
        if (typeof onStatusChange === 'function') {
          onStatusChange(health);
        }
      } catch (error) {
        if (!isMounted) {
          console.warn('[APIStatus] Component unmounted after error');
          return;
        }

        const errorMessage = error?.message || 'Erro ao verificar API';
        const errorStack = error?.stack || 'Stack trace não disponível';
        
        console.error('[APIStatus] Erro ao verificar saúde da API:', {
          message: errorMessage,
          stack: errorStack,
          error: error?.toString(),
          timestamp: new Date().toISOString()
        });
        
        const errorStatus = { 
          healthy: false, 
          checking: false, 
          message: errorMessage,
          error: error?.toString()
        };
        
        setStatus(errorStatus);
        
        if (typeof onStatusChange === 'function') {
          try {
            onStatusChange(errorStatus);
          } catch (callbackError) {
            console.error('[APIStatus] Erro ao executar onStatusChange callback:', callbackError);
          }
        }
      }
    };

    checkStatus();
    
    // Verifica periodicamente
    const interval = setInterval(checkStatus, APP_CONFIG.API.HEALTH_CHECK_INTERVAL);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
      console.debug('[APIStatus] Cleanup: component unmounted');
    };
  }, [onStatusChange]);

  if (status.checking) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-full">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        Verificando API...
      </div>
    );
  }

  if (!status.healthy) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 text-xs bg-red-50 text-red-600 rounded-full">
        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
        API Indisponível
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1 text-xs bg-green-50 text-green-600 rounded-full">
      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
      API Operacional
    </div>
  );
};

export default APIStatus;