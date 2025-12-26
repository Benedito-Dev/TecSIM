import React from 'react';
import { User, Clock, Award } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

const ProfessionalBadges = ({ farmaceutico }) => {
  const { theme } = useTheme();

  const badges = [
    {
      icon: User,
      label: 'Registro CRF',
      value: farmaceutico.registro_crf,
      color: theme.primary,
      bgColor: theme.primaryLight + '20'
    },
    {
      icon: Clock,
      label: 'Turno de Trabalho',
      value: farmaceutico.turno || 'Noite',
      color: theme.success,
      bgColor: theme.success + '20'
    },
    {
      icon: Award,
      label: 'Especialidade',
      value: farmaceutico.especialidade,
      color: theme.info,
      bgColor: theme.info + '20'
    }
  ];

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      {badges.map((badge, index) => {
        const IconComponent = badge.icon;
        return (
          <div 
            key={index}
            className="p-5 rounded-xl border"
            style={{
              background: badge.bgColor,
              borderColor: badge.color,
              color: theme.textPrimary
            }}
          >
            <p 
              className="text-sm mb-2 font-medium"
              style={{ color: badge.color }}
            >
              {badge.label}
            </p>
            <p className="font-semibold flex items-center gap-2 text-lg">
              <IconComponent size={20} style={{ color: badge.color }} /> 
              {badge.value}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default ProfessionalBadges;