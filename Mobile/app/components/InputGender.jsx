import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function GenderInput({ value, onChange }) {
  const options = [
    { label: 'Homem', value: 'man' },
    { label: 'Mulher', value: 'woman' },
    { label: 'Prefiro não dizer', value: 'neutral' },
  ];

  return (
    <View style={{ width: '85%', marginTop: 12 }}>
      <Text style={{ fontSize: 16, fontWeight: '500', color: '#333', marginBottom: 8 }}>Gênero</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            onPress={() => onChange(option.value)}
            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
          >
            <View style={radioStyle(value === option.value)} />
            <Text style={{ marginLeft: 6 }}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const radioStyle = (selected) => ({
  height: 20,
  width: 20,
  borderRadius: 10,
  borderWidth: 2,
  borderColor: '#0097b2',
  backgroundColor: selected ? '#0097b2' : 'transparent',
});
