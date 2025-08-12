// styles.ts
import { StyleSheet } from 'react-native';

export const getForgotPasswordStyles = (theme) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: theme.background,
      justifyContent: 'center',
      padding: 20,
    },
    header: {
      alignItems: 'center',
      marginBottom: 24,
    },
    logo: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.primary,
    },
    content: {
      backgroundColor: theme.backgroundCard,
      borderRadius: 12,
      padding: 20,
      elevation: 3,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.textPrimary,
      marginBottom: 16,
      textAlign: 'center',
    },
    label: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 8,
    },
    input: {
      height: 48,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      backgroundColor: theme.inputBackground,
      color: theme.textPrimary,
      marginBottom: 16,
    },
    button: {
      backgroundColor: theme.primary,
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 12,
    },
    buttonText: {
      color: theme.textOnPrimary,
      fontSize: 16,
      fontWeight: 'bold',
    },
    backButton: {
      alignItems: 'center',
      paddingVertical: 10,
    },
    backText: {
      color: theme.link,
      fontSize: 14,
      fontWeight: '600',
    },
  });
