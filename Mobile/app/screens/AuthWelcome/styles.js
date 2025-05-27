import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around", // centraliza verticalmente
    alignItems: "center",     // centraliza horizontalmente
    backgroundColor: "#fff",  // fundo branco
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
  logo: {
    width: 200,   // largura da imagem
    height: 200,  // altura da imagem
    resizeMode: "contain", // evita distorção da imagem
  },
  containerDown: {
    position: "absolute",       // Posiciona em relação à tela
    bottom: 0,                  // Gruda na base da tela
    width: "100%",              // Ocupa toda a largura
    height: "50%",              // Até 50% da tela
    backgroundColor: "#4942ce",
    borderTopLeftRadius: 30,    // Arredonda canto superior esquerdo
    borderTopRightRadius: 30,   // Arredonda canto superior direito
    padding: 20,                // Espaçamento interno (opcional)
    alignItems: "center",       // Centraliza conteúdo horizontalmente
    justifyContent: "center",   // Centraliza conteúdo verticalmente
}
});