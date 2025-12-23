import React, { useContext, useCallback, useMemo } from 'react';
import { useElderMode } from '../../context/ElderModeContext';
import { ThemeContext } from '../../context/ThemeContext';
import BouncingDots from './BouncingDots';

const MAX_MESSAGE_WIDTH_MOBILE = '80%';
const MAX_MESSAGE_WIDTH_DESKTOP = 'xl';

const MessageList = ({ messages = [], isLoading = false, messagesEndRef }) => {
  const { fontSize } = useElderMode();
  const { theme } = useContext(ThemeContext);

  // Validação de entrada com tratamento de erro
  try {
    if (!Array.isArray(messages)) {
      console.error('MessageList: messages deve ser um array');
      return (
        <div className="flex-1 flex items-center justify-center">
          <p>Erro ao carregar mensagens</p>
        </div>
      );
    }
  } catch (error) {
    console.error('Erro na validação de entrada:', error);
    return (
      <div className="flex-1 flex items-center justify-center">
        <p>Erro crítico no componente</p>
      </div>
    );
  }

  const getMessageStyles = useCallback((msg, isTriage) => {
    if (!msg.isBot) {
      return {
        background: theme.primary,
        borderColor: theme.primary,
        color: theme.textOnPrimary
      };
    }

    if (isTriage && msg.isTriageResult) {
      return {
        background: theme.success + '20',
        borderColor: theme.success,
        color: theme.success
      };
    }

    if (isTriage) {
      return {
        background: theme.primaryLight,
        borderColor: theme.primary,
        color: theme.primary
      };
    }

    return {
      background: theme.backgroundCard,
      borderColor: theme.border,
      color: theme.textPrimary
    };
  }, [theme]);

  const getMessageClasses = useCallback((msg, isTriage) => {
    try {
      let borderClass = 'border';
      if (msg?.isBot && isTriage) {
        borderClass = 'border-2';
      }
      return borderClass;
    } catch (error) {
      console.error('Erro ao gerar classes da mensagem:', error);
      return 'border';
    }
  }, []);

  const renderMessage = useCallback((msg) => {
    // Validação da mensagem
    if (!msg || typeof msg !== 'object' || !msg.id) {
      console.warn('Mensagem inválida ignorada:', msg);
      return null;
    }
    
    const isTriage = msg.isTriage || msg.isTriageResult;
    const messageStyles = getMessageStyles(msg, isTriage);
    const borderClass = getMessageClasses(msg, isTriage);
    
    return (
      <div
        key={msg.id}
        className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
      >
        <div
          className={`rounded-2xl p-4 shadow-md ${borderClass}`}
          style={{
            ...messageStyles,
            maxWidth: MAX_MESSAGE_WIDTH_MOBILE
          }}
        >
          {msg.isBot && (
            <div 
              className="text-xs font-semibold mb-1 flex items-center gap-2" 
              style={{ 
                fontSize: `${fontSize * 0.75}px`,
                color: isTriage 
                  ? msg.isTriageResult
                    ? theme.success
                    : theme.primary
                  : theme.textSecondary
              }}
            >
              {isTriage ? '🔍 TecSim - Triagem' : 'TecSim'}
              {isTriage && !msg.isTriageResult && (
                <span 
                  className="text-xs px-2 py-1 rounded-full"
                  style={{
                    background: theme.primary + '20',
                    color: theme.primary
                  }}
                >
                  Triagem
                </span>
              )}
            </div>
          )}
          <div 
            style={{ fontSize: `${fontSize}px` }}
            className="whitespace-pre-wrap"
          >
            {msg.text || 'Mensagem vazia'}
          </div>
          <div 
            className="text-xs mt-2 opacity-70"
            style={{ fontSize: `${fontSize * 0.7}px` }}
          >
            {msg.time || 'Sem horário'}
          </div>
        </div>
      </div>
    );
  }, [fontSize, theme]);

  return (
    <div 
      className="flex-1 overflow-y-auto px-4 py-4 w-full h-[${MESSAGES_HEIGHT}]"
      style={{ background: theme.background }}
    >
      <div className="space-y-4 max-w-4xl mx-auto">
        {messages.map((msg, index) => {
          try {
            return renderMessage(msg);
          } catch (error) {
            console.error('Erro ao renderizar mensagem:', error, msg);
            return (
              <div key={msg?.id || index} className="text-red-500 text-sm">
                Erro ao exibir mensagem
              </div>
            );
          }
        }).filter(Boolean)}
        
        {/* INDICADOR DE DIGITAÇÃO */}
        {isLoading && (
          <div className="flex justify-start">
            <div 
              className="rounded-2xl p-4 shadow-sm border"
              style={{
                background: theme.backgroundCard,
                borderColor: theme.border
              }}
            >
              <BouncingDots color={theme.primary} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;