import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fbfd',
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
    color: '#000',
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
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  age: {
    fontSize: 14,
    color: '#555',
  },
  email: {
    fontSize: 14,
    color: '#0c87c4',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  row: {
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
    paddingVertical: 12,
  },
  label: {
    color: '#0c87c4',
    fontWeight: '600',
    marginBottom: 4,
  },
  value: {
    color: '#333',
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
    color: '#000',
  },
  chatDate: {
    fontSize: 12,
    color: '#666',
  },
  configItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  configText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#333',
  },
  logoutIcon: {
    transform: [{ rotate: '180deg' }],
  },
  logoutText: {
    marginLeft: 12,
    fontSize: 16,
    color: 'red',
  }
});
