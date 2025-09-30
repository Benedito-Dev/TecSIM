import { StyleSheet } from "react-native";

export const getProfileEditStyles = (theme, baseFontSize) => {
  // baseFontSize vem do ElderModeContext (ex: 12, 16, 20, 24, 32)

  // Escaladores
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
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: scaleSpacing(20),
    },
    avatar: {
      width: scaleSpacing(96),
      height: scaleSpacing(96),
      borderRadius: scaleRadius(48),
      marginBottom: scaleSpacing(12),
      alignSelf: "center",
      backgroundColor: theme.primaryLight,
    },
    title: {
      fontSize: scaleFont(18),
      fontWeight: "bold",
      color: theme.textPrimary,
      textAlign: "center",
      flex: 1,
    },
    botaoUpload: {
      marginTop: scaleSpacing(10),
      backgroundColor: theme.primary,
      paddingVertical: scaleSpacing(10),
      paddingHorizontal: scaleSpacing(16),
      borderRadius: scaleRadius(12),
      alignSelf: "center",
    },
    botaoUploadTexto: {
      color: theme.textOnPrimary,
      fontWeight: "bold",
      fontSize: scaleFont(16),
    },
    section: {
      marginBottom: 0,
      alignItems: "center",
    },
    configItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: scaleSpacing(12),
      marginBottom: scaleSpacing(30),
    },
    configText: {
      borderColor: theme.primary,
      borderWidth: 1,
      borderRadius: scaleRadius(9),
      padding: scaleSpacing(12),
      backgroundColor: null,
      marginLeft: scaleSpacing(12),
      fontSize: scaleFont(14),
      color: theme.textPrimary,
    },
    button: {
      backgroundColor: theme.primary,
      width: "85%",
      paddingVertical: scaleSpacing(12),
      paddingHorizontal: scaleSpacing(80),
      borderRadius: scaleRadius(12),
    },
    buttonText: {
      color: theme.textOnPrimary,
      fontWeight: "bold",
      textAlign: "center",
      fontSize: scaleFont(18),
    },
    pickerWrapper: {
      height: scaleSpacing(45),
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: scaleRadius(8),
      backgroundColor: theme.backgroundCard,
      justifyContent: "center",
    },
    picker: {
      height: scaleSpacing(45),
      width: "100%",
      color: theme.textPrimary,
    },
    profileSection: {
      alignItems: "center",
      marginBottom: 0,
    },
    label: {
      marginBottom: scaleSpacing(6),
      fontSize: scaleFont(14),
      fontWeight: "500",
      color: theme.textPrimary,
    },
    input: {
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: scaleRadius(8),
      padding: scaleSpacing(12),
      backgroundColor: theme.backgroundCard,
      color: theme.textPrimary,
      marginBottom: scaleSpacing(16),
    },
  });
};
