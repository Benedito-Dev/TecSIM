import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import MessageBubble from './MessageBubble';
import BouncingDots from './BouncingDots';

const MessageList = ({ messages, isLoading, messagesEndRef }) => {
  const { theme } = useTheme();

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      
      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-gray-100 p-3 rounded-lg">
            <BouncingDots color={theme.primary} />
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;