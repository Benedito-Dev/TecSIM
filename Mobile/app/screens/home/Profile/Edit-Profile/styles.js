import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fbfd',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 12,
    alignSelf: 'center', // Centraliza a imagem do avatar
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    flex: 1,
  },
  botaoUpload: {
    marginTop: 10,
    backgroundColor: '#0c87c4',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: 'center',
  },

  botaoUploadTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  section: {
    marginBottom: 0,
    alignItems: 'center', // Centraliza os campos do formulário
  },
  configItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Centraliza o botão de salvar
    paddingVertical: 12,
    marginBottom: 30,
  },
  configText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#333',
  },
  button: {
    backgroundColor: '#0097b2',
    width: "85%",
    paddingVertical: 12,
    paddingHorizontal: 80,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
  },
  pickerWrapper: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  picker: {
    height: 45,
    width: '100%',
  },
  profileSection: {
    alignItems: 'center', // Adicionado para centralizar o avatar
    marginBottom: 0,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
});
