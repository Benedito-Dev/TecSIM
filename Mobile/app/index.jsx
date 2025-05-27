import React from "react";
import { StyleSheet, View, Text } from "react-native";
import AuthWelcome from "./screens/AuthWelcome/AuthWelcome";

export default function App() {
  return (
    <AuthWelcome/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // centraliza verticalmente
    alignItems: "center",     // centraliza horizontalmente
    backgroundColor: "#fff",  // fundo branco
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
