import React from "react";
import { View, Text, Image } from "react-native";
import { styles } from './styles'

export default function AuthWelcome() {
  return (
    <View style={styles.container}>
      <View style={styles.containerTop}>
        <Image source={require("../../../assets/images/logo.png")} style={styles.logo}/>
      </View>
      <View style={styles.containerDown}>
        <Text style={styles.text}>Botões de Login</Text>
      </View>
    </View>
  );
}
