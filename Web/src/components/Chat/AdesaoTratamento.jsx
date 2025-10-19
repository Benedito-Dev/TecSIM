import React from 'react';
import { Clock, AlertTriangle, CheckCircle, Pill, MapPin } from 'lucide-react';
import { mockAdesaoData, gerarContextoFarmaceutico, calcularDiasUltimaCompra } from '../../data/mockAdesaoData';

const AdesaoTratamento = ({ paciente, onIniciarConversa }) => {
  const contexto = gerarContextoFarmaceutico(paciente.id);
  
  if (!contexto) {
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Pill className="text-blue-600" size={20} />
          Acompanhamento de Adesão
        </h3>
        <p className="text-gray-500">Nenhum histórico de medicação encontrado.</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'regular': return 'bg-green-100 text-green-800 border-green-200';
      case 'irregular': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critico': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiscoColor = (risco) => {
    switch (risco) {
      case 'baixo': return 'text-green-600';
      case 'medio': return 'text-yellow-600';
      case 'alto': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Pill className="text-blue-600" size={20} />
          Acompanhamento de Adesão
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Score:</span>
          <span className={`font-bold text-lg ${getRiscoColor(contexto.risco)}`}>
            {contexto.scoreAdesao}%
          </span>
        </div>
      </div>

      {/* Última Compra */}
      {contexto.ultimaCompra && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={16} className="text-blue-600" />
            <span className="font-medium text-blue-800">Última Compra</span>
          </div>
          <p className="text-sm text-blue-700">
            <strong>{contexto.ultimaCompra.loja}</strong> - {contexto.ultimaCompra.dataCompra}
          </p>
          <p className="text-sm text-blue-700">
            Há {contexto.diasUltimaCompra} dias - Farmacêutico: {contexto.ultimaCompra.farmaceutico}
          </p>
        </div>
      )}

      {/* Medicamentos Ativos */}
      <div className="space-y-3 mb-4">
        <h4 className="font-medium text-gray-800">Medicamentos em Uso:</h4>
        {contexto.medicamentosAtivos.map((med, index) => (
          <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h5 className="font-medium text-gray-800">{med.nome}</h5>
                <p className="text-sm text-gray-600">
                  {med.frequencia} • Última compra: {med.ultimaCompra}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(med.statusAdesao)}`}>
                  {med.statusAdesao}
                </span>
                <div className="flex items-center gap-1">
                  <Clock size={14} className="text-gray-500" />
                  <span className={`text-sm font-medium ${
                    med.diasRestantes > 7 ? 'text-green-600' :
                    med.diasRestantes > 3 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {med.diasRestantes} dias
                  </span>
                </div>
                {med.alertas > 0 && (
                  <div className="flex items-center gap-1">
                    <AlertTriangle size={14} className="text-red-500" />
                    <span className="text-xs text-red-600">{med.alertas} alerta(s)</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sugestão de Abordagem */}
      <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="flex items-start gap-2">
          <AlertTriangle size={16} className="text-yellow-600 mt-0.5" />
          <div>
            <h5 className="font-medium text-yellow-800 mb-1">Sugestão de Abordagem:</h5>
            <p className="text-sm text-yellow-700">
              {contexto.risco === 'baixo' 
                ? `${paciente.nome} está com boa adesão (${contexto.scoreAdesao}%). Parabenize e reforce a importância da continuidade.`
                : contexto.risco === 'medio'
                ? `${paciente.nome} tem adesão irregular (${contexto.scoreAdesao}%). Investigue motivos e ofereça soluções práticas.`
                : `${paciente.nome} está em risco alto (${contexto.scoreAdesao}%). Intervenção imediata necessária.`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Botão de Ação */}
      <button 
        onClick={() => onIniciarConversa && onIniciarConversa(paciente, contexto)}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
      >
        <CheckCircle size={18} />
        Iniciar Conversa sobre Adesão
      </button>

      {/* Estatísticas Rápidas */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-blue-600">{mockAdesaoData.estatisticas.pacientesComAdesaoRegular}</div>
            <div className="text-xs text-gray-600">Adesão Regular</div>
          </div>
          <div>
            <div className="text-lg font-bold text-yellow-600">{mockAdesaoData.estatisticas.pacientesRiscoMedio}</div>
            <div className="text-xs text-gray-600">Risco Médio</div>
          </div>
          <div>
            <div className="text-lg font-bold text-red-600">{mockAdesaoData.estatisticas.pacientesRiscoAlto}</div>
            <div className="text-xs text-gray-600">Risco Alto</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdesaoTratamento;