import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Feather';

export default function DateInput({ label, value, onChange, placeholder = 'Selecione uma data' }) {
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      const formatted = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
      onChange(formatted);
    }
  };

  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.inputContainer} onPress={() => setShowPicker(true)}>
        <Text style={[styles.inputText, !value && { color: 'gray' }]}>
          {value || placeholder}
        </Text>
        <Icon name="calendar" size={20} color="#888" />
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          value={value ? new Date(value) : new Date()}
          onChange={handleDateChange}
          themeVariant="light" // 👈 ISSO RESOLVE O PROBLEMA DE VISIBILIDADE
        />
      )}
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
    width: '85%',
  },
  inputContainer: {
    height: 45,
    width: '85%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputText: {
    fontSize: 15,
    color: '#000',
  },
});
