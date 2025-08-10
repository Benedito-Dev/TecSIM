import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
  Pressable,
  TextInput,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Feather';

export default function DateInput({ label, value, onChange, placeholder = 'Selecione uma data', onValidityChange }) {
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [isValid, setIsValid] = useState(false);

  // Verifica validade da data (campo não vazio e formato YYYY-MM-DD)
  useEffect(() => {
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [value]);

  useEffect(() => {
    if (onValidityChange) {
      onValidityChange(isValid);
    }
  }, [isValid]);

  const handleChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
      if (selectedDate) {
        const formatted = formatDate(selectedDate);
        onChange(formatted);
      }
    } else {
      if (selectedDate) setTempDate(selectedDate);
    }
  };

  const handleConfirmIOS = () => {
    setShowPicker(false);
    const formatted = formatDate(tempDate);
    onChange(formatted);
  };

  const formatDate = (date) => {
    return date.getFullYear() + '-' +
      String(date.getMonth() + 1).padStart(2, '0') + '-' +
      String(date.getDate()).padStart(2, '0');
  };

  const formatDateToBrazilian = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  if (Platform.OS === 'web') {
    return (
      <View style={{ width: '85%' }}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          type="date"
          style={webStyles.inputContainer}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </View>
    );
  }

  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.inputContainer} onPress={() => setShowPicker(true)}>
        <Text style={[styles.inputText, !value && { color: 'gray' }]}>
          {value ? formatDateToBrazilian(value) : placeholder}
        </Text>
        <Icon name="calendar" size={20} color="#888" />
      </TouchableOpacity>

      {Platform.OS === 'android' && showPicker && (
        <DateTimePicker
          mode="date"
          display="default"
          value={value ? new Date(value) : new Date()}
          onChange={handleChange}
          themeVariant="light"
        />
      )}

      {Platform.OS === 'ios' && (
        <Modal visible={showPicker} transparent animationType="slide">
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <DateTimePicker
                mode="date"
                display="spinner"
                value={value ? new Date(value) : tempDate}
                onChange={handleChange}
                themeVariant="light"
                style={{ backgroundColor: '#fff' }}
              />
              <View style={styles.modalButtons}>
                <Pressable onPress={() => setShowPicker(false)} style={styles.cancelBtn}>
                  <Text style={styles.cancelText}>Cancelar</Text>
                </Pressable>
                <Pressable onPress={handleConfirmIOS} style={styles.confirmBtn}>
                  <Text style={styles.confirmText}>Confirmar</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
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
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: '#fff',
    paddingTop: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  cancelBtn: {
    padding: 10,
  },
  confirmBtn: {
    padding: 10,
  },
  cancelText: {
    color: '#ff4444',
    fontWeight: 'bold',
    fontSize: 16,
  },
  confirmText: {
    color: '#0097b2',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

const webStyles = {
  inputContainer: {
    height: 45,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
};
