import React from 'react';
import { useTheme } from '../../../context/ThemeContext';

const ErrorState = ({ error }) => {
  const { theme } = useTheme();

  return (
    <div 
      className="border rounded-xl p-6 text-center"
      style={{
        background: theme.backgroundSecondary,
        borderColor: theme.error,
        color: theme.textPrimary
      }}
    >
      <p style={{ color: theme.error }} className="font-medium">{error}</p>
      <button 
        onClick={() => window.location.reload()}
        style={{
          background: theme.error,
          color: theme.textOnError
        }}
        className="mt-3 px-4 py-2 rounded-lg hover:opacity-90 transition-colors"
      >
        Tentar Novamente
      </button>
    </div>
  );
};

export default ErrorState;