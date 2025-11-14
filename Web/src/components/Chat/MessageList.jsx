import React, { useContext } from 'react';
import { useElderMode } from '../../context/ElderModeContext';
import { ThemeContext } from '../../context/ThemeContext';
import BouncingDots from './BouncingDots';

const MessageList = ({ messages, isLoading, messagesEndRef }) => {
  const { fontSize } = useElderMode();
  const { theme } = useContext(ThemeContext);

  const renderMessage = (msg) => {
    const isTriage = msg.isTriage || msg.isTriageResult;
    
    return (
      <div
        key={msg.id}
        className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
      >
        <div
          className={`max-w-[80%] md:max-w-xl rounded-2xl p-4 shadow-md ${
            msg.isBot 
              ? isTriage 
                ? msg.isTriageResult
                  ? 'border-2'
                  : 'border-2'
                : 'border'
              : ''
          }`}
          style={{
            background: msg.isBot 
              ? isTriage 
                ? msg.isTriageResult
                  ? theme.success + '20'
                  : theme.primaryLight
                : theme.backgroundCard
              : theme.primary,
            borderColor: msg.isBot 
              ? isTriage 
                ? msg.isTriageResult
                  ? theme.success
                  : theme.primary
                : theme.border
              : theme.primary,
            color: msg.isBot 
              ? isTriage 
                ? msg.isTriageResult
                  ? theme.success
                  : theme.primary
                : theme.textPrimary
              : theme.textOnPrimary
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
              {isTriage ? '🔍 TecSim - Triagem' : 'TecSim - Assistente Geral'}
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
            {msg.text}
          </div>
          <div 
            className="text-xs mt-2 opacity-70"
            style={{ fontSize: `${fontSize * 0.7}px` }}
          >
            {msg.time}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="flex-1 overflow-y-auto px-4 py-4 w-full h-[calc(100vh-14rem)]"
      style={{ background: theme.background }}
    >
      <div className="space-y-4 max-w-4xl mx-auto">
        {messages.map(renderMessage)}
        
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