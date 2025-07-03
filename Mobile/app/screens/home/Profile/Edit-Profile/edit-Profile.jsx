import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';

import { useAuth } from '../../../../context/AuthContext';
import InputField from '../../../../components/InputField';
import { styles } from './styles';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [cpf, setCpf] = useState(user?.cpf || '');
  const [nome, setNome] = useState(user?.nome || '');
  const [email, setEmail] = useState(user?.email || '');
  const [senha, setSenha] = useState('');
  const [dataNascimento, setDataNascimento] = useState(user?.data_nascimento || '');
  const [peso, setPeso] = useState(String(user?.peso_kg || ''));
  const [genero, setGenero] = useState(user?.genero || '');

  const handleSalvar = () => {
    // Chamada para API de atualização
    Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    navigation.goBack();
  };

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

      {/* Campos do Formulário */}
      <View style={styles.section}>
        <InputField label="CPF" value={cpf} onChangeText={setCpf} placeholder="000.000.000-00" keyboardType="numeric" iconName="user" />
        <InputField label="Nome" value={nome} onChangeText={setNome} placeholder="Nome completo" iconName="user" />
        <InputField label="Email" value={email} onChangeText={setEmail} placeholder="exemplo@email.com" keyboardType="email-address" iconName="mail" />
        <InputField label="Nova Senha" value={senha} onChangeText={setSenha} placeholder="Digite sua nova senha" secureTextEntry={true} iconName="lock" />
        <InputField label="Data de Nascimento" value={dataNascimento} onChangeText={setDataNascimento} placeholder="YYYY-MM-DD" keyboardType="default" iconName="calendar" />
        <InputField label="Peso (kg)" value={peso} onChangeText={setPeso} placeholder="Ex: 70.5" keyboardType="numeric" iconName="activity" />
        <InputField label="Gênero" value={genero} onChangeText={setGenero} placeholder="Ex: man, woman, neutral" iconName="user" />
      </View>

      {/* Botão Salvar */}
      <TouchableOpacity style={[styles.configItem, { justifyContent: 'center' }]} onPress={handleSalvar}>
        <Text style={[styles.configText, { color: '#0c87c4', fontWeight: 'bold' }]}>Salvar Alterações</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
