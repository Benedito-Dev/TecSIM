import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function SecondaryButton({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderColor: '#0097b2',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 55,
    borderRadius: 20,
    marginTop: 10,
  },
  text: {
    color: '#0097b2',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
});
