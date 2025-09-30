import { StyleSheet } from 'react-native';

export const getPrivacyStyles = (theme, baseFontSize = 16) => {
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
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: scaleSpacing(50),
      paddingBottom: scaleSpacing(20),
      paddingHorizontal: scaleSpacing(20),
      backgroundColor: theme.backgroundCard,
      borderBottomWidth: 0.3,
      borderBottomColor: theme.border,
    },
    headerTitle: {
      fontSize: scaleFont(18),
      fontWeight: 'bold',
      color: theme.textPrimary,
    },
    content: {
      flexGrow: 1,
      padding: scaleSpacing(20),
    },
    card: {
      backgroundColor: theme.backgroundCard,
      borderRadius: scaleRadius(16),
      padding: scaleSpacing(16),
      marginBottom: scaleSpacing(20),
      elevation: 2,
      shadowColor: theme.shadowColor,
      shadowOpacity: 0.06,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: scaleRadius(4),
    },
    cardTitle: {
      fontSize: scaleFont(16),
      fontWeight: 'bold',
      color: theme.textPrimary,
      marginBottom: scaleSpacing(8),
    },
    cardText: {
      fontSize: scaleFont(14),
      color: theme.textSecondary,
      lineHeight: scaleFont(20),
    },
    changePasswordButton: {
      marginTop: scaleSpacing(16),
      backgroundColor: theme.primary,
      paddingVertical: scaleSpacing(12),
      borderRadius: scaleRadius(10),
      alignItems: 'center',
    },
    changePasswordButtonText: {
      color: theme.textOnPrimary,
      fontWeight: 'bold',
      fontSize: scaleFont(14),
    },
    deactivateButton: {
      marginTop: scaleSpacing(16),
      backgroundColor: theme.warning,
      paddingVertical: scaleSpacing(12),
      borderRadius: scaleRadius(10),
      alignItems: 'center',
    },
    deactivateButtonText: {
      color: theme.textOnPrimary,
      fontWeight: 'bold',
      fontSize: scaleFont(14),
    },
    deleteButton: {
      marginTop: scaleSpacing(16),
      backgroundColor: theme.error,
      paddingVertical: scaleSpacing(12),
      borderRadius: scaleRadius(10),
      alignItems: 'center',
    },
    deleteButtonText: {
      color: theme.textOnPrimary,
      fontWeight: 'bold',
      fontSize: scaleFont(14),
    },
  });
};
