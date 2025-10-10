import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  StyleSheet,
} from 'react-native';
import { Search, X } from 'lucide-react-native';
import { searchMedicamentos } from '../services/medicamentosService';

const MedicamentoAutocomplete = ({
  value,
  onSelect,
  theme,
  fontSize = 16,
  scaleIcon = (size) => size,
  placeholder = "Digite o nome do medicamento",
  style = {},
  minChars = 2
}) => {
  const styles = getAutocompleteStyles(theme, fontSize);

  const [query, setQuery] = useState(value || '');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [skipSearch, setSkipSearch] = useState(false);

  const searchMedicamentosAPI = async (searchTerm) => {
    if (searchTerm.length < minChars) {
      setResults([]);
      setShowResults(false);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const medicamentos = await searchMedicamentos(searchTerm);
      setResults(medicamentos);
      setShowResults(true);
    } catch (error) {
      console.error('Erro ao buscar medicamentos:', error);
      setResults([]);
      setShowResults(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (skipSearch) {
      setSkipSearch(false);
      return;
    }

    const delayDebounce = setTimeout(() => {
      searchMedicamentosAPI(query);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSelect = (item) => {
    setQuery(item.nome);
    onSelect(item.id_medicamento, item.nome);
    setSkipSearch(true);
    setShowResults(false);
    setHasSearched(false);
    Keyboard.dismiss();
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    setHasSearched(false);
    onSelect(null, '');
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (results.length > 0 && query.length >= minChars) {
      setShowResults(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    setTimeout(() => setShowResults(false), 100);
  };

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: isFocused ? theme.primary : theme.border,
            backgroundColor: theme.cardBackground,
          },
        ]}
      >
        <Search size={scaleIcon(20)} color={theme.iconSecondary} style={styles.searchIcon} />
        <TextInput
          style={[styles.input, { color: theme.iconPrimary, fontSize: fontSize }]}
          value={query}
          onChangeText={setQuery}
          placeholder={placeholder}
          placeholderTextColor={theme.placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <X size={scaleIcon(18)} color={theme.iconSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {isLoading && (
        <View style={[styles.resultsContainer, { borderColor: theme.border, backgroundColor: theme.cardBackground }]}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={theme.primary} />
            <Text style={[styles.loadingText, { color: theme.textSecondary, fontSize: fontSize * 0.875 }]}>
              Buscando medicamentos...
            </Text>
          </View>
        </View>
      )}

      {showResults && !isLoading && results.length > 0 && (
        <View style={[styles.resultsContainer, { borderColor: theme.border, backgroundColor: theme.cardBackground }]}>
          <ScrollView style={styles.resultsList} keyboardShouldPersistTaps="always">
            {results.map((item) => (
              <TouchableOpacity
                key={item.id_medicamento}
                style={[styles.resultItem, { borderBottomColor: theme.border, backgroundColor: theme.cardBackground }]}
                onPress={() => handleSelect(item)}
              >
                <Text style={[styles.resultText, { color: theme.text, fontSize: fontSize }]}>
                  {item.nome}
                </Text>
                <Text style={[styles.resultType, { color: theme.textSecondary, fontSize: fontSize * 0.8125 }]}>
                  {item.tipo} • {item.dosagem_padrao}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {showResults && !isLoading && hasSearched && results.length === 0 && (
        <View style={[styles.resultsContainer, { borderColor: theme.border, backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.noResultsText, { color: theme.textSecondary, fontSize: fontSize * 0.875 }]}>
            Nenhum medicamento encontrado para "{query}"
          </Text>
        </View>
      )}
    </View>
  );
};

// ======= Styles Dinâmicos =======
export const getAutocompleteStyles = (theme, baseFontSize = 16) => {
  const scaleFont = (size) => (size / 16) * baseFontSize;
  const scaleSpacing = (value) => (value / 16) * baseFontSize;
  const scaleRadius = (value) => (value / 16) * baseFontSize;

  return StyleSheet.create({
    container: { 
      position: 'relative', 
      zIndex: 1000 
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: scaleRadius(12),
      paddingHorizontal: scaleSpacing(12),
      height: scaleSpacing(50),
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: scaleRadius(4),
      backgroundColor: theme.cardBackground,
    },
    searchIcon: { 
      marginRight: scaleSpacing(8), 
      opacity: 0.6 
    },
    input: { 
      flex: 1,
      fontSize: scaleFont(16), 
      height: '100%' 
    },
    clearButton: { 
      padding: scaleSpacing(6) 
    },
    resultsContainer: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      marginTop: scaleSpacing(6),
      borderWidth: 1,
      borderRadius: scaleRadius(12),
      backgroundColor: "#fff",
      maxHeight: scaleSpacing(250),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: scaleRadius(6),
      elevation: 8,
      zIndex: 9999,
    },
    loadingContainer: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      padding: scaleSpacing(14) 
    },
    loadingText: { 
      marginLeft: scaleSpacing(8),
      fontSize: scaleFont(14),
      opacity: 0.7 
    },
    resultsList: { 
      flexGrow: 0 
    },
    resultItem: { 
      paddingVertical: scaleSpacing(14), 
      paddingHorizontal: scaleSpacing(16), 
      borderBottomWidth: 1,
      borderBottomColor: "#eee" 
    },
    resultText: {
      fontSize: scaleFont(16), 
      fontWeight: '600', 
      marginBottom: scaleSpacing(2) 
    },
    resultType: {
      fontSize: scaleFont(13), 
      opacity: 0.6 
    },
    noResultsText: { 
      textAlign: 'center', 
      padding: scaleSpacing(18),
      fontSize: scaleFont(14), 
      opacity: 0.6 
    },
  });
};

export default MedicamentoAutocomplete;
