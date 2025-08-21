import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import PasswordInput from '../../../../components/Register/EmailInput';

import { styles } from './styles';

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState('');
  const [passwordIsValid, setPasswordIsValid] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordIsValid, setConfirmPasswordIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const isFormValid = passwordIsValid && confirmPasswordIsValid && password === confirmPassword;

  const handleResetPassword = async () => {
    if (!isFormValid) {
      Alert.alert('Erro', 'As senhas não correspondem ou são inválidas');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(password);
      Alert.alert('Sucesso', 'Senha redefinida com sucesso! Faça login com sua nova senha.');
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Erro', error.message || 'Falha ao redefinir a senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#00c4cd', '#0c87c4']} style={styles.topContainer}>
        <Icon name="key" size={80} color="#fff" />
        <Text style={styles.title}>Redefinir Senha</Text>
        <Text style={styles.subtitle}>Crie uma nova senha para sua conta</Text>
      </LinearGradient>

      <View style={styles.content}>
        <PasswordInput
          label="Nova Senha"
          onChangeText={setPassword}
          onValidityChange={setPasswordIsValid}
          iconName="lock"
        />
        <PasswordInput
          label="Confirmar Nova Senha"
          onChangeText={setConfirmPassword}
          onValidityChange={setConfirmPasswordIsValid}
          iconName="lock"
        />

        {loading ? (
          <ActivityIndicator size="large" color="#0097b2" style={styles.loading} />
        ) : (
          <TouchableOpacity
            style={[styles.button, !isFormValid && styles.disabledButton]}
            onPress={handleResetPassword}
            disabled={!isFormValid}
          >
            <Text style={styles.buttonText}>Redefinir Senha</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.backButtonText}>Voltar ao Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}