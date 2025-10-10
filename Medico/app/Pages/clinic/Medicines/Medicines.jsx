import React, { useState, useEffect, useContext } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  Modal, ScrollView, Keyboard, ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getMedicamentos } from '../../../services/medicamentosService';
import { useElderMode } from "../../../context/ElderModeContext"; // ✅ usa o hook

import { ThemeContext } from '../../../context/ThemeContext';

import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ArrowLeft } from 'lucide-react-native';
import { getMedicationStyles } from './styles';
import { useScale } from '../../../utils/scale'; // ✅ Hook global para escalonamento

import removeAccents from 'remove-accents'; // npm install remove-accents

export default function MedicineScreen() {
  const navigation = useNavigation();

  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { theme } = useContext(ThemeContext)
  const { fontSize, fontIndex, increaseFont, decreaseFont } = useElderMode(); // ✅ acessa os valores do contexto
  const { scaleIcon } = useScale(fontSize); // ✅ agora pegamos a função direto do utils
  const styles = getMedicationStyles(theme, fontSize);

  const filterOptions = [
    { id: 'analgesico', label: 'Analgésico', icon: 'emoticon-happy' },
    { id: 'antiinflamatorio', label: 'Anti-inflamatório', icon: 'fire' },
    { id: 'antibiotico', label: 'Antibiótico', icon: 'bacteria' },
    { id: 'antialergico', label: 'Antialérgico', icon: 'flower' },
    { id: 'gastro', label: 'Gastroprotetor', icon: 'stomach' },
  ];

  useEffect(() => {
    async function fetchMedicamentos() {
      setIsLoading(true);
      try {
        const response = await getMedicamentos();
        if (Array.isArray(response)) {
          setMedicines(response);
        } else {
          console.error("Resposta inesperada:", response);
        }
      } catch (error) {
        console.error("Erro ao buscar medicamentos:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMedicamentos();
  }, []);

  const toggleFilter = (filterId) => {
    setActiveFilters(prev =>
      prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  // FILTRO AJUSTADO
  const filtered = medicines.filter(item => {
    const nomeLower = item.nome?.toLowerCase() || '';
    const tipoNormalized = removeAccents(item.tipo?.toLowerCase() || '');
    const searchLower = search.toLowerCase();

    const matchesSearch =
      nomeLower.includes(searchLower) ||
      tipoNormalized.includes(searchLower);

    const matchesFilter =
      activeFilters.length === 0 ||
      activeFilters.some(filterId => filterId === tipoNormalized);

    return matchesSearch && matchesFilter;
  });

  const handleSearchSubmit = () => {
    Keyboard.dismiss();
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={{ marginTop: 10, color: '#2563EB', fontSize: 16 }}>Carregando medicamentos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ display: "flex", alignItems: "center", flexDirection: "row", gap: 20 }} >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={scaleIcon(24)} color={theme.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Medicamentos</Text>
        </View>
      </View>

      {/* Barra de busca */}
      <View style={styles.searchContainer}>
        <FeatherIcon name="search" size={scaleIcon(20)} color="#A0A0A0" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nome ou tipo..."
          placeholderTextColor="#A0A0A0"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearchSubmit}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')} style={styles.clearButton}>
            <FeatherIcon name="x" size={18} color="#A0A0A0" />
          </TouchableOpacity>
        )}
      </View>

      {/* Info de resultados */}
      <View style={styles.resultsHeader}>
        <Text style={styles.sectionTitle}>Meus medicamentos</Text>
        <View style={styles.resultsControls}>
          <Text style={styles.resultsCount}>{filtered.length} {filtered.length === 1 ? 'item' : 'itens'}</Text>
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilters.length > 0 && styles.filterButtonActive
            ]}
            onPress={() => setShowFilters(true)}
          >
            <FeatherIcon
              name="filter"
              size={20}
              color={activeFilters.length > 0 ? '#2563EB' : '#6B7280'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista de medicamentos */}
      {filtered.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="pill-off" size={scaleIcon(48)} color="#E5E7EB" />
          <Text style={styles.emptyText}>Nenhum medicamento encontrado</Text>
          <Text style={styles.emptySubtext}>
            {activeFilters.length > 0
              ? "Tente ajustar os filtros ou buscar com outro termo"
              : "Tente buscar com outro termo"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id_medicamento.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.medItem} onPress={() => navigation.navigate('Bula', { idMedicamento: item.id_medicamento, 
                                                                                                  nomeMedicamento: item.nome, 
                                                                                                  tipoMedicamento: item.tipo, 
                                                                                                  dosagemMedicamento: item.dosagem_padrao })}>
              <View style={styles.medIcon}>
                <MaterialCommunityIcons name="pill" size={scaleIcon(24)} color={theme.primary} />
              </View>
              <View style={styles.medInfo}>
                <Text style={styles.medName}>{item.nome}</Text>
                <View style={styles.medDetails}>
                  <Text style={styles.medDose}>{item.dosagem || item.dosagem_padrao}</Text>
                  <View style={styles.medType}>
                    <Text style={styles.medTypeText}>
                      {filterOptions.find(f => f.id === removeAccents(item.tipo?.toLowerCase()))?.label || item.tipo}
                    </Text>
                  </View>
                </View>
              </View>
              <FeatherIcon name="chevron-right" size={scaleIcon(20)} color="#9CA3AF" />
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}

      {/* Modal de Filtros */}
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtrar por tipo</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <FeatherIcon name="x" size={scaleIcon(24)} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.filtersContainer}>
              {filterOptions.map(filter => (
                <TouchableOpacity
                  key={filter.id}
                  style={[
                    styles.filterOption,
                    activeFilters.includes(filter.id) && styles.filterOptionActive
                  ]}
                  onPress={() => toggleFilter(filter.id)}
                >
                  <MaterialCommunityIcons
                    name={filter.icon}
                    size={scaleIcon(20)}
                    color={activeFilters.includes(filter.id) ? '#2563EB' : '#6B7280'}
                  />
                  <Text style={[
                    styles.filterOptionText,
                    activeFilters.includes(filter.id) && styles.filterOptionTextActive
                  ]}>
                    {filter.label}
                  </Text>
                  {activeFilters.includes(filter.id) && (
                    <FeatherIcon
                      name="check"
                      size={scaleIcon(18)}
                      color="#2563EB"
                      style={styles.filterCheckIcon}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.clearFiltersButton}
                onPress={() => setActiveFilters([])}
              >
                <Text style={styles.clearFiltersText}>Limpar filtros</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyFiltersButton}
                onPress={() => setShowFilters(false)}
              >
                <Text style={styles.applyFiltersText}>Aplicar filtros</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
