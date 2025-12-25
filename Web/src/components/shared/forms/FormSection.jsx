import React from 'react';
import { useTheme } from '../../../context/ThemeContext';

const FormSection = ({ title, subtitle, children }) => {
  const { theme } = useTheme();
  
  return (
    <div 
      className="p-6 rounded-2xl border"
      style={{
        background: theme.backgroundCard,
        borderColor: theme.border
      }}
    >
      <div className="mb-6">
        <h2 
          className="font-semibold text-2xl mb-2"
          style={{ color: theme.textPrimary }}
        >
          {title}
        </h2>
        {subtitle && (
          <p style={{ color: theme.textSecondary }}>
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  );
};

export default FormSection;