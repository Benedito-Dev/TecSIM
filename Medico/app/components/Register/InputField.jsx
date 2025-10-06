import React, { useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { ThemeContext } from '../../context/ThemeContext'; // ajuste se necessário

export default function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  iconName,
  showIcon = true,
  onIconPress = null,
  theme: propTheme,
  fontSize = 16,               // 🔹 controla fontes
  scaleIcon = (size) => size,  // 🔹 escala ícones
}) {
  const contextTheme = useContext(ThemeContext).theme;
  const theme = propTheme || contextTheme;
  const styles = createStyles(theme, fontSize);

  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, { flexDirection: 'row', alignItems: 'center' }]}>
        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor={theme.textMuted}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
        />
        {showIcon && iconName && (
          <TouchableOpacity onPress={onIconPress} disabled={!onIconPress}>
            <Icon
              name={iconName}
              size={scaleIcon(20)} // 🔹 ícone escalável
              color={theme.textMuted}
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
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
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: scaleRadius(8),
      paddingHorizontal: scaleSpacing(10),
      backgroundColor: theme.backgroundCard,
      flexDirection: 'row',
      alignItems: 'center',
    },
    textInput: {
      flex: 1,
      fontSize: scaleFont(16),
      color: theme.textPrimary,
    },
    icon: {
      marginRight: scaleSpacing(10),
    },
  });
};
