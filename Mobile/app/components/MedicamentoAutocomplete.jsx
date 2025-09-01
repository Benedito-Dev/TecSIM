import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { Search, X } from 'lucide-react-native';
import { searchMedicamentos } from '../services/medicamentosService';

const MedicamentoAutocomplete = ({ 
  value, 
  onSelect, 
  theme, 
  placeholder = "Digite o nome do medicamento",
  style = {},
  minChars = 2
}) => {
  const [query, setQuery] = useState(value || '');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Buscar medicamentos na API
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
    const delayDebounce = setTimeout(() => {
      searchMedicamentosAPI(query);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSelect = (item) => {
    setQuery(item.nome);
    onSelect(item.id_medicamento, item.nome);

    // 👇 Loga no console o id sempre que selecionar
    console.log("Medicamento selecionado:", item.id_medicamento);

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
    setTimeout(() => setShowResults(false), 200);
  };

  return (
    <View style={[styles.container, style]}>
      <View style={[
        styles.inputContainer, 
        { 
          borderColor: isFocused ? theme.primary : theme.border,
          backgroundColor: theme.cardBackground
        }
      ]}>
        <Search size={20} color={theme.iconSecondary} style={styles.searchIcon} />
        <TextInput
          style={[styles.input, { color: theme.text }]}
          value={query}
          onChangeText={setQuery}
          placeholder={placeholder}
          placeholderTextColor={theme.placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <X size={18} color={theme.iconSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {isLoading && (
        <View style={[styles.resultsContainer, { 
          borderColor: theme.border,
          backgroundColor: theme.cardBackground
        }]}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={theme.primary} />
            <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
              Buscando medicamentos...
            </Text>
          </View>
        </View>
      )}

      {showResults && !isLoading && results.length > 0 && (
        <View style={[styles.resultsContainer, { 
          borderColor: theme.border,
          backgroundColor: theme.cardBackground
        }]}>
          <ScrollView
            style={styles.resultsList}
            keyboardShouldPersistTaps="always"
          >
            {results.map((item) => (
              <TouchableOpacity 
                key={item.id_medicamento}
                style={[styles.resultItem, { 
                  borderBottomColor: theme.border,
                  backgroundColor: theme.cardBackground
                }]}
                onPress={() => handleSelect(item)}
              >
                <Text style={[styles.resultText, { color: theme.text }]}>
                  {item.nome}
                </Text>
                <Text style={[styles.resultType, { color: theme.textSecondary }]}>
                  {item.tipo} • {item.dosagem_padrao}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {showResults && !isLoading && hasSearched && results.length === 0 && (
        <View style={[styles.resultsContainer, { 
          borderColor: theme.border,
          backgroundColor: theme.cardBackground
        }]}>
          <Text style={[styles.noResultsText, { color: theme.textSecondary }]}>
            Nenhum medicamento encontrado para "{query}"
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = {
  container: {
    position: 'relative',
    zIndex: 1000,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12, // 🔹 mais arredondado
    paddingHorizontal: 12,
    height: 50,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    backgroundColor: '#fff',
  },
  searchIcon: {
    marginRight: 8,
    opacity: 0.6,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  clearButton: {
    padding: 6,
  },
  resultsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#fff',
    maxHeight: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8, // Android
    zIndex: 9999,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    opacity: 0.7,
  },
  resultsList: {
    flexGrow: 0,
  },
  resultItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  resultType: {
    fontSize: 13,
    opacity: 0.6,
  },
  noResultsText: {
    textAlign: 'center',
    padding: 18,
    fontSize: 14,
    opacity: 0.6,
  },
};


export default MedicamentoAutocomplete;
