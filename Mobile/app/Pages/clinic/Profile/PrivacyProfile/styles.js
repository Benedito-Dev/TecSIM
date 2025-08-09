import { StyleSheet } from 'react-native';

export const getPrivacyStyles = (theme) => StyleSheet.create({
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
  cardText: {
    fontSize: 14,
    color: theme.textSecondary,
    lineHeight: 20,
  },
  deactivateButton: {
    marginTop: 16,
    backgroundColor: theme.warning, // Using theme warning color
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  deactivateButtonText: {
    color: theme.textOnPrimary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  deleteButton: {
    marginTop: 16,
    backgroundColor: theme.error, // Using theme error color
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: theme.textOnPrimary,
    fontWeight: 'bold',
    fontSize: 14,
  },
});