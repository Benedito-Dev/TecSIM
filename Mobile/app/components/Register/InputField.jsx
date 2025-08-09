import React, { useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { ThemeContext } from '../../context/ThemeContext'; // Adjust the import path as needed

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
  showPasswordToggle = false,
}) {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

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
        {showIcon && (
          <TouchableOpacity onPress={onIconPress} disabled={!onIconPress}>
            <Icon
              name={iconName}
              size={20}
              color={theme.textMuted}
              style={{ marginRight: 10 }}
            />
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}

const createStyles = (theme) => StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.textPrimary, // Uses theme color
    marginTop: 12,
    marginBottom: 4,
    alignItems: "flex-start",
    width: "85%",
  },
  inputContainer: {
    height: 45,
    width: '85%',
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: theme.backgroundCard,
  },
  textInput: {
    flex: 1,
    color: theme.textPrimary, // Text color adapts to theme
  },
});