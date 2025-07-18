import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Pressable, Alert, ScrollView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import { requestOtp } from '../../../services/auth/otpService'

import InputField from '../../../components/InputField';
import DateInput from '../../../components/DataInput';
import GenderInput from '../../../components/InputGender';

import { styles } from './styles';

export default function RegisterScreen({ navigation }) {
  const [checked, setChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [peso_kg, setPesoKg] = useState('');
  const [genero, setGenero] = useState('');
  const [loading, setLoading] = useState(false);


const handleRegister = async () => {
  if (!email || !password || !confirmPassword) {
    Alert.alert('Erro', 'Por favor, preencha todos os campos');
    return;
  }

  if (password !== confirmPassword) {
    Alert.alert('Erro', 'As senhas não coincidem');
    return;
  }

  setLoading(true);

  try {
    // Aqui você chama uma função para enviar o OTP ao email
    const data = await requestOtp(email);

    if (data?.email && data?.expires_at) {
      Alert.alert('Verificação', 'Enviamos um código para seu e-mail');

      // Navega para a tela 'Code', passando os dados do usuário
      navigation.navigate('Code', {
        nome,
        email,
        password,
        dataNascimento,
        peso_kg,
        genero,
        checked
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
    <View style={styles.container}>
      <LinearGradient colors={['#00c4cd', '#0c87c4']} style={styles.TopContainer}>
        <Image
          source={require('../../../assets/images/logo_branca.png')}
          style={styles.logo}
        />
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <InputField
          label="Nome Completo"
          placeholder="Ex: Antonio Nascimento Barros"
          value={nome}
          onChangeText={setNome}
          iconName="user"
        />

        <InputField
          label="Email"
          placeholder="Digite seu email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
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

        <InputField
          label="Confirmar senha"
          placeholder="Digite sua senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showPassword}
          iconName={showPassword ? 'eye' : 'eye-off'}
          onIconPress={() => setShowPassword(!showPassword)}
        />

        <DateInput
          label="Data de Nascimento"
          placeholder="Ex: 1990-08-15"
          value={dataNascimento}
          onChange={setDataNascimento}
        />

        <GenderInput value={genero} onChange={setGenero} />

        <InputField
          label="Peso (kg)"
          placeholder="Ex: 70"
          value={peso_kg}
          onChangeText={setPesoKg}
          keyboardType="numeric"
          iconName="activity"
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
            <Text style={{ marginLeft: 8, fontWeight: 'bold' }}>Aceitar termos</Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0097b2" style={styles.loading} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Criar Conta</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.subButton} onPress={() => navigation.replace('Login')}>
          <Text style={styles.text}>Já tem uma conta ?</Text>
          <Text style={styles.EsqueciSenha}>Faça o login</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
