import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../../.././../../context/AuthContext';
import { updatePassword } from '../../../../../services/userService'

import PasswordInput from '../../../../../components/Register/PasswordInput';
import InputField from '../../../../../components/Register/InputField';
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
  const [passwordIsValid, setPasswordIsValid] = useState(false);

  // estados para controlar visibilidade
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isFormValid =
    passwordIsValid &&
    newPassword === confirmPassword

  console.log(isFormValid)

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
          <InputField
            style={styles.input}
            secureTextEntry={!showCurrentPassword}
            placeholder="Digite sua senha atual"
            placeholderTextColor={theme.textSecondary}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            iconName={showCurrentPassword ? 'eye-off' : 'eye'}
            showIcon={true}
            onIconPress={() => setShowCurrentPassword(!showCurrentPassword)}
          />
        </View>

        <View style={styles.card}>
          <PasswordInput
            label="Nova Senha"
            style={styles.input}
            secureTextEntry={!showNewPassword}
            placeholder="Digite a nova senha"
            placeholderTextColor={theme.textSecondary}
            value={newPassword}
            onChangeText={setNewPassword}
            onValidityChange={setPasswordIsValid}
            iconName={showNewPassword ? 'eye-off' : 'eye'}
            showIcon={true}
            onIconPress={() => setShowNewPassword(!showNewPassword)}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Confirmar Nova Senha</Text>
          <InputField
            style={styles.input}
            secureTextEntry={!showConfirmPassword}
            placeholder="Confirme a nova senha"
            placeholderTextColor={theme.textSecondary}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            iconName={showConfirmPassword ? 'eye-off' : 'eye'}
            showIcon={true}
            onIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleChangePassword}>
          <Text style={styles.saveButtonText}>Salvar Alterações</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
