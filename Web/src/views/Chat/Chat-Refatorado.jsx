import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import Sidebar from '../../components/SideBarr';
import ChatHeader from '../../components/chat/ChatHeader';
import MessageList from '../../components/chat/MessageList';
import QuickActions from '../../components/chat/QuickActions';
import ChatInput from '../../components/chat/ChatInput';

import { useAuth } from '../../context/UserContext';
import { ThemeContext } from '../../context/ThemeContext';
import { useTriagem } from '../../hooks/useTriagem';
import { useChatMessages } from '../../hooks/useChatMessages';
import { getAIResponse } from '../../services/aiService';

export default function ChatScreen() {
  const { user } = useAuth();
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  
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

  // Lógica de envio de mensagem
  const handleSendMessage = async (messageText = newMessage) => {
    if (!messageText.trim() || isLoading) return;

    addUserMessage(messageText.trim());
    setNewMessage('');
    setIsLoading(true);

    try {
      // Verifica se deve iniciar triagem
      if (!emTriagem) {
        const resultadoTriagem = iniciarProcessoTriagem(messageText.trim());
        if (resultadoTriagem.sucesso) {
          addTriageMessage(
            `🔍 **Iniciando Triagem: ${resultadoTriagem.protocolo.nome}**\n\n${resultadoTriagem.primeiraPergunta.pergunta}`
          );
          setIsLoading(false);
          return;
        }
      }

      // Se está em triagem, processa como resposta da triagem
      if (emTriagem) {
        const resultado = await processarResposta(messageText.trim());
        if (resultado.sucesso) {
          if (resultado.finalizada) {
            // Triagem finalizada
            const { classificacao, response } = resultado.analise;
            let mensagemFinal = '';
            
            if (resultado.analise.success) {
              mensagemFinal = `📋 **RELATÓRIO DE TRIAGEM**\n\n` +
                `🔸 **Classificação**: ${classificacao.icone} ${classificacao.nivel}\n` +
                `🔸 **Recomendação**: ${classificacao.recomendacao}\n` +
                `🔸 **Tempo**: ${classificacao.tempo}\n\n` +
                `**Resumo**: ${response}\n\n` +
                `⚠️ *Este é um sistema de triagem inicial e não substitui avaliação médica profissional.*`;
            } else {
              mensagemFinal = `📋 **TRIAGEM FINALIZADA**\n\n` +
                `Classificação: ${classificacao.icone} ${classificacao.nivel}\n` +
                `Recomendação: ${classificacao.recomendacao}\n\n` +
                `⚠️ *Procure um profissional de saúde para avaliação detalhada.*`;
            }
            
            addTriageMessage(mensagemFinal, true);
          } else {
            // Continua triagem
            addTriageMessage(resultado.proximaPergunta.pergunta);
          }
          setIsLoading(false);
          return;
        }
      }

      // Fluxo normal do AI
      const formattedHistory = getFormattedHistory();
      const aiResponse = await getAIResponse(messageText.trim(), formattedHistory);

      if (aiResponse.success) {
        addBotMessage(aiResponse.response);
      } else {
        throw new Error(aiResponse.error);
      }
    } catch (err) {
      console.error('Erro:', err);
      addBotMessage('⚠️ Ocorreu um erro ao processar sua mensagem. Tente novamente.');
      
      if (err.message.includes('API key') || err.message.includes('chave')) {
        alert('Erro: Problema com a chave de API. Verifique as configurações.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickActionPress = (message) => {
    setNewMessage(message);
    setTimeout(() => handleSendMessage(message), 150);
  };

  const handleGoBack = () => navigate('/dashboard');

  return (
    <div 
      className="flex flex-col h-screen font-sans"
      style={{ background: theme.background }}
    >
      <Sidebar />
      
      <div className="flex flex-col flex-1 h-screen transition-all duration-300">
        <ChatHeader 
          onGoBack={handleGoBack}
          isLoading={isLoading}
          emTriagem={emTriagem}
        />

        <MessageList 
          messages={messages}
          isLoading={isLoading}
          messagesEndRef={messagesEndRef}
        />

        <div 
          className="flex-shrink-0 w-full border-t"
          style={{
            background: theme.backgroundCard,
            borderColor: theme.border
          }}
        >
          <QuickActions 
            onButtonPress={handleQuickActionPress} 
            isLoading={isLoading} 
          />

          <ChatInput 
            message={newMessage}
            setMessage={setNewMessage}
            onSend={handleSendMessage}
            isLoading={isLoading}
            emTriagem={emTriagem}
          />
        </div>
      </div>
    </div>
  );
}