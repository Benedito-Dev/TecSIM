import React from 'react';
import { useTheme } from '../../../context/ThemeContext';

const RadioGroup = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options 
}) => {
  const { theme } = useTheme();
  
  return (
    <div>
      <label 
        className="block text-sm font-medium mb-3"
        style={{ color: theme.textPrimary }}
      >
        {label}
      </label>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-3">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              className="w-4 h-4 focus:ring-2"
              style={{ color: theme.primary }}
            />
            <span style={{ color: theme.textPrimary }}>
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioGroup;