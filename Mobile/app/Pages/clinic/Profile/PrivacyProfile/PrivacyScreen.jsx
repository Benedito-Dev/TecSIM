import React, {useState} from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../../../../context/AuthContext';
import { deletePaciente, inativarPaciente } from '../../../../services/userService'

import { styles } from './styles';
import { ArrowLeft } from 'lucide-react-native';

export default function PrivacyScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();


  const handleInactiveAccount = () => {
    if (Platform.OS === 'web') {
      inativarPaciente(user.id);
      alert('Conta Inativa', 'Sua conta foi desativada. Você poderá reativá-la ao fazer login novamente.')
      navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
    } else {
      Alert.alert(
        'Conta Inativa',
        'Sua conta foi desativada. Você poderá reativá-la ao fazer login novamente.',
        [
          {
            text: 'OK',
            onPress: () => {
              inativarPaciente(user.id);
              navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
            },
          },
        ]
      );
    }
  };

  const handleDeleteAccount = () => {
    if (Platform.OS === 'web') {
      deletePaciente(user.id);
      alert('Conta excluída', 'Sua conta foi excluída com sucesso.')
      navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
    } else {
      Alert.alert(
        'Excluir Conta',
        'Tem certeza que deseja excluir sua conta? Essa ação é irreversível.',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Excluir',
            style: 'destructive',
            onPress: () => {
              deletePaciente(user.id);
              Alert.alert('Conta excluída', 'Sua conta foi excluída com sucesso.');
              navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
            },
          },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacidade</Text>
        <View style={{ width: 24 }} /> {/* Placeholder para alinhamento */}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Card: Informações de privacidade */}
        <View style={styles.card}>
          <TouchableOpacity>
            <Text style={styles.cardTitle}>Gerenciamento de Dados</Text>
            <Text style={styles.cardText}>
                Você tem controle total sobre sua conta. Pode visualizar, editar ou excluir suas informações a qualquer momento.
            </Text>
          </TouchableOpacity>
        </View>

        {/* Card: Transparência */}
        <View style={styles.card}>
          <TouchableOpacity>
            <Text style={styles.cardTitle}>Transparência e Segurança</Text>
            <Text style={styles.cardText}>
                Seus dados são protegidos com criptografia e utilizados apenas para oferecer um serviço mais personalizado.
            </Text>
          </TouchableOpacity>
        </View>

        {/* Card: Exclusão de Conta */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Excluir Conta</Text>
          <Text style={styles.cardText}>
            Ao excluir sua conta, todos os dados associados serão apagados permanentemente e você não poderá recuperá-los.
          </Text>

          <TouchableOpacity style={styles.deactivateButton} onPress={handleInactiveAccount}>
            <Text style={styles.deactivateButtonText}>Desativar minha conta</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
            <Text style={styles.deleteButtonText}>Excluir minha conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
