// dashboardStyles.js
import { StyleSheet } from 'react-native';

export const getDashboardStyles = (theme) =>
  StyleSheet.create({
    background: {
      flex: 1, 
      backgroundColor: theme.background
    },
    scrollContent: {
      padding: 20,
      backgroundColor: theme.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background,
    },
    header: {
      padding: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
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
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.primary,
    },
    welcomeText: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: 4,
      textAlign: 'left',
    },
    subWelcome: {
      fontSize: 14,
      color: theme.textMuted,
      marginBottom: 16,
      textAlign: 'left',
    },
    chatCard: {
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: theme.primary,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      elevation: 6,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 5,
    },
    chatCardTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.textOnPrimary,
      marginTop: 10,
    },
    chatCardDescription: {
      fontSize: 14,
      color: theme.textOnPrimary,
      marginTop: 4,
      textAlign: 'center',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.textPrimary,
      marginBottom: 12,
    },
    cardGrid: {
      flexDirection: 'column',
      gap: 12,
    },
    toolCard: {
      backgroundColor: theme.backgroundCard,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      elevation: 5,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 6,
      alignItems: 'center',
    },
    toolCardTitle: {
      fontSize: 15,
      fontWeight: 'bold',
      color: theme.primary,
      marginTop: 8,
    },
    toolCardDescription: {
      fontSize: 13,
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: 4,
    },
  });