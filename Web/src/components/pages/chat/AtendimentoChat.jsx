import React, { useState, useContext, useCallback } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';
import { useTriagem } from '../../../hooks/useTriagem';
import { useChatMessages } from '../../../hooks/useChatMessages';
import { usePacienteCondicoes } from '../../../hooks/usePacienteCondicoes';
import { getAIResponse } from '@/services/aiService';
import MessageList from './MessageList';
import QuickButtons from './QuickButtons';
import MessageInput from './MessageInput';

const INITIAL_MESSAGE_DELAY = 1000;
const AUTO_SEND_DELAY = 500;

const AtendimentoChat = ({ paciente, onTriagemComplete, mensagemInicial }) => {
  const { theme } = useContext(ThemeContext);
  const [newMessage, setNewMessage] = useState('');
  const [mensagemInicialEnviada, setMensagemInicialEnviada] = useState(false);
  
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

  const handleSendMessageAuto = useCallback(async (message) => {
    if (!message.trim() || isLoading) return;

    addUserMessage(message.trim());
    const messageText = message.trim();
    setNewMessage('');
    setIsLoading(true);

    await processarMensagem(messageText);
  }, [isLoading, addUserMessage, setIsLoading]);

  // Envia mensagem inicial automaticamente quando o componente carrega
  React.useEffect(() => {
    if (mensagemInicial && !mensagemInicialEnviada && paciente?.id) {
      const initialTimer = setTimeout(() => {
        try {
          if (!mensagemInicial.trim()) {
            console.warn('Mensagem inicial vazia');
            setMensagemInicialEnviada(true);
            return;
          }
          setNewMessage(mensagemInicial);
          setMensagemInicialEnviada(true);
          // Simula o envio da mensagem
          const sendTimer = setTimeout(() => {
            handleSendMessageAuto(mensagemInicial).catch((err) => {
              console.error('Erro ao enviar mensagem inicial:', err);
              addBotMessage('⚠️ Erro ao processar mensagem inicial. Tente novamente.');
              setIsLoading(false);
            });
          }, AUTO_SEND_DELAY);
          return () => clearTimeout(sendTimer);
        } catch (err) {
          console.error('Erro ao inicializar chat:', err);
          setMensagemInicialEnviada(true);
          addBotMessage('⚠️ Erro ao inicializar chat. Tente novamente.');
        }
      }, INITIAL_MESSAGE_DELAY);
      return () => clearTimeout(initialTimer);
    }
  }, [mensagemInicial, mensagemInicialEnviada, paciente?.id, handleSendMessageAuto, addBotMessage, setIsLoading]);

  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() || isLoading) return;

    addUserMessage(newMessage.trim());
    const messageText = newMessage.trim();
    setNewMessage('');
    setIsLoading(true);

    try {
      await processarMensagem(messageText);
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      addBotMessage('⚠️ Erro ao enviar mensagem. Tente novamente.');
      setIsLoading(false);
    }
  }, [newMessage, isLoading, addUserMessage, setIsLoading, addBotMessage]);

  const processarMensagem = async (messageText) => {
    try {
      if (!messageText?.trim()) {
        console.warn('Mensagem vazia');
        setIsLoading(false);
        return;
      }

      if (!paciente?.id) {
        throw new Error('Paciente não identificado');
      }

      // Contexto do paciente para IA
      const condicoesTexto = condicoes?.length ? condicoes.map(c => `${c?.condicao} (${c?.severidade})`).join(', ') : 'Nenhuma';
      const contextoAtendimento = `
ATENDIMENTO FARMACÊUTICO - PAGUE MENOS
Paciente: ${paciente?.nome || 'Desconhecido'}
Condições Médicas: ${condicoesTexto}
Alergias: ${paciente?.alergias?.join(', ') || 'Nenhuma'}
Medicamentos: ${paciente?.medicamentosContinuos?.join(', ') || 'Nenhum'}
`;

      // Verifica se deve iniciar triagem
      if (!emTriagem) {
        try {
          const resultadoTriagem = iniciarProcessoTriagem(messageText, condicoes || []);
          if (resultadoTriagem?.sucesso) {
            const tipoProtocolo = resultadoTriagem?.especializado ? '🎯 **Protocolo Especializado**' : '🔍 **Triagem Padrão**';
            addTriageMessage(
              `${tipoProtocolo}: ${resultadoTriagem?.protocolo?.nome}\\n\\n${resultadoTriagem?.primeiraPergunta?.pergunta}`
            );
            setIsLoading(false);
            return;
          }
        } catch (triageErr) {
          console.error('Erro ao iniciar triagem:', triageErr);
          addBotMessage('⚠️ Erro ao iniciar triagem. Por favor, tente novamente.');
          setIsLoading(false);
          return;
        }
      }

      // Se está em triagem
      if (emTriagem) {
        try {
          const resultado = await processarResposta(messageText);
          if (resultado?.sucesso) {
            if (resultado?.finalizada) {
              const { classificacao, response } = resultado?.analise || {};
              
              // Notifica componente pai sobre conclusão da triagem
              onTriagemComplete?.({
                classificacao: classificacao?.nivel,
                recomendacao: classificacao?.recomendacao,
                resumo: response,
                paciente: paciente?.nome
              });

              addTriageMessage(
                `📋 **TRIAGEM FINALIZADA**\\n\\n` +
                `🔸 **Classificação**: ${classificacao?.icone || '❓'} ${classificacao?.nivel || 'Desconhecida'}\\n` +
                `🔸 **Recomendação**: ${classificacao?.recomendacao || 'Nenhuma'}\\n\\n` +
                `**Resumo**: ${response || 'Triagem concluída'}\\n\\n` +
                `⚠️ *Protocolo executado conforme diretrizes da Pague Menos*`
              , true);
            } else {
              addTriageMessage(resultado?.proximaPergunta?.pergunta || 'Continuando a triagem...');
            }
            setIsLoading(false);
            return;
          } else {
            throw new Error('Falha ao processar resposta de triagem');
          }
        } catch (triageErr) {
          console.error('Erro ao processar resposta de triagem:', triageErr);
          addBotMessage('⚠️ Erro ao processar sua resposta. Por favor, tente novamente.');
          setIsLoading(false);
          return;
        }
      }

      // Fluxo normal com contexto do paciente
      try {
        const formattedHistory = getFormattedHistory();
        const promptComContexto = `${contextoAtendimento}\\n\\nPergunta do cliente: ${messageText}`;
        
        const aiResponse = await getAIResponse(promptComContexto, formattedHistory);

        if (!aiResponse) {
          throw new Error('Resposta vazia da IA');
        }

        if (aiResponse?.success) {
          addBotMessage(aiResponse?.response || 'Resposta processada');
        } else {
          throw new Error(aiResponse?.error || 'Erro desconhecido da IA');
        }
      } catch (aiErr) {
        console.error('Erro ao obter resposta da IA:', aiErr);
        addBotMessage('⚠️ Erro no atendimento. Tente novamente ou chame um supervisor.');
        setIsLoading(false);
        return;
      }
    } catch (err) {
      console.error('Erro geral:', err);
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

  const handleQuickButton = useCallback((message) => {
    try {
      if (!message?.trim()) {
        console.warn('Mensagem de botão rápido vazia');
        return;
      }
      setNewMessage(message);
      const timerId = setTimeout(() => {
        try {
          handleSendMessage();
        } catch (err) {
          console.error('Erro ao enviar mensagem do botão rápido:', err);
          addBotMessage('⚠️ Erro ao processar sua solicitação. Tente novamente.');
          setIsLoading(false);
        }
      }, 100);
      return () => clearTimeout(timerId);
    } catch (err) {
      console.error('Erro no botão rápido:', err);
      addBotMessage('⚠️ Erro ao processar sua solicitação. Tente novamente.');
    }
  }, [handleSendMessage, addBotMessage, setIsLoading]);

  return (
    <div className="h-96 flex flex-col">
      <MessageList 
        messages={messages}
        isLoading={isLoading}
        messagesEndRef={messagesEndRef}
      />

      {!emTriagem && messages.length <= 1 && (
        <QuickButtons 
          onQuickButton={handleQuickButton}
          isLoading={isLoading}
        />
      )}

      <MessageInput 
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        onSendMessage={handleSendMessage}
        onKeyPress={handleKeyPress}
        isLoading={isLoading}
        emTriagem={emTriagem}
      />
    </div>
  );
};

export default AtendimentoChat;