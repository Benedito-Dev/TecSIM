import { StyleSheet } from 'react-native';

export const getChangePasswordStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: theme.backgroundCard,
    borderBottomWidth: 0.3,
    borderBottomColor: theme.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.textPrimary,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: theme.backgroundCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: theme.shadowColor,
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: theme.inputBackground || '#fff',
    color: theme.textPrimary,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: theme.border,
  },
  saveButton: {
    backgroundColor: theme.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: theme.textOnPrimary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
