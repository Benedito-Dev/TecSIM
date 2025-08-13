import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../../.././../../context/AuthContext';
import { updatePassword } from '../../../../../services/userService'

import { ThemeContext } from '../../../../../context/ThemeContext';
import { getChangePasswordStyles } from './styles';
import { ArrowLeft } from 'lucide-react-native';

export default function ChangePassword() {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const styles = getChangePasswordStyles(theme);
  const { user, atualizarUsuario } = useAuth();

  const userId = user.id;

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async () => {
    try {
        if (!currentPassword || !newPassword || !confirmPassword) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos.');
        return;
        }
        if (newPassword !== confirmPassword) {
        Alert.alert('Erro', 'A nova senha e a confirmação não coincidem.');
        return;
        }

        const resposta = await updatePassword(userId, currentPassword, newPassword)
        // Aqui você colocaria a lógica para alterar a senha (chamada API etc)
        Alert.alert('Sucesso', 'Senha alterada com sucesso!');
        navigation.goBack();
    } catch {
        console.error('Erro ao atualizar a senha:', error);
        Alert.alert('Erro', 'Não foi possível atualizar a senha do perfil.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={theme.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Alterar Senha</Text>
        <View style={{ width: 24 }} /> {/* Placeholder para alinhamento */}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Senha Atual</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="Digite sua senha atual"
            placeholderTextColor={theme.textSecondary}
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Nova Senha</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="Digite a nova senha"
            placeholderTextColor={theme.textSecondary}
            value={newPassword}
            onChangeText={setNewPassword}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Confirmar Nova Senha</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="Confirme a nova senha"
            placeholderTextColor={theme.textSecondary}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleChangePassword}>
          <Text style={styles.saveButtonText}>Salvar Alterações</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
