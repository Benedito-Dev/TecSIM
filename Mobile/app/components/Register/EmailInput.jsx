import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { ThemeContext } from '../../context/ThemeContext';

export default function EmailInput({
  label = "E-mail",
  value,
  onChangeText,
  placeholder = 'exemplo@gmail.com',
  iconName = 'mail',
  onValidityChange,
  theme: propTheme,
  fontSize = 16,              // 🔹 controla fontes
  scaleIcon = (size) => size, // 🔹 escala ícones
}) {
  const contextTheme = useContext(ThemeContext).theme;
  const theme = propTheme || contextTheme;
  const styles = createStyles(theme, fontSize);

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

  const handleChange = (text) => {
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
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, { borderColor: getBorderColor() }]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={handleChange}
          placeholderTextColor={theme.placeholder}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TouchableOpacity disabled>
          <Icon
            name={iconName}
            size={scaleIcon(20)} // 🔹 ícone escalável
            color={theme.icon}
            style={styles.icon}
          />
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
