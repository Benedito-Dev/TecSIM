import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import {
  View, Text, ScrollView, TouchableOpacity,
  Linking, ActivityIndicator
} from 'react-native';
import {
  MaterialIcons, FontAwesome,
  MaterialCommunityIcons
} from '@expo/vector-icons';
import { getBulaPorMedicamento } from '../../../../services/bulaService';

import styles from './styles';

export default function BulaScreen() {
  const route = useRoute();
  const { idMedicamento, nomeMedicamento, tipoMedicamento, dosagemMedicamento } = route.params;


  const [bula, setBula] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    dosage: true,
    contraindications: true,
    indications: false,
    precautions: false,
    interactions: false,
    storage: false,
  });

  useEffect(() => {
    const fetchBula = async () => {
      try {
        const data = await getBulaPorMedicamento(idMedicamento);
        setBula(data);
      } catch (error) {
        console.error('Erro ao buscar bula:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBula();
  }, [idMedicamento]);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={{ marginTop: 10, color: '#3498db' }}>Carregando bula...</Text>
      </View>
    );
  }

  if (!bula) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: 'red', fontSize: 16 }}>Bula não encontrada.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.medicineName}>{nomeMedicamento?.toUpperCase() || 'MEDICAMENTO'}</Text>
          <Text style={styles.medicineDetails}>
            {tipoMedicamento || ''} • {dosagemMedicamento || ''}
          </Text>
        </View>
        <View style={styles.headerDecoration}></View>
      </View>

      {/* Conteúdo principal */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ExpandableSection
          title="DOSAGEM E ADMINISTRAÇÃO"
          icon={<MaterialIcons name="medication" size={22} color="#3498db" />}
          expanded={expandedSections.dosage}
          onToggle={() => toggleSection('dosage')}
          items={bula.dosagem_e_administracao}
        />

        <ExpandableSection
          title="CONTRAINDICAÇÕES"
          icon={<MaterialIcons name="warning" size={22} color="#e74c3c" />}
          expanded={expandedSections.contraindications}
          onToggle={() => toggleSection('contraindications')}
          items={bula.contraindicacoes}
          important
        />

        <ExpandableSection
          title="INDICAÇÕES"
          icon={<FontAwesome name="heart" size={20} color="#3498db" />}
          expanded={expandedSections.indications}
          onToggle={() => toggleSection('indications')}
          items={bula.indicacoes}
        />

        <ExpandableSection
          title="PRECAUÇÕES E ADVERTÊNCIAS"
          icon={<MaterialCommunityIcons name="alert-circle" size={20} color="#f39c12" />}
          expanded={expandedSections.precautions}
          onToggle={() => toggleSection('precautions')}
          items={bula.advertencias}
        />

        <ExpandableSection
          title="INTERAÇÕES MEDICAMENTOSAS"
          icon={<MaterialCommunityIcons name="alert-octagon" size={20} color="#f39c12" />}
          expanded={expandedSections.interactions}
          onToggle={() => toggleSection('interactions')}
          items={bula.interacoes_medicamentosas}
        />

        <ExpandableSection
          title="ARMAZENAMENTO E VALIDADE"
          icon={<MaterialIcons name="inventory" size={20} color="#3498db" />}
          expanded={expandedSections.storage}
          onToggle={() => toggleSection('storage')}
          items={bula.armazenamento_e_validade}
        />

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
}

// Componente reutilizável para seções
const ExpandableSection = ({ title, icon, expanded, onToggle, items, important = false }) => (
  <View style={[styles.card, important && styles.importantCard]}>
    <TouchableOpacity style={styles.sectionHeader} onPress={onToggle} activeOpacity={0.7}>
      <View style={styles.sectionTitle}>
        {icon}
        <Text style={[styles.sectionHeaderText, important && styles.importantText]}>{title}</Text>
      </View>
      <MaterialIcons
        name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
        size={24}
        color={important ? '#e74c3c' : '#7f8c8d'}
      />
    </TouchableOpacity>
    {expanded && (
      <View style={styles.sectionContent}>
        {items && items.length > 0 ? (
          items.map((text, index) => (
              <InfoItem
                key={index}
                icon={getIconForSection(title)}
                text={text}
            />
            ))
        ) : (
          <Text style={styles.infoText}>Nenhuma informação disponível.</Text>
        )}
      </View>
    )}
  </View>
);

// Componente de linha com ícone
const InfoItem = ({ icon, text }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoIcon}>{icon}</Text>
    <Text style={styles.infoText}>{text}</Text>
  </View>
);

const getIconForSection = (sectionTitle) => {
  switch (sectionTitle) {
    case 'CONTRAINDICAÇÕES':
      return '❌';
    case 'INTERAÇÕES MEDICAMENTOSAS':
      return '💊';
    case 'PRECAUÇÕES E ADVERTÊNCIAS':
      return '⚠️';
    case 'INDICAÇÕES':
      return '✅';
    case 'ARMAZENAMENTO E VALIDADE':
      return '📦';
    case 'DOSAGEM E ADMINISTRAÇÃO':
      return '🕒';
    default:
      return '•';
  }
};
