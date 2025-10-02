import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

import { useAuth } from '../../../../context/AuthContext';
import { ThemeContext } from '../../../../context/ThemeContext';
import { useElderMode } from "../../../../context/ElderModeContext"; // ✅ usa o hook
import { updatePaciente, getPacienteById, uploadFotoPaciente } from '../../../../services/userService';

import InputField from '../../../../components/Register/InputField';
import CpfInput from '../../../../components/Register/CpfInput';
import EmailInput from '../../../../components/Register/EmailInput';
import DateInput from '../../../../components/Register/DataInput';
import PesoInput from '../../../../components/Register/PesoInput';
import GenderInput from '../../../../components/Register/InputGender';
import { useScale } from '../../../../utils/scale'; // ✅ Hook global para escalonamento
import { getProfileEditStyles } from './styles';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const { user, atualizarUsuario } = useAuth();

  const { fontSize } = useElderMode(); // ✅ acessa os valores do contexto
  const { scaleIcon } = useScale(fontSize); // ✅ agora pegamos a função direto do utils

  const userId = user.id;

  // Estados dos campos
  const [cpf, setCpf] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [peso, setPeso] = useState('');
  const [genero, setGenero] = useState('');

  // Estados para os placeholders (valores atuais)
  const [currentCpf, setCurrentCpf] = useState('');
  const [currentNome, setCurrentNome] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
  const [currentDataNascimento, setCurrentDataNascimento] = useState('');
  const [currentPeso, setCurrentPeso] = useState('');
  const [currentGenero, setCurrentGenero] = useState('');

  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [novaImagem, setNovaImagem] = useState(null);

  const { theme } = useContext(ThemeContext);
  const styles = getProfileEditStyles(theme, fontSize);

  useEffect(() => {
    const carregarPaciente = async () => {
      try {
        const data = await getPacienteById(userId);
        setCurrentNome(data.nome || '');
        setCurrentEmail(data.email || '');
        setCurrentDataNascimento(data.data_nascimento?.split('T')[0] || '');
        setCurrentPeso(String(data.peso_kg || ''));
        setGenero(data.genero || '');
        setFotoPerfil(data.foto_perfil ? `http://10.0.30.116:3000${data.foto_perfil}` : null);
        setCurrentCpf(data.cpf || '');
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
      // Usar valores dos estados se preenchidos, caso contrário usar os valores atuais
      const pacienteData = {
        nome: nome || currentNome,
        email: email || currentEmail,
        data_nascimento: dataNascimento || currentDataNascimento,
        peso_kg: parseFloat(peso || currentPeso),
        genero: genero || currentGenero,
        cpf: cpf.trim() ? cpf : currentCpf,
      };

      console.log(pacienteData)

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
          <ArrowLeft size={scaleIcon(24)} color={theme.primary} />
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
              : getAvatarSource(genero || currentGenero)
          }
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.botaoUpload} onPress={escolherImagem}>
          <Text style={styles.botaoUploadTexto}>Alterar Foto do Perfil</Text>
        </TouchableOpacity>
      </View>

      {/* Campos do Formulário */}
      <View style={styles.section}>
        <CpfInput 
          value={cpf} 
          onChangeText={setCpf} 
          placeholder={currentCpf || "Digite seu CPF"}
          fontSize={fontSize}
          scaleIcon={scaleIcon} 
        />
        <InputField 
          label="Nome" 
          value={nome} 
          onChangeText={setNome} 
          placeholder={currentNome || "Digite seu nome"} 
          iconName="user"
          fontSize={fontSize}
          scaleIcon={scaleIcon} 
        />
        <EmailInput 
          label="Email" 
          value={email} 
          onChangeText={setEmail} 
          placeholder={currentEmail || "Digite seu email"} 
          keyboardType="email-address" 
          iconName="mail"
          fontSize={fontSize}
          scaleIcon={scaleIcon} 
        />
        <DateInput 
          value={dataNascimento} 
          onChange={setDataNascimento} 
          placeholder={currentDataNascimento || "Selecione a data de nascimento"}
          fontSize={fontSize}
          scaleIcon={scaleIcon} 
        />
        <PesoInput 
          value={peso} 
          onChangeText={setPeso} 
          placeholder={currentPeso || "Digite seu peso"}
          fontSize={fontSize}
          scaleIcon={scaleIcon} 
        />
        <GenderInput 
          value={genero} 
          onChange={setGenero}
          fontSize={fontSize}
        />
        {/* Resumo de saude */}
        {/*adicionar titulo centralizado "Resumo de Saúde" com uma linha de cada lado */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: theme.border }} />
          <Text style={{ marginHorizontal: 10, color: theme.textPrimary, fontWeight: 'bold', fontSize: fontSize }}>Resumo de Saúde</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: theme.border }} />
        </View>

        <InputField 
          label="Alergias"
          value={''}
          onChangeText={() => {}}
          placeholder={"Ex: medicamentos, alimentos, etc."}
          iconName="alert-circle"
          fontSize={fontSize}
          scaleIcon={scaleIcon}
        />
        <InputField 
          label="Condições Médicas"
          value={''}
          onChangeText={() => {}}
          placeholder={"Ex: diabetes, hipertensão etc."}
          iconName="heart"
          fontSize={fontSize}
          scaleIcon={scaleIcon}
        />
        <InputField 
          label="Medicações"
          value={''}
          onChangeText={() => {}}
          placeholder={"Ex: aspirina, insulina etc."}
          iconName="pill"
          fontSize={fontSize}
          scaleIcon={scaleIcon}
        />
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