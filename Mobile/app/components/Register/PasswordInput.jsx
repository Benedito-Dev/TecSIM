import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export default function PasswordInput({ label, onChangeText, onValidityChange }) {
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  // Função para verificar requisitos
  const checkRequirements = (pwd) => {
    return {
      length: pwd.length >= 8,
      upper: /[A-Z]/.test(pwd),
      lower: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    };
  };

  const requirements = checkRequirements(password);

  // Verifica se todos os requisitos são true
  const isValid = Object.values(requirements).every(Boolean);

  useEffect(() => {
    if (onValidityChange) {
      onValidityChange(isValid);
    }
  }, [isValid]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label || 'Senha'}</Text>
      <View style={[styles.input, { flexDirection: 'row', alignItems: 'center' }]}>
        <TextInput
          style={{ flex: 1 }}
          placeholder="Digite sua senha"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            onChangeText && onChangeText(text);
          }}
          placeholderTextColor="gray"
          secureTextEntry={secureTextEntry}
        />
        <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
          <Icon
            name={secureTextEntry ? 'eye-off' : 'eye'}
            size={20}
            color="gray"
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>
      </View>

      {/* Lista de requisitos */}
      <View style={styles.requirements}>
        <Text style={requirements.length ? styles.valid : styles.invalid}>
          • Pelo menos 8 caracteres
        </Text>
        <Text style={requirements.upper ? styles.valid : styles.invalid}>
          • Pelo menos 1 letra maiúscula
        </Text>
        <Text style={requirements.lower ? styles.valid : styles.invalid}>
          • Pelo menos 1 letra minúscula
        </Text>
        <Text style={requirements.number ? styles.valid : styles.invalid}>
          • Pelo menos 1 número
        </Text>
        <Text style={requirements.special ? styles.valid : styles.invalid}>
          • Pelo menos 1 caractere especial
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '85%',
    marginTop: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  requirements: {
    marginTop: 8,
  },
  valid: {
    color: 'green',
    fontSize: 14,
    fontWeight: 'bold',
  },
  invalid: {
    color: 'red',
    fontSize: 14,
  },
});
