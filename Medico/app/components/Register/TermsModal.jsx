import React from 'react';
import { View, Text, ScrollView, Modal, Pressable, StyleSheet, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const TermsModal = ({ visible, onAccept, onClose }) => {
  const openEmail = () => {
    Linking.openURL('mailto:tecsimassistente@gmail.com');
  };

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
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>1. Aceitação e Restrições</Text>
              <Text style={styles.paragraph}>Ao utilizar o TecnSim, você declara que:</Text>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>É maior de 18 anos ou possui consentimento parental</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>Fornecerá informações verdadeiras e completas</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>Entendeu todos os termos e limitações</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>Concorda em usar o aplicativo apenas como referência informativa</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>2. Cadastro de Dados</Text>
              <Text style={styles.paragraph}>Para utilizar o TecSim, você deve fornecer as seguintes informações obrigatórias:</Text>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>Nome completo</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>E-mail</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>Senha</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>Data de nascimento</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>Identificação de sexo</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>Peso</Text>
              </View>
              <Text style={styles.paragraph}>
                Você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorrerem em sua conta. Seus dados pessoais serão tratados conforme nossa Política de Privacidade. Caso suspeite de uso não autorizado de sua conta, você deve notificar imediatamente através de{' '}
                <Text style={styles.link} onPress={openEmail}>
                  tecsimassistente@gmail.com
                </Text>.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>3. Uso do Aplicativo</Text>
              <Text style={styles.paragraph}>O TecSim é um aplicativo que fornece informações básicas de enfermagem para leigos, incluindo:</Text>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>Orientações sobre medicamentos comuns e suas dosagens</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>Informações sobre potenciais interações medicamentosas</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>Cuidados caseiros para sintomas leves</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>Cadastro e acompanhamento de prescrições médicas (deve incluir orientação completa do profissional de saúde)</Text>
              </View>
              <Text style={[styles.paragraph, styles.warning]}>
                O TecSim <Text style={styles.underline}>NÃO É UM SERVIÇO MÉDICO</Text> e não substitui avaliação, diagnóstico ou tratamento profissional. Em caso de emergência médica, contate imediatamente o serviço de saúde local (ligue 192). As informações fornecidas são apenas para fins educacionais.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>4. Limitação de Responsabilidade Médica</Text>
              <Text style={styles.paragraph}>O TecSim não se responsabiliza por quaisquer danos resultantes do uso do aplicativo. As informações sobre medicamentos e dosagens são calculadas automaticamente com base em diretrizes gerais e <Text style={styles.underline}>DEVEM SEMPRE SER CONFIRMADAS</Text> por um profissional de saúde. Não nos responsabilizamos por:</Text>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>Uso inadequado de medicamentos</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>Efeitos adversos ou reações alérgicas</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>Interações medicamentosas não detectadas</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>Erros de dosagem ou administração</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>5. Alterações nos Termos</Text>
              <Text style={styles.paragraph}>Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. Quaisquer alterações serão publicadas nesta página e entrarão em vigor imediatamente após a publicação. É sua responsabilidade revisar periodicamente os Termos de Uso para estar ciente de quaisquer alterações.</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>6. Contato</Text>
              <Text style={styles.paragraph}>Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco através do e-mail: <Text style={styles.link} onPress={openEmail}>tecsimassistente@gmail.com</Text>.</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>7. Aceitação dos Termos</Text>
              <Text style={styles.paragraph}>Ao clicar em "Concordo" ou ao utilizar o aplicativo, você confirma que leu e concorda com estes Termos de Uso.</Text>
            </View>
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
  section: {
    marginBottom: 16,
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
    flexDirection: 'row',
    marginBottom: 4,
    alignItems: 'flex-start',
  },
  bullet: {
    fontSize: 14,
    color: '#555',
    marginRight: 8,
  },
  listText: {
    fontSize: 14,
    color: '#555',
    flex: 1,
    lineHeight: 20,
  },
  warning: {
    color: '#d32f2f',
    fontWeight: 'bold',
    marginVertical: 12,
  },
  underline: {
    textDecorationLine: 'underline',
  },
  link: {
    color: '#0097b2',
    textDecorationLine: 'underline',
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