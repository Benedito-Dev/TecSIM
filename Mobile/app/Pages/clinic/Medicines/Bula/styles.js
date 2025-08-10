import { StyleSheet } from 'react-native';

export const getBulaStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    backgroundColor: theme.primary,
    paddingBottom: 15,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginBottom: 10,
    elevation: 3,
    shadowColor: theme.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    padding: 20,
    paddingBottom: 15,
  },
  headerDecoration: {
    height: 6,
    backgroundColor: theme.textOnPrimary + '30', // Adds 30% opacity
    width: '40%',
    alignSelf: 'center',
    borderRadius: 3,
  },
  medicineName: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.textOnPrimary,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  medicineDetails: {
    fontSize: 16,
    color: theme.textOnPrimary + 'E6', // 90% opacity (E6 in hex)
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  card: {
    backgroundColor: theme.backgroundCard,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: theme.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    overflow: 'hidden',
  },
  importantCard: {
    borderLeftWidth: 4,
    borderLeftColor: theme.error, // Assuming your theme has an error color
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    backgroundColor: theme.backgroundCard,
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 12,
    color: theme.textPrimary,
  },
  importantText: {
    color: theme.error,
  },
  sectionContent: {
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
  noteText: {
    fontSize: 13,
    color: theme.textMuted,
    marginTop: 12,
    fontStyle: 'italic',
  },
  footerCard: {
    backgroundColor: theme.backgroundCard,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
    elevation: 2,
    shadowColor: theme.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  footerText: {
    color: theme.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  button: {
    backgroundColor: theme.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: theme.textOnPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
  // Estilos para componentes auxiliares
  infoItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginRight: 10,
    marginTop: 2,
    color: theme.textSecondary,
  },
  infoText: {
    color: theme.textPrimary,
    flex: 1,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  infoLabel: {
    fontWeight: '600',
    color: theme.textSecondary,
    width: '40%',
  },
  infoValue: {
    color: theme.textPrimary,
    width: '58%',
    fontWeight: '500',
  },
  infoHighlight: {
    color: theme.error,
    fontWeight: '700',
  },
});