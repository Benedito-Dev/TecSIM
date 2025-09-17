import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import { requestOtp } from '../../../services/auth/otpService';
import TermsModal from '../../../components/Register/TermsModal'

import InputField from '../../../components/Register/InputField';
import DateInput from '../../../components/Register/DataInput';
import GenderInput from '../../../components/Register/InputGender';
import PesoInput from '../../../components/Register/PesoInput';
import CpfInput from '../../../components/Register/CpfInput';
import EmailInput from '../../../components/Register/EmailInput';
import PasswordInput from '../../../components/Register/PasswordInput';

import { styles } from './styles';
import { lightTheme } from '../../../constants/temas';

export default function RegisterScreen({ navigation }) {
  // Estados do formulário
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [cpfIsValid, setCpfIsValid] = useState(false);
  const [email, setEmail] = useState('');
  const [emailIsValid, setEmailIsValid] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordIsValid, setPasswordIsValid] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [dateIsValid, setDateIsValid] = useState(false);
  const [peso_kg, setPesoKg] = useState('');
  const [pesoIsValid, setPesoIsValid] = useState(false);
  const [genero, setGenero] = useState('');
  const [loading, setLoading] = useState(false);

  // Validação geral do formulário
  const isFormValid =
    nome.trim().length > 0 &&
    cpfIsValid &&
    emailIsValid &&
    passwordIsValid &&
    confirmPassword === password &&
    dateIsValid &&
    pesoIsValid &&
    termsAccepted;


  const handleRegister = async () => {
    if (!termsAccepted) {
      Alert.alert('Atenção', 'Você precisa aceitar os termos de uso para se registrar');
      return;
    }
    if (!isFormValid) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos corretamente.');
      return;
    }

    setLoading(true);
    try {
      const data = await requestOtp(email);
      if (data?.email && data?.expires_at) {
        Alert.alert('Verificação', 'Enviamos um código para seu e-mail');
        navigation.navigate('Code', {
          cpf,
          nome,
          email,
          password,
          dataNascimento,
          peso_kg,
          genero,
          termsAccepted,
        });
      } else {
        Alert.alert('Erro ao enviar código', 'Tente novamente mais tarde.');
      }
    } catch (error) {
      console.error('Erro ao solicitar envio de OTP:', error);
      Alert.alert('Erro', 'Não foi possível enviar o código de verificação. Tente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <LinearGradient colors={['#00c4cd', '#0c87c4']} style={styles.TopContainer}>
            <Image source={require('../../../assets/images/logo_branca.png')} style={styles.logo} />
          </LinearGradient>

          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <InputField label="Nome Completo" placeholder="Ex: Antonio Nascimento Barros" value={nome} onChangeText={setNome} iconName="user" theme={lightTheme} />

            <CpfInput label="CPF" value={cpf} onChangeText={setCpf} onValidityChange={setCpfIsValid} theme={lightTheme} />

            <EmailInput label="Email" value={email} onChangeText={setEmail} onValidityChange={setEmailIsValid} keyboardType="email-address" iconName="mail" />

            <PasswordInput label="Senha" onChangeText={setPassword} onValidityChange={setPasswordIsValid} theme={lightTheme} />

            <InputField
              label="Confirmar senha"
              placeholder="Digite sua senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
              iconName={showPassword ? 'eye' : 'eye-off'}
              onIconPress={() => setShowPassword(!showPassword)}
              theme={lightTheme}
            />

            <DateInput label="Data de Nascimento" placeholder="Ex: 1990-08-15" value={dataNascimento} onChange={setDataNascimento} onValidityChange={setDateIsValid} />

            <GenderInput value={genero} onChange={setGenero} theme={lightTheme} />

            <PesoInput label="Peso (kg)" value={peso_kg} onChangeText={setPesoKg} onValidityChange={setPesoIsValid} minWeight={30} maxWeight={300} theme={lightTheme} />

            <View style={styles.authExtras}>
              <View style={styles.Remenber}>
                <Pressable
                  onPress={() => setTermsAccepted(!termsAccepted)}
                  style={{
                    height: 24,
                    width: 24,
                    borderWidth: 2,
                    borderColor: '#0097b2',
                    borderRadius: 6,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: termsAccepted ? '#0097b2' : 'transparent',
                  }}
                >
                  {termsAccepted && <Icon name="check" size={16} color="#fff" />}
                </Pressable>
                <Text style={styles.termsText}>
                  Eu li e concordo com os{' '}
                  <Text style={styles.termsLink} onPress={() => setShowTermsModal(true)}>
                    Termos de Uso
                  </Text>
                </Text>
              </View>
            </View>

            {loading ? (
              <ActivityIndicator size="large" color="#0097b2" style={styles.loading} />
            ) : (
              <TouchableOpacity style={[styles.button, !isFormValid && styles.disabledButton]} onPress={handleRegister} disabled={!isFormValid}>
                <Text style={styles.buttonText}>Criar Conta</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.subButton} onPress={() => navigation.replace('Login')}>
              <Text style={styles.text}>Já tem uma conta ?</Text>
              <Text style={styles.EsqueciSenha}>Faça o login</Text>
            </TouchableOpacity>
          </ScrollView>

          <TermsModal
            visible={showTermsModal}
            onAccept={() => {
              setTermsAccepted(true);
              setShowTermsModal(false);
            }}
            onClose={() => setShowTermsModal(false)}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
