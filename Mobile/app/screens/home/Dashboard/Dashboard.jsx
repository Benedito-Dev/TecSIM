import React, { useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import { useAuth } from '../../../context/AuthContext';
import NotificationIcon from '../../../components/Notification';
import { MessageSquare, Pill, Clock } from 'lucide-react-native'; // Ou Feather

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
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
      
      {/* Cabeçalho fixo sem padding lateral */}
      <View style={styles.header}>
        <Text style={styles.logoText}>TecSIM</Text>
        <NotificationIcon initialCount={10} />
      </View>

      {/* Conteúdo rolável com padding */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Saudação */}
        <Text style={styles.welcomeText}>Olá, <Text style={{color: '#0c87c4', fontWeight: 'bold'}} >{user.nome || 'Usuário'}</Text> 👋</Text>
        <Text style={styles.subWelcome}>Como podemos ajudar na sua saúde hoje?</Text>

        {/* Cartão de Chat com o Assistente */}
        <TouchableOpacity
          style={styles.chatCard}
          onPress={() => navigation.navigate('SymptomReport')}
        >
          <MessageSquare color="#fff" size={32} />
          <Text style={styles.chatCardTitle}>Iniciar Conversar com Assistente</Text>
          <Text style={styles.chatCardDescription}>
            Obtenha recomendações personalizadas para seus sintomas.
          </Text>
        </TouchableOpacity>

        {/* Ferramentas */}
        <Text style={styles.sectionTitle}>Suas Ferramentas de Saúde</Text>
        <View style={styles.cardGrid}>
          <TouchableOpacity
            style={styles.toolCard}
            onPress={() => navigation.navigate('Medicamentos')}
          >
            <Pill color="#0c87c4" size={28} />
            <Text style={styles.toolCardTitle}>Medicamentos</Text>
            <Text style={styles.toolCardDescription}>Informações gerais sobre medicamentos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolCard}
            onPress={() => navigation.navigate('Lembretes')}
          >
            <Clock color="#0c87c4" size={28} />
            <Text style={styles.toolCardTitle}>Lembretes</Text>
            <Text style={styles.toolCardDescription}>Nunca esqueça de tomar seus remédios</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
