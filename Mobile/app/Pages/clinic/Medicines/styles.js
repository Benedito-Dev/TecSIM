import { StyleSheet } from 'react-native';

export const getMedicationStyles = (theme, baseFontSize) => {
  // Funções de escala baseadas no ElderMode
  const scaleFont = (size) => (size / 16) * baseFontSize;
  const scaleSpacing = (value) => (value / 16) * baseFontSize;
  const scaleRadius = (value) => (value / 16) * baseFontSize;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: scaleSpacing(20),
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: scaleSpacing(60),
      marginBottom: scaleSpacing(20),
    },
    title: {
      fontSize: scaleFont(24),
      fontWeight: 'bold',
      color: theme.textPrimary,
    },
    addButton: {
      backgroundColor: theme.primaryLight,
      borderRadius: scaleRadius(12),
      padding: scaleSpacing(8),
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.backgroundCard,
      borderRadius: scaleRadius(12),
      paddingHorizontal: scaleSpacing(16),
      height: scaleSpacing(50),
      marginBottom: scaleSpacing(24),
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: scaleRadius(4),
      elevation: 2,
    },
    searchIcon: {
      marginRight: scaleSpacing(10),
      color: theme.textSecondary,
    },
    searchInput: {
      flex: 1,
      fontSize: scaleFont(16),
      color: theme.textPrimary,
      height: '100%',
    },
    clearButton: {
      padding: scaleSpacing(8),
    },
    resultsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: scaleSpacing(16),
    },
    sectionTitle: {
      fontSize: scaleFont(18),
      fontWeight: '600',
      color: theme.textPrimary,
    },
    resultsControls: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    resultsCount: {
      fontSize: scaleFont(14),
      color: theme.textMuted,
      marginRight: scaleSpacing(12),
    },
    filterButton: {
      backgroundColor: theme.backgroundCard,
      borderRadius: scaleRadius(8),
      padding: scaleSpacing(8),
    },
    filterButtonActive: {
      backgroundColor: theme.primaryLight,
      borderWidth: 1,
      borderColor: theme.primary,
    },
    listContent: {
      paddingBottom: scaleSpacing(20),
    },
    medItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.backgroundCard,
      borderRadius: scaleRadius(12),
      padding: scaleSpacing(16),
      marginBottom: scaleSpacing(12),
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: scaleRadius(4),
      elevation: 2,
    },
    medIcon: {
      backgroundColor: theme.primaryLight,
      borderRadius: scaleRadius(10),
      width: scaleSpacing(44),
      height: scaleSpacing(44),
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: scaleSpacing(16),
    },
    medInfo: {
      flex: 1,
    },
    medName: {
      fontSize: scaleFont(16),
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: scaleSpacing(4),
    },
    medDetails: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    medDose: {
      fontSize: scaleFont(14),
      color: theme.textSecondary,
      marginRight: scaleSpacing(12),
    },
    medType: {
      backgroundColor: theme.background,
      borderRadius: scaleRadius(6),
      paddingHorizontal: scaleSpacing(8),
      paddingVertical: scaleSpacing(4),
    },
    medTypeText: {
      fontSize: scaleFont(12),
      color: theme.textSecondary,
      fontWeight: '500',
    },
    separator: {
      height: 1,
      backgroundColor: theme.border,
      marginVertical: scaleSpacing(8),
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: scaleSpacing(40),
    },
    emptyText: {
      fontSize: scaleFont(16),
      fontWeight: '600',
      color: theme.textMuted,
      marginTop: scaleSpacing(16),
      textAlign: 'center',
    },
    emptySubtext: {
      fontSize: scaleFont(14),
      color: theme.textMuted,
      marginTop: scaleSpacing(8),
      textAlign: 'center',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContainer: {
      backgroundColor: theme.backgroundCard,
      borderTopLeftRadius: scaleRadius(20),
      borderTopRightRadius: scaleRadius(20),
      padding: scaleSpacing(24),
      maxHeight: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: scaleSpacing(24),
    },
    modalTitle: {
      fontSize: scaleFont(18),
      fontWeight: '600',
      color: theme.textPrimary,
    },
    filtersContainer: {
      marginBottom: scaleSpacing(24),
    },
    filterOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: scaleSpacing(12),
      paddingHorizontal: scaleSpacing(16),
      borderRadius: scaleRadius(8),
      marginBottom: scaleSpacing(8),
      backgroundColor: theme.background,
    },
    filterOptionActive: {
      backgroundColor: theme.primaryLight,
      borderWidth: 1,
      borderColor: theme.primary,
    },
    filterOptionText: {
      marginLeft: scaleSpacing(12),
      fontSize: scaleFont(16),
      color: theme.textSecondary,
    },
    filterOptionTextActive: {
      color: theme.primary,
      fontWeight: '500',
    },
    filterCheckIcon: {
      marginLeft: 'auto',
      color: theme.primary,
    },
    modalFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderTopWidth: 1,
      borderTopColor: theme.border,
      paddingTop: scaleSpacing(16),
    },
    clearFiltersButton: {
      padding: scaleSpacing(12),
    },
    clearFiltersText: {
      color: theme.textMuted,
      fontWeight: '500',
    },
    applyFiltersButton: {
      backgroundColor: theme.primary,
      borderRadius: scaleRadius(8),
      paddingHorizontal: scaleSpacing(16),
      paddingVertical: scaleSpacing(12),
    },
    applyFiltersText: {
      color: theme.textOnPrimary,
      fontWeight: '500',
    },
  });
};
