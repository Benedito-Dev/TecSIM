import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export default function CpfInput({
  label,
  value,
  onChangeText,
  placeholder = '000.000.000-00',
  iconName = 'user',
}) {
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

  const handleChange = (text) => {
    const formatted = formatCpf(text);
    onChangeText(formatted);
  };

  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.input}>
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
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
