import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { FiEye, FiEyeOff } from 'react-icons/fi'; // exemplo de ícones, pode trocar conforme iconName

export default function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'text',
  iconName,
  showIcon = true,
  onIconPress = null,
  theme: propTheme,
  fontSize = 16,
  scaleIcon = (size) => size,
}) {
  const contextTheme = useContext(ThemeContext).theme;
  const theme = propTheme || contextTheme;

  // Mapear iconName para react-icons (exemplo simples)
  const getIconComponent = () => {
    switch (iconName) {
      case 'eye':
        return secureTextEntry ? <FiEyeOff /> : <FiEye />;
      case 'mail':
        return <FiEye />; // só placeholder, substitua conforme necessário
      default:
        return <FiEye />; // ícone padrão
    }
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
          borderColor: theme.border,
          backgroundColor: theme.backgroundCard,
          height: `${fontSize * 2.8}px`,
        }}
      >
        <input
          type={secureTextEntry ? 'password' : keyboardType}
          placeholder={placeholder}
          value={value || ''}
          onChange={(e) => onChangeText(e.target.value)}
          style={{ fontSize, color: theme.textPrimary, flex: 1 }}
          className="outline-none bg-transparent"
        />
        {showIcon && iconName && (
          <button
            onClick={onIconPress}
            disabled={!onIconPress}
            className="ml-2"
            style={{ cursor: onIconPress ? 'pointer' : 'default' }}
          >
            {React.cloneElement(getIconComponent(), {
              size: scaleIcon(fontSize * 1.25),
              color: theme.textMuted,
            })}
          </button>
        )}
      </div>
    </div>
  );
}
