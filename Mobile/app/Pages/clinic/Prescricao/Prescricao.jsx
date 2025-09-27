import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { ThemeContext } from '../../../context/ThemeContext';
import { useElderMode } from "../../../context/ElderModeContext"; // ✅ usa o hook
import { useNavigation } from '@react-navigation/native';
import { FileText, ArrowLeft, Plus, ChevronDown, ChevronUp, Trash2, Clock, Calendar, Syringe, User, Clipboard, Download, MoreHorizontal } from 'lucide-react-native';
import { getPrescriptionStyles } from './styles';
import { useScale } from '../../../utils/scale'; // ✅ Hook global para escalonamento

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
  const { fontSize, fontIndex, increaseFont, decreaseFont } = useElderMode();
  const { scaleIcon } = useScale(fontSize); // ✅ agora pegamos a função direto do utils
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
              console.log('[DEBUG] Ação: Download acionada pelo menu');
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

  const { fontSize, fontIndex, increaseFont, decreaseFont } = useElderMode(); // ✅ acessa os valores do contexto
  const { scaleIcon } = useScale(fontSize); // ✅ agora pegamos a função direto do utils

  const styles = getPrescriptionStyles(theme, fontSize);

  const [prescricoes, setPrescricoes] = useState([]);
  const [expandedPrescricao, setExpandedPrescricao] = useState(null);
  const [loading, setLoading] = useState(true);
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

  const togglePrescricao = (id) => {;
    setExpandedPrescricao(expandedPrescricao === id ? null : id);
  };

  const handleAddPrescricao = () => {
    navigation.navigate('NovaPrescricao', { id_paciente: user.id });
  };

  const handleDownloadPrescricao = async (prescricao) => {
    try {
      setDownloadingId(prescricao?.id ?? prescricao?.id_prescricao ?? prescricao?.id_prescricao_uuid ?? null);
      Alert.alert("Gerando PDF", "Aguarde enquanto preparamos seu documento...");

      // Tente diferentes campos caso o backend use nomes diferentes
      const prescIdToUse = prescricao?.id ?? prescricao?.id_prescricao ?? prescricao?.id_prescricao_uuid;

      const filePath = await downloadPrescricao(prescIdToUse);

      Alert.alert("Download Concluído", `PDF salvo com sucesso`);
    } catch (error) {
      // log detalhado se existir response (axios)
      if (error?.response) {
        console.error('[DEBUG] error.response:', {
          status: error.response.status,
          data: error.response.data
        });
      }
      Alert.alert("Erro", "Não foi possível gerar o PDF da prescrição.");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDeletePrescricao = async (prescricaoId) => {
    console.log('[DEBUG] Solicitação de exclusão (iniciando) id =', prescricaoId);
    Alert.alert(
      "Excluir Prescrição",
      "Tem certeza que deseja excluir esta prescrição? Esta ação não pode ser desfeita.",
      [
        {
          text: "Cancelar",
          style: "cancel",
          onPress: () => {
            console.log('[DEBUG] Exclusão cancelada pelo usuário (id =', prescricaoId, ')');
            setExpandedPrescricao(null);
          }
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              console.log('[DEBUG] Confirmado: excluindo id =', prescricaoId);
              setDeletingId(prescricaoId);
              await deletePrescricao(prescricaoId);
              setPrescricoes(prev => {
                console.log('[DEBUG] Atualizando state prescricoes: removendo id =', prescricaoId);
                return prev.filter(p => {
                  const pId = p?.id ?? p?.id_prescricao ?? p?.id_prescricao_uuid ?? null;
                  // debug cada p
                  // console.log('[DEBUG] comparando', pId, '!==', prescricaoId);
                  return String(pId) !== String(prescricaoId);
                });
              });
              Alert.alert("Sucesso", "Prescrição excluída com sucesso!");
            } catch (error) {
              console.error('[DEBUG] Erro ao excluir prescrição:', error);
              if (error?.response) {
                console.error('[DEBUG] deletePrescricao error.response:', {
                  status: error.response.status,
                  data: error.response.data
                });
              }
              let errorMessage = "Não foi possível excluir a prescrição.";
              if (error?.response?.status === 404) errorMessage = "Prescrição não encontrada.";
              if (error?.response?.status === 403) errorMessage = "Você não tem permissão para excluir esta prescrição.";
              if (error?.response?.status === 500) errorMessage = "Erro no servidor. Tente novamente mais tarde.";
              Alert.alert("Erro", errorMessage);
            } finally {
              console.log('[DEBUG] Exclusão finalizada (finally) para id =', prescricaoId);
              setDeletingId(null);
              setExpandedPrescricao(null);
            }
          }
        }
      ]
    );
  };

  // Render medicamento (recebe via inline arrow o prescricaoId)
  const renderMedicamento = ({ item, prescricaoId }) => {
    console.log('[DEBUG] renderMedicamento chamado, prescricaoId =', prescricaoId, 'med =', item);
    return (
      <View style={styles.medicineItem}>
        <View style={styles.medicineHeader}>
          <Text style={styles.medicineName}>{item?.nome ?? '—'}</Text>
          <Text style={styles.medicineDose}>{item?.dosagem ?? '—'}</Text>
        </View>

        <View style={styles.medicineDetails}>
          <View style={styles.detailRow}>
            <Clock size={scaleIcon(14)} color="#6B7280" />
            <Text style={styles.detailText}>{item?.frequencia ?? '—'}x ao dia</Text>
          </View>

          <View style={styles.detailRow}>
            <Calendar size={scaleIcon(14)} color="#6B7280" />
            <Text style={styles.detailText}>{item?.duracao_dias ?? '—'} dias</Text>
          </View>

          <View style={styles.detailRow}>
            <Syringe size={scaleIcon(14)} color="#6B7280" />
            <Text style={styles.detailText}>Via: {item?.via ?? '—'}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderPrescricao = ({ item }) => {
    console.log('[DEBUG] renderPrescricao chamado para item =', item);
    const prescId = item?.id ?? item?.id_prescricao ?? item?.id_prescricao_uuid;
    const isDeleting = String(deletingId) === String(prescId);
    const isDownloading = String(downloadingId) === String(prescId);

    // garantir que medicamentos seja array
    const medicamentosArr = Array.isArray(item?.medicamentos) ? item.medicamentos : [];

    console.log('[DEBUG] prescricao computed ids:', { prescId, medicamentosCount: medicamentosArr.length });

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
                <Text style={styles.prescricaoTitle}>{item?.diagnostico ?? '—'}</Text>
              </View>
              <PrescricaoActions
                onDownload={() => handleDownloadPrescricao(item)}
                onDelete={() => handleDeletePrescricao(prescId)}
              />
            </View>

            <View style={styles.prescricaoHeaderRow}>
              <User size={scaleIcon(16)} color="#6B7280" />
              <Text style={styles.prescricaoSubtitle}>CRM: {item?.crm ?? '—'}</Text>
            </View>

            <Text style={styles.prescricaoDate}>• Cadastro: {formatarData(item?.data_prescricao)}</Text>
            <Text style={styles.prescricaoDate}>• Validade: {formatarData(item?.validade)}</Text>

            <TouchableOpacity
              style={styles.chevronContainer}
              onPress={() => !isDeleting && togglePrescricao(prescId)}
              disabled={isDeleting}
            >
              {expandedPrescricao === prescId ? (
                <ChevronUp size={scaleIcon(20)} color="#6B7280" />
              ) : (
                <ChevronDown size={scaleIcon(20)} color="#6B7280" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {expandedPrescricao === prescId && !isDeleting && (
          <View style={styles.prescricaoContent}>
            {medicamentosArr.length > 0 ? (
              <FlatList
                data={medicamentosArr}
                renderItem={({ item: medItem }) => renderMedicamento({ item: medItem, prescricaoId: prescId })}
                keyExtractor={(med, index) => {
                  const computed = String(med?.id ?? med?.id_medicamento_prescrito ?? med?.id_medicamento ?? index);
                  console.log('[DEBUG] medicamento keyExtractor:', { med, computed });
                  return computed;
                }}
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
          <ArrowLeft size={scaleIcon(24)} color="#2563EB" />
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
            keyExtractor={(it, index) => {
              const computed = String(it?.id ?? it?.id_prescricao ?? it?.id_prescricao_uuid ?? index);
              console.log('[DEBUG] prescricao keyExtractor:', { it, computed });
              return computed;
            }}
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

      {/* Botão Adicionar Prescrição */}
      <TouchableOpacity
        style={styles.addPrescButton}
        onPress={handleAddPrescricao}
      >
        <Plus size={scaleIcon(24)} color="#fff" />
        <Text style={styles.addPrescButtonText}>Nova Prescrição</Text>
      </TouchableOpacity>
    </View>
  );
}
