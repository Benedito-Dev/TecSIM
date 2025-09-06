import { StyleSheet } from 'react-native';

export const getPrescriptionFormStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    backgroundColor: theme.backgroundCard,
  },

  backButton: {
    padding: 8    
  },

  headerRight: {
    width: 40    
  },

  title: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.textPrimary,
    textAlign: 'center',
  },

  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100
  },

  formSection: {
    backgroundColor: theme.backgroundCard,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textPrimary,
    marginBottom: 16
  },

  sectionHeader: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },

  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8 
  },

  addButtonText: {
    color: theme.textOnPrimary,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6
  },

  inputGroup: {
    marginBottom: 16,
    position: 'relative',
    zIndex: 1000, 
  },

  label: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.textSecondary,
    marginBottom: 4
  },

  input: {
    backgroundColor: theme.backgroundCard,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: theme.textPrimary,
  },

  dateRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between'
  },

  dateInput: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.backgroundCard,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    padding: 12 
  },

  dateText: { 
    fontSize: 15,
    color: theme.textPrimary
  },

  medicamentoCard: {
    backgroundColor: theme.backgroundSecondary,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.border,
    position: 'relative',
  },

  medicamentoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },

  medNumber: {
    backgroundColor: theme.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },

  medNumberText: {
    color: theme.textOnPrimary,
    fontSize: 12,
    fontWeight: '600'
  },

  medicamentoTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.textPrimary,
    flex: 1
  },

  deleteButton: {
    padding: 4
  },

  medRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 1
  },

  dropdown: {
    backgroundColor: theme.backgroundCard,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 48,
    justifyContent: 'center',
  },

  dropDownContainer: {
    backgroundColor: theme.backgroundCard,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 2,
    zIndex: 1000,
    elevation: 5,
  },

  dropdownText: {
    fontSize: 15,
    color: theme.textPrimary,
  },

  listItemContainer: {
    borderBottomWidth: 0,
    borderTopWidth: 0,
    borderWidth: 0,
    paddingVertical: 10,
    backgroundColor: theme.backgroundCard,
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24
  },

  emptyText: {
    fontSize: 14,
    color: theme.textMuted,
    marginTop: 8
  },

  submitButton: {
    backgroundColor: theme.success,
    padding: 16,
    borderRadius: 12,
    margin: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
  },

  submitButtonText: {
    color: theme.textOnPrimary,
    fontSize: 16,
    fontWeight: '600'
  },
});