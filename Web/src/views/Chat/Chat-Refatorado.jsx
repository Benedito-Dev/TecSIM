import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

import Sidebar from '../../components/layout/Sidebar';
import { PageContainer } from '../../components/layout/PageContainer';
import MessageList from '../../components/pages/chat/MessageList';
import QuickActions from '../../components/pages/chat/QuickActions';
import ChatInput from '../../components/pages/chat/ChatInput';

import { useAuth } from '../../context/UserContext';
import { ThemeContext } from '../../context/ThemeContext';
import { useTriagem } from '../../hooks/pages/chat/useTriagem';
import { useChatMessages } from '../../hooks/pages/chat/useChatMessages';
import { useAPIHealth } from '../../hooks/shared/useAPIHealth';
import { getAIResponse } from '@/services/aiService';

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

  const { apiStatus, isHealthy } = useAPIHealth();

  // Monitora status da API
  useEffect(() => {
    if (!apiStatus.checking && !isHealthy) {
      addBotMessage(
        `⚠️ **Aviso de Sistema**\n\n` +
        `Problema detectado na conexão com a IA: ${apiStatus.message}\n\n` +
        `O sistema pode funcionar com limitações. Verifique sua conexão ou tente mais tarde.`
      );
    }
  }, [apiStatus.checking, isHealthy, apiStatus.message, addBotMessage]);

  // Lógica de envio de mensagem - SIMPLIFICADA como no Mobile
  const handleSendMessage = async (messageText = newMessage) => {
    if (!messageText.trim() || isLoading) return;

    // Verifica redirecionamentos específicos (como no Mobile)
    if (messageText.trim() === "Preciso alterar meus dados pessoais") {
      addUserMessage(messageText.trim());
      addBotMessage("Redirecionando você para a tela de edição de perfil...");
      setTimeout(() => navigate('/profile'), 2000);
      return;
    }

    if (messageText.trim() === "Tenho dúvidas sobre meus medicamentos") {
      addUserMessage(messageText.trim());
      addBotMessage("Redirecionando você para a tela de medicamentos...");
      setTimeout(() => navigate('/medicines'), 2000);
      return;
    }

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
            addTriageMessage(resultado.proximaPergunta.pergunta);
          }
          setIsLoading(false);
          return;
        }
      }

      // Fluxo normal da IA - SIMPLES como no Mobile
      const formattedHistory = getFormattedHistory();
      const aiResponse = await getAIResponse(messageText.trim(), formattedHistory);

      if (aiResponse.success) {
        addBotMessage(aiResponse.response);
      } else {
        throw new Error(aiResponse.error);
      }
    } catch (err) {
      console.error('Erro:', err);
      
      let errorMessage = '⚠️ Ocorreu um erro ao processar sua mensagem. Tente novamente.';
      
      if (err.message.includes('API key') || err.message.includes('chave')) {
        errorMessage = '⚠️ Erro de configuração: Chave de API não encontrada. Verifique o arquivo .env';
      } else if (err.message.includes('quota') || err.message.includes('limit')) {
        errorMessage = '⚠️ Limite de uso da API atingido. Tente novamente mais tarde.';
      } else if (err.message.includes('network') || err.message.includes('fetch')) {
        errorMessage = '⚠️ Erro de conexão. Verifique sua internet e tente novamente.';
      }
      
      addBotMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickActionPress = (message) => {
    setNewMessage(message);
    setTimeout(() => handleSendMessage(message), 150);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      
      <PageContainer
        title="Chat Médico"
        icon={MessageCircle}
        className="flex-1 p-0 h-screen"
      >
        <div className="flex flex-col h-[calc(100vh-8rem)] justify-end">
          <div className="flex-1 overflow-hidden min-h-0">
            <MessageList 
              messages={messages}
              isLoading={isLoading}
              messagesEndRef={messagesEndRef}
            />
          </div>

          <div 
            className="flex-shrink-0 border-t"
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
      </PageContainer>
    </div>
  );
}