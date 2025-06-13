import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { styles } from './styles';
import { useAuth } from '../../../context/AuthContext';
import { ArrowLeft, MessageCircle, Edit3, Bell, Shield, HelpCircle, LogOut  } from 'lucide-react-native';

export default function ProfileScreen({ navigation }) {
  const { user, loading } = useAuth();

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
          source={require('../../../assets/images/logo.png')} // substitua pela imagem real
          style={styles.avatar}
        />
        <Text style={styles.name}>{user.nome}</Text>
        <Text style={styles.age}>32 anos</Text>
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

        <TouchableOpacity style={styles.configItem}>
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

        <TouchableOpacity style={styles.configItem}>
          <LogOut  size={20} color="red" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
