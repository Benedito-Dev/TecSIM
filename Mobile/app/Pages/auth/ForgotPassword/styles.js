import { StyleSheet, Dimensions } from 'react-native';
const { height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: height * 0.35,
    backgroundColor: '#5f65d9',
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 25,
    marginTop: 20,
  },
  subtitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    paddingTop: 20,
  },
  button: {
    backgroundColor: '#0097b2',
    width: '85%',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 40,
  },
  disabledButton: {
    backgroundColor: '#0097b2',
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
  },
  backButton: {
    marginTop: 20,
  },
  backButtonText: {
    color: '#0097b2',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loading: {
    marginVertical: 20,
  },
  inputContainer: {
    width: '85%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 45,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  icon: {
    marginLeft: 10,
  },
});