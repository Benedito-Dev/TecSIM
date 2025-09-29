import { StyleSheet } from 'react-native';

export const getProfileStyles = (theme, baseFontSize = 16) => {
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
      paddingVertical: scaleSpacing(20),
    },
    title: {
      fontSize: scaleFont(18),
      fontWeight: 'bold',
      color: theme.textPrimary,
      marginLeft: scaleSpacing(30),
    },
    profileSection: {
      alignItems: 'center',
      marginBottom: scaleSpacing(24),
    },
    avatar: {
      width: scaleSpacing(96),
      height: scaleSpacing(96),
      borderRadius: scaleRadius(48),
      marginBottom: scaleSpacing(12),
      backgroundColor: theme.primaryLight,
    },
    name: {
      fontSize: scaleFont(18),
      fontWeight: 'bold',
      color: theme.textPrimary,
    },
    age: {
      fontSize: scaleFont(14),
      color: theme.textSecondary,
    },
    email: {
      fontSize: scaleFont(14),
      color: theme.primary,
      marginTop: scaleSpacing(4),
    },
    section: {
      marginBottom: scaleSpacing(24),
    },
    sectionTitle: {
      fontSize: scaleFont(16),
      fontWeight: 'bold',
      color: theme.textPrimary,
      marginBottom: scaleSpacing(12),
    },
    row: {
      borderTopWidth: 1,
      borderColor: theme.border,
      paddingVertical: scaleSpacing(5),
    },
    rowItem: {
      borderTopWidth: 3,
      borderColor: theme.border,
      paddingVertical: scaleSpacing(6),
    },
    label: {
      color: theme.primary,
      fontWeight: '600',
      marginBottom: scaleSpacing(4),
    },
    value: {
      color: theme.textPrimary,
      fontSize: scaleFont(14),
    },
    chatItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: scaleSpacing(12),
    },
    chatText: {
      marginLeft: scaleSpacing(12),
    },
    chatTitle: {
      fontSize: scaleFont(14),
      fontWeight: '500',
      color: theme.textPrimary,
    },
    chatDate: {
      fontSize: scaleFont(12),
      color: theme.textMuted,
    },
    configItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: scaleSpacing(12),
    },
    configText: {
      marginLeft: scaleSpacing(12),
      fontSize: scaleFont(14),
      color: theme.textPrimary,
    },
    logoutIcon: {
      transform: [{ rotate: '180deg' }],
      color: theme.error,
    },
    logoutText: {
      marginLeft: scaleSpacing(12),
      fontSize: scaleFont(16),
      color: theme.error,
    },
  });
};
