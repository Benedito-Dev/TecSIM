import { StyleSheet } from 'react-native';

export const getPrescriptionStyles = (theme, baseFontSize = 16) => {
  // Funções de escala baseadas no ElderMode
  const scaleFont = (size) => (size / 16) * baseFontSize;
  const scaleSpacing = (value) => (value / 16) * baseFontSize;
  const scaleRadius = (value) => (value / 16) * baseFontSize;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: scaleSpacing(16),
      backgroundColor: theme.backgroundCard,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    title: {
      fontSize: scaleFont(18),
      fontWeight: '600',
      color: theme.textPrimary,
    },
    scrollContainer: {
      padding: scaleSpacing(16),
      paddingBottom: scaleSpacing(100),
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: scaleSpacing(32),
    },
    emptyText: {
      fontSize: scaleFont(18),
      color: theme.textSecondary,
      marginTop: scaleSpacing(16),
      fontWeight: '600',
      textAlign: 'center',
    },
    emptySubtext: {
      fontSize: scaleFont(14),
      color: theme.textMuted,
      marginTop: scaleSpacing(4),
      marginBottom: scaleSpacing(24),
      textAlign: 'center',
    },
    prescricaoItem: {
      backgroundColor: theme.backgroundCard,
      borderRadius: scaleRadius(12),
      marginBottom: scaleSpacing(16),
      borderWidth: 1,
      borderColor: theme.borderLight,
      overflow: 'hidden',
    },
    prescricaoHeader: {
      padding: scaleSpacing(16),
    },
    prescricaoInfo: {
      flex: 1,
    },
    prescricaoTitleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: scaleSpacing(8),
    },
    prescricaoTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: scaleSpacing(6),
    },
    prescricaoHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: scaleSpacing(4),
      gap: scaleSpacing(6),
    },
    prescricaoTitle: {
      fontSize: scaleFont(16),
      fontWeight: '600',
      color: theme.textPrimary,
      flex: 1,
    },
    prescricaoSubtitle: {
      fontSize: scaleFont(14),
      color: theme.textSecondary,
    },
    prescricaoDate: {
      fontSize: scaleFont(13),
      color: theme.textSecondary,
      marginTop: scaleSpacing(4),
    },
    prescricaoContent: {
      padding: scaleSpacing(14),
      paddingTop: 0,
      borderTopWidth: 1,
      borderTopColor: theme.borderLight,
    },
    medicineItem: {
      backgroundColor: theme.backgroundSecondary,
      padding: scaleSpacing(12),
      borderRadius: scaleRadius(8),
      marginBottom: scaleSpacing(8),
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    medicineHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: scaleSpacing(8),
    },
    medicineName: {
      fontSize: scaleFont(15),
      fontWeight: '600',
      color: theme.textPrimary,
      flex: 1,
    },
    medicineDose: {
      fontSize: scaleFont(14),
      fontWeight: '500',
      color: theme.primary,
      marginRight: scaleSpacing(8),
    },
    medicineDetails: {
      gap: scaleSpacing(6),
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scaleSpacing(6),
    },
    detailText: {
      fontSize: scaleFont(13),
      color: theme.textSecondary,
    },
    emptyMedicamentos: {
      textAlign: 'center',
      color: theme.textMuted,
      fontSize: scaleFont(14),
      paddingVertical: scaleSpacing(12),
    },
    addPrescButton: {
      position: 'absolute',
      bottom: scaleSpacing(20),
      right: scaleSpacing(20),
      backgroundColor: theme.primary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: scaleSpacing(12),
      paddingHorizontal: scaleSpacing(16),
      borderRadius: scaleRadius(50),
      elevation: 3,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: scaleRadius(4),
    },
    addPrescButtonText: {
      color: theme.textOnPrimary,
      fontSize: scaleFont(16),
      fontWeight: '500',
      marginLeft: scaleSpacing(8),
    },

    // Menu de ações
    actionsContainer: {
      position: 'relative',
    },
    actionsButton: {
      padding: scaleSpacing(4),
    },
    actionsMenu: {
      position: 'absolute',
      top: scaleSpacing(28),
      right: 0,
      backgroundColor: theme.backgroundCard,
      borderRadius: scaleRadius(8),
      paddingVertical: scaleSpacing(4),
      paddingHorizontal: scaleSpacing(8),
      flexDirection: 'column',
      minWidth: scaleSpacing(140),
      zIndex: 999,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: scaleRadius(4),
      elevation: 5,
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    actionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: scaleSpacing(8),
      paddingHorizontal: scaleSpacing(12),
    },
    actionText: {
      marginLeft: scaleSpacing(12),
      fontSize: scaleFont(16),
      color: theme.textSecondary,
    },

    chevronContainer: {
      alignItems: 'center',
      marginTop: scaleSpacing(8),
      paddingTop: scaleSpacing(8),
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
      borderRadius: scaleRadius(12),
    },
    deletingText: {
      marginTop: scaleSpacing(8),
      color: '#EF4444',
      fontWeight: '600',
      fontSize: scaleFont(14),
    },
  });
};
