import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import EmailInput from '../../../components/Register/EmailInput'; // Ajustado para pasta components
import { verifyOtp, requestOtp } from '../../../services/auth/otpService';
import { styles } from './styles';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [emailIsValid, setEmailIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSendResetEmail = async () => {
    if (!emailIsValid) {
      Alert.alert('Erro', 'Por favor, insira um email válido');
      return;
    }

    setLoading(true);
    try {
      await requestOtp(email);
      Alert.alert('Sucesso', 'Email de recuperação enviado! Verifique sua caixa de entrada.');
      navigation.navigate('VerifyOtp', { email });
    } catch (error) {
      Alert.alert('Erro', error.message || 'Falha ao enviar email de recuperação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#00c4cd', '#0c87c4']} style={styles.topContainer}>
        <Icon name="lock" size={80} color="#fff" />
        <Text style={styles.title}>Recuperar Senha</Text>
        <Text style={styles.subtitle}>Insira seu email para receber um link de recuperação</Text>
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

        {loading ? (
          <ActivityIndicator size="large" color="#0097b2" style={styles.loading} />
        ) : (
          <TouchableOpacity
            style={[styles.button, !emailIsValid && styles.disabledButton]}
            onPress={handleSendResetEmail}
            disabled={!emailIsValid}
          >
            <Text style={styles.buttonText}>Enviar Link de Recuperação</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.backButtonText}>Voltar ao Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}