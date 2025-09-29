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
}) {
  const contextTheme = useContext(ThemeContext).theme;
  const theme = propTheme || contextTheme;
  const styles = createStyles(theme);

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
          <Icon name={iconName} size={20} color={theme.icon} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    label: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.textPrimary,
      marginTop: 12,
      marginBottom: 4,
      width: '85%',
    },
    inputContainer: {
      height: 45,
      width: '85%',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 10,
      backgroundColor: theme.backgroundCard,
      flexDirection: 'row',
      alignItems: 'center',
    },
    input: {
      flex: 1,
      color: theme.textPrimary,
    },
    icon: {
      marginRight: 10,
    },
  });
