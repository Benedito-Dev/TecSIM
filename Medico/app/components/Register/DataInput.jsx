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
  fontSize = 16,              // 🔹 controla fontes
  scaleIcon = (size) => size, // 🔹 escala ícones
}) {
  const contextTheme = useContext(ThemeContext).theme;
  const theme = propTheme || contextTheme;
  const styles = createStyles(theme, fontSize);

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
    if (onValidityChange) onValidityChange(isValid);
  }, [isValid]);

  const formatDate = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  const formatDateToBrazilian = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
      if (selectedDate) onChange(formatDate(selectedDate));
    } else {
      if (selectedDate) setTempDate(selectedDate);
    }
  };

  const handleConfirmIOS = () => {
    setShowPicker(false);
    onChange(formatDate(tempDate));
  };

  if (Platform.OS === 'web') {
    return (
      <View style={{ width: '85%' }}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          type="date"
          style={[
            webStyles.inputContainer,
            { borderColor: value ? (isValid ? theme.success : theme.error) : theme.border, fontSize }
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
        style={[styles.inputContainer, { borderColor: value ? (isValid ? theme.success : theme.error) : theme.border }]}
        onPress={() => setShowPicker(true)}
      >
        <Text style={[styles.inputText, !value && { color: theme.placeholder }]}>
          {value ? formatDateToBrazilian(value) : placeholder}
        </Text>
        <Icon name="calendar" size={scaleIcon(20)} color={theme.icon} />
      </TouchableOpacity>

      {Platform.OS === 'android' && showPicker && (
        <DateTimePicker
          mode="date"
          display="default"
          value={value ? new Date(value) : new Date()}
          locale="pt-BR"
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
                locale="pt-BR"
                themeVariant="light"
                style={{ backgroundColor: theme.backgroundCard }}
              />
              <View style={styles.modalButtons}>
                <Pressable onPress={() => setShowPicker(false)} style={styles.cancelBtn}>
                  <Text style={[styles.cancelText, { fontSize } ]}>Cancelar</Text>
                </Pressable>
                <Pressable onPress={handleConfirmIOS} style={styles.confirmBtn}>
                  <Text style={[styles.confirmText, { fontSize } ]}>Confirmar</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}
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
      borderWidth: 1,
      borderRadius: scaleRadius(8),
      paddingHorizontal: scaleSpacing(10),
      backgroundColor: theme.backgroundCard,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    inputText: {
      fontSize: scaleFont(15),
      color: theme.textPrimary,
    },
    modalBackground: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalContent: {
      backgroundColor: theme.backgroundCard,
      paddingTop: scaleSpacing(16),
      borderTopLeftRadius: scaleRadius(12),
      borderTopRightRadius: scaleRadius(12),
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: scaleSpacing(12),
    },
    cancelBtn: { padding: scaleSpacing(10) },
    confirmBtn: { padding: scaleSpacing(10) },
    cancelText: { color: theme.error, fontWeight: 'bold', fontSize: scaleFont(16) },
    confirmText: { color: theme.primary, fontWeight: 'bold', fontSize: scaleFont(16) },
  });
};

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
