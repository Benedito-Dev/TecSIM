import { StyleSheet, Dimensions } from "react-native";
const { height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loading: {
    marginTop: 80,
  },
  TopContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: height * 0.12, // Ocupa 45% da tela
    backgroundColor: '#5f65d9',
  },
  headerContent: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    width: "130%"
  },
  logo: {
    width: 140,
    height: 140,
  },
  usernameText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20
  },
  text: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16
  },
  content: {
    flex: 1,
    display: "flex",
    alignItems: 'center',
    flexDirection: "column",
    paddingTop: 20,
    backgroundColor: "#ececec"
  },
  chipsContainer: {
    display: "flex",
    alignItems: "center",
    padding: 20,
    width: "80%",
    height: "50%",
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "gray"
  },
  sintomaButton: {
    backgroundColor: "#2f6ba4",
    padding: 20,
    borderRadius: 20
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14
  },
  chips: {
    display: "flex",
    flexDirection: "row",
    margin: 40,
    width: "100%",
    flexWrap: "wrap", // Isso permite a quebra de linha
    gap: 10
  },
  chip: {
    backgroundColor: "#ff9a00",
    padding: 10,
    borderRadius: 20
  },
  consultas: {
    display: "flex",
    margin: 10,
    width: "80%",
    gap: 15
  },
  consulta: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    borderColor: "gray",
    borderWidth: 2
  },
  consultaTitle: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16
  },
  subTitle: {
    color: "gray",
    fontWeight: "bold"
  }
});
