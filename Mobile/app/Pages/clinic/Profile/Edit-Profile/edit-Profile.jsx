import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

import { useAuth } from '../../../../context/AuthContext';
import { ThemeContext } from '../../../../context/ThemeContext';
import { updatePaciente, getPacienteById, uploadFotoPaciente } from '../../../../services/userService';

import InputField from '../../../../components/Register/InputField';
import CpfInput from '../../../../components/Register/CpfInput';
import DateInput from '../../../../components/Register/DataInput';
import PasswordInput from '../../../../components/Register/PasswordInput';
import PesoInput from '../../../../components/Register/PesoInput';
import GenderInput from '../../../../components/Register/InputGender';
import { getProfileEditStyles } from './styles';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const { user, atualizarUsuario } = useAuth();

  const userId = user.id;

  // Estados dos campos
  const [cpf, setCpf] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [peso, setPeso] = useState('');
  const [genero, setGenero] = useState('');

  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [novaImagem, setNovaImagem] = useState(null);

  const { theme } = useContext(ThemeContext);
  const styles = getProfileEditStyles(theme);

  useEffect(() => {
    const carregarPaciente = async () => {
      try {
        const data = await getPacienteById(userId);
        setNome(data.nome || '');
        setEmail(data.email || '');
        setDataNascimento(data.data_nascimento?.split('T')[0] || '');
        setPeso(String(data.peso_kg || ''));
        setGenero(data.genero || '');
        setFotoPerfil(data.foto_perfil ? `http://192.168.1.9:3000${data.foto_perfil}` : null);
        setCpf(data.cpf || '');
      } catch (error) {
        console.error('Erro ao carregar paciente:', error);
        Alert.alert('Erro', 'Não foi possível carregar os dados do paciente.');
      } finally {
        setLoading(false);
      }
    };

    carregarPaciente();
  }, []);

  const escolherImagem = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permissão necessária', 'Você precisa permitir acesso à galeria.');
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
        senha: senha.trim() ? senha : undefined,
        data_nascimento: dataNascimento,
        peso_kg: parseFloat(peso),
        genero,
        cpf: cpf.trim() ? cpf : undefined,
      };

      const resposta = await updatePaciente(userId, pacienteData);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');

      const dadosAtualizados = {
        id: resposta.data.id,
        nome: resposta.data.nome,
        email: resposta.data.email,
        genero: resposta.data.genero,
        idade: calcularIdade(resposta.data.data_nascimento),
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
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={theme.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Editar Perfil</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Foto de perfil */}
      <View style={styles.profileSection}>
        <Image
          source={
            novaImagem
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
        <CpfInput value={cpf} onChangeText={setCpf} />
        <InputField label="Nome" value={nome} onChangeText={setNome} placeholder="Nome completo" iconName="user" />
        <InputField label="Email" value={email} onChangeText={setEmail} placeholder="exemplo@email.com" keyboardType="email-address" iconName="mail" />
        <PasswordInput value={senha} onChangeText={setSenha} />
        <DateInput value={dataNascimento} onChange={setDataNascimento} />
        <PesoInput value={peso} onChangeText={setPeso} />
        <GenderInput value={genero} onChange={setGenero} />
      </View>

      {/* Botão Salvar */}
      <TouchableOpacity
        style={[styles.configItem, { justifyContent: 'center' }]}
        onPress={handleSalvar}
      >
        <Text style={[styles.configText, { color: '#0c87c4', fontWeight: 'bold' }]}>Salvar Alterações</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
