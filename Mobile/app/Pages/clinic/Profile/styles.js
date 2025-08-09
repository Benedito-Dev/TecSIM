import { StyleSheet } from 'react-native';

export const getProfileStyles = (theme) => StyleSheet.create({
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.textPrimary,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 12,
    backgroundColor: theme.primaryLight,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.textPrimary,
  },
  age: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  email: {
    fontSize: 14,
    color: theme.primary,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.textPrimary,
    marginBottom: 12,
  },
  row: {
    borderTopWidth: 1,
    borderColor: theme.border,
    paddingVertical: 5,
  },
  rowItem: {
    borderTopWidth: 3,
    borderColor: theme.border,
    paddingVertical: 6,
  },
  label: {
    color: theme.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  value: {
    color: theme.textPrimary,
    fontSize: 14,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  chatText: {
    marginLeft: 12,
  },
  chatTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.textPrimary,
  },
  chatDate: {
    fontSize: 12,
    color: theme.textMuted,
  },
  configItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  configText: {
    marginLeft: 12,
    fontSize: 14,
    color: theme.textPrimary,
  },
  logoutIcon: {
    transform: [{ rotate: '180deg' }],
    color: theme.error,
  },
  logoutText: {
    marginLeft: 12,
    fontSize: 16,
    color: theme.error,
  }
});