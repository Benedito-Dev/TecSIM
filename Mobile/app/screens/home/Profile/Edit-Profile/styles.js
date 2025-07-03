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
  section: {
    marginBottom: 24,
    alignItems: 'center',
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
});
