import { StyleSheet } from 'react-native';

export const getLembretesStyles = (theme, baseFontSize) => {
  // baseFontSize vem do ElderModeContext (ex: 12, 16, 20, 24, 32)

  // Função para escalar fontes de forma proporcional
  const scaleFont = (size) => (size / 16) * baseFontSize;

  // Podemos também escalar espaçamentos e bordas proporcionalmente
  const scaleSpacing = (value) => (value / 16) * baseFontSize;
  const scaleRadius = (value) => (value / 16) * baseFontSize;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: 20,
      paddingTop: 30,
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    headerText: {
      fontSize: 22,
      fontWeight: '600',
      color: theme.textPrimary,
      marginLeft: 8,
    },
    list: {
      paddingBottom: 20,
    },
    card: {
      flexDirection: 'row',
      backgroundColor: theme.backgroundCard,
      borderRadius: 14,
      padding: 16,
      marginBottom: 16,
      alignItems: 'center',
      shadowColor: theme.shadowColor,
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      elevation: 3,
    },
    icon: {
      width: 32,
      height: 32,
      marginRight: 16,
      tintColor: theme.primary,
    },
    textContainer: {
      flex: 1,
      marginLeft: 10
    },
    title: {
      fontSize: scaleFont(32




        
      ),
      fontWeight: '600',
      color: theme.primary,
    },
    subtitle: {
      fontSize: 14,
      color: theme.textMuted,
      marginTop: 4,
    },
  })};