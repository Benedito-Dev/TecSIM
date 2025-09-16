import { StyleSheet } from 'react-native';

export const getHelpStyles = (theme) =>
  StyleSheet.create({
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
    scrollContent: {
      padding: 20,
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.primary,
      marginBottom: 10,
    },
    sectionDescription: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 15,
    },
    contactCard: {
      flexDirection: 'row',
      backgroundColor: theme.backgroundCard,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      alignItems: 'center',
      elevation: 2,
      shadowColor: theme.shadowColor,
      shadowOpacity: 0.06,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
    },
    iconContainer: {
      marginRight: 15,
    },
    contactInfo: {
      flex: 1,
    },
    contactTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.primary,
      marginBottom: 4,
    },
    contactDescription: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    contactText: {
      marginTop: 4,
      fontSize: 14,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    faqItem: {
      backgroundColor: theme.backgroundCard,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      elevation: 2,
      shadowColor: theme.shadowColor,
      shadowOpacity: 0.06,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
    },
    faqQuestion: {
      fontWeight: '700',
      color: theme.primary,
      marginBottom: 6,
      fontSize: 15,
    },
    faqAnswer: {
      color: theme.textSecondary,
      fontSize: 14,
    },
    usefulLink: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
    },
    usefulLinkText: {
      marginLeft: 10,
      fontSize: 16,
      color: theme.primary,
      fontWeight: '600',
    },
    versionContainer: {
      alignItems: 'center',
      paddingVertical: 20,
    },
    versionText: {
      color: theme.textMuted,
      fontSize: 13,
    },
  });
