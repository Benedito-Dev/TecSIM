import { StyleSheet } from 'react-native';

export const getPrescriptionStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.backgroundCard,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    color: theme.textSecondary,
    marginTop: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.textMuted,
    marginTop: 4,
    marginBottom: 24,
    textAlign: 'center',
  },
  prescricaoItem: {
    backgroundColor: theme.backgroundCard,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.borderLight,
    overflow: 'hidden',
  },
  prescricaoHeader: {
    padding: 16,
  },
  prescricaoInfo: {
    flex: 1,
  },
  prescricaoTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  prescricaoTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 6,
  },
  prescricaoHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  prescricaoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textPrimary,
    flex: 1,
  },
  prescricaoSubtitle: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  prescricaoDate: {
    fontSize: 13,
    color: theme.textSecondary,
    marginTop: 4,
  },
  prescricaoContent: {
    padding: 14,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: theme.borderLight,
  },
  medicineItem: {
    backgroundColor: theme.backgroundSecondary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  medicineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  medicineName: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.textPrimary,
    flex: 1,
  },
  medicineDose: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.primary,
    marginRight: 8,
  },
  medicineDetails: {
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: theme.textSecondary,
  },
  deleteButton: {
    padding: 4,
  },
  emptyMedicamentos: {
    textAlign: 'center',
    color: theme.textMuted,
    fontSize: 14,
    paddingVertical: 12,
  },
  addPrescButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: theme.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 50,
    elevation: 3,
    shadowColor: theme.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addPrescButtonText: {
    color: theme.textOnPrimary,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  
  // Estilos para o componente de ações
  actionsContainer: {
    position: 'relative',
  },
  actionsButton: {
    padding: 4,
  },
  actionsMenu: {
    position: 'absolute',
    top: 28,
    right: 0,
    backgroundColor: theme.backgroundCard,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    flexDirection: 'column', // vertical
    minWidth: 140, // largura mínima para textos
    zIndex: 999, // fica acima dos outros elementos

    // Sombra iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,

    // Sombra Android
    elevation: 5,

    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionText: {
    marginLeft: 12,
    fontSize: 16,
    color: theme.textSecondary,
  },

  chevronContainer: {
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme.borderLight,
  },
  deletingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  deletingText: {
    marginTop: 8,
    color: '#EF4444',
    fontWeight: '600',
  }
});