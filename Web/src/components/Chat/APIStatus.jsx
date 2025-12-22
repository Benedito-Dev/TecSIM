import React, { useState, useEffect } from 'react';
import { checkAPIHealth } from '../../services/aiService';
import { APP_CONFIG } from '../../config/appConfig';

const APIStatus = ({ onStatusChange }) => {
  const [status, setStatus] = useState({ healthy: true, checking: true });

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const health = await checkAPIHealth();
        setStatus({ ...health, checking: false });
        onStatusChange?.(health);
      } catch (error) {
        setStatus({ 
          healthy: false, 
          checking: false, 
          message: 'Erro ao verificar API' 
        });
        onStatusChange?.({ healthy: false, message: 'Erro ao verificar API' });
      }
    };

    checkStatus();
    
    // Verifica periodicamente
    const interval = setInterval(checkStatus, APP_CONFIG.API.HEALTH_CHECK_INTERVAL);
    return () => clearInterval(interval);
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