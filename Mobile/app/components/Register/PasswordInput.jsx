import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { ThemeContext } from '../../context/ThemeContext';

export default function PasswordInput({
  label = 'Senha',
  onChangeText,
  onValidityChange,
  theme: propTheme,
}) {
  const contextTheme = useContext(ThemeContext).theme;
  const theme = propTheme || contextTheme;
  const styles = createStyles(theme);

  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [isValid, setIsValid] = useState(false);

  const checkRequirements = (pwd) => ({
    length: pwd.length >= 8,
    upper: /[A-Z]/.test(pwd),
    lower: /[a-z]/.test(pwd),
    number: /[0-9]/.test(pwd),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
  });

  const requirements = checkRequirements(password);

  useEffect(() => {
    const valid = Object.values(requirements).every(Boolean);
    setIsValid(valid);
  }, [password]);

  useEffect(() => {
    if (onValidityChange) {
      onValidityChange(isValid);
    }
  }, [isValid]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.input,
          { flexDirection: 'row', alignItems: 'center', borderColor: password ? (isValid ? theme.success : theme.error) : theme.border },
        ]}
      >
        <TextInput
          style={{ flex: 1, color: theme.textPrimary }}
          placeholder="Digite sua senha"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            onChangeText && onChangeText(text);
          }}
          placeholderTextColor={theme.placeholder}
          secureTextEntry={secureTextEntry}
        />
        <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
          <Icon
            name={secureTextEntry ? 'eye-off' : 'eye'}
            size={20}
            color={theme.icon}
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>
      </View>

      {/* Lista de requisitos */}
      <View style={styles.requirements}>
        <Text style={requirements.length ? styles.valid : styles.invalid}>• Pelo menos 8 caracteres</Text>
        <Text style={requirements.upper ? styles.valid : styles.invalid}>• Pelo menos 1 letra maiúscula</Text>
        <Text style={requirements.lower ? styles.valid : styles.invalid}>• Pelo menos 1 letra minúscula</Text>
        <Text style={requirements.number ? styles.valid : styles.invalid}>• Pelo menos 1 número</Text>
        <Text style={requirements.special ? styles.valid : styles.invalid}>• Pelo menos 1 caractere especial</Text>
      </View>
    </View>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      width: '85%',
      marginTop: 12,
    },
    label: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.textPrimary,
      marginBottom: 4,
    },
    input: {
      height: 45,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 10,
      backgroundColor: theme.backgroundCard,
    },
    requirements: {
      marginTop: 8,
    },
    valid: {
      color: theme.success,
      fontSize: 14,
      fontWeight: 'bold',
    },
    invalid: {
      color: theme.error,
      fontSize: 14,
    },
  });
