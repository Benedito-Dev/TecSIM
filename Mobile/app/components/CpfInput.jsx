import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export default function CpfInput({
  label,
  value,
  onChangeText,
  placeholder = '000.000.000-00',
  iconName = 'user',
}) {
  const [isValid, setIsValid] = useState(false);

  const formatCpf = (text) => {
    const digits = text.replace(/\D/g, '').slice(0, 11);
    let cpf = '';

    if (digits.length <= 3) {
      cpf = digits;
    } else if (digits.length <= 6) {
      cpf = `${digits.slice(0, 3)}.${digits.slice(3)}`;
    } else if (digits.length <= 9) {
      cpf = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    } else {
      cpf = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
    }

    return cpf;
  };

  const validateCpf = (cpf) => {
    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length !== 11) return false;

    // impede CPFs como 111.111.111-11
    if (/^(\d)\1+$/.test(cleanCpf)) return false;

    let sum = 0;
    let rest;

    for (let i = 1; i <= 9; i++) sum += parseInt(cleanCpf.substring(i - 1, i)) * (11 - i);
    rest = (sum * 10) % 11;
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
    setIsValid(validateCpf(formatted)); // só seta aqui
  };

  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.input, { borderColor: value ? (isValid ? 'green' : 'red') : '#ccc' }]}>
        <TextInput
          style={{ flex: 1 }}
          placeholder={placeholder}
          value={value}
          onChangeText={handleChange}
          placeholderTextColor="gray"
          keyboardType="numeric"
          maxLength={14}
        />
        <TouchableOpacity disabled>
          <Icon name={iconName} size={20} color="gray" style={{ marginRight: 10 }} />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginTop: 12,
    marginBottom: 4,
    alignItems: 'flex-start',
    width: '85%',
  },
  input: {
    height: 45,
    width: '85%',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
