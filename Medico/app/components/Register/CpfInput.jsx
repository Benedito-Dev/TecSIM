import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { ThemeContext } from '../../context/ThemeContext';

export default function CpfInput({
  label = 'CPF',
  value,
  onChangeText,
  placeholder = '000.000.000-00',
  iconName = 'user',
  onValidityChange,
  theme: propTheme,
  fontSize = 16,              // 🔹 controla fontes
  scaleIcon = (size) => size, // 🔹 escala ícones
}) {
  const contextTheme = useContext(ThemeContext).theme;
  const theme = propTheme || contextTheme;
  const styles = createStyles(theme, fontSize);

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

  const handleChange = (text) => {
    const formatted = formatCpf(text);
    onChangeText(formatted);
    setIsValid(validateCpf(formatted));
  };

  useEffect(() => {
    if (onValidityChange) onValidityChange(isValid);
  }, [isValid]);

  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputContainer,
          { borderColor: value ? (isValid ? theme.success : theme.error) : theme.border },
        ]}
      >
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={theme.placeholder}
          value={value}
          onChangeText={handleChange}
          keyboardType="numeric"
          maxLength={14}
        />
        <TouchableOpacity disabled>
          <Icon name={iconName} size={scaleIcon(20)} color={theme.icon} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </>
  );
}

// ======= Styles Dinâmicos =======
const createStyles = (theme, baseFontSize = 16) => {
  const scaleFont = (size) => (size / 16) * baseFontSize;
  const scaleSpacing = (value) => (value / 16) * baseFontSize;
  const scaleRadius = (value) => (value / 16) * baseFontSize;

  return StyleSheet.create({
    label: {
      fontSize: scaleFont(16),
      fontWeight: '500',
      color: theme.textPrimary,
      marginTop: scaleSpacing(12),
      marginBottom: scaleSpacing(4),
      width: '85%',
    },
    inputContainer: {
      height: scaleSpacing(45),
      width: '85%',
      borderWidth: 1,
      borderRadius: scaleRadius(8),
      paddingHorizontal: scaleSpacing(10),
      backgroundColor: theme.backgroundCard,
      flexDirection: 'row',
      alignItems: 'center',
    },
    input: {
      flex: 1,
      fontSize: scaleFont(16),
      color: theme.textPrimary,
    },
    icon: {
      marginRight: scaleSpacing(10),
    },
  });
};
