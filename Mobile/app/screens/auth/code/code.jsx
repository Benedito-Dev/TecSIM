import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { verifyOtp } from '../../../services/auth/otpService';
import { createPaciente } from '../../../services/userService'; // ✅ Import da função nova
import styles from './styles';

const CODE_LENGTH = 6;

export default function CodeScreen({ route }) {
  const navigation = useNavigation();
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const codeInputs = useRef(Array(CODE_LENGTH).fill().map(() => React.createRef()));

  const { email: routeEmail = 'seu@email.com', ...registrationData } = route.params;
  const email = routeEmail || 'seu@email.com';

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleCodeChange = useCallback((text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < CODE_LENGTH - 1) {
      codeInputs.current[index + 1].focus();
    }

    if (index === CODE_LENGTH - 1 && text) {
      verifyCode(newCode.join(''));
    }
  }, [code]);

  const resendCode = useCallback(() => {
    setCountdown(30);
    Alert.alert('Código reenviado', `Enviamos um novo código para ${email}`);
  }, [email]);

  const verifyCode = async (fullCode) => {
    if (fullCode.length < CODE_LENGTH) return;

    setLoading(true);
    try {
      const verified = await verifyOtp(email, fullCode);
      if (!verified) throw new Error('Código inválido');

      const {
        cpf,
        nome,
        password: senha,
        dataNascimento: data_nascimento,
        peso_kg,
        genero,
        termsAccepted: aceite_termos
      } = registrationData;

      const pacienteData = {
        cpf,
        nome,
        email,
        senha,
        data_nascimento,
        peso_kg,
        genero,
        aceite_termos
      };

      const result = await createPaciente(pacienteData);

      if (result?.data.id) {
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
        navigation.replace('Login');
      } else {
        throw new Error('Erro inesperado ao criar paciente. Tente novamente.');
      }

    } catch (error) {
      Alert.alert('Erro', error.message || 'Ocorreu um erro. Tente novamente.');
      resetCode();
    } finally {
      setLoading(false);
    }
  };

  const resetCode = () => {
    setCode(Array(CODE_LENGTH).fill(''));
    codeInputs.current[0].focus();
  };

  const isCodeComplete = code.every(c => c !== '');
  const showResend = countdown <= 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>TecSIM</Text>
          <Text style={styles.headerSubtitle}>Assistente de saúde inteligente</Text>

          <View style={styles.userGreeting}>
            <Text style={styles.greetingText}>Olá, Usuário</Text>
            <Text style={styles.helpText}>Insira o código de verificação enviado para:</Text>
            <Text style={styles.emailText}>{email}</Text>
          </View>
        </View>

        <View style={styles.codeSection}>
          <Text style={styles.sectionTitle}>Código de Verificação</Text>

          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <View
                key={`code-input-${index}`}
                style={[styles.codeInputWrapper, digit && styles.codeInputFilled]}
              >
                <TextInput
                  ref={el => codeInputs.current[index] = el}
                  style={styles.codeInput}
                  maxLength={1}
                  keyboardType="number-pad"
                  value={digit}
                  onChangeText={(text) => handleCodeChange(text, index)}
                  selectTextOnFocus
                  editable={!loading}
                />
              </View>
            ))}
          </View>

          <View style={styles.resendContainer}>
            {!showResend ? (
              <Text style={styles.resendText}>
                Reenviar código em <Text style={styles.countdownText}>{countdown}s</Text>
              </Text>
            ) : (
              <TouchableOpacity onPress={resendCode} disabled={loading}>
                <Text style={styles.resendButtonText}>Reenviar código</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={styles.verifyButton}
          onPress={() => verifyCode(code.join(''))}
          disabled={loading || !isCodeComplete}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.verifyButtonText}>Verificar Código</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Problemas com o código?</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.footerLink}>Voltar para cadastro</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
