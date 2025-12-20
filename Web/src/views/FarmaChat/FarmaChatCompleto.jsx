import React, { useState } from 'react';
import FarmaChatDashboard from './FarmaChatDashboard';
import ChatFarmaceutico from './ChatFarmaceutico';
import EstatisticasExecutivas from './EstatisticasExecutivas';
import { useTheme } from '../../context/ThemeContext';

const FarmaChatCompleto = () => {
  const { theme } = useTheme();
  const [abaSelecionada, setAbaSelecionada] = useState('dashboard');
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);

  const abas = [
    { id: 'dashboard', nome: 'Dashboard', icone: '📊' },
    { id: 'chat', nome: 'Chat IA', icone: '🤖' },
    { id: 'executivo', nome: 'Visão Executiva', icone: '📈' }
  ];

  return (
    <div 
      className="min-h-screen"
      style={{ background: theme.background }}
    >
      {/* Header com Navegação */}
      <div 
        className="shadow-sm border-b"
        style={{
          background: theme.backgroundCard,
          borderColor: theme.border
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">FC</span>
                </div>
                <h1 
                  className="text-xl font-bold"
                  style={{ color: theme.textPrimary }}
                >
                  FarmaChat
                </h1>
              </div>
              <span className="text-gray-400">|</span>
              <span 
                className="text-sm"
                style={{ color: theme.textSecondary }}
              >
                Pague Menos • Protocolo de Cuidado Contínuo
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span 
                className="text-sm"
                style={{ color: theme.textSecondary }}
              >
                Farmacêutico:
              </span>
              <span 
                className="text-sm font-medium"
                style={{ color: theme.textPrimary }}
              >
                Ana Silva
              </span>
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
                className="flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors"
                style={{
                  borderColor: abaSelecionada === aba.id ? theme.primary : 'transparent',
                  color: abaSelecionada === aba.id ? theme.primary : theme.textSecondary
                }}
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
                <h2 
                  className="text-2xl font-bold mb-6"
                  style={{ color: theme.textPrimary }}
                >
                  Chat com Assistente IA
                </h2>
                <ChatFarmaceutico pacienteId={pacienteSelecionado} />
                
                {!pacienteSelecionado && (
                  <div 
                    className="mt-6 p-4 border rounded-lg"
                    style={{
                      background: theme.primaryLight + '20',
                      borderColor: theme.primary
                    }}
                  >
                    <p 
                      className="text-sm"
                      style={{ color: theme.primary }}
                    >
                      💡 <strong>Dica:</strong> Selecione um paciente no Dashboard para iniciar uma conversa contextual com a IA
                    </p>
                  </div>
                )}
              </div>
              
              <div>
                <h2 
                  className="text-2xl font-bold mb-6"
                  style={{ color: theme.textPrimary }}
                >
                  Recursos do Chat IA
                </h2>
                <div className="space-y-4">
                  <div 
                    className="p-6 rounded-lg shadow-sm"
                    style={{
                      background: theme.backgroundCard
                    }}
                  >
                    <h3 
                      className="font-semibold mb-3"
                      style={{ color: theme.textPrimary }}
                    >
                      🎯 Orientação Contextual
                    </h3>
                    <p 
                      className="text-sm"
                      style={{ color: theme.textSecondary }}
                    >
                      A IA conhece todo o histórico do paciente e oferece sugestões baseadas 
                      no protocolo ativo, condições crônicas e padrão de adesão.
                    </p>
                  </div>
                  
                  <div 
                    className="p-6 rounded-lg shadow-sm"
                    style={{
                      background: theme.backgroundCard
                    }}
                  >
                    <h3 
                      className="font-semibold mb-3"
                      style={{ color: theme.textPrimary }}
                    >
                      ⚠️ Alertas Inteligentes
                    </h3>
                    <p 
                      className="text-sm"
                      style={{ color: theme.textSecondary }}
                    >
                      Identifica automaticamente riscos de interação, problemas de adesão 
                      e necessidade de intervenção farmacêutica.
                    </p>
                  </div>
                  
                  <div 
                    className="p-6 rounded-lg shadow-sm"
                    style={{
                      background: theme.backgroundCard
                    }}
                  >
                    <h3 
                      className="font-semibold mb-3"
                      style={{ color: theme.textPrimary }}
                    >
                      📚 Base de Conhecimento
                    </h3>
                    <p 
                      className="text-sm"
                      style={{ color: theme.textSecondary }}
                    >
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
      <footer 
        className="border-t mt-12"
        style={{
          background: theme.backgroundCard,
          borderColor: theme.border
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <p 
                className="text-sm"
                style={{ color: theme.textSecondary }}
              >
                FarmaChat © 2024 - Transformando o cuidado farmacêutico no Brasil
              </p>
              <p 
                className="text-xs mt-1"
                style={{ color: theme.textMuted }}
              >
                "O protocolo que pode mudar o cuidado no Brasil"
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <span 
                className="text-xs"
                style={{ color: theme.textMuted }}
              >
                Versão 1.0
              </span>
              <span 
                className="text-xs"
                style={{ color: theme.textMuted }}
              >
                •
              </span>
              <span 
                className="text-xs"
                style={{ color: theme.textMuted }}
              >
                Suporte 24/7
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FarmaChatCompleto;