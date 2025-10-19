import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import AtendimentoChat from './AtendimentoChat';
import { gerarResumoContextual } from '../../services/resumoContextualService';

const ChatContextualizado = ({ paciente, condicoes, onClose }) => {
  const [resultadoTriagem, setResultadoTriagem] = useState(null);
  const resumoContextual = gerarResumoContextual(paciente, condicoes);

  const handleTriagemComplete = (resultado) => {
    setResultadoTriagem(resultado);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[95vh] flex">
        
        {/* Sidebar com Informações Rápidas */}
        <div className="w-80 bg-gray-50 border-r flex flex-col">
          {/* Header Sidebar */}
          <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">{paciente.nome.split(' ')[0]}</h3>
                <p className="text-blue-100 text-sm">
                  {resumoContextual.nivelRisco.nivel} Risco • {resumoContextual.contextoAdesao?.scoreAdesao || 'N/A'}%
                </p>
              </div>
              <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Informações Essenciais */}
          <div className="p-4 space-y-4 flex-1 overflow-y-auto">
            {/* Última Compra */}
            {resumoContextual.contextoAdesao?.ultimaCompra && (
              <div className="bg-white p-3 rounded-lg border">
                <h4 className="font-semibold text-sm text-gray-700 mb-2">🏢 Última Compra</h4>
                <p className="text-sm">{resumoContextual.contextoAdesao.ultimaCompra.loja}</p>
                <p className="text-xs text-gray-600">
                  Há {resumoContextual.contextoAdesao.diasUltimaCompra} dias
                </p>
              </div>
            )}

            {/* Medicamentos */}
            {resumoContextual.contextoAdesao?.medicamentosAtivos && (
              <div className="bg-white p-3 rounded-lg border">
                <h4 className="font-semibold text-sm text-gray-700 mb-2">💊 Medicamentos</h4>
                {resumoContextual.contextoAdesao.medicamentosAtivos.map((med, i) => (
                  <div key={i} className="text-sm mb-1">
                    <p className="font-medium">{med.nome}</p>
                    <p className="text-xs text-gray-600">
                      {med.diasRestantes} dias restantes • {med.frequencia}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Alertas */}
            {resumoContextual.sugestoesEspecificas.length > 0 && (
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-sm text-yellow-800 mb-2">⚠️ Alertas</h4>
                {resumoContextual.sugestoesEspecificas.map((sugestao, i) => (
                  <p key={i} className="text-xs text-yellow-700 mb-1">{sugestao}</p>
                ))}
              </div>
            )}

            {/* Resultado Triagem */}
            {resultadoTriagem && (
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h4 className="font-semibold text-sm text-green-800 mb-2">✅ Triagem</h4>
                <p className="text-sm font-medium">{resultadoTriagem.classificacao}</p>
                <p className="text-xs text-green-700">{resultadoTriagem.recomendacao}</p>
              </div>
            )}
          </div>
        </div>

        {/* Área Principal do Chat */}
        <div className="flex-1 flex flex-col">
          {/* Header Chat */}
          <div className="p-4 border-b bg-white">
            <div className="flex items-center gap-3">
              <MessageSquare size={20} className="text-blue-600" />
              <div>
                <h2 className="font-bold text-gray-800">Chat Especializado</h2>
                <p className="text-sm text-gray-600">Atendimento contextualizado</p>
              </div>
            </div>
          </div>

          {/* Chat */}
          <div className="flex-1 p-4">
            <AtendimentoChat 
              paciente={paciente}
              onTriagemComplete={handleTriagemComplete}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatContextualizado;