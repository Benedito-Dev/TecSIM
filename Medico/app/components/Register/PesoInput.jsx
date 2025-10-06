import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
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
  fontSize = 16,             // 🔹 controla fontes
  scaleIcon = (size) => size, // 🔹 caso queira usar em algum ícone futuro
}) {
  const [isValid, setIsValid] = useState(null);

  const contextTheme = useContext(ThemeContext).theme;
  const theme = propTheme || contextTheme;
  const styles = createStyles(theme, fontSize);

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

  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputContainer,
          { borderColor: isValid === null ? '#ccc' : isValid ? 'green' : 'red' },
        ]}
      >
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          keyboardType="numeric"
          value={value}
          onChangeText={handleChange}
          maxLength={3}
        />
        <Text style={styles.kgText}>kg</Text>
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
      flexDirection: 'row',
      alignItems: 'center',
      width: '85%',
      height: scaleSpacing(45),
      borderWidth: 1,
      borderRadius: scaleRadius(8),
      paddingHorizontal: scaleSpacing(10),
      backgroundColor: theme.backgroundCard,
    },
    input: {
      flex: 1,
      fontSize: scaleFont(16),
      color: theme.textPrimary,
    },
    kgText: {
      fontSize: scaleFont(16),
      color: '#555',
      marginLeft: scaleSpacing(8),
    },
    valid: {
      color: theme.success,
      fontSize: scaleFont(14),
      fontWeight: 'bold',
    },
    invalid: {
      color: theme.error,
      fontSize: scaleFont(14),
    },
  });
};
