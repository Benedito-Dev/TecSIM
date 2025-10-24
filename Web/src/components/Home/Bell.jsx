import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';

const NotificationIcon = ({ initialCount = 0, onPress, iconSize = 24 }) => {
  const [count, setCount] = useState(initialCount);

  // Atualiza se o initialCount mudar externamente
  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  const handlePress = () => {
    // Reduz o contador ao clicar (mínimo 0)
    const newCount = Math.max(0, count - 1);
    setCount(newCount);
    
    // Chama a função personalizada se fornecida
    if (onPress) {
      onPress(newCount);
    } else {
      console.log('Notificações pressionadas', newCount);
    }
  };

  return (
    <button 
      onClick={handlePress}
      className="relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    >
      <Bell size={iconSize} className="text-white" />
      
      {count > 0 && (
        <div className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
          <span className="text-white text-xs font-bold">
            {count > 9 ? '9+' : count}
          </span>
        </div>
      )}
    </button>
  );
};

export default NotificationIcon;