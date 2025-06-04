import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, Pressable, Alert, ScrollView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import { register } from '../../../services/authService';
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
      const { success, message } = await register(
        nome,
        email,
        password,
        dataNascimento,
        peso_kg,
        checked
      );

      if (success) {
        Alert.alert('Sucesso', message);
        console.log('Usuário registrado com sucesso:', message);
        // navigation.replace('Login');
      } else {
        Alert.alert('Erro', message);
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro inesperado. Tente novamente mais tarde.');
      console.error('Erro inesperado ao registrar usuário:', error);
    } finally {
      setLoading(false);
    }
};

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#00c4cd', '#0c87c4']} style={styles.TopContainer}>
        <Image
          source={require('../../../../assets/images/logo_branca.png')}
          style={styles.logo}
        />
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.label}>Nome Completo</Text>
        <View style={[styles.input, { flexDirection: 'row', alignItems: 'center' }]}>
          <TextInput
            style={{ flex: 1 }}
            placeholder="Ex: Antonio Nascimento Barros"
            value={nome}
            onChangeText={setNome}
            placeholderTextColor="gray"
          />
          <TouchableOpacity>
            <Icon name="user" size={20} color="gray" style={{ marginRight: 10 }} />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Email</Text>
        <View style={[styles.input, { flexDirection: 'row', alignItems: 'center' }]}>
          <TextInput
            style={{ flex: 1 }}
            placeholder="Digite seu email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="gray"
          />
          <TouchableOpacity>
            <Icon name="mail" size={20} color="gray" style={{ marginRight: 10 }} />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Senha</Text>
        <View style={[styles.input, { flexDirection: 'row', alignItems: 'center' }]}>
          <TextInput
            style={{ flex: 1 }}
            placeholder="Digite sua senha"
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="gray"
            secureTextEntry={!showPassword}
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

        <Text style={styles.label}>Confirmar senha</Text>
        <View style={[styles.input, { flexDirection: 'row', alignItems: 'center' }]}>
          <TextInput
            style={{ flex: 1 }}
            placeholder="Digite sua senha"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholderTextColor="gray"
            secureTextEntry={!showPassword}
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

        <Text style={styles.label}>Data de Nascimento</Text>
        <View style={[styles.input, { flexDirection: 'row', alignItems: 'center' }]}>
          <TextInput
            style={{ flex: 1 }}
            placeholder="Ex: 15/08/1990"
            value={dataNascimento}
            onChangeText={setDataNascimento}
            placeholderTextColor="gray"
            keyboardType="numeric"
          />
          <TouchableOpacity>
            <Icon name="calendar" size={20} color="gray" style={{ marginRight: 10 }} />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Peso (kg)</Text>
        <View style={[styles.input, { flexDirection: 'row', alignItems: 'center' }]}>
          <TextInput
            style={{ flex: 1 }}
            placeholder="Ex: 70"
            value={peso_kg}
            onChangeText={setPesoKg}
            placeholderTextColor="gray"
            keyboardType="numeric"
          />
          <TouchableOpacity>
            <Icon name="activity" size={20} color="gray" style={{ marginRight: 10 }} />
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
