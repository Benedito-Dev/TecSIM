import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Modal, ScrollView, Keyboard, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getMedicametos } from '../../../services/medicamentosService';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ArrowLeft } from 'lucide-react-native';
import { styles } from './styles';

export default function MedicineScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  const filterOptions = [
    { id: 'analgesico', label: 'Analgésico', icon: 'emoticon-happy' },
    { id: 'antiinflamatorio', label: 'Anti-inflamatório', icon: 'fire' },
    { id: 'antibiotico', label: 'Antibiótico', icon: 'bacteria' },
    { id: 'antialergico', label: 'Antialérgico', icon: 'flower' },
    { id: 'gastro', label: 'Gastroprotetor', icon: 'stomach' },
  ];

  useEffect(() => {
    (async () => {
      try {
        const response = await getMedicametos();
        setMedicines(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("Erro ao buscar medicamentos:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleFilter = (id) =>
    setActiveFilters((prev) => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);

  const filtered = medicines.filter(({ nome = '', tipo = '' }) => {
    const searchMatch = nome.toLowerCase().includes(search.toLowerCase()) || tipo.toLowerCase().includes(search.toLowerCase());
    const filterMatch = !activeFilters.length || activeFilters.includes(tipo);
    return searchMatch && filterMatch;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>Medicamentos</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <FeatherIcon name="search" size={20} color="#A0A0A0" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nome ou tipo..."
          placeholderTextColor="#A0A0A0"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={Keyboard.dismiss}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')} style={styles.clearButton}>
            <FeatherIcon name="x" size={18} color="#A0A0A0" />
          </TouchableOpacity>
        )}
      </View>

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <Text style={styles.sectionTitle}>Meus medicamentos</Text>
        <View style={styles.resultsControls}>
          <Text style={styles.resultsCount}>
            {filtered.length} {filtered.length === 1 ? 'item' : 'itens'}
          </Text>
          <TouchableOpacity
            style={[styles.filterButton, activeFilters.length > 0 && styles.filterButtonActive]}
            onPress={() => setShowFilters(true)}
          >
            <FeatherIcon name="filter" size={20} color={activeFilters.length > 0 ? '#2563EB' : '#6B7280'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Loading */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="pill-off" size={48} color="#E5E7EB" />
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
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.medItem} onPress={() => navigation.replace('Bula')}>
              <View style={styles.medIcon}>
                <MaterialCommunityIcons name="pill" size={24} color="#2563EB" />
              </View>
              <View style={styles.medInfo}>
                <Text style={styles.medName}>{item.nome}</Text>
                <View style={styles.medDetails}>
                  <Text style={styles.medDose}>{item.dosagem}</Text>
                  <View style={styles.medType}>
                    <Text style={styles.medTypeText}>
                      {filterOptions.find(f => f.id === item.tipo)?.label || item.tipo}
                    </Text>
                  </View>
                </View>
              </View>
              <FeatherIcon name="chevron-right" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        />
      )}

      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtrar por tipo</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <FeatherIcon name="x" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.filtersContainer}>
              {filterOptions.map(({ id, label, icon }) => {
                const active = activeFilters.includes(id);
                return (
                  <TouchableOpacity
                    key={id}
                    style={[styles.filterOption, active && styles.filterOptionActive]}
                    onPress={() => toggleFilter(id)}
                  >
                    <MaterialCommunityIcons name={icon} size={20} color={active ? '#2563EB' : '#6B7280'} />
                    <Text style={[styles.filterOptionText, active && styles.filterOptionTextActive]}>{label}</Text>
                    {active && <FeatherIcon name="check" size={18} color="#2563EB" style={styles.filterCheckIcon} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.clearFiltersButton} onPress={() => setActiveFilters([])}>
                <Text style={styles.clearFiltersText}>Limpar filtros</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyFiltersButton} onPress={() => setShowFilters(false)}>
                <Text style={styles.applyFiltersText}>Aplicar filtros</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
