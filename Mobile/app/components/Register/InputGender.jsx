import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';

export default function GenderInput({
  value,
  onChange,
  theme: propTheme,
  fontSize = 16, // controla escala
}) {
  const contextTheme = useContext(ThemeContext).theme;
  const theme = propTheme || contextTheme;

  const scaleFont = (size) => (size / 16) * fontSize;
  const scaleSpacing = (value) => (value / 16) * fontSize;
  const scaleRadius = (value) => (value / 16) * fontSize;

  const styles = createStyles(theme, scaleFont, scaleSpacing, scaleRadius);

  const options = [
    { label: 'Homem', value: 'man' },
    { label: 'Mulher', value: 'woman' },
    { label: 'Prefiro não dizer', value: 'neutral' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Gênero</Text>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            onPress={() => onChange(option.value)}
            style={styles.option}
          >
            <View style={radioStyle(theme, value === option.value, scaleRadius)} />
            <Text style={styles.optionText}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const createStyles = (theme, scaleFont, scaleSpacing, scaleRadius) =>
  StyleSheet.create({
    container: {
      width: '85%',
      marginTop: scaleSpacing(12),
      marginBottom: scaleSpacing(12),
    },
    label: {
      fontSize: scaleFont(16),
      fontWeight: '500',
      color: theme.textPrimary,
      marginBottom: scaleSpacing(8),
    },
    optionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: scaleSpacing(8),
    },
    optionText: {
      marginLeft: scaleSpacing(6),
      fontSize: scaleFont(16),
      color: theme.textPrimary,
    },
  });

// ======= radio adaptado =======
const radioStyle = (theme, selected, scaleRadius) => ({
  height: scaleRadius(20),
  width: scaleRadius(20),
  borderRadius: scaleRadius(10),
  borderWidth: 2,
  borderColor: theme.primary,
  backgroundColor: selected ? theme.primary : 'transparent',
});
