import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { FiUser } from 'react-icons/fi'; // ícone padrão

export default function CpfInput({
  label = 'CPF',
  value,
  onChangeText,
  placeholder = '000.000.000-00',
  iconName = 'user',
  onValidityChange,
  theme: propTheme,
  fontSize = 16,
  scaleIcon = (size) => size,
}) {
  const contextTheme = useContext(ThemeContext).theme;
  const theme = propTheme || contextTheme;

  const [isValid, setIsValid] = useState(false);

  const formatCpf = (text) => {
    const digits = text.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  };

  const validateCpf = (cpf) => {
    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cleanCpf)) return false;

    let sum = 0;
    for (let i = 1; i <= 9; i++) sum += parseInt(cleanCpf.substring(i - 1, i)) * (11 - i);
    let rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) rest = 0;
    if (rest !== parseInt(cleanCpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) sum += parseInt(cleanCpf.substring(i - 1, i)) * (12 - i);
    rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) rest = 0;
    if (rest !== parseInt(cleanCpf.substring(10, 11))) return false;

    return true;
  };

  const handleChange = (e) => {
    const formatted = formatCpf(e.target.value);
    onChangeText(formatted);
    setIsValid(validateCpf(formatted));
  };

  useEffect(() => {
    if (onValidityChange) onValidityChange(isValid);
  }, [isValid]);

  const borderColor = value
    ? isValid
      ? theme.success
      : theme.error
    : theme.border;

  return (
    <div className="flex flex-col w-[85%] mt-3 mb-1">
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
        }}
      >
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          maxLength={14}
          style={{ fontSize, color: theme.textPrimary, flex: 1 }}
          className="outline-none bg-transparent"
        />
        <FiUser
          size={scaleIcon(fontSize * 1.25)}
          color={theme.icon}
          className="mr-2"
        />
      </div>
    </div>
  );
}
