import React, { useMemo } from 'react';
import { BarChart3, Droplets, Heart, Activity, Calendar, TrendingUp } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export const GraficosAcompanhamento = ({ tipoGrafico, paciente }) => {
  const { theme } = useTheme();

  // Valores fixos que não mudam com re-renders
  const dadosFixos = useMemo(() => ({
    acompanhamento: {
      trimestre: Math.floor(Math.random() * 3) + 3,
      ano: Math.floor(Math.random() * 8) + 8,
      comparecimento: Math.floor(Math.random() * 10) + 90
    },
    glicemia: {
      valores: Array.from({length: 6}, () => Math.max(15, 60 - Math.random() * 45)),
      atual: Math.floor(Math.random() * 30) + 85,
      meta: '<100 mg/dL'
    },
    pressao: {
      valores: Array.from({length: 6}, () => Math.max(15, 50 - Math.random() * 35)),
      sistolica: Math.floor(Math.random() * 30) + 120,
      diastolica: Math.floor(Math.random() * 20) + 75,
      meta: '<140/90 mmHg'
    },
    indicadoresGerais: {
      peso: Math.random() > 0.3 ? 'Normal' : 'Atenção',
      sono: Math.random() > 0.2 ? 'Bom' : 'Regular',
      exercicio: Math.random() > 0.4 ? 'Ativo' : 'Sedentário'
    },
    tendencia: Array.from({length: 12}, (_, i) => 
      Math.max(8, 20 + Math.sin(i * 0.5) * 8 + Math.random() * 6)
    )
  }), [paciente?.id]); // Só recalcula se mudar o paciente

  const GraficoGlicemia = () => (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Droplets className="w-4 h-4" style={{ color: theme.primary }} />
        <h3 className="font-semibold" style={{ color: theme.textPrimary }}>
          Glicemia (últimos 6 meses)
        </h3>
      </div>
      <div className="rounded-lg p-4" style={{ background: theme.backgroundSecondary }}>
        <div className="flex justify-between items-end h-20 mb-2">
          {['Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'].map((mes, index) => {
            const altura = dadosFixos.glicemia.valores[index];
            const cor = altura > 40 ? 'bg-red-400' : altura > 25 ? 'bg-yellow-400' : 'bg-green-400';
            return (
              <div key={mes} className="flex flex-col items-center">
                <div className={`w-6 ${cor} rounded-t`} style={{height: `${altura}px`}}></div>
                <span className="text-xs mt-1" style={{ color: theme.textSecondary }}>
                  {mes}
                </span>
              </div>
            );
          })}
        </div>
        <div className="text-xs text-center" style={{ color: theme.textSecondary }}>
          Atual: {dadosFixos.glicemia.atual} mg/dL • Meta: {dadosFixos.glicemia.meta}
        </div>
      </div>
    </div>
  );

  const GraficoPressao = () => (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Heart className="w-4 h-4" style={{ color: theme.error }} />
        <h3 className="font-semibold" style={{ color: theme.textPrimary }}>
          Pressão Arterial (últimos 6 meses)
        </h3>
      </div>
      <div className="rounded-lg p-4" style={{ background: theme.backgroundSecondary }}>
        <div className="flex justify-between items-end h-20 mb-2">
          {['Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'].map((mes, index) => {
            const altura = dadosFixos.pressao.valores[index];
            const cor = altura > 35 ? 'bg-red-400' : altura > 25 ? 'bg-yellow-400' : 'bg-green-400';
            return (
              <div key={mes} className="flex flex-col items-center">
                <div className={`w-6 ${cor} rounded-t`} style={{height: `${altura}px`}}></div>
                <span className="text-xs mt-1" style={{ color: theme.textSecondary }}>
                  {mes}
                </span>
              </div>
            );
          })}
        </div>
        <div className="text-xs text-center" style={{ color: theme.textSecondary }}>
          Atual: {dadosFixos.pressao.sistolica}/{dadosFixos.pressao.diastolica} mmHg • Meta: {dadosFixos.pressao.meta}
        </div>
      </div>
    </div>
  );

  const GraficosAmbos = () => (
    <div className="mb-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-1 mb-2">
            <Heart className="w-3 h-3" style={{ color: theme.error }} />
            <h4 className="text-sm font-semibold" style={{ color: theme.textPrimary }}>
              Pressão Arterial
            </h4>
          </div>
          <div className="rounded-lg p-3" style={{ background: theme.backgroundSecondary }}>
            <div className="flex justify-between items-end h-12 mb-1">
              {[30, 22, 15, 12].map((altura, index) => {
                const cor = altura > 25 ? 'bg-red-400' : altura > 18 ? 'bg-yellow-400' : 'bg-green-400';
                return (
                  <div key={index} className={`w-3 ${cor} rounded-t`} style={{height: `${altura}px`}}></div>
                );
              })}
            </div>
            <div className="text-xs text-center" style={{ color: theme.textSecondary }}>
              {dadosFixos.pressao.sistolica}/{dadosFixos.pressao.diastolica}
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1 mb-2">
            <Droplets className="w-3 h-3" style={{ color: theme.primary }} />
            <h4 className="text-sm font-semibold" style={{ color: theme.textPrimary }}>
              Glicemia
            </h4>
          </div>
          <div className="rounded-lg p-3" style={{ background: theme.backgroundSecondary }}>
            <div className="flex justify-between items-end h-12 mb-1">
              {[35, 25, 18, 15].map((altura, index) => {
                const cor = altura > 30 ? 'bg-red-400' : altura > 20 ? 'bg-yellow-400' : 'bg-green-400';
                return (
                  <div key={index} className={`w-3 ${cor} rounded-t`} style={{height: `${altura}px`}}></div>
                );
              })}
            </div>
            <div className="text-xs text-center" style={{ color: theme.textSecondary }}>
              {dadosFixos.glicemia.atual} mg/dL
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const GraficosGerais = () => (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="w-4 h-4" style={{ color: theme.success }} />
        <h3 className="font-semibold" style={{ color: theme.textPrimary }}>
          Indicadores Gerais de Saúde
        </h3>
      </div>
      <div className="rounded-lg p-4" style={{ background: theme.backgroundSecondary }}>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className={`text-lg font-bold ${
              dadosFixos.indicadoresGerais.peso === 'Normal' ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {dadosFixos.indicadoresGerais.peso}
            </div>
            <div className="text-xs" style={{ color: theme.textSecondary }}>Peso</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-bold ${
              dadosFixos.indicadoresGerais.sono === 'Bom' ? 'text-blue-600' : 'text-orange-600'
            }`}>
              {dadosFixos.indicadoresGerais.sono}
            </div>
            <div className="text-xs" style={{ color: theme.textSecondary }}>Sono</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-bold ${
              dadosFixos.indicadoresGerais.exercicio === 'Ativo' ? 'text-green-600' : 'text-red-600'
            }`}>
              {dadosFixos.indicadoresGerais.exercicio}
            </div>
            <div className="text-xs" style={{ color: theme.textSecondary }}>Exercício</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGraficoEspecifico = () => {
    switch (tipoGrafico) {
      case 'diabetes':
        return <GraficoGlicemia />;
      case 'hipertensao':
        return <GraficoPressao />;
      case 'ambos':
        return <GraficosAmbos />;
      default:
        return <GraficosGerais />;
    }
  };

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
        style={{ background: theme.warning }}
      >
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Acompanhamento Clínico
        </h2>
      </div>
      <div className="p-6">
        {renderGraficoEspecifico()}

        {/* Frequência de Consultas */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4" style={{ color: theme.info }} />
            <h3 className="font-semibold" style={{ color: theme.textPrimary }}>
              Frequência de Consultas
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="rounded-lg p-3 text-center" style={{ background: theme.info + '20' }}>
              <div className="text-lg font-bold" style={{ color: theme.info }}>
                {dadosFixos.acompanhamento.trimestre}
              </div>
              <div className="text-xs" style={{ color: theme.info }}>
                Último Trimestre
              </div>
            </div>
            <div className="rounded-lg p-3 text-center" style={{ background: theme.success + '20' }}>
              <div className="text-lg font-bold" style={{ color: theme.success }}>
                {dadosFixos.acompanhamento.ano}
              </div>
              <div className="text-xs" style={{ color: theme.success }}>
                Último Ano
              </div>
            </div>
            <div className="rounded-lg p-3 text-center" style={{ background: theme.primary + '20' }}>
              <div className="text-lg font-bold" style={{ color: theme.primary }}>
                {dadosFixos.acompanhamento.comparecimento}%
              </div>
              <div className="text-xs" style={{ color: theme.primary }}>
                Comparecimento
              </div>
            </div>
          </div>
          
          {/* Mini Gráfico de Tendência */}
          <div className="rounded-lg p-3" style={{ background: theme.backgroundSecondary }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium" style={{ color: theme.textSecondary }}>
                Tendência (12 meses)
              </span>
              <TrendingUp className="w-3 h-3" style={{ color: theme.success }} />
            </div>
            <div className="flex justify-between items-end h-8">
              {dadosFixos.tendencia.map((altura, i) => (
                <div key={i} className="w-1 rounded-t" style={{
                  height: `${altura}px`,
                  background: theme.info
                }}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};