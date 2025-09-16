import { StyleSheet } from "react-native";

export const getChatStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  TopContainer: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: theme.primary,
  },
  headerContent: {
    display: "flex",
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  usernameText: {
    color: theme.textOnPrimary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: theme.background,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: theme.backgroundCard,
    borderBottomLeftRadius: 5,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: theme.primary,
    borderBottomRightRadius: 5,
  },
  timeText: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'right',
  },
  botTime: {
    color: theme.textMuted,
  },
  botName: {
    fontWeight: 'bold',
    color: theme.textPrimary,
    marginBottom: 4,
    fontSize: 12,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
    backgroundColor: theme.textOnPrimary,
  },
  statusText: {
    color: theme.textOnPrimary,
    fontSize: 12,
  },
  disabledButton: {
    opacity: 0.6,
  },
  messageText: {
    fontSize: 16,
    color: theme.textPrimary,
  },
  userMessageText: {
    color: theme.textOnPrimary,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    backgroundColor: theme.backgroundCard,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    backgroundColor: theme.backgroundCard,
    color: theme.textPrimary,
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userTime: {
    color: theme.textOnPrimary,
    opacity: 0.7,
  },
  
  // NOVOS ESTILOS PARA OS BOTÕES DE AÇÃO RÁPIDA
  quickActionsContainer: {
    borderTopWidth: 1,
    borderTopColor: theme.border,
    backgroundColor: theme.backgroundCard,
    paddingVertical: 12,
  },
  quickActionsScroll: {
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.background,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    minHeight: 40,
  },
  quickActionButtonDisabled: {
    opacity: 0.6,
  },
  quickActionIcon: {
    marginRight: 5,
  },
  quickActionText: {
    color: theme.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
});