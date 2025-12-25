import React from 'react';
import { Activity, Stethoscope, Calendar } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

const ActivityStats = () => {
  const { theme } = useTheme();

  const stats = [
    {
      icon: Activity,
      label: 'Plantões Realizados',
      value: '24',
      color: theme.warning,
      bgColor: theme.warning + '20'
    },
    {
      icon: Stethoscope,
      label: 'Pacientes Atendidos',
      value: '156',
      color: theme.info,
      bgColor: theme.info + '20'
    },
    {
      icon: Calendar,
      label: 'Dias Trabalhados',
      value: '45',
      color: theme.success,
      bgColor: theme.success + '20'
    }
  ];

  return (
    <div 
      className="mt-8 pt-6 border-t"
      style={{ borderColor: theme.border }}
    >
      <h3 
        className="text-lg font-semibold mb-4"
        style={{ color: theme.textPrimary }}
      >
        Atividade Recente
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div 
              key={index}
              className="p-4 rounded-lg border"
              style={{
                background: stat.bgColor,
                borderColor: stat.color,
                color: theme.textPrimary
              }}
            >
              <div className="flex items-center gap-3">
                <IconComponent size={24} style={{ color: stat.color }} />
                <div>
                  <p 
                    className="text-sm"
                    style={{ color: stat.color }}
                  >
                    {stat.label}
                  </p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityStats;