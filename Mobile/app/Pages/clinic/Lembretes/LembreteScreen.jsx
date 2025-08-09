import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './styles';

const lembretes = [
  { id: '1', titulo: 'Paracetamol 500mg', horario: '08:00 - Após o café da manhã' },
  { id: '2', titulo: 'Vitamina D',          horario: '12:00 - Junto ao almoço' },
  { id: '3', titulo: 'Omeprazol 20mg',      horario: '30 min antes do café' },
  { id: '4', titulo: 'Losartana 50mg',      horario: '07:00 - Ao acordar' },
  { id: '5', titulo: 'Metformina 850mg',    horario: '18:00 - Antes do jantar' },
  { id: '6', titulo: 'Cetirizina 10mg',     horario: '21:00 - Antes de dormir' },
  { id: '7', titulo: 'Sinvastatina 20mg',   horario: '22:00 - Ao deitar' },
  { id: '8', titulo: 'Complexo B',          horario: '10:00 - Após lanche da manhã' },
  { id: '9', titulo: 'Propranolol 40mg',    horario: '06:30 - Jejum' },
  { id: '10', titulo: 'Ácido Fólico',       horario: '13:00 - Após o almoço' },
  { id: '11', titulo: 'Ibuprofeno 400mg',   horario: 'Quando necessário - Dor ou febre' },
  { id: '12', titulo: 'Colágeno c/ Vit. C', horario: '09:30 - Após café' },
];

export default function LembretesScreen({ navigation }) {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <MaterialCommunityIcons name="pill" size={24} color="#2563EB" />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.titulo}</Text>
        <Text style={styles.subtitle}>{item.horario}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header com seta de voltar */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={10}>
          <ArrowLeft size={24} color="#2563EB" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Seus Lembretes</Text>
      </View>

      {/* Lista dos lembretes */}
      <FlatList
        data={lembretes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
