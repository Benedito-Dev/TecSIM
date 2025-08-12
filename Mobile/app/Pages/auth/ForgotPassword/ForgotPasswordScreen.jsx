import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { getForgotPasswordStyles } from './styles';
import { useTheme } from '@react-navigation/native'; // ou do seu gerenciador de temas

export default function ForgotPasswordScreen() {
  const theme = useTheme(); // obtém o tema atual
  const styles = getForgotPasswordStyles(theme.colors); // usa o tema para gerar os estilos

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>LOGO TECSIM</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Recuperar Senha</Text>
        <Text style={styles.label}>Informe seu e-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="exemplo@tecsim.com.br"
          placeholderTextColor={theme.colors.textMuted}
          keyboardType="email-address"
        />
        <TouchableOpacity style={styles.button} onPress={() => {}}>
          <Text style={styles.buttonText}>Enviar Instruções</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={() => {}}>
          <Text style={styles.backText}>Voltar para Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
