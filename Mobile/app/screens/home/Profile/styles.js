import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 16,
  },
  loading: {
    marginVertical: 20,
  },
  containerUser: {
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: 400,
    padding: 20,
    backgroundColor: "#ececec",
    borderWidth: 1.5,
    borderColor: "black",
    borderRadius: 20,
    marginVertical: 20,
  },
  title: {
    fontWeight: "bold",
    fontSize: 22,
    textAlign: "center",
    marginBottom: 10,
  },
  circle: {
    aspectRatio: 1,
    width: "60%",
    maxWidth: 180,
    borderRadius: 999,
    backgroundColor: "gray",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  logoutButton: {
    backgroundColor: "red",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignSelf: "center",
    marginTop: 10,
  },
  textButton: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});
