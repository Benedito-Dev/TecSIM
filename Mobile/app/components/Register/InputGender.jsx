import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext'; // Adjust the import path as needed

export default function GenderInput({ value, onChange }) {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

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
            <View style={radioStyle(theme, value === option.value)} />
            <Text style={styles.optionText}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    width: '85%',
    marginTop: 12,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.textPrimary,
    marginBottom: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionText: {
    marginLeft: 6,
    color: theme.textPrimary,
  },
});

const radioStyle = (theme, selected) => ({
  height: 20,
  width: 20,
  borderRadius: 10,
  borderWidth: 2,
  borderColor: theme.primary,
  backgroundColor: selected ? theme.primary : 'transparent',
});