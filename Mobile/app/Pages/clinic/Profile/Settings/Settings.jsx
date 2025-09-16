import React, { useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../../../../context/ThemeContext';
import { useElderMode } from '../../../../context/ElderModeContext';
import { getAjustesStyles } from './styles';

import { deletePaciente } from '../../../../services/userService'
import { useAuth } from '../../../../context/AuthContext';

import { ArrowLeft, Bell, Shield, Info, Moon, Sun, Trash2, User, LogOut } from 'lucide-react-native';

export default function AjustesScreen() {
  const navigation = useNavigation();
  const { theme, toggleTheme, mode } = useContext(ThemeContext);
  const { elderMode, toggleElderMode } = useElderMode();

  const { user } = useAuth();

  const styles = getAjustesStyles(theme);

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
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={theme.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Ajustes</Text>
        {/* Espaço para manter alinhamento */}
        <View style={{ width: 24 }} />
      </View>

      {/* Preferências de Aparência */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aparência</Text>

        <TouchableOpacity style={styles.configItem} onPress={toggleTheme}>
          {mode === 'dark' ? <Sun size={20} color={theme.primary} /> : <Moon size={20} color={theme.primary} />}
          <Text style={styles.configText}>
            Tema: {mode === 'dark' ? 'Escuro' : 'Claro'}
          </Text>
        </TouchableOpacity>

        {/* Botão de Modo Idoso */}
        <View style={styles.configItem}>
          <User size={20} color={theme.primary} />
          <Text style={styles.configText}>Modo Idoso</Text>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Switch
              value={elderMode}
              onValueChange={toggleElderMode}
              thumbColor={elderMode ? theme.primary : '#ccc'}
              trackColor={{ true: theme.primaryLight, false: theme.border }}
            />
          </View>
        </View>
      </View>

      {/* Notificações */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notificações</Text>

        <TouchableOpacity style={styles.configItem}>
          <Bell size={20} color={theme.primary} />
          <Text style={styles.configText}>Gerenciar Notificações</Text>
        </TouchableOpacity>
      </View>

      {/* Privacidade */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacidade</Text>

        <TouchableOpacity style={styles.configItem} onPress={() => navigation.navigate('Profile', { screen: 'Privacy' })}>
          <Shield size={20} color={theme.primary} />
          <Text style={styles.configText}>Política de Privacidade</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.configItem} onPress={handleDeleteAccount}>
          <Trash2 size={20} color={theme.error} />
          <Text style={[styles.configText, { color: theme.error }]}>
            Excluir Conta
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sobre */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sobre</Text>

        <TouchableOpacity style={styles.configItem}>
          <Info size={20} color={theme.primary} />
          <Text style={styles.configText}>Sobre o App</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}
