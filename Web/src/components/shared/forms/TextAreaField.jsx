import React from 'react';
import { useTheme } from '../../../context/ThemeContext';

const TextAreaField = ({ 
  name, 
  value, 
  onChange, 
  placeholder, 
  rows = 3, 
  error 
}) => {
  const { theme } = useTheme();
  
  return (
    <div>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        style={{
          background: theme.background,
          border: `1px solid ${error ? theme.error : theme.border}`,
          color: theme.textPrimary
        }}
        className={`w-full rounded-lg p-3 focus:ring-2 focus:border-transparent outline-none transition ${
          error ? "bg-red-50" : ""
        }`}
      />
      {error && <span className="text-red-600 text-sm mt-1 block">{error}</span>}
    </div>
  );
};

export default TextAreaField;