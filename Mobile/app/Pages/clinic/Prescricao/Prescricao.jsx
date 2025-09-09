import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { ThemeContext } from '../../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { FileText, ArrowLeft, Plus, ChevronDown, ChevronUp, Trash2, Clock, Calendar, Syringe, User, Clipboard, Download, MoreHorizontal } from 'lucide-react-native';
import { getPrescriptionStyles } from './styles';

import { useAuth } from '../../../context/AuthContext';
import { getPrescricoesByPaciente, deletePrescricao, downloadPrescricao } from '../../../services/prescricaoService';

// Funções para donwload
import { downloadPDF } from '../../../services/download-service'

const formatarData = (dataString) => {
  const data = new Date(dataString);
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}-${mes}-${ano}`;
};

// Componente de Ações para cada prescrição
const PrescricaoActions = ({ onDownload, onDelete }) => {
  const { theme } = useContext(ThemeContext);
  const styles = getPrescriptionStyles(theme);
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const handleDelete = () => {
    onDelete();
    setExpanded(false); // Fecha o menu imediatamente
  };

  return (
    <View style={styles.actionsContainer}>
      <TouchableOpacity onPress={toggleExpanded} style={styles.actionsButton}>
        <MoreHorizontal size={20} color="#6B7280" />
      </TouchableOpacity>
      
      {expanded && (
        <View style={styles.actionsMenu}>
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => {
              onDownload();
              setExpanded(false);
            }}
          >
            <Download size={16} color="#2563EB" />
            <Text style={styles.actionText}>Download</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={handleDelete}
          >
            <Trash2 size={16} color="#EF4444" />
            <Text style={[styles.actionText, { color: '#EF4444' }]}>Excluir</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};


export default function PrescricaoScreen() {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const styles = getPrescriptionStyles(theme);
  const { user } = useAuth();

  const [prescricoes, setPrescricoes] = useState([]);
  const [expandedPrescricao, setExpandedPrescricao] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null); // Estado para controlar qual item está sendo excluído

  useEffect(() => {
    const fetchPrescricoes = async () => {
      try {
        setLoading(true);
        const response = await getPrescricoesByPaciente(user.id);
        setPrescricoes(response);
      } catch (error) {
        console.error('Erro ao buscar prescrições:', error);
        Alert.alert("Erro", "Não foi possível carregar as prescrições.");
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

  // const handleDownloadPrescricao = (prescricao) => {
  //   console.log("Download")
  //   Alert.alert("Download", `Gerando PDF da prescrição: ${prescricao.diagnostico}`);
  //   // Aqui entraria a lógica real de geração/download de PDF
  // };

  const handleDownloadPrescricao = async (prescricao) => {
    try {
      Alert.alert("Gerando PDF", "Aguarde enquanto preparamos seu documento...");

      // Recebe o caminho do PDF gerado
      const filePath = await downloadPrescricao(prescricao.id);

      Alert.alert(
        "Download Concluído",
        `PDF salvo com sucesso`,
        [{ text: "OK" }]
      );

    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      Alert.alert("Erro", "Não foi possível gerar o PDF da prescrição.");
    }
  };

  const handleDeletePrescricao = async (prescricaoId) => {
    Alert.alert(
      "Excluir Prescrição",
      "Tem certeza que deseja excluir esta prescrição? Esta ação não pode ser desfeita.",
      [
        { 
          text: "Cancelar", 
          style: "cancel",
          onPress: () => setExpandedPrescricao(null) // Fecha o menu
        },
        { 
          text: "Excluir", 
          style: "destructive",
          onPress: async () => {
            try {
              setDeletingId(prescricaoId); // Define qual item está sendo excluído
              
              await deletePrescricao(prescricaoId);
              
              // Garantir que comparamos tipos iguais
              setPrescricoes(prev => prev.filter(p => p.id.toString() !== prescricaoId.toString()));
              
              Alert.alert("Sucesso", "Prescrição excluída com sucesso!");
            } catch (error) {
              console.error("Erro ao excluir prescrição:", error);
              
              let errorMessage = "Não foi possível excluir a prescrição.";
              if (error.response?.status === 404) {
                errorMessage = "Prescrição não encontrada.";
              } else if (error.response?.status === 403) {
                errorMessage = "Você não tem permissão para excluir esta prescrição.";
              } else if (error.response?.status === 500) {
                errorMessage = "Erro no servidor. Tente novamente mais tarde.";
              }
              
              Alert.alert("Erro", errorMessage);
            } finally {
              setDeletingId(null); // Reseta o estado de exclusão
              setExpandedPrescricao(null); // Fecha qualquer prescrição expandida
            }
          }
        }
      ]
    );
  };

  const renderMedicamento = ({ item, prescricaoId }) => (
    <View style={styles.medicineItem}>
      <View style={styles.medicineHeader}>
        <Text style={styles.medicineName}>{item.nome}</Text>
        <Text style={styles.medicineDose}>{item.dosagem}</Text>
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

  const renderPrescricao = ({ item }) => {
    const isDeleting = deletingId === item.id;
    
    return (
      <View style={styles.prescricaoItem}>
        {isDeleting && (
          <View style={styles.deletingOverlay}>
            <ActivityIndicator size="large" color="#EF4444" />
            <Text style={styles.deletingText}>Excluindo...</Text>
          </View>
        )}
        
        <View style={[styles.prescricaoHeader, isDeleting && { opacity: 0.6 }]}>
          <View style={styles.prescricaoInfo}>
            <View style={styles.prescricaoTitleRow}>
              <View style={styles.prescricaoTitleContainer}>
                <Clipboard size={16} color="#2563EB" />
                <Text style={styles.prescricaoTitle}>{item.diagnostico}</Text>
              </View>
              <PrescricaoActions 
                onDownload={() => handleDownloadPrescricao(item)}
                onDelete={() => handleDeletePrescricao(item.id)}
              />
            </View>
            
            <View style={styles.prescricaoHeaderRow}>
              <User size={16} color="#6B7280" />
              <Text style={styles.prescricaoSubtitle}>CRM: {item.crm}</Text>
            </View>
            
            <Text style={styles.prescricaoDate}>
              • Cadastro: {formatarData(item.data_prescricao)}
            </Text>
            <Text style={styles.prescricaoDate}>• Validade: {formatarData(item.validade)}</Text>
            
            <TouchableOpacity 
              style={styles.chevronContainer}
              onPress={() => !isDeleting && togglePrescricao(item.id)}
              disabled={isDeleting}
            >
              {expandedPrescricao === item.id ? (
                <ChevronUp size={20} color="#6B7280" />
              ) : (
                <ChevronDown size={20} color="#6B7280" />
              )}
            </TouchableOpacity>
          </View>
        </View>
        
        {expandedPrescricao === item.id && !isDeleting && (
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
  };

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