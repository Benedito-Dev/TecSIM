import React from 'react';
import { useTheme } from '../../../context/ThemeContext';

const ProfessionalInfo = ({ enfermeiro, formatarData, calcularExperiencia }) => {
  const { theme } = useTheme();

  const infoItems = [
    {
      label: 'Status',
      value: enfermeiro.status,
      color: enfermeiro.status === 'Ativo' ? theme.success : theme.error
    },
    {
      label: 'Especialidade',
      value: enfermeiro.especialidade,
      color: theme.textPrimary
    },
    {
      label: 'Anos de Experiência',
      value: enfermeiro.anos_experiencia || calcularExperiencia(enfermeiro.data_admissao),
      color: theme.textPrimary
    },
    {
      label: 'Última Atualização',
      value: formatarData(enfermeiro.data_atualizacao),
      color: theme.textPrimary
    },
    {
      label: 'Data de Cadastro',
      value: formatarData(enfermeiro.data_cadastro),
      color: theme.textPrimary
    },
    {
      label: 'Conta Ativa',
      value: enfermeiro.ativo ? 'Sim' : 'Não',
      color: enfermeiro.ativo ? theme.success : theme.error
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
        Informações Profissionais
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {infoItems.map((item, index) => (
          <div 
            key={index}
            className="flex justify-between py-2 border-b"
            style={{ 
              borderColor: theme.borderLight,
              color: theme.textSecondary
            }}
          >
            <span>{item.label}</span>
            <span 
              className="font-medium"
              style={{ color: item.color }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfessionalInfo;