import React from 'react';
import { TrendingUp, Target, Clock, Users } from 'lucide-react';

const MetricasContinuidade = () => {
  const metricas = {
    protocolosCompletados: 87,
    adesaoMedicamentosa: 92,
    tempoMedioConsultas: 12,
    satisfacaoPaciente: 94,
    reducaoAbandonos: 34,
    economiaGerada: 2100000
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-white" />
          <h2 className="text-lg font-semibold text-white">Métricas de Continuidade do Cuidado</h2>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Métricas Principais */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 mb-4">Indicadores de Efetividade</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">Protocolos Completados</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600 text-lg">{metricas.protocolosCompletados}%</div>
                  <div className="text-xs text-green-500">↑ 12% vs mês anterior</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-700">Adesão Medicamentosa</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-blue-600 text-lg">{metricas.adesaoMedicamentosa}%</div>
                  <div className="text-xs text-blue-500">↑ 8% vs média nacional</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-700">Tempo Médio Entre Consultas</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-purple-600 text-lg">{metricas.tempoMedioConsultas} dias</div>
                  <div className="text-xs text-purple-500">Meta: ≤ 15 dias</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Impacto Social */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 mb-4">Impacto Social</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-orange-600" />
                  <span className="text-sm text-gray-700">Satisfação do Paciente</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-orange-600 text-lg">{metricas.satisfacaoPaciente}%</div>
                  <div className="text-xs text-orange-500">NPS: +78</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-gray-700">Redução de Abandonos</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-red-600 text-lg">{metricas.reducaoAbandonos}%</div>
                  <div className="text-xs text-red-500">vs. tratamento tradicional</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">Economia Gerada (SUS)</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600 text-lg">
                    R$ {(metricas.economiaGerada / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-xs text-green-500">últimos 12 meses</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Gráfico de Evolução */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-3">Evolução da Continuidade (últimos 6 meses)</h4>
          <div className="flex justify-between items-end h-20">
            {['Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'].map((mes, index) => {
              const altura = Math.max(20, 60 + (index * 8) + Math.random() * 10);
              return (
                <div key={mes} className="flex flex-col items-center">
                  <div 
                    className="w-8 bg-gradient-to-t from-green-500 to-green-400 rounded-t" 
                    style={{height: `${altura}px`}}
                  ></div>
                  <span className="text-xs text-gray-600 mt-1">{mes}</span>
                </div>
              );
            })}
          </div>
          <div className="text-center text-xs text-gray-500 mt-2">
            Tendência crescente de 15% na continuidade dos protocolos
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricasContinuidade;