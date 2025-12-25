import React from 'react';
import { useTheme } from '../../../context/ThemeContext';

const QuickActionsSection = () => {
  const { theme } = useTheme();

  const actions = [
    {
      title: 'Exportar Dados',
      description: 'Backup manual do sistema',
      color: theme.primary,
      bgColor: theme.primaryLight
    },
    {
      title: 'Limpar Cache',
      description: 'Otimizar performance',
      color: theme.success,
      bgColor: theme.success + '20'
    },
    {
      title: 'Testar Conexão',
      description: 'Verificar servidores',
      color: theme.warning,
      bgColor: theme.warning + '20'
    },
    {
      title: 'Relatório do Sistema',
      description: 'Status e métricas',
      color: theme.info,
      bgColor: theme.info + '20'
    }
  ];

  return (
    <div 
      className="rounded-2xl p-6 border"
      style={{
        background: theme.backgroundCard,
        borderColor: theme.border
      }}
    >
      <h2 
        className="text-xl font-bold mb-6"
        style={{ color: theme.textPrimary }}
      >
        Ações Rápidas
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <button 
            key={index}
            className="p-4 rounded-xl hover:opacity-80 transition-colors text-left border"
            style={{
              background: action.bgColor,
              color: action.color,
              borderColor: action.color
            }}
          >
            <div className="font-semibold">{action.title}</div>
            <div className="text-sm opacity-80">{action.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsSection;