import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./styles";
import FeatherIcon from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function PrescricaoScreen() {
    const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FeatherIcon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Prescrições Medica</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>Medicamentos Prescritos</Text>
        {/*mapear os medicamentos prescritos */}
        <View style={styles.medicineList}>
          {/* Exemplo de item de medicamento */}
          <View style={styles.medicineItem}>
            <Text style={styles.medicineName}>Paracetamol</Text>
            <Text style={styles.medicineDose}>500mg</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("Medicamentos")}
        >
          <MaterialCommunityIcons name="plus" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Adicionar Medicamento</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
