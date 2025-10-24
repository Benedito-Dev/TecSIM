import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

export default function PesoInput({
  label,
  value,
  onChangeText,
  placeholder = 'Ex: 70',
  minWeight = 30,
  maxWeight = 300,
  onValidityChange,
  theme: propTheme,
  fontSize = 16,
}) {
  const [isValid, setIsValid] = useState(null);
  const contextTheme = useContext(ThemeContext).theme;
  const theme = propTheme || contextTheme;

  const scale = (size) => (size / 16) * fontSize;

  const handleChange = (text) => {
    const onlyNumbers = text.replace(/[^0-9]/g, '');
    const numericValue = Number(onlyNumbers);
    onChangeText(onlyNumbers);

    if (onlyNumbers.length === 0) setIsValid(null);
    else if (numericValue >= minWeight && numericValue <= maxWeight) setIsValid(true);
    else setIsValid(false);
  };

  useEffect(() => {
    if (onValidityChange) onValidityChange(isValid === true);
  }, [isValid]);

  const borderColor =
    isValid === null ? '#ccc' : isValid ? theme.success : theme.error;

  return (
    <div className="w-[100%] mt-3">
      <label
        className="block mb-1 font-medium"
        style={{ fontSize: scale(16), color: theme.textPrimary }}
      >
        {label}
      </label>
      <div
        className="flex items-center px-2 rounded-md"
        style={{
          borderWidth: '1px',
          borderColor: borderColor,
          backgroundColor: theme.backgroundCard,
          height: `${scale(45)}px`,
        }}
      >
        <input
          type="text"
          placeholder={placeholder}
          value={value || ''}
          onChange={(e) => handleChange(e.target.value)}
          maxLength={3}
          style={{ fontSize: scale(16), color: theme.textPrimary, flex: 1 }}
          className="outline-none bg-transparent"
        />
        <span
          className="ml-2"
          style={{ fontSize: scale(16), color: '#555' }}
        >
          kg
        </span>
      </div>
    </div>
  );
}
