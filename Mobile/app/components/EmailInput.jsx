import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export default function EmailInput({
  label,
  value,
  onChangeText,
  placeholder = 'exemplo@gmail.com',
  iconName = 'mail',
}) {
  const [isValid, setIsValid] = useState(null); // null = ainda não digitou

  const validDomains = [
    'gmail.com',
    'yahoo.com',
    'outlook.com',
    'hotmail.com',
    'icloud.com',
    'live.com'
  ];

  const validateEmail = (text) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(text)) return false;

    const domain = text.split('@')[1]?.toLowerCase();
    return validDomains.includes(domain);
  };

  const handleChange = (text) => {
    onChangeText(text);
    if (text.trim() === '') {
      setIsValid(null); // volta para cinza se apagar tudo
    } else {
      setIsValid(validateEmail(text));
    }
  };

  // Define cor da borda conforme estado
  const getBorderColor = () => {
    if (isValid === null) return 'gray'; // inicial / vazio
    return isValid ? 'green' : 'red';
  };

  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.input, { borderColor: getBorderColor() }]}>
        <TextInput
          style={{ flex: 1 }}
          placeholder={placeholder}
          value={value}
          onChangeText={handleChange}
          placeholderTextColor="gray"
          keyboardType="email-address"
          autoCapitalize="none"
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
