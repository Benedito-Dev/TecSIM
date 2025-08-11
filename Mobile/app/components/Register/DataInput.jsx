import React, { useState, useEffect, useContext } from 'react';
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
import { ThemeContext } from '../../context/ThemeContext';

export default function DateInput({
  label = 'Data',
  value,
  onChange,
  placeholder = 'Selecione uma data',
  onValidityChange,
  theme: propTheme,
}) {
  const contextTheme = useContext(ThemeContext).theme;
  const theme = propTheme || contextTheme;
  const styles = createStyles(theme);

  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [isValid, setIsValid] = useState(false);

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

  if (Platform.OS === 'web') {
    return (
      <View style={{ width: '85%' }}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          type="date"
          style={[
            webStyles.inputContainer,
            { borderColor: value ? (isValid ? theme.success : theme.error) : theme.border }
          ]}
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
      <TouchableOpacity
        style={[
          styles.inputContainer,
          { borderColor: value ? (isValid ? theme.success : theme.error) : theme.border }
        ]}
        onPress={() => setShowPicker(true)}
      >
        <Text style={[styles.inputText, !value && { color: theme.placeholder }]}>
          {value ? formatDateToBrazilian(value) : placeholder}
        </Text>
        <Icon name="calendar" size={20} color={theme.icon} />
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
                style={{ backgroundColor: theme.backgroundCard }}
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

const createStyles = (theme) =>
  StyleSheet.create({
    label: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.textPrimary,
      marginTop: 12,
      marginBottom: 4,
      width: '85%',
    },
    inputContainer: {
      height: 45,
      width: '85%',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 10,
      backgroundColor: theme.backgroundCard,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    inputText: {
      fontSize: 15,
      color: theme.textPrimary,
    },
    modalBackground: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalContent: {
      backgroundColor: theme.backgroundCard,
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
      color: theme.error,
      fontWeight: 'bold',
      fontSize: 16,
    },
    confirmText: {
      color: theme.primary,
      fontWeight: 'bold',
      fontSize: 16,
    },
  });

const webStyles = {
  inputContainer: {
    height: 45,
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
};
