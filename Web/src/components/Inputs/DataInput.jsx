import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { FiCalendar } from 'react-icons/fi';

export default function DateInput({
  label = 'Data',
  value,
  onChange,
  placeholder = 'Selecione uma data',
  onValidityChange,
  theme: propTheme,
  fontSize = 16,
  scaleIcon = (size) => size,
}) {
  const contextTheme = useContext(ThemeContext).theme;
  const theme = propTheme || contextTheme;

  const [isValid, setIsValid] = useState(false);

  // Validação simples: YYYY-MM-DD
  useEffect(() => {
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [value]);

  useEffect(() => {
    if (onValidityChange) onValidityChange(isValid);
  }, [isValid]);

  const formatDateToBrazilian = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const borderColor = value
    ? isValid
      ? theme.success
      : theme.error
    : theme.border;

  return (
    <div className="flex flex-col w-[100%] mt-3 mb-1">
      <label
        className="mb-1 font-medium"
        style={{ fontSize, color: theme.textPrimary }}
      >
        {label}
      </label>
      <div
        className="flex items-center px-2 rounded-md"
        style={{
          borderWidth: '1px',
          borderColor: borderColor,
          backgroundColor: theme.backgroundCard,
          height: `${fontSize * 2.8}px`,
          justifyContent: 'space-between',
        }}
      >
        <input
          type="date"
          placeholder={placeholder}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          style={{ fontSize, color: theme.textPrimary, flex: 1 }}
          className="outline-none bg-transparent"
        />
        <FiCalendar
          size={scaleIcon(fontSize * 1.25)}
          color={theme.icon}
          className="ml-2"
        />
      </div>
      {value && !isValid && (
        <span className="text-sm mt-1" style={{ color: theme.error }}>
          Data inválida
        </span>
      )}
    </div>
  );
}
