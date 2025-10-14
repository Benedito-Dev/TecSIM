import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { FiMail } from 'react-icons/fi';

export default function EmailInput({
  label = "E-mail",
  value,
  onChangeText,
  placeholder = 'exemplo@gmail.com',
  iconName = 'mail',
  onValidityChange,
  theme: propTheme,
  fontSize = 16,
  scaleIcon = (size) => size,
}) {
  const contextTheme = useContext(ThemeContext).theme;
  const theme = propTheme || contextTheme;

  const [isValid, setIsValid] = useState(null);

  const validDomains = [
    'gmail.com',
    'yahoo.com',
    'outlook.com',
    'hotmail.com',
    'icloud.com',
    'live.com'
  ];

  const validateEmail = (text) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(text)) return false;

    const domain = text.split('@')[1]?.toLowerCase();
    return validDomains.includes(domain);
  };

  const handleChange = (e) => {
    const text = e.target.value;
    onChangeText(text);
    if (text.trim() === '') {
      setIsValid(null);
    } else {
      setIsValid(validateEmail(text));
    }
  };

  useEffect(() => {
    if (onValidityChange) {
      onValidityChange(isValid === true);
    }
  }, [isValid]);

  const getBorderColor = () => {
    if (isValid === null) return theme.border;
    return isValid ? theme.success : theme.error;
  };

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
          borderColor: getBorderColor(),
          backgroundColor: theme.backgroundCard,
          height: `${fontSize * 2.8}px`,
        }}
      >
        <input
          type="email"
          placeholder={placeholder}
          value={value || ''}
          onChange={handleChange}
          style={{ fontSize, color: theme.textPrimary, flex: 1 }}
          className="outline-none bg-transparent"
        />
        <FiMail
          size={scaleIcon(fontSize * 1.25)}
          color={theme.icon}
          className="ml-2"
        />
      </div>
      {isValid === false && (
        <span className="text-sm mt-1" style={{ color: theme.error }}>
          E-mail inválido
        </span>
      )}
    </div>
  );
}
