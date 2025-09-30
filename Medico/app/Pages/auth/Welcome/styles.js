import { StyleSheet, Dimensions } from "react-native";
const { height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    display: "flex",
    alignItems: 'center',
    paddingTop: 20,
  },
});
