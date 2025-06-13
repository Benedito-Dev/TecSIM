import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; // <-- nova lib
import { styles } from './styles';

export default function MedicineScreen() {
  const [search, setSearch] = useState('');
  const [medicines, setMedicines] = useState([
    { id: '1', name: 'Paracetamol', dose: '250mg' },
    { id: '2', name: 'Ibuprofeno', dose: '500mg' },
    { id: '3', name: 'Loratadina', dose: '10mg' },
    { id: '4', name: 'Dipirona', dose: '100mg' },
    { id: '5', name: 'Diclofenaco', dose: '50mg' },
  ]);

  const filtered = medicines.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Medicamentos</Text>

      <View style={styles.searchContainer}>
        <FeatherIcon name="search" size={20} color="#A0A0A0" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar medicamentos"
          placeholderTextColor="#A0A0A0"
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity>
          {/* <FeatherIcon name="plus" size={24} color="#000" /> */}
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Meus medicamentos</Text>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.medItem}>
            <View style={styles.medIcon}>
              <MaterialCommunityIcons name="pill" size={20} color="#2563EB" />
            </View>
            <View>
              <Text style={styles.medName}>{item.name}</Text>
              <Text style={styles.medDose}>{item.dose}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}