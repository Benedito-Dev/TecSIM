import { useState, useRef, useEffect } from 'react';

export const useChatMessages = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef();

  const getCurrentTime = () =>
    new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });

  // Mensagem inicial
  useEffect(() => {
    setMessages([
      {
        id: 1,
        text: 'Olá! Sou o TecSim, seu assistente virtual de saúde.',
        isBot: true,
        time: getCurrentTime(),
      },
    ]);
  }, []);

  // Scroll removido para evitar comportamento indesejado na página

  const addMessage = (message) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      time: getCurrentTime(),
      ...message
    }]);
  };

  const addUserMessage = (text) => {
    addMessage({
      text: text.trim(),
      isBot: false
    });
  };

  const addBotMessage = (text, options = {}) => {
    addMessage({
      text,
      isBot: true,
      ...options
    });
  };

  const addTriageMessage = (text, isResult = false) => {
    addMessage({
      text,
      isBot: true,
      isTriage: !isResult,
      isTriageResult: isResult
    });
  };

  const getFormattedHistory = () => {
    return messages
      .filter(msg => msg.id !== 1)
      .map(msg => ({ isBot: msg.isBot, text: msg.text }));
  };

  return {
    messages,
    isLoading,
    setIsLoading,
    messagesEndRef,
    addUserMessage,
    addBotMessage,
    addTriageMessage,
    getFormattedHistory
  };
};