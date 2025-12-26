import { useState } from 'react';

export const useAjustesData = () => {
  const [configuracoes, setConfiguracoes] = useState({
    notificacoesEstoque: true,
    alertasVencimento: true,
    somSistema: true,
    autoBackup: true,
    impressaoAutomatica: false,
    modoRapido: true
  });

  const toggleConfig = (key) => {
    setConfiguracoes(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return {
    configuracoes,
    toggleConfig
  };
};