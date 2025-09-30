import { StyleSheet } from 'react-native';

export const getBulaStyles = (theme, baseFontSize) => {
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
      backgroundColor: theme.primary,
      paddingBottom: scaleSpacing(15),
      borderBottomLeftRadius: scaleRadius(16),
      borderBottomRightRadius: scaleRadius(16),
      marginBottom: scaleSpacing(10),
      elevation: 3,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: scaleRadius(4),
    },
    headerContent: {
      padding: scaleSpacing(20),
      paddingBottom: scaleSpacing(15),
    },
    headerDecoration: {
      height: scaleSpacing(6),
      backgroundColor: theme.textOnPrimary + '30', // 30% opacity
      width: '40%',
      alignSelf: 'center',
      borderRadius: scaleRadius(3),
    },
    medicineName: {
      fontSize: scaleFont(28),
      fontWeight: '800',
      color: theme.textOnPrimary,
      textAlign: 'center',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    medicineDetails: {
      fontSize: scaleFont(16),
      color: theme.textOnPrimary + 'E6', // 90% opacity
      textAlign: 'center',
      marginTop: scaleSpacing(8),
      fontWeight: '500',
    },
    content: {
      flex: 1,
      paddingHorizontal: scaleSpacing(16),
      paddingTop: scaleSpacing(8),
    },
    card: {
      backgroundColor: theme.backgroundCard,
      borderRadius: scaleRadius(12),
      marginBottom: scaleSpacing(16),
      elevation: 2,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: scaleRadius(3),
      overflow: 'hidden',
    },
    importantCard: {
      borderLeftWidth: 4,
      borderLeftColor: theme.error,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: scaleSpacing(16),
      paddingHorizontal: scaleSpacing(18),
      backgroundColor: theme.backgroundCard,
    },
    sectionTitle: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    sectionHeaderText: {
      fontSize: scaleFont(16),
      fontWeight: '700',
      marginLeft: scaleSpacing(12),
      color: theme.textPrimary,
    },
    importantText: {
      color: theme.error,
    },
    sectionContent: {
      paddingHorizontal: scaleSpacing(18),
      paddingBottom: scaleSpacing(18),
    },
    noteText: {
      fontSize: scaleFont(13),
      color: theme.textMuted,
      marginTop: scaleSpacing(12),
      fontStyle: 'italic',
    },
    footerCard: {
      backgroundColor: theme.backgroundCard,
      borderRadius: scaleRadius(12),
      padding: scaleSpacing(20),
      marginBottom: scaleSpacing(24),
      alignItems: 'center',
      elevation: 2,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: scaleRadius(3),
    },
    footerText: {
      color: theme.textMuted,
      textAlign: 'center',
      lineHeight: scaleFont(22),
      marginBottom: scaleSpacing(16),
    },
    button: {
      backgroundColor: theme.primary,
      paddingVertical: scaleSpacing(14),
      paddingHorizontal: scaleSpacing(24),
      borderRadius: scaleRadius(8),
      width: '100%',
      alignItems: 'center',
    },
    buttonText: {
      color: theme.textOnPrimary,
      fontWeight: '700',
      fontSize: scaleFont(14),
    },
    infoItem: {
      flexDirection: 'row',
      marginBottom: scaleSpacing(12),
      alignItems: 'flex-start',
    },
    infoIcon: {
      marginRight: scaleSpacing(10),
      marginTop: scaleSpacing(2),
      color: theme.textSecondary,
    },
    infoText: {
      color: theme.textPrimary,
      flex: 1,
      fontSize: scaleFont(14), 
      lineHeight: scaleFont(22),
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: scaleSpacing(10),
      flexWrap: 'wrap',
    },
    infoLabel: {
      fontWeight: '600',
      color: theme.textSecondary,
      width: '40%',
    },
    infoValue: {
      color: theme.textPrimary,
      width: '58%',
      fontWeight: '500',
    },
    infoHighlight: {
      color: theme.error,
      fontWeight: '700',
    },
  });
};
