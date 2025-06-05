import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, Pressable, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { login } from '../../../services/authService'

import { styles } from './styles';

export default function LoginScreen() {
  const [checked, setChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👈 controle da visibilidade da senha
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState('')

  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      // Chama a função de login do authService
      await login(email, password);
      
      // Redireciona para a tela principal após login bem-sucedido
      navigation.replace('App');
    } catch (error) {
      // Exibe mensagem de erro adequada
      Alert.alert('Erro', error.message || 'Falha no login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#00c4cd', '#0c87c4']}
        style={styles.TopContainer}
      >
        <Image
          source={require('../../../../assets/images/logo_branca.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.label}>Email</Text>
        <View style={[styles.input, { flexDirection: 'row', alignItems: 'center' }]}>
          <TextInput
            style={{ flex: 1 }}
            placeholder="Digite seu email"
            placeholderTextColor={"gray"}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Icon
            name={'mail'}
            size={20}
            color="gray"
            style={{ marginRight: 10 }}
          />
        </View>

        <Text style={styles.label}>Senha</Text>
        <View style={[styles.input, { flexDirection: 'row', alignItems: 'center' }]}>
          <TextInput
            style={{ flex: 1 }}
            placeholder="Digite sua senha"
            placeholderTextColor={"gray"}
            secureTextEntry={!showPassword} // 👈 alterna visibilidade
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon
              name={showPassword ? 'eye' : 'eye-off'}
              size={20}
              color="gray"
              style={{ marginRight: 10 }}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.authExtras}>
          <View style={styles.Remenber}>
            <Pressable
              onPress={() => setChecked(!checked)}
              style={{
                height: 24,
                width: 24,
                borderWidth: 2,
                borderColor: '#0097b2',
                borderRadius: 6,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: checked ? '#0097b2' : 'transparent',
              }}
            >
              {checked && <Icon name="check" size={16} color="#fff" />}
            </Pressable>
            <Text style={{ marginLeft: 8 }}>Lembrar-me</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('EmailRecovery')}>
            <Text style={styles.EsqueciSenha}>Esqueci Minha Senha</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0097b2" style={styles.loading} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.subButton} onPress={() => navigation.replace('Register')}>
          <Text style={styles.text}>Não Tem uma Conta ?</Text>
          <Text style={styles.EsqueciSenha}>Crie sua Conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
