import React, { useRef, useContext, useCallback } from 'react';
import { Send } from 'lucide-react';
import { useElderMode } from '../../context/ElderModeContext';
import { ThemeContext } from '../../context/ThemeContext';

const MIN_INPUT_HEIGHT = '48px';
const MAX_INPUT_HEIGHT = '100px';
const BUTTON_SIZE = '48px';

const ChatInput = ({ 
  message, 
  setMessage, 
  onSend, 
  isLoading, 
  emTriagem 
}) => {
  const inputRef = useRef();
  const { fontSize } = useElderMode();
  const { theme } = useContext(ThemeContext);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }, [onSend]);

  const handleSend = useCallback(() => {
    onSend();
    inputRef.current?.focus();
  }, [onSend]);

  return (
    <div className="p-4 w-full"> 
      <div className="max-w-4xl mx-auto flex space-x-3"> 
        <textarea
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={emTriagem ? "Responda à pergunta de triagem..." : "Digite sua mensagem..."}
          disabled={isLoading}
          rows={1}
          className={
            "flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 " +
            "disabled:opacity-50 disabled:cursor-not-allowed resize-none"
          }
          style={{ 
            fontSize: `${fontSize}px`, 
            minHeight: MIN_INPUT_HEIGHT, 
            maxHeight: MAX_INPUT_HEIGHT,
            background: theme.backgroundCard,
            borderColor: theme.border,
            color: theme.textPrimary
          }}
        />
        <button
          onClick={handleSend}
          disabled={!message.trim() || isLoading}
          className="px-6 py-3 text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center h-full"
          style={{ 
            minWidth: BUTTON_SIZE, 
            height: BUTTON_SIZE,
            background: theme.primary
          }} 
        >
          {isLoading ? (
            <div 
              className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: theme.textOnPrimary }}
            />
          ) : (
            <Send size={fontSize * 1.25} />
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatInput;