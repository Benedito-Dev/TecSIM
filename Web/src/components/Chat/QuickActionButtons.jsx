import React, { useContext } from 'react';
import { Clock, FilePlus, User, Package } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';

const QuickActionButtons = ({ onButtonPress, isLoading }) => {
  const { theme } = useContext(ThemeContext);

  const quickActions = [
    {
      id: 1,
      title: 'Ver histórico',
      icon: <Clock size={16} />,
      message: 'Gostaria de ver meu histórico médico'
    },
    {
      id: 2,
      title: 'Nova prescrição',
      icon: <FilePlus size={16} />,
      message: 'Como solicitar uma nova prescrição médica?'
    },
    {
      id: 3,
      title: 'Alterar dados pessoais',
      icon: <User size={16} />,
      message: 'Preciso alterar meus dados pessoais'
    },
    {
      id: 6,
      title: 'Dúvidas sobre medicamentos',
      icon: <Package size={16} />,
      message: 'Tenho dúvidas sobre meus medicamentos'
    }
  ];

  const handlePress = (message) => {
    if (!isLoading) {
      onButtonPress(message);
    }
  };

  return (
    <div className="w-full mb-4">
      <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={() => handlePress(action.message)}
            disabled={isLoading}
            className={`
              flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200 whitespace-nowrap flex-shrink-0
              ${isLoading 
                ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed' 
                : `bg-white border-${theme.primary} text-${theme.primary} hover:bg-${theme.primary} hover:text-white cursor-pointer`
              }
            `}
            style={{
              borderColor: isLoading ? '#d1d5db' : theme.primary,
              color: isLoading ? '#9ca3af' : theme.primary,
              backgroundColor: isLoading ? '#f3f4f6' : '#ffffff'
            }}
          >
            <div 
              style={{ 
                color: isLoading ? '#9ca3af' : theme.primary 
              }}
              className="transition-colors duration-200"
            >
              {action.icon}
            </div>
            <span className="text-sm font-medium transition-colors duration-200">
              {action.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActionButtons;