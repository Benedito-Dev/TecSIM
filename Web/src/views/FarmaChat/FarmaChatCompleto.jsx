import React, { useState } from 'react';
import FarmaChatDashboard from './FarmaChatDashboard';
import ChatFarmaceutico from './ChatFarmaceutico';
import EstatisticasExecutivas from './EstatisticasExecutivas';

const FarmaChatCompleto = () => {
  const [abaSelecionada, setAbaSelecionada] = useState('dashboard');
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);

  const abas = [
    { id: 'dashboard', nome: 'Dashboard', icone: '📊' },
    { id: 'chat', nome: 'Chat IA', icone: '🤖' },
    { id: 'executivo', nome: 'Visão Executiva', icone: '📈' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com Navegação */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">FC</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">FarmaChat</h1>
              </div>
              <span className="text-gray-400">|</span>
              <span className="text-sm text-gray-600">Pague Menos • Protocolo de Cuidado Contínuo</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Farmacêutico:</span>
              <span className="text-sm font-medium text-gray-900">Ana Silva</span>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">AS</span>
              </div>
            </div>
          </div>
          
          {/* Navegação por Abas */}
          <div className="flex space-x-8">
            {abas.map((aba) => (
              <button
                key={aba.id}
                onClick={() => setAbaSelecionada(aba.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  abaSelecionada === aba.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{aba.icone}</span>
                <span>{aba.nome}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conteúdo das Abas */}
      <div className="max-w-7xl mx-auto">
        {abaSelecionada === 'dashboard' && (
          <div className="p-6">
            <FarmaChatDashboard onPacienteSelecionado={setPacienteSelecionado} />
          </div>
        )}
        
        {abaSelecionada === 'chat' && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Chat com Assistente IA
                </h2>
                <ChatFarmaceutico pacienteId={pacienteSelecionado} />
                
                {!pacienteSelecionado && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      💡 <strong>Dica:</strong> Selecione um paciente no Dashboard para iniciar uma conversa contextual com a IA
                    </p>
                  </div>
                )}
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Recursos do Chat IA
                </h2>
                <div className="space-y-4">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-3">🎯 Orientação Contextual</h3>
                    <p className="text-gray-600 text-sm">
                      A IA conhece todo o histórico do paciente e oferece sugestões baseadas 
                      no protocolo ativo, condições crônicas e padrão de adesão.
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-3">⚠️ Alertas Inteligentes</h3>
                    <p className="text-gray-600 text-sm">
                      Identifica automaticamente riscos de interação, problemas de adesão 
                      e necessidade de intervenção farmacêutica.
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-3">📚 Base de Conhecimento</h3>
                    <p className="text-gray-600 text-sm">
                      Acesso instantâneo a protocolos clínicos, diretrizes de tratamento 
                      e melhores práticas em cuidado farmacêutico.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {abaSelecionada === 'executivo' && <EstatisticasExecutivas />}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                FarmaChat © 2024 - Transformando o cuidado farmacêutico no Brasil
              </p>
              <p className="text-xs text-gray-500 mt-1">
                "O protocolo que pode mudar o cuidado no Brasil"
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-xs text-gray-500">Versão 1.0</span>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-500">Suporte 24/7</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FarmaChatCompleto;