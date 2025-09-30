import { StyleSheet } from 'react-native';

export const getAjustesStyles = (theme, baseFontSize) => {
  // Helpers para escalar baseado no tamanho de fonte do ElderModeContext
  const scaleFont = (size) => (size / 16) * baseFontSize;
  const scaleSpacing = (value) => (value / 16) * baseFontSize;
  const scaleBorder = (width) => (width / 16) * baseFontSize;

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
      paddingVertical: scaleSpacing(20),
    },
    title: {
      fontSize: scaleFont(18),
      fontWeight: 'bold',
      color: theme.textPrimary,
    },
    section: {
      marginBottom: scaleSpacing(24),
      borderTopWidth: scaleBorder(1),
      borderColor: theme.border,
      paddingTop: scaleSpacing(12),
    },
    sectionTitle: {
      fontSize: scaleFont(16),
      fontWeight: 'bold',
      color: theme.textPrimary,
      marginBottom: scaleSpacing(12),
    },
    configItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: scaleSpacing(12),
      borderBottomWidth: scaleBorder(1),
      borderColor: theme.border,
    },
    configText: {
      marginLeft: scaleSpacing(12),
      fontSize: scaleFont(14),
      color: theme.textPrimary,
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: scaleSpacing(20),
      paddingVertical: scaleSpacing(12),
      borderTopWidth: scaleBorder(1),
      borderColor: theme.border,
    },
    logoutText: {
      marginLeft: scaleSpacing(8),
      fontSize: scaleFont(16),
      fontWeight: 'bold',
      color: theme.error,
    },
  });
};
