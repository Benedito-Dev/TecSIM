import React from 'react';
import { View, Text, ScrollView, Modal, Pressable, StyleSheet, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const TermsModal = ({ visible, onAccept, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Termos de Uso</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Icon name="x" size={24} color="#666" />
            </Pressable>
          </View>
          
          <ScrollView style={styles.scrollContent}>
            <Text style={styles.sectionTitle}>1. Aceitação e Restrições</Text>
            <Text style={styles.paragraph}>Ao utilizar o TecnSim, você declara que:</Text>
            <Text style={styles.listItem}>• É maior de 18 anos ou possui consentimento parental</Text>
            <Text style={styles.listItem}>• Fornecerá informações verdadeiras e completas</Text>
            <Text style={styles.listItem}>• Entendeu todos os termos e limitações</Text>
            <Text style={styles.listItem}>• Concorda em usar o aplicativo apenas como referência informativa</Text>
            
            <Text style={styles.sectionTitle}>2. Cadastro de Dados</Text>
            <Text style={styles.paragraph}>Para utilizar o TecSim, você deve fornecer as seguintes informações obrigatórias:</Text>
            <Text style={styles.listItem}>• Nome completo</Text>
            <Text style={styles.listItem}>• E-mail</Text>
            <Text style={styles.listItem}>• Senha</Text>
            <Text style={styles.listItem}>• Data de nascimento</Text>
            <Text style={styles.listItem}>• Identificação de sexo</Text>
            <Text style={styles.listItem}>• Peso</Text>
            
            <Text style={[styles.paragraph, styles.warning]}>
              O TecSim NÃO É UM SERVIÇO MÉDICO e não substitui avaliação, diagnóstico ou tratamento profissional.
            </Text>
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <Pressable 
              style={styles.acceptButton}
              onPress={onAccept}
            >
              <Text style={styles.acceptButtonText}>Aceitar Termos</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0097b2',
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    lineHeight: 20,
  },
  listItem: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
    marginBottom: 4,
    lineHeight: 20,
  },
  warning: {
    color: '#d32f2f',
    fontWeight: 'bold',
    marginVertical: 12,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  acceptButton: {
    backgroundColor: '#0097b2',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default TermsModal;