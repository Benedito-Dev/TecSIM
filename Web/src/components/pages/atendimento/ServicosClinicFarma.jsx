import React from 'react';
import { Stethoscope, Droplets, Heart, Pill, Calendar, Activity, Target } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export const ServicosClinicFarma = ({ tipoGrafico, resumoContextual }) => {
  const { theme } = useTheme();

  const ServiceCard = ({ icon: Icon, title, color, children }) => (
    <div 
      className="border rounded-lg p-4"
      style={{
        background: color + '20',
        borderColor: color
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-5 h-5" style={{ color }} />
        <h3 className="font-semibold" style={{ color }}>
          {title}
        </h3>
      </div>
      {children}
    </div>
  );

  const ServiceInfo = ({ label, value, color }) => (
    <div className="flex justify-between text-sm">
      <span style={{ color }}>{label}:</span>
      <span className="font-medium" style={{ color: theme.textPrimary }}>
        {value}
      </span>
    </div>
  );

  const ServiceButton = ({ color, children }) => (
    <button 
      className="w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors hover:opacity-80"
      style={{
        background: color + '30',
        color: color
      }}
    >
      {children}
    </button>
  );

  return (
    <div className="mb-8">
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
            <Stethoscope className="w-5 h-5" />
            Serviços ClinicFarma - Acompanhamento de Adesão
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Monitoramento Glicêmico */}
            {(tipoGrafico === 'diabetes' || tipoGrafico === 'ambos') && (
              <ServiceCard icon={Droplets} title="Monitoramento Glicêmico" color={theme.primary}>
                <div className="space-y-2">
                  <ServiceInfo label="Última medição" value="há 3 dias" color={theme.primary} />
                  <ServiceInfo label="Adesão mensal" value="87%" color={theme.primary} />
                  <div className="mt-3">
                    <ServiceButton color={theme.primary}>Agendar Consulta</ServiceButton>
                  </div>
                </div>
              </ServiceCard>
            )}

            {/* Controle Pressórico */}
            {(tipoGrafico === 'hipertensao' || tipoGrafico === 'ambos') && (
              <ServiceCard icon={Heart} title="Controle Pressórico" color={theme.error}>
                <div className="space-y-2">
                  <ServiceInfo label="Última aferição" value="há 5 dias" color={theme.error} />
                  <ServiceInfo label="Meta atingida" value="92%" color={theme.error} />
                  <div className="mt-3">
                    <ServiceButton color={theme.error}>Verificar Pressão</ServiceButton>
                  </div>
                </div>
              </ServiceCard>
            )}

            {/* Adesão Medicamentosa */}
            <ServiceCard icon={Pill} title="Adesão Medicamentosa" color={theme.success}>
              <div className="space-y-2">
                <ServiceInfo label="Doses tomadas" value="28/30" color={theme.success} />
                <ServiceInfo label="Taxa de adesão" value="93%" color={theme.success} />
                <div className="mt-3">
                  <ServiceButton color={theme.success}>Revisar Medicações</ServiceButton>
                </div>
              </div>
            </ServiceCard>

            {/* Consultas Programadas */}
            <ServiceCard icon={Calendar} title="Consultas Programadas" color={theme.info}>
              <div className="space-y-2">
                <ServiceInfo label="Próxima consulta" value="15/02" color={theme.info} />
                <ServiceInfo label="Comparecimento" value="95%" color={theme.info} />
                <div className="mt-3">
                  <ServiceButton color={theme.info}>Reagendar</ServiceButton>
                </div>
              </div>
            </ServiceCard>

            {/* Exames Laboratoriais */}
            <ServiceCard icon={Activity} title="Exames Laboratoriais" color={theme.warning}>
              <div className="space-y-2">
                <ServiceInfo label="Último exame" value="10/01" color={theme.warning} />
                <ServiceInfo label="Próximo" value="10/03" color={theme.warning} />
                <div className="mt-3">
                  <ServiceButton color={theme.warning}>Solicitar Exames</ServiceButton>
                </div>
              </div>
            </ServiceCard>

            {/* Orientação Nutricional */}
            <ServiceCard icon={Target} title="Orientação Nutricional" color={theme.warning}>
              <div className="space-y-2">
                <ServiceInfo label="Última consulta" value="20/01" color={theme.warning} />
                <ServiceInfo label="Adesão dieta" value="78%" color={theme.warning} />
                <div className="mt-3">
                  <ServiceButton color={theme.warning}>Agendar Nutricionista</ServiceButton>
                </div>
              </div>
            </ServiceCard>
          </div>

          {/* Resumo de Adesão Geral */}
          <div 
            className="mt-6 rounded-lg p-4"
            style={{ background: theme.backgroundSecondary }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold" style={{ color: theme.textPrimary }}>
                Resumo de Adesão ao Tratamento
              </h3>
              <span className="text-2xl font-bold" style={{ color: theme.success }}>
                {resumoContextual.indicadores.adesao}%
              </span>
            </div>
            <div 
              className="w-full rounded-full h-3"
              style={{ background: theme.border }}
            >
              <div 
                className="h-3 rounded-full transition-all duration-500"
                style={{
                  background: `linear-gradient(to right, ${theme.success}, ${theme.success}dd)`,
                  width: `${resumoContextual.indicadores.adesao}%`
                }}
              />
            </div>
            <div className="flex justify-between text-xs mt-2">
              <span style={{ color: theme.textSecondary }}>Baixa Adesão</span>
              <span style={{ color: theme.textSecondary }}>Alta Adesão</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};