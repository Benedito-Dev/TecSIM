import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  header: {
    padding: 25,
    paddingTop: 50,
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0c87c4',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 30,
  },
  userGreeting: {
    marginTop: 15,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 10,
  },
  helpText: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 5,
  },
  emailText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0c87c4',
  },
  codeSection: {
    paddingHorizontal: 25,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 20,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  codeInputWrapper: {
    width: 50,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  codeInputFilled: {
    borderColor: '#0c87c4',
    backgroundColor: '#f0f9ff',
  },
  codeInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    width: '100%',
    textAlign: 'center',
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    color: '#6b7280',
  },
  countdownText: {
    color: '#0c87c4',
    fontWeight: '600',
  },
  resendButtonText: {
    fontSize: 14,
    color: '#0c87c4',
    fontWeight: '600',
  },
  verifyButton: {
    backgroundColor: '#0c87c4',
    paddingVertical: 16,
    borderRadius: 12,
    marginHorizontal: 25,
    marginBottom: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0c87c4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  verifyButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: 15,
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 5,
  },
  footerLink: {
    fontSize: 14,
    color: '#0c87c4',
    fontWeight: '600',
  },
});