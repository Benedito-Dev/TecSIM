import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

import { useAuth } from '../../../../context/AuthContext';
import { updatePaciente, getPacienteById, uploadFotoPaciente } from '../../../../services/userService';

import InputField from '../../../../components/Register/InputField';
import GenderInput from '../../../../components/Register/InputGender';
import CpfInput from '../../../../components/Register/CpfInput';
import { styles } from './styles';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const { user, atualizarUsuario } = useAuth();

  const userId = user.id;

  const [cpf, setCpf] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [peso, setPeso] = useState('');
  const [genero, setGenero] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [novaImagem, setNovaImagem] = useState(null);

  useEffect(() => {
    const carregarPaciente = async () => {
      try {
        const data = await getPacienteById(userId);
        setNome(data.nome || '');
        setEmail(data.email || '');
        setDataNascimento(data.data_nascimento?.split('T')[0] || '');
        setPeso(String(data.peso_kg || ''));
        setGenero(data.genero || '');
        setFotoPerfil(data.foto_perfil ? `http://192.168.1.110:3000${data.foto_perfil}` : null);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar paciente:', error);
        Alert.alert('Erro', 'Não foi possível carregar os dados do paciente.');
        setLoading(false);
      }
    };

    carregarPaciente();
  }, []);

  const escolherImagem = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permissão necessária", "Você precisa permitir acesso à galeria.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const imagemSelecionada = result.assets[0];
      setNovaImagem(imagemSelecionada.uri);

      try {
        const file = {
          uri: imagemSelecionada.uri,
          name: 'perfil.jpg',
          type: 'image/jpeg',
        };

        const formData = new FormData();
        formData.append('image', file);

        await uploadFotoPaciente(userId, file);
        setFotoPerfil(imagemSelecionada.uri);
        Alert.alert('Sucesso', 'Foto de perfil atualizada!');
      } catch (error) {
        console.error('Erro ao fazer upload:', error);
        Alert.alert('Erro', 'Não foi possível enviar a imagem.');
      }
    }
  };

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

      if (senha.trim()) pacienteData.senha = senha;
      if (cpf.trim()) pacienteData.cpf = cpf;

      const resposta = await updatePaciente(userId, pacienteData);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');

      const dadosAtualizados = {
        id: resposta.data.id,
        nome: resposta.data.nome,
        email: resposta.data.email,
        genero: resposta.data.genero,
        idade: calcularIdade(resposta.data.data_nascimento)
      };

      await atualizarUsuario(dadosAtualizados);
      navigation.goBack();
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
      default:
        return require('../../../../assets/images/Profile/neutral.png');
    }
  };

  const calcularIdade = (dataNascimento) => {
    const nascimento = new Date(dataNascimento);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Editar Perfil</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Foto de perfil */}
      <View style={styles.profileSection}>
        <Image source={ novaImagem
              ? { uri: novaImagem }
              : fotoPerfil
              ? { uri: fotoPerfil }
              : getAvatarSource(genero)
          }
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.botaoUpload} onPress={escolherImagem}>
          <Text style={styles.botaoUploadTexto}>Alterar Foto do Perfil</Text>
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
        <GenderInput value={genero} onChange={setGenero} />
      </View>

      {/* Botão Salvar */}
      <TouchableOpacity style={[styles.configItem, { justifyContent: 'center' }]} onPress={handleSalvar}>
        <Text style={[styles.configText, { color: '#0c87c4', fontWeight: 'bold' }]}>Salvar Alterações</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
