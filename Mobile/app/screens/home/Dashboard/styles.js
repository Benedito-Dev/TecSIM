import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0c87c4',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    textAlign: 'left',
  },
  subWelcome: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'left',
  },
  chatCard: {
    backgroundColor: '#0c87c4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  chatCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  chatCardDescription: {
    fontSize: 14,
    color: '#e0f7ff',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  cardGrid: {
    flexDirection: 'column',
    gap: 12,
  },
  toolCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    alignItems: 'center',
  },
  toolCardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0c87c4',
    marginTop: 8,
  },
  toolCardDescription: {
    fontSize: 13,
    color: '#555',
    textAlign: 'center',
    marginTop: 4,
  },
});
