import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  headerRight: {
    width: 24,
  },
  listContainer: {
    paddingBottom: 80,
  },
  prescricaoItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    margin: 16,
    marginBottom: 8,
    overflow: 'hidden',
  },
  prescricaoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  prescricaoHeaderContent: {
    flex: 1,
  },
  prescricaoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  prescricaoDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  prescricaoContent: {
    padding: 16,
    paddingTop: 0,
  },
  medicineItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  medicineNameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  medicineName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  medicineDose: {
    fontSize: 14,
    color: '#6B7280',
  },
  medicineDetails: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  deleteButton: {
    marginLeft: 8,
    padding: 8,
  },
  emptyMedicamentos: {
    textAlign: 'center',
    color: '#6B7280',
    marginVertical: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  editButton: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  deleteButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  actionButtonText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
  },
  newPrescButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 50,
    elevation: 3,
  },
  newPrescButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});