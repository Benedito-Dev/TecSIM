import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { MaterialIcons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import styles from './styles';

const MedicineLeafletScreen = () => {
  const [expandedSections, setExpandedSections] = React.useState({
    dosage: true,
    contraindications: true,
    indications: false,
    precautions: false,
    interactions: false,
    storage: false
  });

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.medicineName}>PARACETAMOL</Text>
          <Text style={styles.medicineDetails}>Analgésico e antitérmico • Comprimido 500mg</Text>
        </View>
        <View style={styles.headerDecoration}></View>
      </View>

      {/* Conteúdo principal */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Seção de DOSAGEM */}
        <View style={styles.card}>
          <TouchableOpacity 
            style={styles.sectionHeader} 
            onPress={() => toggleSection('dosage')}
            activeOpacity={0.7}
          >
            <View style={styles.sectionTitle}>
              <MaterialIcons name="medication" size={22} color="#3498db" />
              <Text style={styles.sectionHeaderText}>DOSAGEM E ADMINISTRAÇÃO</Text>
            </View>
            <MaterialIcons 
              name={expandedSections.dosage ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
              size={24} 
              color="#7f8c8d" 
            />
          </TouchableOpacity>
          
          {expandedSections.dosage && (
            <View style={styles.sectionContent}>
              <InfoRow label="Forma farmacêutica:" value="Comprimido revestido" />
              <InfoRow label="Forma de administração:" value="Oral" />
              <InfoRow label="Dose para adultos:" value="500mg a cada 4-6 horas" />
              <InfoRow 
                label="Dose máxima diária:" 
                value="4g (8 comprimidos)" 
                highlight 
              />
              <Text style={styles.noteText}>* Não recomendado para crianças abaixo de 10 anos</Text>
            </View>
          )}
        </View>

        {/* Seção de CONTRAINDICAÇÕES */}
        <View style={[styles.card, styles.importantCard]}>
          <TouchableOpacity 
            style={styles.sectionHeader} 
            onPress={() => toggleSection('contraindications')}
            activeOpacity={0.7}
          >
            <View style={styles.sectionTitle}>
              <MaterialIcons name="warning" size={22} color="#e74c3c" />
              <Text style={[styles.sectionHeaderText, styles.importantText]}>CONTRAINDICAÇÕES</Text>
            </View>
            <MaterialIcons 
              name={expandedSections.contraindications ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
              size={24} 
              color="#e74c3c" 
            />
          </TouchableOpacity>
          
          {expandedSections.contraindications && (
            <View style={styles.sectionContent}>
              <InfoItem icon="❌" text="Alergia ao paracetamol ou qualquer componente da fórmula" />
              <InfoItem icon="❌" text="Pacientes com insuficiência hepática grave" />
              <InfoItem icon="❌" text="Crianças menores de 12 anos (para esta formulação)" />
            </View>
          )}
        </View>

        {/* Seção de INDICAÇÕES */}
        <View style={styles.card}>
          <TouchableOpacity 
            style={styles.sectionHeader} 
            onPress={() => toggleSection('indications')}
            activeOpacity={0.7}
          >
            <View style={styles.sectionTitle}>
              <FontAwesome name="heart" size={20} color="#3498db" />
              <Text style={styles.sectionHeaderText}>INDICAÇÕES</Text>
            </View>
            <MaterialIcons 
              name={expandedSections.indications ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
              size={24} 
              color="#7f8c8d" 
            />
          </TouchableOpacity>
          
          {expandedSections.indications && (
            <View style={styles.sectionContent}>
              <InfoItem icon="🌡️" text="Febre" />
              <InfoItem icon="🤕" text="Dor leve a moderada (incluindo dor de cabeça, dor de dente)" />
              <InfoItem icon="💪" text="Dores musculares" />
              <InfoItem icon="🤒" text="Sintomas de gripes e resfriados" />
            </View>
          )}
        </View>

        {/* Seção de PRECAUÇÕES */}
        <View style={styles.card}>
          <TouchableOpacity 
            style={styles.sectionHeader} 
            onPress={() => toggleSection('precautions')}
            activeOpacity={0.7}
          >
            <View style={styles.sectionTitle}>
              <MaterialCommunityIcons name="alert-circle" size={20} color="#f39c12" />
              <Text style={styles.sectionHeaderText}>PRECAUÇÕES E ADVERTÊNCIAS</Text>
            </View>
            <MaterialIcons 
              name={expandedSections.precautions ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
              size={24} 
              color="#7f8c8d" 
            />
          </TouchableOpacity>
          
          {expandedSections.precautions && (
            <View style={styles.sectionContent}>
              <InfoItem icon="⚠️" text="Pacientes com problemas hepáticos devem usar com cautela" />
              <InfoItem icon="⚠️" text="Evitar consumo de álcool durante o tratamento" />
              <InfoItem icon="⚠️" text="Grávidas e lactantes: usar somente sob orientação médica" />
              <InfoItem icon="⚠️" text="Não use por mais de 3 dias para febre sem orientação médica" />
            </View>
          )}
        </View>

        {/* Seção de INTERAÇÕES */}
        <View style={styles.card}>
          <TouchableOpacity 
            style={styles.sectionHeader} 
            onPress={() => toggleSection('interactions')}
            activeOpacity={0.7}
          >
            <View style={styles.sectionTitle}>
              <MaterialCommunityIcons name="alert-octagon" size={20} color="#f39c12" />
              <Text style={styles.sectionHeaderText}>INTERAÇÕES MEDICAMENTOSAS</Text>
            </View>
            <MaterialIcons 
              name={expandedSections.interactions ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
              size={24} 
              color="#7f8c8d" 
            />
          </TouchableOpacity>
          
          {expandedSections.interactions && (
            <View style={styles.sectionContent}>
              <InfoItem icon="💊" text="Anticoagulantes (varfarina): pode aumentar o efeito anticoagulante" />
              <InfoItem icon="💊" text="Outros medicamentos contendo paracetamol: risco de overdose" />
              <InfoItem icon="🍷" text="Álcool: aumenta risco de dano hepático" />
            </View>
          )}
        </View>

        {/* Seção de ARMAZENAMENTO */}
        <View style={styles.card}>
          <TouchableOpacity 
            style={styles.sectionHeader} 
            onPress={() => toggleSection('storage')}
            activeOpacity={0.7}
          >
            <View style={styles.sectionTitle}>
              <MaterialIcons name="inventory" size={20} color="#3498db" />
              <Text style={styles.sectionHeaderText}>ARMAZENAMENTO E VALIDADE</Text>
            </View>
            <MaterialIcons 
              name={expandedSections.storage ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
              size={24} 
              color="#7f8c8d" 
            />
          </TouchableOpacity>
          
          {expandedSections.storage && (
            <View style={styles.sectionContent}>
              <InfoItem icon="🌡️" text="Armazenar em local seco abaixo de 30°C" />
              <InfoItem icon="📦" text="Manter na embalagem original" />
              <InfoItem icon="👶" text="Manter fora do alcance de crianças" />
              <InfoItem icon="⏱️" text="Prazo de validade: 36 meses após fabricação" />
            </View>
          )}
        </View>

        {/* Rodapé */}
        <View style={styles.footerCard}>
          <Text style={styles.footerText}>
            Para informações completas, consulte a bula profissional no site da Anvisa
          </Text>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => Linking.openURL('https://www.anvisa.gov.br')}
          >
            <Text style={styles.buttonText}>ACESSAR BULA COMPLETA</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

// Componentes auxiliares
const InfoItem = ({ icon, text }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoIcon}>{icon}</Text>
    <Text style={styles.infoText}>{text}</Text>
  </View>
);

const InfoRow = ({ label, value, highlight = false }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={[styles.infoValue, highlight && styles.infoHighlight]}>{value}</Text>
  </View>
);

export default MedicineLeafletScreen;