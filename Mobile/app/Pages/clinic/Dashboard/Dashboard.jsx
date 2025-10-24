import React, { useContext } from "react";
import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator, Linking, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from "../../../context/ThemeContext";
import { useElderMode } from "../../../context/ElderModeContext";
import { getDashboardStyles } from "./styles";
import { useScale } from '../../../utils/scale';
import { useAuth } from "../../../context/AuthContext";
import NotificationIcon from "../../../components/Notification";
import { MessageSquare, Pill, Clock, FileText, AlertTriangle, Phone } from "lucide-react-native";

export default function DashboardScreen() {
  const navigation = useNavigation();
  const { user, loading } = useAuth();
  const { theme } = useContext(ThemeContext);
  const { fontSize } = useElderMode();
  const { scaleIcon } = useScale(fontSize);

  const styles = getDashboardStyles(theme, fontSize);

  // Função para ligar para o SAMU
  const callSamu = async () => {
    const samuNumber = "tel:192";
    
    Alert.alert(
      "Ligar para o SAMU",
      "Você está prestes a ligar para o Serviço de Atendimento Móvel de Urgência (SAMU) no número 192. Deseja continuar?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Ligar",
          onPress: async () => {
            try {
              const canOpen = await Linking.canOpenURL(samuNumber);
              if (canOpen) {
                await Linking.openURL(samuNumber);
              } else {
                Alert.alert("Erro", "Não foi possível realizar a chamada");
              }
            } catch (error) {
              console.error("Erro ao ligar para SAMU:", error);
              Alert.alert("Erro", "Não foi possível realizar a chamada");
            }
          }
        }
      ]
    );
  };

  if (loading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={styles.background}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.logoText}>TecSIM</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 30 }}>
          <TouchableOpacity onPress={callSamu}>
            <AlertTriangle color={theme.error} size={scaleIcon(22)} />
          </TouchableOpacity>
          <NotificationIcon initialCount={3} iconSize={scaleIcon(22)} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Saudação */}
        <Text style={styles.welcomeText}>
          Olá, <Text style={styles.highlightName}>{user.nome || "Usuário"}</Text> 👋
        </Text>
        <Text style={styles.subWelcome}>Como podemos ajudar na sua saúde hoje?</Text>

        {/* Card de Chat */}
        <TouchableOpacity
          style={styles.chatCard}
          activeOpacity={0.9}
          onPress={() => navigation.navigate("Chat")}
        >
          <MessageSquare color="#fff" size={scaleIcon(32)} />
          <Text style={styles.chatCardTitle}>Iniciar Conversa com Assistente</Text>
          <Text style={styles.chatCardDescription}>
            Obtenha recomendações personalizadas para seus sintomas.
          </Text>
        </TouchableOpacity>

        {/* Seção de Ferramentas */}
        <Text style={styles.sectionTitle}>Suas Ferramentas de Saúde</Text>
        <View style={styles.cardGrid}>
          <TouchableOpacity style={styles.toolCard} onPress={() => navigation.navigate("Medicamentos")}>
            <Pill color={theme.primary} size={scaleIcon(28)} />
            <Text style={styles.toolCardTitle}>Medicamentos</Text>
            <Text style={styles.toolCardDescription}>Informações gerais sobre medicamentos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.toolCard} onPress={() => navigation.navigate("Lembretes")}>
            <Clock color={theme.primary} size={scaleIcon(28)} />
            <Text style={styles.toolCardTitle}>Lembretes</Text>
            <Text style={styles.toolCardDescription}>Nunca esqueça de tomar seus remédios</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.toolCard} onPress={() => navigation.navigate("Prescricao")}>
            <FileText color={theme.primary} size={scaleIcon(28)} />
            <Text style={styles.toolCardTitle}>Minhas Prescrições</Text>
            <Text style={styles.toolCardDescription}>Acesse suas receitas médicas</Text>
          </TouchableOpacity>

          {/* Botão de Pânico - Agora chama a função callSamu */}
          <TouchableOpacity style={styles.PanicCard} onPress={callSamu}>
            <AlertTriangle color={theme.error} size={scaleIcon(28)} />
            <Text style={styles.toolCardTitle}>Botão de Pânico</Text>
            <Text style={styles.toolCardDescription}>Ligar para o SAMU - 192</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}