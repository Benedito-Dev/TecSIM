import React, { useState, useContext } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import { useTriagem } from '../../hooks/useTriagem';
import { useChatMessages } from '../../hooks/useChatMessages';
import { usePacienteCondicoes } from '../../hooks/usePacienteCondicoes';
import { getAIResponse } from '../../services/aiService';
import BouncingDots from './BouncingDots';

const AtendimentoChat = ({ paciente, onTriagemComplete }) => {
  const { theme } = useContext(ThemeContext);
  const [newMessage, setNewMessage] = useState('');
  
  const {
    messages,
    isLoading,
    setIsLoading,
    messagesEndRef,
    addUserMessage,
    addBotMessage,
    addTriageMessage,
    getFormattedHistory
  } = useChatMessages();

  const {
    emTriagem,
    iniciarProcessoTriagem,
    processarResposta,
  } = useTriagem();

  const { condicoes } = usePacienteCondicoes(paciente?.id);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;

    addUserMessage(newMessage.trim());
    const messageText = newMessage.trim();
    setNewMessage('');
    setIsLoading(true);

    try {
      // Contexto do paciente para IA
      const condicoesTexto = condicoes.map(c => `${c.condicao} (${c.severidade})`).join(', ');
      const contextoAtendimento = `
ATENDIMENTO FARMACÊUTICO - PAGUE MENOS
Paciente: ${paciente.nome}
Condições Médicas: ${condicoesTexto || 'Nenhuma'}
Alergias: ${paciente.alergias?.join(', ') || 'Nenhuma'}
Medicamentos: ${paciente.medicamentosContinuos?.join(', ') || 'Nenhum'}
`;

      // Verifica se deve iniciar triagem
      if (!emTriagem) {
        const resultadoTriagem = iniciarProcessoTriagem(messageText, condicoes);
        if (resultadoTriagem.sucesso) {
          const tipoProtocolo = resultadoTriagem.especializado ? '🎯 **Protocolo Especializado**' : '🔍 **Triagem Padrão**';
          addTriageMessage(
            `${tipoProtocolo}: ${resultadoTriagem.protocolo.nome}\n\n${resultadoTriagem.primeiraPergunta.pergunta}`
          );
          setIsLoading(false);
          return;
        }
      }

      // Se está em triagem
      if (emTriagem) {
        const resultado = await processarResposta(messageText);
        if (resultado.sucesso) {
          if (resultado.finalizada) {
            const { classificacao, response } = resultado.analise;
            
            // Notifica componente pai sobre conclusão da triagem
            onTriagemComplete?.({
              classificacao: classificacao.nivel,
              recomendacao: classificacao.recomendacao,
              resumo: response,
              paciente: paciente.nome
            });

            addTriageMessage(
              `📋 **TRIAGEM FINALIZADA**\n\n` +
              `🔸 **Classificação**: ${classificacao.icone} ${classificacao.nivel}\n` +
              `🔸 **Recomendação**: ${classificacao.recomendacao}\n\n` +
              `**Resumo**: ${response || 'Triagem concluída'}\n\n` +
              `⚠️ *Protocolo executado conforme diretrizes da Pague Menos*`
            , true);
          } else {
            addTriageMessage(resultado.proximaPergunta.pergunta);
          }
          setIsLoading(false);
          return;
        }
      }

      // Fluxo normal com contexto do paciente
      const formattedHistory = getFormattedHistory();
      const promptComContexto = `${contextoAtendimento}\n\nPergunta do cliente: ${messageText}`;
      
      const aiResponse = await getAIResponse(promptComContexto, formattedHistory);

      if (aiResponse.success) {
        addBotMessage(aiResponse.response);
      } else {
        throw new Error(aiResponse.error);
      }
    } catch (err) {
      console.error('Erro:', err);
      addBotMessage('⚠️ Erro no atendimento. Tente novamente ou chame um supervisor.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm h-96 flex flex-col">
      {/* Header do Chat */}
      <div 
        className="p-4 border-b rounded-t-lg"
        style={{ background: theme.primary }}
      >
        <div className="flex items-center gap-2 text-white">
          <Bot size={20} />
          <h3 className="font-semibold">TecSim - Atendimento {paciente.nome}</h3>
          {emTriagem && (
            <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
              Em Triagem
            </span>
          )}
        </div>
      </div>

      {/* Área de Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg text-sm ${
                msg.isBot
                  ? 'bg-gray-100 text-gray-800'
                  : 'text-white'
              } ${
                msg.isTriage ? 'border-l-4 border-blue-500' : ''
              } ${
                msg.isTriageResult ? 'border-l-4 border-green-500 bg-green-50' : ''
              }`}
              style={{
                background: !msg.isBot ? theme.primary : undefined
              }}
            >
              {msg.isBot && (
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                  <Bot size={12} />
                  {msg.isTriage ? 'Triagem' : 'TecSim'}
                </div>
              )}
              <div className="whitespace-pre-wrap">{msg.text}</div>
              <div className="text-xs opacity-70 mt-1">{msg.time}</div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg">
              <BouncingDots color={theme.primary} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input de Mensagem */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={emTriagem ? "Responda à pergunta..." : "Digite sua mensagem..."}
            disabled={isLoading}
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isLoading}
            className="px-4 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-colors"
            style={{ background: theme.primary }}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AtendimentoChat;