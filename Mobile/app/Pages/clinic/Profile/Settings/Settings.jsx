// Pages/clinic/Ajustes/AjustesScreen.jsx
import React, { useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../../../../context/ThemeContext';
import { useElderMode } from "../../../../context/ElderModeContext";
import { getAjustesStyles } from './styles';
import { useScale } from '../../../../utils/scale'; // ✅ Hook global para escalonamento

import { deletePaciente } from '../../../../services/userService';
import { useAuth } from '../../../../context/AuthContext';

import { 
  ArrowLeft, Bell, Shield, Info, Moon, Sun, 
  Trash2, ALargeSmall, Minus, Plus 
} from 'lucide-react-native';

export default function AjustesScreen() {
  const navigation = useNavigation();
  const { theme, toggleTheme, mode } = useContext(ThemeContext);
  const { fontSize, increaseFont, decreaseFont } = useElderMode();
  const { user } = useAuth();

  const styles = getAjustesStyles(theme, fontSize);
  const { scaleIcon } = useScale(fontSize); // ✅ agora pegamos a função direto do utils

  const handleDeleteAccount = () => {
    if (Platform.OS === 'web') {
      deletePaciente(user.id);
      alert('Conta excluída', 'Sua conta foi excluída com sucesso.');
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
          <ArrowLeft size={scaleIcon(24)} color={theme.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Ajustes</Text>
        <View style={{ width: scaleIcon(24) }} />
      </View>

      {/* Preferências de Aparência */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aparência</Text>

        {/* Botão de alternância Light/Dark */}
        <TouchableOpacity style={styles.configItem} onPress={toggleTheme}>
          {mode === 'dark' ? (
            <Sun size={scaleIcon(20)} color={theme.primary} />
          ) : (
            <Moon size={scaleIcon(20)} color={theme.primary} />
          )}
          <Text style={styles.configText}>
            Tema: {mode === 'dark' ? 'Escuro' : mode === 'elder' ? 'Modo Idoso' : 'Claro'}
          </Text>
        </TouchableOpacity>

        {/* Ajuste de tamanho da fonte */}
        <View style={[styles.configItem, { justifyContent: 'space-between', alignItems: 'center' }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <ALargeSmall size={scaleIcon(20)} color={theme.primary} />
            <Text style={styles.configText}>Tamanho da Fonte</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TouchableOpacity onPress={decreaseFont}>
              <Minus size={scaleIcon(24)} color={theme.primary} />
            </TouchableOpacity>

            <Text style={[styles.configText, { fontWeight: 'bold' }]}>{fontSize}</Text>

            <TouchableOpacity onPress={increaseFont}>
              <Plus size={scaleIcon(24)} color={theme.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Notificações */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notificações</Text>
        <TouchableOpacity style={styles.configItem}>
          <Bell size={scaleIcon(20)} color={theme.primary} />
          <Text style={styles.configText}>Gerenciar Notificações</Text>
        </TouchableOpacity>
      </View>

      {/* Privacidade */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacidade</Text>
        <TouchableOpacity
          style={styles.configItem}
          onPress={() => navigation.navigate('Profile', { screen: 'Privacy' })}
        >
          <Shield size={scaleIcon(20)} color={theme.primary} />
          <Text style={styles.configText}>Política de Privacidade</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.configItem} onPress={handleDeleteAccount}>
          <Trash2 size={scaleIcon(20)} color={theme.error} />
          <Text style={[styles.configText, { color: theme.error }]}>
            Excluir Conta
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sobre */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sobre</Text>
        <TouchableOpacity style={styles.configItem}>
          <Info size={scaleIcon(20)} color={theme.primary} />
          <Text style={styles.configText}>Sobre o App</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
