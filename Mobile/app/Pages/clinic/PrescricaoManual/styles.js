import { StyleSheet } from 'react-native';

export const getPrescriptionFormStyles = (theme, baseFontSize = 16) => {
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
      paddingHorizontal: scaleSpacing(24),
      paddingVertical: scaleSpacing(16),
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      backgroundColor: theme.backgroundCard,
    },
    backButton: {
      padding: scaleSpacing(8),
    },
    headerRight: {
      width: scaleSpacing(40),
    },
    title: {
      fontSize: scaleFont(20),
      fontWeight: '600',
      color: theme.textPrimary,
      textAlign: 'center',
    },
    scrollContainer: {
      paddingHorizontal: scaleSpacing(16),
      paddingBottom: scaleSpacing(100),
    },
    formSection: {
      backgroundColor: theme.backgroundCard,
      borderRadius: scaleRadius(12),
      padding: scaleSpacing(16),
      marginTop: scaleSpacing(16),
      borderWidth: 1,
      borderColor: theme.border,
    },
    sectionTitle: {
      fontSize: scaleFont(16),
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: scaleSpacing(16),
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: scaleSpacing(8),
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.primary,
      paddingVertical: scaleSpacing(8),
      paddingHorizontal: scaleSpacing(12),
      borderRadius: scaleRadius(8),
    },
    addButtonText: {
      color: theme.textOnPrimary,
      fontSize: scaleFont(14),
      fontWeight: '500',
      marginLeft: scaleSpacing(6),
    },
    inputGroup: {
      marginBottom: scaleSpacing(16),
      position: 'relative',
      zIndex: 1000,
    },
    label: {
      fontSize: scaleFont(14),
      fontWeight: '500',
      color: theme.textSecondary,
      marginBottom: scaleSpacing(4),
    },
    input: {
      backgroundColor: theme.backgroundCard,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: scaleRadius(8),
      padding: scaleSpacing(12),
      fontSize: scaleFont(15),
      color: theme.textPrimary,
    },
    dateRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    dateInput: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.backgroundCard,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: scaleRadius(8),
      padding: scaleSpacing(12),
    },
    dateText: {
      fontSize: scaleFont(15),
      color: theme.textPrimary,
    },
    medicamentoCard: {
      backgroundColor: theme.backgroundSecondary,
      borderRadius: scaleRadius(8),
      padding: scaleSpacing(16),
      marginBottom: scaleSpacing(16),
      borderWidth: 1,
      borderColor: theme.border,
      position: 'relative',
    },
    medicamentoHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: scaleSpacing(16),
    },
    medNumber: {
      backgroundColor: theme.primary,
      width: scaleSpacing(24),
      height: scaleSpacing(24),
      borderRadius: scaleRadius(12),
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: scaleSpacing(12),
    },
    medNumberText: {
      color: theme.textOnPrimary,
      fontSize: scaleFont(12),
      fontWeight: '600',
    },
    medicamentoTitle: {
      fontSize: scaleFont(15),
      fontWeight: '600',
      color: theme.textPrimary,
      flex: 1,
    },
    deleteButton: {
      padding: scaleSpacing(4),
    },
    medRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      zIndex: 1,
    },
    dropdown: {
      backgroundColor: theme.backgroundCard,
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: scaleRadius(8),
      minHeight: scaleSpacing(48),
      justifyContent: 'center',
    },
    dropDownContainer: {
      backgroundColor: theme.backgroundCard,
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: scaleRadius(8),
      marginTop: scaleSpacing(2),
      zIndex: 1000,
      elevation: 5,
    },
    dropdownText: {
      fontSize: scaleFont(15),
      color: theme.textPrimary,
    },
    listItemContainer: {
      borderBottomWidth: 0,
      borderTopWidth: 0,
      borderWidth: 0,
      paddingVertical: scaleSpacing(10),
      backgroundColor: theme.backgroundCard,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: scaleSpacing(24),
    },
    emptyText: {
      fontSize: scaleFont(14),
      color: theme.textMuted,
      marginTop: scaleSpacing(8),
    },
    submitButton: {
      backgroundColor: theme.success,
      padding: scaleSpacing(16),
      borderRadius: scaleRadius(12),
      marginHorizontal: scaleSpacing(16),
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: scaleRadius(4),
      elevation: 3,
      position: 'absolute',
      bottom: 0,
      left: scaleSpacing(16),
      right: scaleSpacing(16),
    },
    submitButtonText: {
      color: theme.textOnPrimary,
      fontSize: scaleFont(16),
      fontWeight: '600',
    },
  });
};
