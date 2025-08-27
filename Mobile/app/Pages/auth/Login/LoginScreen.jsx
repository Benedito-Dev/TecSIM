import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  Alert,
  ActivityIndicator,
  AppState,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as loginService, getCurrentUser } from '../../../services/auth/authService';
import { useAuth } from '../../../context/AuthContext';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import EmailInput from '../../../components/Register/EmailInput';
import PasswordInput from '../../../components/Register/PasswordInput';
import { styles } from './styles';
import { lightTheme } from '../../../constants/temas';

const COOLDOWN_STORAGE_KEY = 'login_cooldown_endtime';

export default function LoginScreen() {
  const [checked, setChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [emailIsValid, setEmailIsValid] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordIsValid, setPasswordIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);
  const scrollViewRef = useRef(null);
  const loginButtonRef = useRef(null);

  const navigation = useNavigation();
  const { setUser } = useAuth();
  const isFormValid = emailIsValid && passwordIsValid;

  useEffect(() => {
    loadPersistedCooldown();

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const handleAppStateChange = (nextAppState) => {
    if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
      loadPersistedCooldown();
    }
    appStateRef.current = nextAppState;
  };

  const loadPersistedCooldown = async () => {
    try {
      const storedEndTime = await AsyncStorage.getItem(COOLDOWN_STORAGE_KEY);
      if (storedEndTime) {
        const endTime = parseInt(storedEndTime, 10);
        const now = Date.now();
        const remainingSeconds = Math.max(0, Math.ceil((endTime - now) / 1000));

        if (remainingSeconds > 0) {
          setCooldown(remainingSeconds);
          startCooldownTimer(endTime);
        } else {
          await AsyncStorage.removeItem(COOLDOWN_STORAGE_KEY);
          setCooldown(0);
        }
      }
    } catch (error) {
      console.log('Erro ao carregar cooldown:', error);
    }
  };

  const startCooldownTimer = (endTime) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    timerRef.current = setInterval(() => {
      const now = Date.now();
      const remainingSeconds = Math.max(0, Math.ceil((endTime - now) / 1000));
      setCooldown(remainingSeconds);

      if (remainingSeconds <= 0) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        AsyncStorage.removeItem(COOLDOWN_STORAGE_KEY);
      }
    }, 1000);
  };

  const persistCooldown = async (seconds) => {
    try {
      const endTime = Date.now() + seconds * 1000;
      await AsyncStorage.setItem(COOLDOWN_STORAGE_KEY, endTime.toString());
      return endTime;
    } catch (error) {
      console.log('Erro ao persistir cooldown:', error);
    }
  };

  const handleLogin = async () => {
    if (!isFormValid) {
      Alert.alert('Erro', 'Por favor, preencha os campos corretamente');
      return;
    }

    setLoading(true);
    try {
      const response = await loginService(email, password);
      const userData = await getCurrentUser();
      setUser(userData);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      await AsyncStorage.removeItem(COOLDOWN_STORAGE_KEY);
      setCooldown(0);

      navigation.replace('App');
    } catch (error) {
      let msg = error.message;
      let seconds = 0;

      if (error.cooldown || error.response?.data?.cooldown) {
        seconds = error.cooldown || error.response.data.cooldown;
        setCooldown(seconds);
        const endTime = await persistCooldown(seconds);
        startCooldownTimer(endTime);
        msg = `Muitas tentativas. Aguarde ${seconds} segundo${seconds > 1 ? 's' : ''}.`;
      } else if (error.response && error.response.data) {
        msg = error.response.data?.mensagem || error.response.data?.message || msg;
      }

      Alert.alert('Erro', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      ref={scrollViewRef}
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={290} // ✅ Ajuste fino entre 30~50
      keyboardOpeningTime={250} // ⏱️ tenta entre 200~300ms
    >
      <LinearGradient colors={['#00c4cd', '#0c87c4']} style={styles.TopContainer}>
        <Image source={require('../../../assets/images/logo_branca.png')} style={styles.logo} />
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>
      </LinearGradient>

      <View style={styles.content}>
        <EmailInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          onValidityChange={setEmailIsValid}
          keyboardType="email-address"
          iconName="mail"
        />

        <PasswordInput
          label="Senha"
          onChangeText={setPassword}
          onValidityChange={setPasswordIsValid}
          theme={lightTheme}
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
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.EsqueciSenha}>Esqueci Minha Senha</Text>
          </TouchableOpacity>
        </View>

        {cooldown > 0 && (
          <Text style={{ color: 'red', textAlign: 'center', marginVertical: 10 }}>
            ⏰ Você deve aguardar {cooldown} segundo{cooldown > 1 ? 's' : ''} antes de tentar novamente
          </Text>
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#0097b2" style={styles.loading} />
        ) : (
          <TouchableOpacity
            ref={loginButtonRef}
            style={[styles.button, (!isFormValid || cooldown > 0) && styles.disabledButton]}
            onPress={handleLogin}
            disabled={!isFormValid || cooldown > 0}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.subButton} onPress={() => navigation.replace('Register')}>
          <Text style={styles.text}>Não Tem uma Conta ?</Text>
          <Text style={styles.EsqueciSenha}>Crie sua Conta</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}
