import React, { useState, useCallback, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator, Platform } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../../../context/ThemeContext';
import { getProfileStyles } from './styles';

import { useAuth } from '../../../context/AuthContext';
import { logout as logoutService } from '../../../services/auth/authService';
import { getPacienteById } from '../../../services/userService';

import { ArrowLeft, MessageCircle, Edit3, Bell, Shield, HelpCircle, LogOut, Settings, Moon, Sun } from 'lucide-react-native';
import SwitchTheme from '../../../components/SwitchTeme';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user, Logout } = useAuth();

  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fotoPerfil, setFotoPerfil] = useState(null);

  const { theme, toggleTheme, mode } = useContext(ThemeContext)

  const styles = getProfileStyles(theme)

  useFocusEffect(
    useCallback(() => {
      console.log(user)
      if (!user?.id) return; // Proteção contra user null/undefined

      const carregarPaciente = async () => {
        try {
          const data = await getPacienteById(user.id);
          setPaciente(data);

          if (data.foto_perfil) {
            setFotoPerfil(`http://10.0.30.110:3000${data.foto_perfil}?t=${Date.now()}`);
          } else {
            setFotoPerfil(null);
          }

          setLoading(false);
        } catch (error) {
          console.error('Erro ao carregar paciente:', error);
          Alert.alert('Erro', 'Não foi possível carregar os dados do perfil.');
          setLoading(false);
        }
      };

      carregarPaciente();
    }, [user?.id])
  );

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const confirmLogout = window.confirm("Você realmente deseja sair?");
      if (!confirmLogout) return;

      (async () => {
        try {
          await logoutService();
          await Logout();
          navigation.replace('Welcome');
        } catch (error) {
          console.error("Erro ao fazer logout:", error);
          alert("Erro: Não foi possível sair.");
        }
      })();
    } else {
      Alert.alert(
        "Sair",
        "Você realmente deseja sair?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Sim", onPress: async () => {
              try {
                await logoutService();
                await Logout();
                navigation.replace('Welcome');
              } catch (error) {
                console.error("Erro ao fazer logout:", error);
                Alert.alert("Erro", "Não foi possível sair.");
              }
            }
          }
        ]
      );
    }
  };

  const getAvatarSource = (gender) => {
    switch (gender) {
      case 'man':
        return require('../../../assets/images/Profile/man.png');
      case 'woman':
        return require('../../../assets/images/Profile/woman.png');
      default:
        return require('../../../assets/images/Profile/neutral.png');
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
        <TouchableOpacity onPress={() => navigation.navigate('App', { screen: 'Dashboard' })}>
          <ArrowLeft size={24} color={theme.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>TecSIM</Text>
        <SwitchTheme 
          onToggle={(isDark) => {
            // 'isDark' do SwitchTheme corresponde ao 'mode' do seu código atual
            toggleTheme(); // Chama a função que já existe para alternar o tema
          }}
        />
      </View>

      {/* Avatar */}
      <View style={styles.profileSection}>
        <Image
          source={fotoPerfil ? { uri: fotoPerfil } : getAvatarSource(paciente?.genero)}
          style={styles.avatar}
          onError={() => console.warn('Erro ao carregar imagem de perfil')}
        />
        <Text style={styles.name}>{paciente?.nome}</Text>
        <Text style={styles.age}>{calcularIdade(paciente?.data_nascimento)} anos</Text>
        <Text style={styles.email}>{paciente?.email}</Text>
      </View>

      {/* Resumo de Saúde */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumo de Saúde</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Alergias</Text>
          <Text style={styles.value}>Penicilina, Polen</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Medicações</Text>
          <Text style={styles.value}>Ibuprofeno (200mg/dia), Vitamina D (1000UI/dia)</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Condições</Text>
          <Text style={styles.value}>Asma leve, Rinite alérgica</Text>
        </View>
      </View>

      {/* Interações com o Chatbot */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Interações com o Chatbot</Text>
        <TouchableOpacity style={styles.chatItem}>
          <MessageCircle size={20} color="#0c87c4" />
          <View style={styles.chatText}>
            <Text style={styles.chatTitle}>Receitas de Baixo Risco</Text>
            <Text style={styles.chatDate}>15/03/2024</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.chatItem}>
          <MessageCircle size={20} color="#0c87c4" />
          <View style={styles.chatText}>
            <Text style={styles.chatTitle}>Tratamentos Naturais</Text>
            <Text style={styles.chatDate}>20/02/2024</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Configurações */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configurações</Text>

        <TouchableOpacity style={styles.configItem} onPress={() => navigation.navigate('Profile', { screen: 'EditProfile' })}>
        <Settings size={20} color="#0c87c4"></Settings>
          <Text style={styles.configText}>Ajustes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.configItem} onPress={() => navigation.navigate('Profile', { screen: 'EditProfile' })}>
          <Edit3 size={20} color="#0c87c4" />
          <Text style={styles.configText}>Editar Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.configItem}>
          <Bell size={20} color="#0c87c4" />
          <Text style={styles.configText}>Notificações</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.configItem} onPress={() => navigation.navigate('Profile', { screen: 'Privacy' })} >
          <Shield size={20} color="#0c87c4" />
          <Text style={styles.configText}>Privacidade</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.configItem}>
          <HelpCircle size={20} color="#0c87c4" />
          <Text style={styles.configText}>Ajuda</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.configItem} onPress={handleLogout}>
          <LogOut size={20} color="red" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function calcularIdade(dataNascimento) {
  if (!dataNascimento) return '';
  const nascimento = new Date(dataNascimento);
  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
}