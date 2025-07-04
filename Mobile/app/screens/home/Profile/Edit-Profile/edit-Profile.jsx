import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { useAuth } from '../../../../context/AuthContext';
import { updatePaciente } from '../../../../services/userService';

import InputField from '../../../../components/InputField';
import { styles } from './styles';

import { getPacienteById } from '../../../../services/userService';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // Supondo que você tenha um contexto de autenticação

  // 🔑 ID do usuário que será buscado (você pode passar via props, contexto ou rota)
  const userId = user.id;

  const [cpf, setCpf] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [peso, setPeso] = useState('');
  const [genero, setGenero] = useState('');

  useEffect(() => {
    const carregarPaciente = async () => {
      try {
        const data = await getPacienteById(userId);
        setNome(data.nome || '');
        setEmail(data.email || '');
        setDataNascimento(data.data_nascimento?.split('T')[0] || '');
        setPeso(String(data.peso_kg || ''));
        setGenero(data.genero || '');
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar paciente:', error);
        Alert.alert('Erro', 'Não foi possível carregar os dados do paciente.');
        setLoading(false);
      }
    };

    carregarPaciente();
  }, []);

  const handleSalvar = async () => {
    try {
      const pacienteData = {
        nome,
        email,
        senha,
        data_nascimento: dataNascimento,
        peso_kg: parseFloat(peso),
        genero
      };
  
    if (senha.trim()) {
      pacienteData.senha = senha;
    }

    if (cpf.trim()) {
      pacienteData.cpf = cpf;
    }

      await updatePaciente(userId, pacienteData);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      navigation.navigate('App', { screen: 'Profile' })
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o perfil.');
    }
  };


  const getAvatarSource = (gender) => {
    switch (gender) {
      case 'man':
        return require('../../../../assets/images/Profile/man.png');
      case 'woman':
        return require('../../../../assets/images/Profile/woman.png');
      case 'neutral':
      default:
        return require('../../../../assets/images/Profile/neutral.png');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0c87c4" />
        <Text style={{ marginTop: 10 }}>Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('App', { screen: 'Profile' })}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Editar Perfil</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.profileSection}>
        <Image
          source={getAvatarSource(genero)}
          style={styles.avatar}
        />
      <TouchableOpacity style={[styles.configItem, { justifyContent: 'center' }]} onPress={handleSalvar}>
        <Text style={[styles.configText, { color: '#0c87c4', fontWeight: 'bold' }]}>Alterar Foto do Perfil</Text>
      </TouchableOpacity>
      </View>

      {/* Campos do Formulário */}
      <View style={styles.section}>
        <InputField label="CPF" value={cpf} onChangeText={setCpf} placeholder="000.000.000-00" keyboardType="numeric" iconName="user" />
        <InputField label="Nome" value={nome} onChangeText={setNome} placeholder="Nome completo" iconName="user" />
        <InputField label="Email" value={email} onChangeText={setEmail} placeholder="exemplo@email.com" keyboardType="email-address" iconName="mail" />
        <InputField label="Nova Senha" value={senha} onChangeText={setSenha} placeholder="Digite sua nova senha" secureTextEntry={true} iconName="lock" />
        <InputField label="Data de Nascimento" value={dataNascimento} onChangeText={setDataNascimento} placeholder="YYYY-MM-DD" keyboardType="default" iconName="calendar" />
        <InputField label="Peso (kg)" value={peso} onChangeText={setPeso} placeholder="Ex: 70.5" keyboardType="numeric" iconName="activity" />
        
        <View style={{ width: '85%', marginTop: 12 }}>
          <Text style={styles.label}>Gênero</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={genero}
              onValueChange={(itemValue) => setGenero(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Selecione o gênero" value="" enabled={false} />
              <Picker.Item label="Masculino" value="man" />
              <Picker.Item label="Feminino" value="woman" />
              <Picker.Item label="Prefiro não dizer" value="neutral" />
            </Picker>
          </View>
        </View>
      </View>

      {/* Botão Salvar */}
      <TouchableOpacity style={[styles.configItem, { justifyContent: 'center' }]} onPress={handleSalvar}>
        <Text style={[styles.configText, { color: '#0c87c4', fontWeight: 'bold' }]}>Salvar Alterações</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}