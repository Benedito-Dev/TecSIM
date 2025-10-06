import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window'); // largura da tela

export default function ProfessionalHeader() {
  // Define o tamanho da logo como 30% da largura da tela (pode ajustar)
  const logoSize = width * 0.3;

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logo.png')}
        style={[styles.logo, { width: logoSize, height: logoSize, tintColor: '#1c4aacff' }]} // Aplica a cor verde
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: -width * 0.25, // margin proporcional à largura da tela
    marginBottom: width * 0.04,
    backgroundColor: '#fff',
    padding: width * 0.03,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  logo: {
    marginBottom: -10,
  },
});
