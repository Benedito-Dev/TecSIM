import React, { useState, useEffect, useRef } from 'react';
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

import styles from './styles';

export default function CodeScreen({ route }) {
  // Estados do componente
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [showResend, setShowResend] = useState(false);
  
  // Navegação e referências
  const navigation = useNavigation();
  const codeInputs = Array(6).fill(0).map(() => useRef(null));
  
  // Email do usuário (vindo da rota ou padrão)
  const email = route.params?.email || 'seu@email.com';

  // Efeito para o countdown de reenvio
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setShowResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleCodeChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    
    if (text && index < 5) {
      codeInputs[index + 1].current.focus();
    }
    
    if (index === 5 && text) {
      verifyCode(newCode.join(''));
    }
  };

  const resendCode = () => {
    setCountdown(30);
    setShowResend(false);
    Alert.alert('Código reenviado', `Enviamos um novo código para ${email}`);
  };

  const verifyCode = async (fullCode) => {
    if (fullCode.length < 6) return;
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigation.replace('App');
    } catch (error) {
      Alert.alert('Erro', 'Código inválido. Por favor, tente novamente.');
      setCode(['', '', '', '', '', '']);
      codeInputs[0].current.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>TecSIM</Text>
          <Text style={styles.headerSubtitle}>Assistente de saúde inteligente</Text>
          
          <View style={styles.userGreeting}>
            <Text style={styles.greetingText}>Olá, Usuário</Text>
            <Text style={styles.helpText}>Insira o código de verificação enviado para:</Text>
            <Text style={styles.emailText}>{email}</Text>
          </View>
        </View>

        {/* Campos de código */}
        <View style={styles.codeSection}>
          <Text style={styles.sectionTitle}>Código de Verificação</Text>
          
          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <View key={index} style={[
                styles.codeInputWrapper,
                digit && styles.codeInputFilled
              ]}>
                <TextInput
                  ref={codeInputs[index]}
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

          {/* Botão de reenvio */}
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

        {/* Botão de verificação */}
        <TouchableOpacity 
          style={styles.verifyButton}
          onPress={() => verifyCode(code.join(''))}
          disabled={loading || code.some(c => c === '')}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.verifyButtonText}>Verificar Código</Text>
          )}
        </TouchableOpacity>

        {/* Rodapé */}
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