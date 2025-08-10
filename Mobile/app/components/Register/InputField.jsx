import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

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
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.input, { flexDirection: 'row', alignItems: 'center' }]}>
        <TextInput
          style={{ flex: 1 }}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor="gray"
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
        />
        {showIcon && (
          <TouchableOpacity onPress={onIconPress} disabled={!onIconPress}>
            <Icon
              name={iconName}
              size={20}
              color="gray"
              style={{ marginRight: 10 }}
            />
          </TouchableOpacity>
        )}
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
    alignItems: "flex-start",
    width: "85%",
  },
  input: {
    height: 45,
    width: '85%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
});