import React from 'react';
import { useTheme } from '../../../context/ThemeContext';

const SelectField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options, 
  error, 
  required = false 
}) => {
  const { theme } = useTheme();
  
  return (
    <div>
      <label 
        className="block text-sm font-medium mb-1"
        style={{ color: theme.textPrimary }}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        style={{
          background: theme.background,
          border: `1px solid ${error ? theme.error : theme.border}`,
          color: theme.textPrimary
        }}
        className={`w-full rounded-lg p-3 focus:ring-2 focus:border-transparent outline-none transition ${
          error ? "bg-red-50" : ""
        }`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="text-red-600 text-sm mt-1 block">{error}</span>}
    </div>
  );
};

export default SelectField;