import React from 'react';
import { useTheme } from '../../../context/ThemeContext';

export const ClientsStats = ({ clientes }) => {
  const { theme } = useTheme();

  const stats = [
    {
      value: clientes.length,
      label: 'Total de Clientes',
      color: theme.primary
    },
    {
      value: clientes.filter(c => c.status === 'ativo').length,
      label: 'Clientes Ativos',
      color: theme.success
    },
    {
      value: clientes.filter(c => c.alergias.length > 0).length,
      label: 'Com Alergias',
      color: theme.warning
    },
    {
      value: clientes.filter(c => c.condicoesCronicas?.length > 0).length,
      label: 'Com Patologias',
      color: theme.info
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className="p-4 rounded-xl border"
          style={{
            background: theme.backgroundCard,
            borderColor: theme.border
          }}
        >
          <div 
            className="text-2xl font-bold"
            style={{ color: stat.color }}
          >
            {stat.value}
          </div>
          <div 
            className="text-sm"
            style={{ color: theme.textSecondary }}
          >
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};