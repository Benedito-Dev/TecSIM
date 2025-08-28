import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator
} from "react-native";
import { ThemeContext } from "../../../context/ThemeContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import { getPrescriptionFormStyles } from "./styles";
import { createPrescricao } from "../../../services/prescricaoService";
import { ArrowLeft, Plus, Trash2, Pill, Calendar } from "lucide-react-native";

export default function PrescricaoManualScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useContext(ThemeContext);
  const styles = getPrescriptionFormStyles(theme);

  // Obter dados do paciente da navegação (se disponível)
  const paciente = route.params?.paciente;

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showValidadePicker, setShowValidadePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [medicamentosDisponiveis, setMedicamentosDisponiveis] = useState([]);

  const [form, setForm] = useState({
    id_paciente: paciente?.id || "",
    crm: "CRM_DO_MEDICO", // Você precisa obter isso do contexto do médico logado
    diagnostico: "",
    data_prescricao: new Date(),
    medicamentos: [],
  });

  // Simular carregamento de medicamentos disponíveis (substitua pela sua API real)
  useEffect(() => {
    const carregarMedicamentos = async () => {
      try {
        // Aqui você buscaria a lista de medicamentos do seu backend
        const medicamentosFake = [
          { id: 1, nome: "Paracetamol" },
          { id: 2, nome: "Ibuprofeno" },
          { id: 3, nome: "Amoxicilina" },
          { id: 4, nome: "Losartana" },
          { id: 5, nome: "Atorvastatina" },
        ];
        setMedicamentosDisponiveis(medicamentosFake);
      } catch (error) {
        console.error("Erro ao carregar medicamentos:", error);
      }
    };

    carregarMedicamentos();
  }, []);

  const handleAddMedicamento = () => {
    const novoMedicamento = {
      id: Math.random().toString(36).substr(2, 9),
      id_medicamento: "",
      nome: "",
      dosagem: "",
      frequencia: "",
      duracao_dias: "",
      via: "",
      horarios: "",
      openVia: false,
      openMedicamento: false,
    };

    setForm((prev) => ({
      ...prev,
      medicamentos: [...prev.medicamentos, novoMedicamento],
    }));
  };

  const handleRemoveMedicamento = (id) => {
    Alert.alert("Remover medicamento", "Tem certeza que deseja remover este medicamento?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        onPress: () => {
          setForm((prev) => ({
            ...prev,
            medicamentos: prev.medicamentos.filter((med) => med.id !== id),
          }));
        },
      },
    ]);
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateForAPI = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleMedicamentoChange = (id, field, value) => {
    setForm((prev) => ({
      ...prev,
      medicamentos: prev.medicamentos.map((med) =>
        med.id === id ? { ...med, [field]: value } : med
      ),
    }));
  };

  const handleSubmit = async () => {
    // Validações
    if (!form.id_paciente) {
      Alert.alert("Paciente não selecionado", "Selecione um paciente para criar a prescrição");
      return;
    }

    if (!form.diagnostico.trim()) {
      Alert.alert("Campo obrigatório", "Por favor, informe o diagnóstico");
      return;
    }

    if (form.medicamentos.length === 0) {
      Alert.alert("Prescrição vazia", "Adicione pelo menos um medicamento");
      return;
    }

    for (const med of form.medicamentos) {
      if (
        !med.id_medicamento || 
        !med.dosagem.trim() || 
        !med.frequencia.trim() || 
        !med.duracao_dias.trim() || 
        !med.via.trim()
      ) {
        Alert.alert("Dados incompletos", "Preencha todos os campos obrigatórios dos medicamentos");
        return;
      }
    }

    setLoading(true);

    try {
      // Preparar dados para enviar ao backend
      const prescricaoData = {
        id_paciente: parseInt(form.id_paciente),
        crm: form.crm, // Isso deve vir do médico logado
        diagnostico: form.diagnostico,
        data_prescricao: formatDateForAPI(form.data_prescricao),
        medicamentos: form.medicamentos.map(med => ({
          id_medicamento: parseInt(med.id_medicamento),
          dosagem: med.dosagem,
          frequencia: med.frequencia,
          duracao_dias: parseInt(med.duracao_dias),
          via: med.via,
          horarios: med.horarios || ""
        }))
      };

      console.log("Enviando prescrição:", prescricaoData);
      
      // Chamar o serviço para criar a prescrição
      const resultado = await createPrescricao(prescricaoData);
      
      Alert.alert("Sucesso", "Prescrição salva com sucesso", [
        { 
          text: "OK", 
          onPress: () => navigation.navigate("Prescricao", { refresh: true }) 
        },
      ]);
    } catch (error) {
      console.error("Erro ao salvar prescrição:", error);
      Alert.alert(
        "Erro", 
        error.message || "Não foi possível salvar a prescrição. Verifique os dados e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft size={24} color="#2563EB" />
          </TouchableOpacity>
          <Text style={styles.title}>Nova Prescrição</Text>
          <View style={styles.headerRight} />
        </View>

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={styles.loadingText}>Salvando prescrição...</Text>
          </View>
        )}

        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          {/* Informações do Paciente */}
          {paciente && (
            <View style={styles.pacienteInfo}>
              <Text style={styles.pacienteTitle}>Paciente</Text>
              <Text style={styles.pacienteName}>{paciente.nome}</Text>
              <Text style={styles.pacienteDetails}>
                {paciente.idade} anos • {paciente.sexo}
              </Text>
            </View>
          )}

          {/* Restante do formulário */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Informações da Prescrição</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Diagnóstico Principal*</Text>
              <TextInput
                style={styles.input}
                value={form.diagnostico}
                onChangeText={(text) => setForm({ ...form, diagnostico: text })}
                placeholder="Ex: Hipertensão arterial"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Data da Prescrição</Text>
              <TouchableOpacity style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
                <Text style={styles.dateText}>{formatDate(form.data_prescricao)}</Text>
                <Calendar size={18} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={form.data_prescricao}
                mode="date"
                display="default"
                onChange={(_, date) => {
                  setShowDatePicker(false);
                  date && setForm({ ...form, data_prescricao: date });
                }}
              />
            )}
          </View>

          {/* Medicamentos */}
          <View style={styles.formSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Medicamentos Prescritos</Text>
              <TouchableOpacity style={styles.addButton} onPress={handleAddMedicamento}>
                <Plus size={20} color="#FFFFFF" />
                <Text style={styles.addButtonText}>Adicionar</Text>
              </TouchableOpacity>
            </View>

            {form.medicamentos.length === 0 ? (
              <View style={styles.emptyState}>
                <Pill size={40} color="#E5E7EB" />
                <Text style={styles.emptyText}>Nenhum medicamento adicionado</Text>
              </View>
            ) : (
              form.medicamentos.map((med, index) => (
                <View key={med.id} style={styles.medicamentoCard}>
                  <View style={styles.medicamentoHeader}>
                    <View style={styles.medNumber}>
                      <Text style={styles.medNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.medicamentoTitle}>Medicamento</Text>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => handleRemoveMedicamento(med.id)}>
                      <Trash2 size={20} color="#EF4444" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Selecionar Medicamento*</Text>
                    <DropDownPicker
                      open={med.openMedicamento || false}
                      value={med.id_medicamento || null}
                      items={medicamentosDisponiveis.map(med => ({
                        label: med.nome,
                        value: med.id.toString()
                      }))}
                      setOpen={(open) => handleMedicamentoChange(med.id, "openMedicamento", open)}
                      setValue={(callback) => {
                        const value = callback(med.id_medicamento);
                        // Encontrar o nome do medicamento selecionado
                        const medicamentoSelecionado = medicamentosDisponiveis.find(m => m.id.toString() === value);
                        handleMedicamentoChange(med.id, "id_medicamento", value);
                        handleMedicamentoChange(med.id, "nome", medicamentoSelecionado?.nome || "");
                      }}
                      placeholder="Selecione o medicamento..."
                      listMode="SCROLLVIEW"
                      style={styles.dropdown}
                      dropDownContainerStyle={styles.dropDownContainer}
                      textStyle={styles.dropdownText}
                    />
                  </View>

                  <View style={styles.medRow}>
                    <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                      <Text style={styles.label}>Dosagem*</Text>
                      <TextInput
                        style={styles.input}
                        value={med.dosagem}
                        onChangeText={(text) => handleMedicamentoChange(med.id, "dosagem", text)}
                        placeholder="Ex: 50mg"
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>

                    <View style={[styles.inputGroup, { flex: 1 }]}>
                      <Text style={styles.label}>Via de Administração*</Text>
                      <DropDownPicker
                        open={med.openVia || false}
                        value={med.via || null}
                        items={[
                          { label: "Oral", value: "oral" },
                          { label: "Tópica", value: "tópica" },
                          { label: "Inalatória", value: "inalatória" },
                          { label: "Subcutânea", value: "subcutânea" },
                          { label: "Intramuscular", value: "intramuscular" },
                          { label: "Intravenosa", value: "intravenosa" },
                        ]}
                        setOpen={(open) => handleMedicamentoChange(med.id, "openVia", open)}
                        setValue={(callback) => {
                          const value = callback(med.via);
                          handleMedicamentoChange(med.id, "via", value);
                        }}
                        placeholder="Selecione a via..."
                        listMode="SCROLLVIEW"
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropDownContainer}
                        textStyle={styles.dropdownText}
                      />
                    </View>
                  </View>

                  <View style={styles.medRow}>
                    <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                      <Text style={styles.label}>Frequência*</Text>
                      <TextInput
                        style={styles.input}
                        value={med.frequencia}
                        onChangeText={(text) => handleMedicamentoChange(med.id, "frequencia", text)}
                        placeholder="Ex: 8/8h ou 1x ao dia"
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>

                    <View style={[styles.inputGroup, { flex: 1 }]}>
                      <Text style={styles.label}>Duração (dias)*</Text>
                      <TextInput
                        style={styles.input}
                        value={med.duracao_dias}
                        onChangeText={(text) => handleMedicamentoChange(med.id, "duracao_dias", text)}
                        keyboardType="numeric"
                        placeholder="Ex: 30"
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Horários (opcional)</Text>
                    <TextInput
                      style={styles.input}
                      value={med.horarios}
                      onChangeText={(text) => handleMedicamentoChange(med.id, "horarios", text)}
                      placeholder="Ex: 08h, 14h, 20h"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>

        {/* Botão Final */}
        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
          onPress={handleSubmit} 
          activeOpacity={0.8}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Salvar Prescrição</Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}