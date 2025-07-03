import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import FeatherIcon from "react-native-vector-icons/Feather";
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from "./styles";

export default function PrescricaoManualScreen() {
  const navigation = useNavigation();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showValidadePicker, setShowValidadePicker] = useState(false);
  
  const [form, setForm] = useState({
    diagnostico: "",
    data_prescricao: new Date(),
    validade: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    medicamentos: []
  });

  const handleAddMedicamento = () => {
    const novoMedicamento = {
      id: Math.random().toString(36).substr(2, 9),
      nome: "",
      dosagem: "",
      frequencia: "",
      duracao: "",
      via: "oral"
    };
    
    setForm(prev => ({
      ...prev,
      medicamentos: [...prev.medicamentos, novoMedicamento]
    }));
  };

  const handleRemoveMedicamento = (id) => {
    setForm(prev => ({
      ...prev,
      medicamentos: prev.medicamentos.filter(med => med.id !== id)
    }));
  };

  const handleMedicamentoChange = (id, field, value) => {
    setForm(prev => ({
      ...prev,
      medicamentos: prev.medicamentos.map(med => 
        med.id === id ? { ...med, [field]: value } : med
      )
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
      if (!med.nome.trim() || !med.dosagem.trim() || !med.frequencia.trim() || !med.duracao.trim()) {
        Alert.alert("Dados incompletos", "Preencha todos os campos obrigatórios dos medicamentos");
        return;
      }
    }
    
    // Aqui você faria o envio para a API ou salvamento local
    console.log("Prescrição a ser salva:", form);
    Alert.alert("Sucesso", "Prescrição salva com sucesso", [
      { text: "OK", onPress: () => navigation.navigate("Prescricao") }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FeatherIcon name="arrow-left" size={24} color="#2563EB" />
        </TouchableOpacity>
        <Text style={styles.title}>Prescrição Manual</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Informações Básicas</Text>
          
          <Text style={styles.label}>Diagnóstico*</Text>
          <TextInput
            style={styles.input}
            value={form.diagnostico}
            onChangeText={(text) => setForm({...form, diagnostico: text})}
            placeholder="Informe o diagnóstico principal"
          />

          <Text style={styles.label}>Data da Prescrição</Text>
          <TouchableOpacity 
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>{form.data_prescricao.toLocaleDateString()}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={form.data_prescricao}
              onChange={(_, date) => {
                setShowDatePicker(false);
                date && setForm({...form, data_prescricao: date});
              }}
            />
          )}

          <Text style={styles.label}>Validade</Text>
          <TouchableOpacity 
            style={styles.dateInput}
            onPress={() => setShowValidadePicker(true)}
          >
            <Text>{form.validade.toLocaleDateString()}</Text>
          </TouchableOpacity>

          {showValidadePicker && (
            <DateTimePicker
              value={form.validade}
              onChange={(_, date) => {
                setShowValidadePicker(false);
                date && setForm({...form, validade: date});
              }}
            />
          )}
        </View>

        <View style={styles.formSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Medicamentos</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddMedicamento}
            >
              <FeatherIcon name="plus" size={20} color="#2563EB" />
            </TouchableOpacity>
          </View>

          {form.medicamentos.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum medicamento adicionado</Text>
          ) : (
            form.medicamentos.map((med, index) => (
              <View key={med.id} style={styles.medicamentoContainer}>
                <View style={styles.medicamentoHeader}>
                  <Text style={styles.medicamentoTitle}>Medicamento #{index + 1}</Text>
                  <TouchableOpacity onPress={() => handleRemoveMedicamento(med.id)}>
                    <FeatherIcon name="trash-2" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.label}>Nome*</Text>
                <TextInput
                  style={styles.input}
                  value={med.nome}
                  onChangeText={(text) => handleMedicamentoChange(med.id, 'nome', text)}
                  placeholder="Ex: Paracetamol"
                />

                <Text style={styles.label}>Dosagem*</Text>
                <TextInput
                  style={styles.input}
                  value={med.dosagem}
                  onChangeText={(text) => handleMedicamentoChange(med.id, 'dosagem', text)}
                  placeholder="Ex: 500mg"
                />

                <Text style={styles.label}>Frequência*</Text>
                <TextInput
                  style={styles.input}
                  value={med.frequencia}
                  onChangeText={(text) => handleMedicamentoChange(med.id, 'frequencia', text)}
                  placeholder="Ex: 1x ao dia"
                />

                <Text style={styles.label}>Duração (dias)*</Text>
                <TextInput
                  style={styles.input}
                  value={med.duracao}
                  onChangeText={(text) => handleMedicamentoChange(med.id, 'duracao', text)}
                  keyboardType="numeric"
                  placeholder="Ex: 30"
                />

                {index < form.medicamentos.length - 1 && <View style={styles.divider} />}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>Salvar Prescrição</Text>
      </TouchableOpacity>
    </View>
  );
}