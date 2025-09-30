import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

export default function ProfessionalHeader() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/Profile/logo.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Acesso Profissional - TecSIM</Text>
      <Text style={styles.subtitle}>Painel de atendimento médico</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: -100,
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 20,
    elevation: 2,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    color: '#222',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
});
