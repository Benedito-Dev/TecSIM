import React, { useState, useContext } from "react";
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
} from "react-native";
import { ThemeContext } from "../../../context/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import { getPrescriptionFormStyles } from "./styles";
import { ArrowLeft, Plus, Trash2, Pill, Calendar } from "lucide-react-native";
import PrescriptionSummaryModal from "../../../components/PrescriptionSummaryModal";

export default function PrescricaoManualScreen() {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const styles = getPrescriptionFormStyles(theme);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showValidadePicker, setShowValidadePicker] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [showSummary, setShowSummary] = useState(false);

  const [form, setForm] = useState({
    crm: "",
    diagnostico: "",
    observacoes: "",
    data_prescricao: new Date(),
    validade: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    medicamentos: [],
  });

  const handleAddMedicamento = () => {
    const novoMedicamento = {
      id: Math.random().toString(36).substr(2, 9),
      nome: "",
      dosagem: "",
      frequencia: "",
      duracao_dias: "",
      via: "",
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
          if (openDropdownId === id) {
            setOpenDropdownId(null);
          }
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

  const handleMedicamentoChange = (id, field, value) => {
    setForm((prev) => ({
      ...prev,
      medicamentos: prev.medicamentos.map((med) =>
        med.id === id ? { ...med, [field]: value } : med
      ),
    }));
  };

  const handleSubmit = () => {
    if (!form.crm.trim()) {
      Alert.alert("Campo obrigatório", "Por favor, informe o número do CRM");
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
        !med.nome.trim() ||
        !med.dosagem.trim() ||
        !med.frequencia.trim() ||
        !med.duracao_dias.trim() ||
        !med.via.trim()
      ) {
        Alert.alert("Dados incompletos", "Preencha todos os campos obrigatórios dos medicamentos");
        return;
      }
    }

    setShowSummary(true);
  };

  const handleSavePrescription = () => {
    setShowSummary(false);
    console.log("Prescrição salva:", form);
    Alert.alert("Sucesso", "Prescrição salva com sucesso", [
      { text: "OK", onPress: () => navigation.navigate("Prescricao") },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft size={24} color={theme.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Nova Prescrição</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContainer} 
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Informações da Prescrição</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>CRM*</Text>
              <TextInput
                style={styles.input}
                value={form.crm}
                onChangeText={(text) => {
                  const numericValue = text.replace(/[^0-9]/g, "");
                  setForm({ ...form, crm: numericValue });
                }}
                keyboardType="numeric"
                placeholder="Ex: 123456"
                placeholderTextColor={theme.placeholder}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Diagnóstico Principal*</Text>
              <TextInput
                style={styles.input}
                value={form.diagnostico}
                onChangeText={(text) => setForm({ ...form, diagnostico: text })}
                placeholder="Ex: Hipertensão arterial"
                placeholderTextColor={theme.placeholder}
              />
            </View>

            <View style={styles.dateRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Data da Prescrição</Text>
                <TouchableOpacity style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
                  <Text style={styles.dateText}>{formatDate(form.data_prescricao)}</Text>
                  <Calendar size={18} color={theme.iconSecondary} />
                </TouchableOpacity>
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Validade</Text>
                <TouchableOpacity style={styles.dateInput} onPress={() => setShowValidadePicker(true)}>
                  <Text style={styles.dateText}>{formatDate(form.validade)}</Text>
                  <Calendar size={18} color={theme.iconSecondary} />
                </TouchableOpacity>
              </View>
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

            {showValidadePicker && (
              <DateTimePicker
                value={form.validade}
                mode="date"
                display="default"
                onChange={(_, date) => {
                  setShowValidadePicker(false);
                  date && setForm({ ...form, validade: date });
                }}
              />
            )}
          </View>

          <View style={styles.formSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Medicamentos Prescritos</Text>
              <TouchableOpacity style={styles.addButton} onPress={handleAddMedicamento}>
                <Plus size={20} color={theme.textOnPrimary} />
                <Text style={styles.addButtonText}>Adicionar</Text>
              </TouchableOpacity>
            </View>

            {form.medicamentos.length === 0 ? (
              <View style={styles.emptyState}>
                <Pill size={40} color={theme.iconSecondary} />
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
                      <Trash2 size={20} color={theme.error} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nome do Medicamento*</Text>
                    <TextInput
                      style={styles.input}
                      value={med.nome}
                      onChangeText={(text) => handleMedicamentoChange(med.id, "nome", text)}
                      placeholder="Ex: Losartana"
                      placeholderTextColor={theme.placeholder}
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
                        placeholderTextColor={theme.placeholder}
                      />
                    </View>

                    <View style={[styles.inputGroup, { flex: 1, zIndex: openDropdownId === med.id ? 1000 : 1 }]}>
                      <Text style={styles.label}>Via de Administração</Text>
                      <View style={styles.pickerWrapper}>
                        <DropDownPicker
                          open={openDropdownId === med.id}
                          value={med.via || null}
                          items={[
                            { label: "Oral", value: "Oral" },
                            { label: "Tópica", value: "Tópica" },
                            { label: "Inalatória", value: "Inalatória" },
                            { label: "Subcutánea", value: "Subcutánea" },
                          ]}
                          setOpen={(open) => {
                            if (open) {
                              setOpenDropdownId(med.id);
                            } else {
                              setOpenDropdownId(null);
                            }
                          }}
                          setValue={(callback) => {
                            const value = callback(med.via);
                            handleMedicamentoChange(med.id, "via", value);
                          }}
                          onClose={() => setOpenDropdownId(null)}
                          placeholder="Selecione..."
                          style={styles.ScrollView}
                          dropDownContainerStyle={styles.dropDownContainer}
                          textStyle={styles.textStyle}
                          listMode="SCROLLVIEW"
                          dropDownDirection="BOTTOM"
                          zIndex={openDropdownId === med.id ? 1000 : 1}
                          zIndexInverse={1000}
                        />
                      </View>
                    </View>
                  </View>

                  <View style={styles.medRow}>
                    <View style={[styles.inputGroup, { flex: 1, marginRight: 8, zIndex: 1 }]}>
                      <Text style={styles.label}>Frequência*</Text>
                      <TextInput
                        style={styles.input}
                        value={med.frequencia}
                        onChangeText={(text) => handleMedicamentoChange(med.id, "frequencia", text)}
                        placeholder="Ex: 1x ao dia"
                        placeholderTextColor={theme.placeholder}
                      />
                    </View>

                    <View style={[styles.inputGroup, { flex: 1, zIndex: 1 }]}>
                      <Text style={styles.label}>Duração (dias)*</Text>
                      <TextInput
                        style={styles.input}
                        value={med.duracao_dias}
                        onChangeText={(text) => handleMedicamentoChange(med.id, "duracao_dias", text)}
                        keyboardType="numeric"
                        placeholder="Ex: 30"
                        placeholderTextColor={theme.placeholder}
                      />
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Observações</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Observações</Text>
              <TextInput
                style={[styles.input, { height: 100, textAlignVertical: "top" }]}
                value={form.observacoes}
                onChangeText={(text) => setForm({ ...form, observacoes: text })}
                multiline
                placeholder="Digite informações adicionais (opcional)"
                placeholderTextColor={theme.placeholder}
              />
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.8}>
          <Text style={styles.submitButtonText}>Salvar Prescrição</Text>
        </TouchableOpacity>

        <PrescriptionSummaryModal
          visible={showSummary}
          onClose={() => setShowSummary(false)}
          onSave={handleSavePrescription}
          prescription={form}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}