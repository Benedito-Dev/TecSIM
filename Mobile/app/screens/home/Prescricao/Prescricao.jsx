import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./styles";
import FeatherIcon from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// Função para formatar a data no padrão dd-mm-aaaa
const formatarData = (dataString) => {
  const data = new Date(dataString);
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}-${mes}-${ano}`;
};

// Dados mockados
const mockPrescricoes = [
  {
    id_prescricao: 1,
    diagnostico: "Hipertensão arterial",
    data_prescricao: "2023-05-15",
    validade: "2023-11-15",
    medicamentos: [
      {
        id_medicamento_prescrito: 1,
        nome: "Losartana",
        dosagem: "50mg",
        frequencia: "1x ao dia",
        duracao_dias: 30,
        via: "Oral"
      }
    ]
  },
  {
    id_prescricao: 2,
    diagnostico: "Diabetes Mellitus Tipo 2",
    data_prescricao: "2023-06-20",
    validade: "2023-12-20",
    medicamentos: [
      {
        id_medicamento_prescrito: 2,
        nome: "Metformina",
        dosagem: "850mg",
        frequencia: "2x ao dia",
        duracao_dias: 60,
        via: "Oral"
      },
      {
        id_medicamento_prescrito: 3,
        nome: "Insulina NPH",
        dosagem: "20UI",
        frequencia: "1x ao dia",
        duracao_dias: 30,
        via: "Subcutânea"
      }
    ]
  }
];

export default function PrescricaoScreen() {
  const navigation = useNavigation();
  const [prescricoes] = useState(mockPrescricoes);
  const [expandedPrescricao, setExpandedPrescricao] = useState(null);

  const togglePrescricao = (id) => {
    setExpandedPrescricao(expandedPrescricao === id ? null : id);
  };

  const handleAddMedicamento = (idPrescricao) => {
    navigation.navigate("Medicamentos", { idPrescricao });
  };

  const handleDeleteMedicamento = (idMedicamento) => {
    Alert.alert(
      "Remover medicamento",
      "Tem certeza que deseja remover este medicamento da prescrição?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Remover", onPress: () => console.log("Medicamento removido:", idMedicamento) }
      ]
    );
  };

  const renderMedicamento = ({ item }) => (
    <View style={styles.medicineItem}>
      <View style={styles.medicineNameContainer}>
        <Text style={styles.medicineName}>{item.nome}</Text>
        <Text style={styles.medicineDose}> • {item.dosagem}</Text>
      </View>
      
      <View style={styles.medicineDetails}>
        <View style={styles.detailRow}>
          <FeatherIcon name="clock" size={14} color="#6B7280" />
          <Text style={styles.detailText}>{item.frequencia}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <FeatherIcon name="calendar" size={14} color="#6B7280" />
          <Text style={styles.detailText}>{item.duracao_dias} dias</Text>
        </View>
        
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="needle" size={14} color="#6B7280" />
          <Text style={styles.detailText}>Via: {item.via}</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => handleDeleteMedicamento(item.id_medicamento_prescrito)}
      >
        <MaterialCommunityIcons name="trash-can-outline" size={18} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );

  const renderPrescricao = ({ item }) => (
    <View style={styles.prescricaoItem}>
      <TouchableOpacity 
        style={styles.prescricaoHeader}
        onPress={() => togglePrescricao(item.id_prescricao)}
      >
      <View>
        <Text style={styles.prescricaoTitle}>{item.diagnostico}</Text>
        <Text style={styles.prescricaoDate}>
          Criada em: {formatarData(item.data_prescricao)} | Validade: {formatarData(item.validade)}
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
        {item.medicamentos.length > 0 ? (
          <FlatList
            data={item.medicamentos}
            renderItem={renderMedicamento}
            keyExtractor={med => med.id_medicamento_prescrito.toString()}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.emptyMedicamentos}>Nenhum medicamento prescrito</Text>
        )}
        
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => handleEditPrescricao(item.id_prescricao)}
          >
            <FeatherIcon name="edit" size={16} color="#2563EB" />
            <Text style={styles.actionButtonText}>Editar</Text>
          </TouchableOpacity>
          
        </View>
      </View>
    )}
  </View>
);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <FeatherIcon name="arrow-left" size={24} color="#2563EB" />
        </TouchableOpacity>
        <Text style={styles.title}>Minhas Prescrições</Text>
        <View style={styles.headerRight} />
      </View>

      <FlatList
        data={prescricoes}
        renderItem={renderPrescricao}
        keyExtractor={item => item.id_prescricao.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="file-document-outline" size={48} color="#E5E7EB" />
            <Text style={styles.emptyText}>Nenhuma prescrição encontrada</Text>
            <Text style={styles.emptySubtext}>Consulte seu médico para obter prescrições</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.newPrescButton}
        onPress={() => navigation.navigate("RegistroPrescricao")}
      >
        <MaterialCommunityIcons name="plus" size={24} color="#fff" />
        <Text style={styles.newPrescButtonText}>Nova Prescrição</Text>
      </TouchableOpacity>
    </View>
  );
}