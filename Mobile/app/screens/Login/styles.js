import { StyleSheet, Dimensions } from "react-native";
const { height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  TopContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: height * 0.45, // Ocupa 45% da tela
    backgroundColor: '#5f65d9',
  },
  logo: {
    width: 160,
    height: 160,
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: "30",
    marginTop: 20,
  },
  subtitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: "16",
    marginTop: 10,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginTop: 12,
    marginBottom: 4,
    alignItems: "flex-start",
    width: "90%",
  },
  input: {
    height: 45,
    width: '85%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  authExtras: {
    backgroundColor: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  checkInput: {
    height: 24,
    width: 24,
    borderWidth: 2,
    borderColor: '#4942ce',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#5e17eb',
    width: "85%",
    paddingVertical: 12,
    paddingHorizontal: 80,
    borderRadius: 12,
    marginTop: 40,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
  },
});
