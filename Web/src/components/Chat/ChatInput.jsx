import React, { useRef, useContext } from 'react';
import { Send } from 'lucide-react';
import { useElderMode } from '../../context/ElderModeContext';
import { ThemeContext } from '../../context/ThemeContext';

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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleSend = () => {
    onSend();
    inputRef.current?.focus();
  };

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
          className="flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
          style={{ 
            fontSize: `${fontSize}px`, 
            minHeight: '48px', 
            maxHeight: '100px',
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
            minWidth: '48px', 
            height: '48px',
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