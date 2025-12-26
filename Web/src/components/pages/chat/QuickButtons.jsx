import React from 'react';
import { useTheme } from '../../../context/ThemeContext';

const QuickButtons = ({ onQuickButton, isLoading }) => {
  const { theme } = useTheme();

  const quickButtons = [
    { 
      text: "Acompanhamento", 
      message: "Quero meu acompanhamento farmacêutico",
      icon: "📋",
      color: "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
    },
    { 
      text: "Miligramas de Medicação", 
      message: "Preciso verificar as miligramas corretas dos meus medicamentos",
      icon: "💊",
      color: "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
    },
    { 
      text: "Interações Perigosas", 
      message: "Quero saber se há interações perigosas entre os meus medicamentos",
      icon: "⚠️",
      color: "bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
    }
  ];

  return (
    <div className="px-3 py-2" style={{ background: theme.backgroundCard }}>
      <div className="text-xs mb-2 font-medium" style={{ color: theme.textPrimary }}>
        💊 Consultas Rápidas:
      </div>
      <div className="grid grid-cols-3 gap-1">
        {quickButtons.map((button, index) => (
          <button
            key={index}
            onClick={() => onQuickButton(button.message)}
            disabled={isLoading}
            className={`text-xs px-2 py-2 border rounded-lg transition-colors disabled:opacity-50 text-center flex flex-col items-center gap-1 hover:shadow-sm ${button.color}`}
          >
            <span className="text-sm">{button.icon}</span>
            <span className="leading-tight">{button.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickButtons;