import React, {useState} from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

import { logout } from "../../../services/authService";
import { useAuth } from '../../../context/AuthContext';

import { styles } from './styles'

export default function ProfileScreen() {
    const navigation = useNavigation();
    const { user, loading } = useAuth(); // Usando diretamente o hook do contexto
    const [loadingLogout, setLoading] = useState('')

    const handleLogout = async () => {

        setLoading(true);
        try {
        // Chama a função de login do authService
        await logout();
        
        // Redireciona para a tela principal após login bem-sucedido
        navigation.replace('Welcome');
        } catch (error) {
        // Exibe mensagem de erro adequada
        Alert.alert('Erro', error.message || 'Falha no login. Verifique suas credenciais.');
        } finally {
        setLoading(false);
        }
    }

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
      console.log("Usuário logado:", user);
      if (!user) {
        return null;
      }

    return (
        <View style={styles.container}>
            <View style={styles.containerUser}>
                <Text style={styles.title}>Olá {user.nome || 'Usuário'}!</Text>
                <View style={styles.circle}>
                    <Icon name="camera" size={30} color="#fff" />
                </View>
                {loadingLogout ? (
                <ActivityIndicator size="large" color="#0097b2" style={styles.loading} />
                ) : (
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.textButton}>Logout</Text>
                </TouchableOpacity>
                )}
            </View>
        </View>
    )
}