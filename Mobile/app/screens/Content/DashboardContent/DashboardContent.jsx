import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';

import { useNavigation } from '@react-navigation/native';
import { getCurrentUser, isAuthenticated } from '../../../src/services/authService';

import { styles } from './styles';
import NotificationIcon from '../../../src/Notification';

export default function DashboardContent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      try {
        // Verifica primeiro se está autenticado
        const authenticated = await isAuthenticated();
        
        if (!authenticated) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
          return;
        }

        // Se autenticado, carrega os dados do usuário
        const userData = await getCurrentUser();
        
        if (!userData) {
          throw new Error('Dados do usuário não encontrados');
        }

        setUser(userData);
        
        // Só reseta a navegação se não estiver já na Dashboard
        if (navigation.canGoBack()) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Dashboard' }],
          });
        }
      } catch (error) {
        console.error('Erro:', error);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoad();
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#00c4cd', '#0c87c4']}
        style={styles.TopContainer}
      >
        <View style={styles.headerContent}>
          {user && (
            <>
              <Text style={styles.usernameText}>Bem-vindo, {user.name}</Text>
              <NotificationIcon count={5} /> {/* Exemplo com 5 notificações */}
            </> 
          )}
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.chipsContainer}>
            <TouchableOpacity style={styles.sintomaButton}>
                <Text style={styles.buttonText}>ESTOU COM UM SINTOMA 🩺</Text>
            </TouchableOpacity>
            <View style={styles.chips}>
                <TouchableOpacity style={styles.chip}>
                    <Text style={styles.buttonText}>Febre 🤒</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.chip}>
                    <Text style={styles.buttonText}>Dor de Cabeça 🤕</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.chip}>
                    <Text style={styles.buttonText}>Dor de garganta 😷</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.chip}>
                    <Text style={styles.buttonText}>Enjoo 🤢</Text>
                </TouchableOpacity>
            </View>
        </View>
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
};