import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { styles } from './styles';

import { useAuth } from '../../../context/AuthContext';
import { logout as logoutService } from '../../../services/auth/authService';
import { useNavigation } from '@react-navigation/native';

import { ArrowLeft, MessageCircle, Edit3, Bell, Shield, HelpCircle, LogOut  } from 'lucide-react-native';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user, loading, Logout } = useAuth();

  const handleLogout = () => {
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
  };

  const getAvatarSource = (gender) => {
    switch (gender) {
      case 'man':
        return require('../../../assets/images/Profile/man.png');
      case 'woman':
        return require('../../../assets/images/Profile/woman.png');
      case 'neutral':
      default:
        return require('../../../assets/images/Profile/neutral.png');
    }
  };


  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>TecSIM</Text>
        <View style={{ width: 24 }} /> {/* placeholder para centralizar o título */}
      </View>

      {/* Avatar */}
      <View style={styles.profileSection}>
        <Image
          source={getAvatarSource(user.genero)}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user.nome}</Text>
        <Text style={styles.age}>{user.idade} anos</Text>
        <Text style={styles.email}>{user.email}</Text>
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

        <TouchableOpacity style={styles.configItem} onPress={() => navigation.replace("Edit-Profile")}>
          <Edit3 size={20} color="#0c87c4" />
          <Text style={styles.configText}>Editar Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.configItem}>
          <Bell size={20} color="#0c87c4" />
          <Text style={styles.configText}>Notificações</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.configItem}>
          <Shield size={20} color="#0c87c4" />
          <Text style={styles.configText}>Privacidade</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.configItem}>
          <HelpCircle size={20} color="#0c87c4" />
          <Text style={styles.configText}>Ajuda</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.configItem} onPress={handleLogout}>
          <LogOut  size={20} color="red" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
