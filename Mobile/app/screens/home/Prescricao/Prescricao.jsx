import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
<<<<<<< HEAD
import { FileText, Plus, Search, Filter, ChevronDown, ChevronUp, Trash2, Clock, Calendar, Syringe, User, Clipboard } from 'lucide-react-native';
=======
import { FileText, ArrowLeft, Plus, Filter, ChevronDown, ChevronUp, Trash2, Clock, Calendar, Syringe, User, Clipboard } from 'lucide-react-native';
>>>>>>> 3d12a93034122dd47626d38175654c7dddc000c4
import { styles } from './styles';

// Função para formatar a data no padrão dd/mm/aaaa
const formatarData = (dataString) => {
  const data = new Date(dataString);
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
<<<<<<< HEAD
  return `${dia}/${mes}/${ano}`;
};

// Dados mockados atualizados com a nova estrutura
const mockPrescricoes = [
=======
  return `${dia}-${mes}-${ano}`;
};

// Dados mockados atualizados com a nova estrutura
const initialMockPrescricoes = [
>>>>>>> 3d12a93034122dd47626d38175654c7dddc000c4
  {
    id: '1',
    id_paciente: '123',
    id_medico: '456',
    crm: '123456',
    diagnostico: 'Hipertensão arterial',
    data_prescricao: '2023-05-15',
    validade: '2023-11-15',
    data_cadastro: '2023-05-15',
    medicamentos: [
      {
        id_medicamento_prescrito: '1',
        nome: 'Losartana',
        dosagem: '50mg',
        frequencia: '1x ao dia',
        duracao_dias: '30',
<<<<<<< HEAD
        via: 'Oral'
=======
>>>>>>> 3d12a93034122dd47626d38175654c7dddc000c4
      }
    ]
  },
  {
    id: '2',
    id_paciente: '123',
    id_medico: '789',
    crm: '654321',
    diagnostico: 'Diabetes Mellitus Tipo 2',
    data_prescricao: '2023-06-20',
    validade: '2023-12-20',
    data_cadastro: '2023-06-20',
    medicamentos: [
      {
        id_medicamento_prescrito: '2',
        nome: 'Metformina',
        dosagem: '850mg',
        frequencia: '2x ao dia',
        duracao_dias: '60',
<<<<<<< HEAD
        via: 'Oral'
=======
>>>>>>> 3d12a93034122dd47626d38175654c7dddc000c4
      },
      {
        id_medicamento_prescrito: '3',
        nome: 'Insulina NPH',
        dosagem: '20UI',
        frequencia: '1x ao dia',
        duracao_dias: '30',
<<<<<<< HEAD
        via: 'Subcutânea'
=======
>>>>>>> 3d12a93034122dd47626d38175654c7dddc000c4
      }
    ]
  }
];

export default function PrescricaoScreen() {
  const navigation = useNavigation();
<<<<<<< HEAD
  const [prescricoes] = useState(mockPrescricoes);
=======
  const [prescricoes, setPrescricoes] = useState(initialMockPrescricoes);
>>>>>>> 3d12a93034122dd47626d38175654c7dddc000c4
  const [expandedPrescricao, setExpandedPrescricao] = useState(null);

  const togglePrescricao = (id) => {
    setExpandedPrescricao(expandedPrescricao === id ? null : id);
  };

  const handleAddPrescricao = () => {
<<<<<<< HEAD
    navigation.navigate('RegistroPrescricao');
  };

  const handleSearch = () => {
    navigation.navigate('BuscarPrescricao');
  };

=======
    navigation.navigate('NovaPrescricao');
  };

>>>>>>> 3d12a93034122dd47626d38175654c7dddc000c4
  const handleFilter = () => {
    console.log('Filtrar prescrições');
  };

