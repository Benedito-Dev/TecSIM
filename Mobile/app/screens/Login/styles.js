import { StyleSheet, Dimensions } from "react-native";
const { height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loading: {
    marginVertical: 20,
  },
  TopContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: height * 0.35, // Ocupa 45% da tela
    backgroundColor: '#5f65d9',
  },
  logo: {
    width: 140,
    height: 140,
  },
  text: {
    color: "black"
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 25,
    marginTop: 20,
  },
  subtitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    marginTop: 10,
  },
  content: {
    flex: 1,
    display: "flex",
    alignItems: 'center',
    flexDirection: "column",
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
    justifyContent: "space-around",
    flexDirection: "row",
    width: "100%",
    marginTop: 20
  },
  Remenber: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  EsqueciSenha: {
    color: "#0097b2",
    fontWeight: "bold"
  },
  button: {
    backgroundColor: '#0097b2',
    width: "85%",
    paddingVertical: 12,
    paddingHorizontal: 80,
    borderRadius: 12,
    marginTop: 40,
  },
  subButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
    marginTop: 20,
    width: "80%"
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
  },
});
