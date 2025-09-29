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
  theme: propTheme
}) {
  const [isValid, setIsValid] = useState(null); // null: sem digitação ainda

  const contextTheme = useContext(ThemeContext).theme;
  const theme = propTheme || contextTheme;
  const styles = createStyles(theme);

  const handleChange = (text) => {
    // Remove tudo que não é número
    const onlyNumbers = text.replace(/[^0-9]/g, '');

    const numericValue = Number(onlyNumbers);

    onChangeText(onlyNumbers);

    if (onlyNumbers.length === 0) {
      setIsValid(null);
    } else if (numericValue >= minWeight && numericValue <= maxWeight) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  // Notifica componente pai sobre validade
  useEffect(() => {
    if (onValidityChange) {
      onValidityChange(isValid === true);
    }
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
      flexDirection: 'row',
      alignItems: 'center',
      width: '85%',
      height: 45,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 10,
      backgroundColor: theme.backgroundCard,
    },
    valid: {
      color: theme.success,
      fontSize: 14,
      fontWeight: 'bold',
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: theme.textPrimary,
    },
    invalid: {
      color: theme.error,
      fontSize: 14,
    },
    kgText: {
      fontSize: 16,
      color: '#555',
      marginLeft: 8,
    },
  });