<<<<<<< HEAD
  const handleDeleteMedicamento = (idMedicamento) => {
=======
  const handleDeleteMedicamento = (prescricaoId, medicamentoId) => {
>>>>>>> 3d12a93034122dd47626d38175654c7dddc000c4
    Alert.alert(
      "Remover medicamento",
      "Tem certeza que deseja remover este medicamento da prescrição?",
      [
        { text: "Cancelar", style: "cancel" },
<<<<<<< HEAD
        { text: "Remover", onPress: () => console.log("Medicamento removido:", idMedicamento) }
=======
        { 
          text: "Remover", 
          onPress: () => {
            const updatedPrescricoes = prescricoes.map(prescricao => {
              if (prescricao.id === prescricaoId) {
                return {
                  ...prescricao,
                  medicamentos: prescricao.medicamentos.filter(
                    med => med.id_medicamento_prescrito !== medicamentoId
                  )
                };
              }
              return prescricao;
            });
            setPrescricoes(updatedPrescricoes);
          }
        }
>>>>>>> 3d12a93034122dd47626d38175654c7dddc000c4
      ]
    );
  };

<<<<<<< HEAD
  const renderMedicamento = ({ item }) => (
=======
  const renderMedicamento = ({ item, prescricaoId }) => (
>>>>>>> 3d12a93034122dd47626d38175654c7dddc000c4
    <View style={styles.medicineItem}>
      <View style={styles.medicineHeader}>
        <Text style={styles.medicineName}>{item.nome}</Text>
        <Text style={styles.medicineDose}>{item.dosagem}</Text>
        <TouchableOpacity 
          style={styles.deleteButton}
<<<<<<< HEAD
          onPress={() => handleDeleteMedicamento(item.id_medicamento_prescrito)}
        >
=======
          onPress={() => handleDeleteMedicamento(prescricaoId, item.id_medicamento_prescrito)}>
>>>>>>> 3d12a93034122dd47626d38175654c7dddc000c4
          <Trash2 size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.medicineDetails}>
        <View style={styles.detailRow}>
          <Clock size={14} color="#6B7280" />
          <Text style={styles.detailText}>{item.frequencia}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Calendar size={14} color="#6B7280" />
          <Text style={styles.detailText}>{item.duracao_dias} dias</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Syringe size={14} color="#6B7280" />
          <Text style={styles.detailText}>Via: {item.via}</Text>
        </View>
      </View>
    </View>
  );

  const renderPrescricao = ({ item }) => (
    <View style={styles.prescricaoItem}>
      <TouchableOpacity 
        style={styles.prescricaoHeader}
        onPress={() => togglePrescricao(item.id)}
      >
        <View style={styles.prescricaoInfo}>
          <View style={styles.prescricaoHeaderRow}>
            <Clipboard size={16} color="#2563EB" />
            <Text style={styles.prescricaoTitle}>{item.diagnostico}</Text>
          </View>
          
          <View style={styles.prescricaoHeaderRow}>
            <User size={16} color="#6B7280" />
            <Text style={styles.prescricaoSubtitle}>CRM: {item.crm}</Text>
          </View>
          
          <Text style={styles.prescricaoDate}>
<<<<<<< HEAD
            {formatarData(item.data_prescricao)} • Validade: {formatarData(item.validade)}
=======
            • Cadastro:{formatarData(item.data_prescricao)}
>>>>>>> 3d12a93034122dd47626d38175654c7dddc000c4
          </Text>
          <Text style={styles.prescricaoDate}>• Validade: {formatarData(item.validade)}</Text>
        </View>
        {expandedPrescricao === item.id ? (
          <ChevronUp size={20} color="#6B7280" />
        ) : (
          <ChevronDown size={20} color="#6B7280" />
        )}
      </TouchableOpacity>
      
      {expandedPrescricao === item.id && (
        <View style={styles.prescricaoContent}>
          {item.medicamentos.length > 0 ? (
            <FlatList
              data={item.medicamentos}
<<<<<<< HEAD
              renderItem={renderMedicamento}
=======
              renderItem={({ item: medItem }) => renderMedicamento({ item: medItem, prescricaoId: item.id })}
>>>>>>> 3d12a93034122dd47626d38175654c7dddc000c4
              keyExtractor={med => med.id_medicamento_prescrito.toString()}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.emptyMedicamentos}>Nenhum medicamento prescrito</Text>
          )}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
<<<<<<< HEAD
        <Text style={styles.headerTitle}>Minhas Prescrições</Text>
      </View>

      {/* Barra de ações */}
      <View style={styles.actionsBar}>
        <View style={styles.searchFilterContainer}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={handleSearch}
          >
            <Search size={22} color="#0c87c4" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={handleFilter}
          >
            <Filter size={22} color="#0c87c4" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddPrescricao}
        >
          <Plus size={20} color="#fff" />
          <Text style={styles.addButtonText}>Nova</Text>
        </TouchableOpacity>
      </View>

=======
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#2563EB" />
        </TouchableOpacity>
        <Text style={styles.title}>Minhas Prescrições</Text>
        <View style={{ width: 24 }} />
      </View>

>>>>>>> 3d12a93034122dd47626d38175654c7dddc000c4
      {/* Lista de prescrições */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {prescricoes.length > 0 ? (
          <FlatList
            data={prescricoes}
            renderItem={renderPrescricao}
            keyExtractor={item => item.id.toString()}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <FileText size={48} color="#ccc" />
            <Text style={styles.emptyText}>Nenhuma prescrição cadastrada</Text>
            <Text style={styles.emptySubtext}>Adicione uma nova prescrição para começar</Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={handleAddPrescricao}
            >
              <Text style={styles.emptyButtonText}>Adicionar Prescrição</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}