import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { styles } from '../styles';

export default function ResetPasswordScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>LOGO TECSIM</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Crie uma senha forte</Text>
        <Text style={styles.label}>Digite nova senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Pelo menos 8 caracteres"
          secureTextEntry
        />
        <Text style={styles.label}>Confirme Nova Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Pelo menos 8 caracteres"
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={() => {}}>
          <Text style={styles.buttonText}>Redefinir minha senha</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.replace('Login')}>
          <Text style={styles.backText}>Voltar ao login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}