import { StyleSheet } from 'react-native';

export const getHelpStyles = (theme, baseFontSize = 16) => {
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
    scrollContent: {
      padding: scaleSpacing(20),
    },
    section: {
      marginBottom: scaleSpacing(20),
    },
    sectionTitle: {
      fontSize: scaleFont(20),
      fontWeight: 'bold',
      color: theme.primary,
      marginBottom: scaleSpacing(10),
    },
    sectionDescription: {
      fontSize: scaleFont(14),
      color: theme.textSecondary,
      marginBottom: scaleSpacing(15),
    },
    contactCard: {
      flexDirection: 'row',
      backgroundColor: theme.backgroundCard,
      borderRadius: scaleRadius(16),
      padding: scaleSpacing(16),
      marginBottom: scaleSpacing(12),
      alignItems: 'center',
      elevation: 2,
      shadowColor: theme.shadowColor,
      shadowOpacity: 0.06,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: scaleRadius(4),
    },
    iconContainer: {
      marginRight: scaleSpacing(15),
    },
    contactInfo: {
      flex: 1,
    },
    contactTitle: {
      fontSize: scaleFont(16),
      fontWeight: '700',
      color: theme.primary,
      marginBottom: scaleSpacing(4),
    },
    contactDescription: {
      fontSize: scaleFont(14),
      color: theme.textSecondary,
    },
    contactText: {
      marginTop: scaleSpacing(4),
      fontSize: scaleFont(14),
      fontWeight: '600',
      color: theme.textPrimary,
    },
    faqItem: {
      backgroundColor: theme.backgroundCard,
      borderRadius: scaleRadius(16),
      padding: scaleSpacing(16),
      marginBottom: scaleSpacing(12),
      elevation: 2,
      shadowColor: theme.shadowColor,
      shadowOpacity: 0.06,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: scaleRadius(4),
    },
    faqQuestion: {
      fontSize: scaleFont(15),
      fontWeight: '700',
      color: theme.primary,
      marginBottom: scaleSpacing(6),
    },
    faqAnswer: {
      fontSize: scaleFont(14),
      color: theme.textSecondary,
    },
    usefulLink: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: scaleSpacing(12),
    },
    usefulLinkText: {
      marginLeft: scaleSpacing(10),
      fontSize: scaleFont(16),
      color: theme.primary,
      fontWeight: '600',
    },
    versionContainer: {
      alignItems: 'center',
      paddingVertical: scaleSpacing(20),
    },
    versionText: {
      fontSize: scaleFont(13),
      color: theme.textMuted,
    },
  });
};
