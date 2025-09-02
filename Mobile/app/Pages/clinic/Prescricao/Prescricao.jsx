import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { ThemeContext } from '../../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { FileText, ArrowLeft, Plus, ChevronDown, ChevronUp, Trash2, Clock, Calendar, Syringe, User, Clipboard } from 'lucide-react-native';
import { getPrescriptionStyles } from './styles';

import { useAuth } from '../../../context/AuthContext';
import { getPrescricoesByPaciente } from '../../../services/prescricaoService';

const formatarData = (dataString) => {
  const data = new Date(dataString);
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}-${mes}-${ano}`;
};

export default function PrescricaoScreen() {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const styles = getPrescriptionStyles(theme);
  const { user } = useAuth();

  const [prescricoes, setPrescricoes] = useState([]);
  const [expandedPrescricao, setExpandedPrescricao] = useState(null);
  const [loading, setLoading] = useState(true);

  // Buscar prescrições do backend
  useEffect(() => {
    const fetchPrescricoes = async () => {
      try {
        setLoading(true);
        const response = await getPrescricoesByPaciente(user.id);
        setPrescricoes(response);
      } catch (error) {
        console.error('Erro ao buscar prescrições:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrescricoes();
  }, [user.id]);

  const togglePrescricao = (id) => {
    setExpandedPrescricao(expandedPrescricao === id ? null : id);
  };

  const handleAddPrescricao = () => {
    navigation.navigate('NovaPrescricao', { id_paciente: user.id });
  };

  const handleDeleteMedicamento = (prescricaoId, medicamentoId) => {
    Alert.alert(
      "Remover medicamento",
      "Tem certeza que deseja remover este medicamento da prescrição?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Remover", 
          onPress: () => {
            const updatedPrescricoes = prescricoes.map(prescricao => {
              if (prescricao.id === prescricaoId) {
                return {
                  ...prescricao,
                  medicamentos: prescricao.medicamentos.filter(
                    med => med.id !== medicamentoId
                  )
                };
              }
              return prescricao;
            });
            setPrescricoes(updatedPrescricoes);
          }
        }
      ]
    );
  };

  const renderMedicamento = ({ item, prescricaoId }) => (
    <View style={styles.medicineItem}>
      <View style={styles.medicineHeader}>
        <Text style={styles.medicineName}>{item.nome || `Medicamento ${item.id_medicamento}`}</Text>
        <Text style={styles.medicineDose}>{item.dosagem}mg</Text>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => handleDeleteMedicamento(prescricaoId, item.id)}
        >
          <Trash2 size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <View style={styles.medicineDetails}>
        <View style={styles.detailRow}>
          <Clock size={14} color="#6B7280" />
          <Text style={styles.detailText}>{item.frequencia}x ao dia</Text>
        </View>

        <View style={styles.detailRow}>
          <Calendar size={14} color="#6B7280" />
          <Text style={styles.detailText}>{item.duracao_dias} dias</Text>
        </View>

        <View style={styles.detailRow}>
          <Syringe size={14} color="#6B7280" />
          <Text style={styles.detailText}>Via: {item.via}</Text>
        </View>
      </View>
    </View>
  );

  const renderPrescricao = ({ item }) => (
    <View style={styles.prescricaoItem}>
      <TouchableOpacity 
        style={styles.prescricaoHeader}
        onPress={() => togglePrescricao(item.id)}
      >
        <View style={styles.prescricaoInfo}>
          <View style={styles.prescricaoHeaderRow}>
            <Clipboard size={16} color="#2563EB" />
            <Text style={styles.prescricaoTitle}>{item.diagnostico}</Text>
          </View>
          
          <View style={styles.prescricaoHeaderRow}>
            <User size={16} color="#6B7280" />
            <Text style={styles.prescricaoSubtitle}>CRM: {item.crm}</Text>
          </View>
          
          <Text style={styles.prescricaoDate}>
            • Cadastro: {formatarData(item.data_prescricao)}
          </Text>
          <Text style={styles.prescricaoDate}>
            • Validade: {item.validade ? formatarData(item.validade) : 'Indefinida'}
          </Text>
        </View>
        {expandedPrescricao === item.id ? (
          <ChevronUp size={20} color="#6B7280" />
        ) : (
          <ChevronDown size={20} color="#6B7280" />
        )}
      </TouchableOpacity>
      
      {expandedPrescricao === item.id && (
        <View style={styles.prescricaoContent}>
          {item.medicamentos.length > 0 ? (
            <FlatList
              data={item.medicamentos}
              renderItem={({ item: medItem }) => renderMedicamento({ item: medItem, prescricaoId: item.id })}
              keyExtractor={med => med.id.toString()}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.emptyMedicamentos}>Nenhum medicamento prescrito</Text>
          )}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#2563EB" />
        </TouchableOpacity>
        <Text style={styles.title}>Minhas Prescrições</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Lista de prescrições */}
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        style={{ flex: 1 }}
      >
        {loading ? (
          <View style={styles.emptyContainer}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={{ marginTop: 10 }}>Carregando prescrições...</Text>
          </View>
        ) : prescricoes.length > 0 ? (
          <FlatList
            data={prescricoes}
            renderItem={renderPrescricao}
            keyExtractor={item => item.id.toString()}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <FileText size={48} color="#ccc" />
            <Text style={styles.emptyText}>Nenhuma prescrição cadastrada</Text>
            <Text style={styles.emptySubtext}>Adicione uma nova prescrição para começar</Text>
          </View>
        )}
      </ScrollView>

      {/* Botão Adicionar Prescrição */}
      <TouchableOpacity
        style={styles.addPrescButton}
        onPress={handleAddPrescricao}
      >
        <Plus size={24} color="#fff" />
        <Text style={styles.addPrescButtonText}>Nova Prescrição</Text>
      </TouchableOpacity>
    </View>
  );
}
