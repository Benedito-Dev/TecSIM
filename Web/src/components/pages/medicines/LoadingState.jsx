import React from 'react';
import { FaSpinner } from 'react-icons/fa';
import { useTheme } from '../../../context/ThemeContext';

const LoadingState = ({ message = "Carregando..." }) => {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <FaSpinner 
        className="animate-spin text-4xl mb-4" 
        style={{ color: theme.primary }}
      />
      <p style={{ color: theme.textSecondary }}>
        {message}
      </p>
    </div>
  );
};

export default LoadingState;