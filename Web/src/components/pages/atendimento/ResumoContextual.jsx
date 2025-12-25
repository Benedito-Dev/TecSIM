import React from 'react';
import { Target } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export const ResumoContextual = ({ resumoContextual }) => {
  const { theme } = useTheme();

  const InfoSection = ({ title, content, color }) => (
    <div 
      className="border rounded-lg p-4"
      style={{
        background: color + '20',
        borderColor: color
      }}
    >
      <h3 className="font-semibold mb-2" style={{ color }}>
        {title}
      </h3>
      <p className="text-sm" style={{ color: theme.textPrimary }}>
        {content}
      </p>
    </div>
  );

  return (
    <div 
      className="rounded-xl shadow-lg border overflow-hidden"
      style={{
        background: theme.backgroundCard,
        borderColor: theme.border
      }}
    >
      <div 
        className="px-6 py-4"
        style={{ background: theme.info }}
      >
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Target className="w-5 h-5" />
          Resumo Contextual IA
        </h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          <InfoSection 
            title="Perfil do Paciente"
            content={resumoContextual.perfil}
            color={theme.info}
          />
          
          <InfoSection 
            title="Padrão de Atendimentos"
            content={resumoContextual.padrao}
            color={theme.primary}
          />
          
          <div 
            className="border rounded-lg p-4"
            style={{
              background: theme.success + '20',
              borderColor: theme.success
            }}
          >
            <h3 className="font-semibold mb-2" style={{ color: theme.success }}>
              Indicadores de Saúde
            </h3>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="text-center">
                <div className="text-lg font-bold" style={{ color: theme.success }}>
                  {resumoContextual.indicadores.adesao}%
                </div>
                <div className="text-xs" style={{ color: theme.textSecondary }}>
                  Adesão Medicamentosa
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold" style={{ color: theme.primary }}>
                  {resumoContextual.indicadores.condicao}
                </div>
                <div className="text-xs" style={{ color: theme.textSecondary }}>
                  Condição Geral
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};