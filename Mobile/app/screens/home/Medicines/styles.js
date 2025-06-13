import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // fundo da tela
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#374151', // cinza escuro
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 45,
    marginBottom: 20,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#000', // cor da bordas
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#374151', // texto escuro
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#374151', // título escuro
  },
  medItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000', // sombra mais forte
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2, // mais opaca
    shadowRadius: 4,
    elevation: 5, // para Android: sombra mais intensa
  },
  medIcon: {
    backgroundColor: '#EFF6FF', // azul claro
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
  },
  medName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000', // azul principal
  },
  medDose: {
    fontSize: 14,
    color: '#6B7280', // texto secundário
  },
});