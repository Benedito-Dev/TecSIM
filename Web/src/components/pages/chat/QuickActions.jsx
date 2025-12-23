import React, { useContext, useCallback } from 'react';
import { Clock, FileText, User, Pill } from 'lucide-react';
import { useElderMode } from '../../context/ElderModeContext';
import { ThemeContext } from '../../context/ThemeContext';

const BUTTON_PRESS_DELAY = 100;

const QuickActions = ({ onButtonPress, isLoading }) => {
  const { fontSize } = useElderMode();
  const { theme } = useContext(ThemeContext);
  
  const quickSymptoms = [
    {
      id: 1,
      title: 'Dor de Cabeça',
      icon: '🤕',
      message: 'Estou com dor de cabeça'
    },
    {
      id: 2,
      title: 'Problemas Respiratórios',
      icon: '😮💨',
      message: 'Estou com dificuldade para respirar'
    },
    {
      id: 3,
      title: 'Dor Abdominal',
      icon: '🤢',
      message: 'Estou com dor na barriga'
    },
    {
      id: 4,
      title: 'Febre',
      icon: '🌡️',
      message: 'Estou com febre'
    }
  ];

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
      icon: <FileText size={16} />,
      message: 'Como solicitar uma nova prescrição médica?'
    },
    {
      id: 3,
      title: 'Alterar dados',
      icon: <User size={16} />,
      message: 'Preciso alterar meus dados pessoais'
    },
    {
      id: 4,
      title: 'Dúvidas medicamentos',
      icon: <Pill size={16} />,
      message: 'Tenho dúvidas sobre meus medicamentos'
    }
  ];

  const handlePress = useCallback((message) => {
    if (!isLoading) {
      onButtonPress(message);
    }
  }, [isLoading, onButtonPress]);

  const buttonStyle = {
    background: theme.backgroundCard,
    borderColor: theme.primary,
    color: theme.primary
  };

  const disabledButtonStyle = {
    background: theme.backgroundCard,
    borderColor: theme.borderLight,
    color: theme.textMuted
  };

  return (
    <div className="w-full px-4 max-w-4xl mx-auto">
      {/* Sintomas Comuns */}
      <div className="mb-4">
        <h3 
          className="text-sm font-semibold mb-2"
          style={{ 
            fontSize: `${fontSize * 0.9}px`,
            color: theme.textSecondary 
          }}
        >
          Sintomas Comuns:
        </h3>
        <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
          {quickSymptoms.map((action) => (
            <button
              key={action.id}
              onClick={() => handlePress(action.message)}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200 whitespace-nowrap flex-shrink-0 disabled:opacity-50 hover:scale-105"
              style={isLoading ? disabledButtonStyle : buttonStyle}
            >
              <span className="text-lg">{action.icon}</span>
              <span 
                className="text-sm font-medium"
                style={{ fontSize: `${fontSize * 0.85}px` }}
              >
                {action.title}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Ações Rápidas */}
      <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={() => handlePress(action.message)}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200 whitespace-nowrap flex-shrink-0 disabled:opacity-50 hover:scale-105"
            style={isLoading ? disabledButtonStyle : buttonStyle}
          >
            <div style={{ color: isLoading ? theme.textMuted : theme.primary }}>
              {action.icon}
            </div>
            <span 
              className="text-sm font-medium"
              style={{ fontSize: `${fontSize * 0.85}px` }}
            >
              {action.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;