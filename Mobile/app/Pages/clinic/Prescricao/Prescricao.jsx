import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { ThemeContext } from '../../../context/ThemeContext';
import { useElderMode } from "../../../context/ElderModeContext";
import { useNavigation } from '@react-navigation/native';
import { FileText, ArrowLeft, Plus, ChevronDown, ChevronUp, Trash2, Clock, Calendar, Syringe, User, Clipboard, Download, MoreHorizontal } from 'lucide-react-native';
import { getPrescriptionStyles } from './styles';
import { useScale } from '../../../utils/scale';

import { useAuth } from '../../../context/AuthContext';
import { getPrescricoesByPaciente, deletePrescricao, downloadPrescricao } from '../../../services/prescricaoService';

// --- util: formata data com proteção contra input inválido
const formatarData = (dataString) => {
  try {
    if (!dataString) return '—';
    const data = new Date(dataString);
    if (Number.isNaN(data.getTime())) return String(dataString);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}-${mes}-${ano}`;
  } catch (e) {
    return String(dataString);
  }
};

// Componente de Ações para cada prescrição
const PrescricaoActions = ({ onDownload, onDelete }) => {
  const { theme } = useContext(ThemeContext);
  const { fontSize } = useElderMode();
  const { scaleIcon } = useScale(fontSize);
  const styles = getPrescriptionStyles(theme);
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.actionsContainer}>
      <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.actionsButton}>
        <MoreHorizontal size={scaleIcon(20)} color="#6B7280" />
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
            <Download size={scaleIcon(16)} color="#2563EB" />
            <Text style={styles.actionText}>Download</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => {
              onDelete();
              setExpanded(false);
            }}
          >
            <Trash2 size={scaleIcon(16)} color="#EF4444" />
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
  const { user } = useAuth();

  const { fontSize } = useElderMode();
  const { scaleIcon } = useScale(fontSize);
  const styles = getPrescriptionStyles(theme, fontSize);

  const [prescricoes, setPrescricoes] = useState([]);
  const [expandedPrescricao, setExpandedPrescricao] = useState(null);
  const [loading, setLoading] = useState(true);

  // ⬇️ Estados para download e exclusão
  const [deletingId, setDeletingId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    const fetchPrescricoes = async () => {
      try {
        setLoading(true);
        const response = await getPrescricoesByPaciente(user.id);
        setPrescricoes(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error('[DEBUG] Erro ao buscar prescrições:', error);
        Alert.alert("Erro", "Não foi possível carregar as prescrições.");
      } finally {
        setLoading(false);
      }
    };
    fetchPrescricoes();
  }, [user?.id]);

  const togglePrescricao = (id) => {
    setExpandedPrescricao(expandedPrescricao === id ? null : id);
  };

  const handleAddPrescricao = () => {
    navigation.navigate('NovaPrescricao', { id_paciente: user.id });
  };

  // ⬇️ Função de Download de Prescrição
  const handleDownloadPrescricao = async (prescricao) => {
    try {
      setDownloadingId(prescricao?.id ?? null);
      Alert.alert("Gerando PDF", "Aguarde enquanto preparamos seu documento...");

      const filePath = await downloadPrescricao(prescricao?.id);
      console.log("Sucesso fase 2")
      Alert.alert("Download Concluído", `PDF salvo com sucesso`);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      Alert.alert("Erro", "Não foi possível gerar o PDF da prescrição.");
    } finally {
      setDownloadingId(null);
    }
  };

  // ⬇️ Função de Exclusão de Prescrição
  const handleDeletePrescricao = async (prescricaoId) => {
    Alert.alert(
      "Excluir Prescrição",
      "Tem certeza que deseja excluir esta prescrição? Esta ação não pode ser desfeita.",
      [
        {
          text: "Cancelar",
          style: "cancel",
          onPress: () => setExpandedPrescricao(null)
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              setDeletingId(prescricaoId);
              await deletePrescricao(prescricaoId);
              setPrescricoes(prev => prev.filter(p => String(p.id) !== String(prescricaoId)));
              Alert.alert("Sucesso", "Prescrição excluída com sucesso!");
            } catch (error) {
              console.error("Erro ao excluir prescrição:", error);
              let errorMessage = "Não foi possível excluir a prescrição.";
              if (error.response?.status === 404) errorMessage = "Prescrição não encontrada.";
              if (error.response?.status === 403) errorMessage = "Você não tem permissão para excluir esta prescrição.";
              if (error.response?.status === 500) errorMessage = "Erro no servidor. Tente novamente mais tarde.";
              Alert.alert("Erro", errorMessage);
            } finally {
              setDeletingId(null);
              setExpandedPrescricao(null);
            }
          }
        }
      ]
    );
  };

  // ⬇️ Renderização de cada item de prescrição (com overlay para download/exclusão)
  const renderPrescricao = ({ item }) => {
    const isDeleting = String(deletingId) === String(item.id);
    const isDownloading = String(downloadingId) === String(item.id);

    return (
      <View style={styles.prescricaoItem}>
        {(isDeleting || isDownloading) && (
          <View style={styles.deletingOverlay}>
            <ActivityIndicator size="large" color={isDeleting ? "#EF4444" : "#2563EB"} />
            <Text style={styles.deletingText}>{isDeleting ? "Excluindo..." : "Baixando PDF..."}</Text>
          </View>
        )}

        <View style={[styles.prescricaoHeader, (isDeleting || isDownloading) && { opacity: 0.6 }]}>
          <View style={styles.prescricaoInfo}>
            <View style={styles.prescricaoTitleRow}>
              <View style={styles.prescricaoTitleContainer}>
                <Clipboard size={scaleIcon(16)} color="#2563EB" />
                <Text style={styles.prescricaoTitle}>{item.diagnostico}</Text>
              </View>
              <PrescricaoActions
                onDownload={() => handleDownloadPrescricao(item)}
                onDelete={() => handleDeletePrescricao(item.id)}
              />
            </View>

            <View style={styles.prescricaoHeaderRow}>
              <User size={scaleIcon(16)} color="#6B7280" />
              <Text style={styles.prescricaoSubtitle}>CRM: {item.crm}</Text>
            </View>

            <Text style={styles.prescricaoDate}>• Cadastro: {formatarData(item.data_prescricao)}</Text>
            <Text style={styles.prescricaoDate}>• Validade: {formatarData(item.validade)}</Text>

            <TouchableOpacity
              style={styles.chevronContainer}
              onPress={() => !isDeleting && togglePrescricao(item.id)}
              disabled={isDeleting}
            >
              {expandedPrescricao === item.id ? (
                <ChevronUp size={scaleIcon(20)} color="#6B7280" />
              ) : (
                <ChevronDown size={scaleIcon(20)} color="#6B7280" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={scaleIcon(24)} color="#2563EB" />
        </TouchableOpacity>
        <Text style={styles.title}>Minhas Prescrições</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} style={{ flex: 1 }}>
        {loading ? (
          <View style={styles.emptyContainer}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={{ marginTop: 10 }}>Carregando prescrições...</Text>
          </View>
        ) : prescricoes.length > 0 ? (
          <FlatList
            data={prescricoes}
            renderItem={renderPrescricao}
            keyExtractor={item => item.id
            }
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <FileText size={scaleIcon(48)} color="#ccc" />
            <Text style={styles.emptyText}>Nenhuma prescrição cadastrada</Text>
            <Text style={styles.emptySubtext}>Adicione uma nova prescrição para começar</Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.addPrescButton} onPress={handleAddPrescricao}>
        <Plus size={scaleIcon(24)} color="#fff" />
        <Text style={styles.addPrescButtonText}>Nova Prescrição</Text>
      </TouchableOpacity>
    </View>
  );
}
