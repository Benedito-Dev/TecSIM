import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { styles } from "./styles";
import FeatherIcon from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const formatarData = (dataString) => {
  const data = new Date(dataString);
  return data.toLocaleDateString('pt-BR');
};

export default function PrescricaoScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [prescricoes, setPrescricoes] = useState([]);
  const [expandedPrescricao, setExpandedPrescricao] = useState(null);

  // Carrega prescrições salvas
  const carregarPrescricoes = async () => {
    try {
      const prescricoesSalvas = await AsyncStorage.getItem('@prescricoes');
      if (prescricoesSalvas) {
        setPrescricoes(JSON.parse(prescricoesSalvas));
      }
    } catch (error) {
      console.error('Erro ao carregar prescrições:', error);
      Alert.alert("Erro", "Não foi possível carregar as prescrições");
    }
  };

  // Atualiza a lista quando a tela ganha foco
  useEffect(() => {
    if (isFocused) {
      carregarPrescricoes();
    }
  }, [isFocused]);

  // Remove uma prescrição
  const handleDeletePrescricao = async (id) => {
    Alert.alert(
      "Remover prescrição",
      "Tem certeza que deseja remover esta prescrição?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Remover", 
          onPress: async () => {
            try {
              const novasPrescricoes = prescricoes.filter(p => p.id_prescricao !== id);
              await AsyncStorage.setItem('@prescricoes', JSON.stringify(novasPrescricoes));
              setPrescricoes(novasPrescricoes);
            } catch (error) {
              console.error('Erro ao remover prescrição:', error);
              Alert.alert("Erro", "Não foi possível remover a prescrição");
            }
          }
        }
      ]
    );
  };

  // Renderiza cada medicamento
  const renderMedicamento = ({ item }) => (
    <View style={styles.medicineItem}>
      <View style={styles.medicineNameContainer}>
        <Text style={styles.medicineName}>{item.nome}</Text>
        <Text style={styles.medicineDose}> • {item.dosagem}</Text>
      </View>
      
      <View style={styles.medicineDetails}>
        <Text style={styles.detailText}>{item.frequencia}</Text>
        <Text style={styles.detailText}>• {item.duracao} dias</Text>
        <Text style={styles.detailText}>• Via: {item.via}</Text>
      </View>
    </View>
  );

  // Renderiza cada prescrição
  const renderPrescricao = ({ item }) => (
    <View style={styles.prescricaoItem}>
      <TouchableOpacity 
        style={styles.prescricaoHeader}
        onPress={() => setExpandedPrescricao(expandedPrescricao === item.id_prescricao ? null : item.id_prescricao)}
      >
        <View style={styles.prescricaoHeaderContent}>
          <Text style={styles.prescricaoTitle}>{item.diagnostico}</Text>
          <Text style={styles.prescricaoDate}>
            {formatarData(item.data_prescricao)} - Val: {formatarData(item.validade)}
          </Text>
        </View>
        <FeatherIcon 
          name={expandedPrescricao === item.id_prescricao ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="#6B7280" 
        />
      </TouchableOpacity>
      
      {expandedPrescricao === item.id_prescricao && (
        <View style={styles.prescricaoContent}>
          <FlatList
            data={item.medicamentos}
            renderItem={renderMedicamento}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
          />
          
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => handleDeletePrescricao(item.id_prescricao)}
            >
              <FeatherIcon name="trash-2" size={16} color="#EF4444" />
              <Text style={[styles.actionButtonText, { color: "#EF4444" }]}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Minhas Prescrições</Text>
      </View>

      <FlatList
        data={prescricoes}
        renderItem={renderPrescricao}
        keyExtractor={(item) => item.id_prescricao.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="file-document-outline" size={48} color="#E5E7EB" />
            <Text style={styles.emptyText}>Nenhuma prescrição encontrada</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.newPrescButton}
        onPress={() => navigation.navigate("NovaPrescricao")}
      >
        <FeatherIcon name="plus" size={24} color="#fff" />
        <Text style={styles.newPrescButtonText}>Nova Prescrição</Text>
      </TouchableOpacity>
    </View>
  );
}