import { StyleSheet } from "react-native";

export const getDashboardStyles = (theme, baseFontSize) => {
  // baseFontSize vem do ElderModeContext (ex: 12, 16, 20, 24, 32)

  // Função para escalar fontes de forma proporcional
  const scaleFont = (size) => (size / 16) * baseFontSize;

  // Podemos também escalar espaçamentos e bordas proporcionalmente
  const scaleSpacing = (value) => (value / 16) * baseFontSize;
  const scaleRadius = (value) => (value / 16) * baseFontSize;

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
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background,
    },
    header: {
      padding: scaleSpacing(14),
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: scaleSpacing(20),
      backgroundColor: theme.backgroundCard,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      elevation: 3,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
    },
    logoText: {
      fontSize: scaleFont(28),
      fontWeight: "bold",
      color: theme.textPrimary,
    },
    highlightName: {
      color: theme.primary,
      fontWeight: "bold",
      fontSize: scaleFont(22),
    },
    welcomeText: {
      fontSize: scaleFont(22),
      fontWeight: "700",
      color: theme.textPrimary,
      marginBottom: scaleSpacing(8),
      textAlign: "left",
    },
    subWelcome: {
      fontSize: scaleFont(17),
      color: theme.textMuted,
      marginBottom: scaleSpacing(20),
      textAlign: "left",
    },
    chatCard: {
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: theme.primary,
      borderRadius: scaleRadius(20),
      padding: scaleSpacing(28),
      marginBottom: scaleSpacing(30),
      elevation: 6,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
    },
    chatCardTitle: {
      fontSize: scaleFont(20),
      fontWeight: "bold",
      color: theme.textOnPrimary,
      marginTop: scaleSpacing(14),
      textAlign: "center",
    },
    chatCardDescription: {
      fontSize: scaleFont(17),
      color: theme.textOnPrimary,
      marginTop: scaleSpacing(8),
      textAlign: "center",
    },
    sectionTitle: {
      fontSize: scaleFont(22),
      fontWeight: "bold",
      color: theme.textPrimary,
      marginBottom: scaleSpacing(16),
    },
    cardGrid: {
      flexDirection: "column",
      gap: scaleSpacing(16),
    },
    toolCard: {
      backgroundColor: theme.backgroundCard,
      borderRadius: scaleRadius(20),
      padding: scaleSpacing(24),
      marginBottom: scaleSpacing(22),
      elevation: 5,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 6,
      alignItems: "center",
    },
    toolCardTitle: {
      fontSize: scaleFont(18),
      fontWeight: "bold",
      color: theme.textPrimary,
      marginTop: scaleSpacing(12),
    },
    toolCardDescription: {
      fontSize: scaleFont(16),
      color: theme.textSecondary,
      textAlign: "center",
      marginTop: scaleSpacing(8),
    },
    PanicCard: {
      backgroundColor: theme.backgroundCard,
      borderRadius: scaleRadius(16),
      padding: scaleSpacing(20),
      marginBottom: scaleSpacing(16),
      alignItems: "center",
      justifyContent: "center",
      elevation: 4,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      borderWidth: 2,
      borderColor: theme.error,
      minHeight: scaleSpacing(120),
    },
    toolPanicCardTitle: {
      fontSize: scaleFont(16),
      fontWeight: "bold",
      color: theme.textPrimary,
      textAlign: "center",
      marginTop: scaleSpacing(12),
      marginBottom: scaleSpacing(4),
    },
    toolPanicCardDescription: {
      fontSize: scaleFont(14),
      color: theme.textSecondary,
      textAlign: "center",
      lineHeight: scaleFont(18),
    },
  });
};
