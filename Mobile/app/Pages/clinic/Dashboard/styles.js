// dashboardStyles.js
import { StyleSheet } from 'react-native';

export const getDashboardStyles = (theme, elderMode = false) => {
  // helpers para escalar valores
  const scaleFont = (size) => elderMode ? size + 4 : size;
  const scaleSpacing = (value) => elderMode ? value * 1.2 : value;

  return StyleSheet.create({
    background: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      padding: scaleSpacing(20),
      backgroundColor: theme.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background,
    },
    header: {
      padding: scaleSpacing(10),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: scaleSpacing(16),
      backgroundColor: theme.backgroundCard,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      elevation: 3,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },
    logoText: {
      fontSize: scaleFont(24),
      fontWeight: 'bold',
      color: theme.primary,
    },
    welcomeText: {
      fontSize: scaleFont(18),
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: scaleSpacing(4),
      textAlign: 'left',
    },
    subWelcome: {
      fontSize: scaleFont(14),
      color: theme.textMuted,
      marginBottom: scaleSpacing(16),
      textAlign: 'left',
    },
    chatCard: {
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: theme.primary,
      borderRadius: scaleSpacing(16),
      padding: scaleSpacing(20),
      marginBottom: scaleSpacing(24),
      elevation: 6,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 5,
    },
    chatCardTitle: {
      fontSize: scaleFont(16),
      fontWeight: 'bold',
      color: theme.textOnPrimary,
      marginTop: scaleSpacing(10),
    },
    chatCardDescription: {
      fontSize: scaleFont(14),
      color: theme.textOnPrimary,
      marginTop: scaleSpacing(4),
      textAlign: 'center',
    },
    sectionTitle: {
      fontSize: scaleFont(18),
      fontWeight: 'bold',
      color: theme.textPrimary,
      marginBottom: scaleSpacing(12),
    },
    cardGrid: {
      flexDirection: 'column',
      gap: scaleSpacing(12),
    },
    toolCard: {
      backgroundColor: theme.backgroundCard,
      borderRadius: scaleSpacing(16),
      padding: scaleSpacing(16),
      marginBottom: scaleSpacing(16),
      elevation: 5,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 6,
      alignItems: 'center',
    },
    toolCardTitle: {
      fontSize: scaleFont(15),
      fontWeight: 'bold',
      color: theme.primary,
      marginTop: scaleSpacing(8),
    },
    toolCardDescription: {
      fontSize: scaleFont(13),
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: scaleSpacing(4),
    },
  });
};
