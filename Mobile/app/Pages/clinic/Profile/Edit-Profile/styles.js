import { StyleSheet } from 'react-native';

export const getProfileEditStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 12,
    alignSelf: 'center',
    backgroundColor: theme.primaryLight, // Added for better visibility
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.textPrimary,
    textAlign: 'center',
    flex: 1,
  },
  botaoUpload: {
    marginTop: 10,
    backgroundColor: theme.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: 'center',
  },
  botaoUploadTexto: {
    color: theme.textOnPrimary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  section: {
    marginBottom: 0,
    alignItems: 'center',
  },
  configItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginBottom: 30,
  },
  configText: {
    marginLeft: 12,
    fontSize: 14,
    color: theme.textPrimary,
  },
  button: {
    backgroundColor: theme.primary,
    width: "85%",
    paddingVertical: 12,
    paddingHorizontal: 80,
    borderRadius: 12,
  },
  buttonText: {
    color: theme.textOnPrimary,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
  },
  pickerWrapper: {
    height: 45,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: theme.backgroundCard,
    justifyContent: 'center',
  },
  picker: {
    height: 45,
    width: '100%',
    color: theme.textPrimary, // Added text color for picker
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 0,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '500',
    color: theme.textPrimary,
  },
  input: { // Added input style for text inputs
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    backgroundColor: theme.backgroundCard,
    color: theme.textPrimary,
    marginBottom: 16,
  },
});