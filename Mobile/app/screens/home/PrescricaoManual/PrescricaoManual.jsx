import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { styles } from "./styles";

// Lucide ícones
import {
  ArrowLeft,
  Calendar,
  Plus,
  Trash2,
  Pill,
  ChevronDown,
} from "lucide-react-native";

export default function PrescricaoManualScreen() {
  const navigation = useNavigation();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showValidadePicker, setShowValidadePicker] = useState(false);

  const [form, setForm] = useState({
    diagnostico: "",
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
      via: "Oral",
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

  const handleMedicamentoChange = (id, field, value) => {
    setForm((prev) => ({
      ...prev,
      medicamentos: prev.medicamentos.map((med) =>
        med.id === id ? { ...med, [field]: value } : med
      ),
    }));
  };

  const handleSubmit = () => {
    if (!form.diagnostico.trim()) {
      Alert.alert("Campo obrigatório", "Por favor, informe o diagnóstico");
      return;
    }

    if (form.medicamentos.length === 0) {
      Alert.alert("Prescrição vazia", "Adicione pelo menos um medicamento");
      return;
    }

    for (const med of form.medicamentos) {
      if (!med.nome.trim() || !med.dosagem.trim() || !med.frequencia.trim() || !med.duracao_dias.trim()) {
        Alert.alert("Dados incompletos", "Preencha todos os campos obrigatórios dos medicamentos");
        return;
      }
    }

    console.log("Prescrição a ser salva:", form);
    Alert.alert("Sucesso", "Prescrição salva com sucesso", [
      { text: "OK", onPress: () => navigation.navigate("Prescricao") },
    ]);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="#2563EB" />
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
            <Text style={styles.label}>Diagnóstico Principal*</Text>
            <TextInput
              style={styles.input}
              value={form.diagnostico}
              onChangeText={(text) => setForm({ ...form, diagnostico: text })}
              placeholder="Ex: Hipertensão arterial"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.dateRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Data da Prescrição</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateText}>{formatDate(form.data_prescricao)}</Text>
                <Calendar size={18} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Validade</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowValidadePicker(true)}
              >
                <Text style={styles.dateText}>{formatDate(form.validade)}</Text>
                <Calendar size={18} color="#6B7280" />
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
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleRemoveMedicamento(med.id)}
                  >
                    <Trash2 size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nome do Medicamento*</Text>
                  <TextInput
                    style={styles.input}
                    value={med.nome}
                    onChangeText={(text) => handleMedicamentoChange(med.id, "nome", text)}
                    placeholder="Ex: Losartana"
                    placeholderTextColor="#9CA3AF"
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
                    <Text style={styles.label}>Via de Administração</Text>
                    <View style={styles.picker}>
                      <Text style={styles.pickerText}>{med.via}</Text>
                      <ChevronDown size={18} color="#6B7280" />
                    </View>
                  </View>
                </View>

                <View style={styles.medRow}>
                  <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.label}>Frequência*</Text>
                    <TextInput
                      style={styles.input}
                      value={med.frequencia}
                      onChangeText={(text) => handleMedicamentoChange(med.id, "frequencia", text)}
                      placeholder="Ex: 1x ao dia"
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
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.8}>
        <Text style={styles.submitButtonText}>Salvar Prescrição</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}