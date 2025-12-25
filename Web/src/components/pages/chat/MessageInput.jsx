import React from 'react';
import { Send } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

const MessageInput = ({ 
  newMessage, 
  setNewMessage, 
  onSendMessage, 
  onKeyPress, 
  isLoading, 
  emTriagem 
}) => {
  const { theme } = useTheme();

  return (
    <div className="p-4 border-t">
      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder={emTriagem ? "Responda à pergunta..." : "Digite sua mensagem..."}
          disabled={isLoading}
          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
        <button
          onClick={onSendMessage}
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
  );
};

export default MessageInput;