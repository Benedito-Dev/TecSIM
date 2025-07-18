import { StyleSheet, Dimensions } from "react-native";
const { height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  Imagecontainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#00acd2',
    opacity: 1,
    zIndex: 0,
  },
  topImage: {
    height: height * 0.45, // Ocupa 45% da tela
    width: '100%',
    marginLeft: -0, // Para estender a imagem além da tela
    zIndex: 1,
    opacity: 0.5, // Opacidade da imagem de fundo
  },
  content: {
    flex: 1,
    display: "flex",
    alignItems: 'center',
    paddingTop: 20,
  },
  logo: {
    width: 160,
    height: 160,
    marginTop: -100, // Para sobrepor a imagem de fundo
    marginBottom: 10,
    zIndex: 100,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20, // Para deixar a imagem circular/
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  subtitleBold: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#0097b2',
    paddingVertical: 12,
    paddingHorizontal: 80,
    borderRadius: 20,
    marginTop: 40,
  },
  buttonSecondary: {
    backgroundColor: '#0097b2',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
  },
});
