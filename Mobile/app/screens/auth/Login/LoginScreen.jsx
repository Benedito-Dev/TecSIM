import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { login as loginService, getCurrentUser } from '../../../services/auth/authService';
import { useAuth } from '../../../context/AuthContext';

import InputField from '../../../components/InputField'; // 👈 usa o mesmo InputField da tela Register
import { styles } from './styles';

export default function LoginScreen() {
  const [checked, setChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const { setUser } = useAuth();

  const handleLogin = async () => {
    // if (!email || !password) {
    //   Alert.alert('Erro', 'Por favor, preencha todos os campos');
    //   return;
    // }

    // setLoading(true);
    // try {
    //   await loginService(email, password);

    //   const userData = await getCurrentUser();
    //   setUser(userData);

    //   navigation.replace('App');
    // } catch (error) {
    //   Alert.alert('Erro', error.message || 'Falha no login. Verifique suas credenciais.');
    // } finally {
    //   setLoading(false);
    // }
    navigation.replace('Code')
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#00c4cd', '#0c87c4']} style={styles.TopContainer}>
        <Image
          source={require('../../../assets/images/logo_branca.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>
      </LinearGradient>

      <View style={styles.content}>
        <InputField
          label="Email"
          placeholder="Digite seu email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          iconName="mail"
        />

        <InputField
          label="Senha"
          placeholder="Digite sua senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          iconName={showPassword ? 'eye' : 'eye-off'}
          onIconPress={() => setShowPassword(!showPassword)}
        />

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
