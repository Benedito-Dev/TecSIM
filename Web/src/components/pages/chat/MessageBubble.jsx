import React from 'react';
import { Bot } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

const MessageBubble = ({ message }) => {
  const { theme } = useTheme();

  return (
    <div className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[80%] p-3 rounded-lg text-sm ${
          message.isBot
            ? 'bg-gray-100 text-gray-800'
            : 'text-white'
        } ${
          message.isTriage ? 'border-l-4 border-blue-500' : ''
        } ${
          message.isTriageResult ? 'border-l-4 border-green-500 bg-green-50' : ''
        }`}
        style={{
          background: !message.isBot ? theme.primary : undefined
        }}
      >
        {message.isBot && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
            <Bot size={12} />
            {message.isTriage ? 'Triagem' : 'TecSim'}
          </div>
        )}
        <div className="whitespace-pre-wrap">{message.text}</div>
        <div className="text-xs opacity-70 mt-1">{message.time}</div>
      </div>
    </div>
  );
};

export default MessageBubble;