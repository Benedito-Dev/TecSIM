import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

// Contexto
import { useAuth } from '../../../context/AuthContext';

// Estilos
import { styles } from './styles';
import NotificationIcon from '../../../components/Notification';

export default function DashboardScreen() {
  const navigation = useNavigation();
  const { user, loading } = useAuth(); // Usando diretamente o hook do contexto

  // Se estiver carregando, mostra spinner
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Se não houver usuário (não autenticado), não renderiza nada
  // O AuthContext já redireciona para Login automaticamente
  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Cabeçalho com gradiente */}
      <LinearGradient
        colors={['#00c4cd', '#0c87c4']}
        style={styles.TopContainer}
      >
        <View style={styles.headerContent}>
          <Text style={styles.usernameText}>Bem-vindo, {user.nome || 'Usuário'}</Text>
          <NotificationIcon initialCount={10} />
        </View>
      </LinearGradient>

      {/* Conteúdo principal */}
      <View style={styles.content}>
        {/* Seção de sintomas */}
        <View style={styles.chipsContainer}>
          <TouchableOpacity 
            style={styles.sintomaButton}
            onPress={() => navigation.navigate('SymptomReport')}
          >
            <Text style={styles.buttonText}>ESTOU COM UM SINTOMA 🩺</Text>
          </TouchableOpacity>
          
          <View style={styles.chips}>
            {['Febre 🤒', 'Dor de Cabeça 🤕', 'Dor de garganta 😷', 'Enjoo 🤢'].map((symptom) => (
              <TouchableOpacity 
                key={symptom}
                style={styles.chip}
                onPress={() => navigation.navigate('SymptomDetail', { symptom })}
              >
                <Text style={styles.buttonText}>{symptom}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Seção de consultas */}
        {/* <View style={styles.consultas}>
          <Text style={styles.text}>Últimas consultas</Text>
          
          {user.appointments?.length > 0 ? (
            user.appointments.slice(0, 3).map((appointment, index) => (
              <TouchableOpacity 
                key={index}
                style={styles.consulta}
                onPress={() => navigation.navigate('AppointmentDetail', { id: appointment.id })}
              >
                <Text style={styles.consultaTitle}>
                  <Icon name="folder" size={20} color="#000" /> {appointment.type}
                </Text>
                <Text style={styles.subTitle}>
                  {new Date(appointment.date).toLocaleDateString('pt-BR')}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noAppointments}>Nenhuma consulta recente</Text>
          )}
        </View> */}
         <View style={styles.consultas}>
          <Text style={styles.text}>Ultimas consultas</Text>
          <TouchableOpacity style={styles.consulta}>
            <Text style={styles.consultaTitle}><Icon name="folder" size={20} color="#000" />   Atendimento</Text>
            <Text style={styles.subTitle}>30-05-2015</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.consulta}>
            <Text style={styles.consultaTitle}><Icon name="folder" size={20} color="#000" />   Atendimento</Text>
            <Text style={styles.subTitle}>30-05-2015</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.consulta}>
            <Text style={styles.consultaTitle}><Icon name="folder" size={20} color="#000" />   Atendimento</Text>
            <Text style={styles.subTitle}>30-05-2015</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}