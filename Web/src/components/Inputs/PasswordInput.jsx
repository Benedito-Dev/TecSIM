import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function PasswordInput({
  label = 'Senha',
  onChangeText,
  onValidityChange,
  theme: propTheme,
  fontSize = 16,
}) {
  const contextTheme = useContext(ThemeContext).theme;
  const theme = propTheme || contextTheme;

  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [isValid, setIsValid] = useState(false);

  const checkRequirements = (pwd) => ({
    length: pwd.length >= 8,
    upper: /[A-Z]/.test(pwd),
    lower: /[a-z]/.test(pwd),
    number: /[0-9]/.test(pwd),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
  });

  const requirements = checkRequirements(password);

  useEffect(() => {
    const valid = Object.values(requirements).every(Boolean);
    setIsValid(valid);
  }, [password]);

  useEffect(() => {
    if (onValidityChange) {
      onValidityChange(isValid);
    }
  }, [isValid]);

  const borderColor = password ? (isValid ? theme.success : theme.error) : theme.border;

  const scale = (size) => (size / 16) * fontSize;

  return (
    <div className="w-[85%] mt-3">
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
          type={secureTextEntry ? 'password' : 'text'}
          placeholder="Digite sua senha"
          value={password}
          onChange={(e) => {
            const text = e.target.value;
            setPassword(text);
            onChangeText && onChangeText(text);
          }}
          style={{ fontSize: scale(16), color: theme.textPrimary, flex: 1 }}
          className="outline-none bg-transparent"
        />
        <button
          type="button"
          onClick={() => setSecureTextEntry(!secureTextEntry)}
          className="ml-2"
        >
          {secureTextEntry ? (
            <FiEyeOff size={scale(20)} color={theme.textSecondary} />
          ) : (
            <FiEye size={scale(20)} color={theme.textSecondary} />
          )}
        </button>
      </div>

      <div className="mt-2">
        <p style={{ color: requirements.length ? theme.success : theme.error, fontSize: scale(14), fontWeight: 'bold' }}>
          • Pelo menos 8 caracteres
        </p>
        <p style={{ color: requirements.upper ? theme.success : theme.error, fontSize: scale(14), fontWeight: 'bold' }}>
          • Pelo menos 1 letra maiúscula
        </p>
        <p style={{ color: requirements.lower ? theme.success : theme.error, fontSize: scale(14), fontWeight: 'bold' }}>
          • Pelo menos 1 letra minúscula
        </p>
        <p style={{ color: requirements.number ? theme.success : theme.error, fontSize: scale(14), fontWeight: 'bold' }}>
          • Pelo menos 1 número
        </p>
        <p style={{ color: requirements.special ? theme.success : theme.error, fontSize: scale(14), fontWeight: 'bold' }}>
          • Pelo menos 1 caractere especial
        </p>
      </div>
    </div>
  );
}
