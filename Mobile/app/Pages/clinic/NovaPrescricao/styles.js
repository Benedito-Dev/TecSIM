import { StyleSheet } from "react-native";

export const getSubscriptionStyles = (theme, baseFontSize = 16) => {
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
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      backgroundColor: theme.backgroundCard,
    },
    backButton: {
      padding: scaleSpacing(8),
    },
    headerRight: {
      width: scaleSpacing(24),
    },
    title: {
      fontSize: scaleFont(18),
      fontWeight: '600',
      color: theme.textPrimary,
      textAlign: 'center',
    },
    content: {
      flex: 1,
      padding: scaleSpacing(24),
    },
    subtitle: {
      fontSize: scaleFont(16),
      color: theme.textSecondary,
      marginBottom: scaleSpacing(24),
      textAlign: 'center',
    },
    optionCard: {
      backgroundColor: theme.backgroundCard,
      borderRadius: scaleRadius(12),
      padding: scaleSpacing(20),
      marginBottom: scaleSpacing(16),
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: scaleRadius(3),
      elevation: 2,
    },
    recommendedOption: {
      borderColor: theme.primary,
      borderWidth: 1.5,
    },
    optionHeader: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginBottom: scaleSpacing(12),
    },
    recommendedBadge: {
      backgroundColor: theme.primaryLight,
      paddingHorizontal: scaleSpacing(8),
      paddingVertical: scaleSpacing(4),
      borderRadius: scaleRadius(4),
    },
    recommendedText: {
      color: theme.primary,
      fontSize: scaleFont(12),
      fontWeight: '500',
    },
    optionContent: {
      alignItems: 'center',
    },
    optionTitle: {
      fontSize: scaleFont(18),
      fontWeight: '600',
      color: theme.textPrimary,
      marginTop: scaleSpacing(12),
      marginBottom: scaleSpacing(4),
    },
    optionDescription: {
      fontSize: scaleFont(14),
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: scaleSpacing(4),
    },
  });
};
