import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '../../../context/AuthContext';
import NotificationIcon from '../../../components/Notification';
import { styles } from './styles';

export default function DashboardScreen() {
  const navigation = useNavigation();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  }, [loading, user]);

  if (loading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00c4cd" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logoText}>TecSIM</Text>
        <NotificationIcon initialCount={2} />
      </View>

      {/* Saudação */}
      <Text style={styles.welcomeText}>Olá, {user.nome || 'Usuário'} 👋</Text>
      <Text style={styles.subWelcome}>Como podemos ajudar na sua saúde hoje?</Text>

      {/* Card Assistente */}
      <TouchableOpacity
        style={styles.chatCard}
        onPress={() => navigation.navigate('SymptomReport')}
      >
        <Icon name="message-square" size={28} color="#fff" />
        <Text style={styles.chatCardTitle}>Iniciar Conversar com Assistente</Text>
        <Text style={styles.chatCardDescription}>Obtenha recomendações personalizadas para seus sintomas.</Text>
      </TouchableOpacity>

      {/* Seção Ferramentas */}
      <Text style={styles.sectionTitle}>Suas Ferramentas de Saúde</Text>

      <View style={styles.cardGrid}>
        {tools.map((tool, index) => (
          <TouchableOpacity key={index} style={styles.toolCard}>
            <Icon name={tool.icon} size={32} color="#0c87c4" />
            <Text style={styles.toolCardTitle}>{tool.title}</Text>
            <Text style={styles.toolCardDescription}>{tool.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const tools = [
  {
    title: 'Medicamentos',
    description: 'Informações gerais sobre medicamentos',
    icon: 'package',
  },
  {
    title: 'Lembretes',
    description: 'Nunca esqueça de tomar seus remédios',
    icon: 'clock',
  },
];
