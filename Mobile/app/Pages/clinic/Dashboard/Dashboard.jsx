import React, { useContext } from "react";
import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from "../../../context/ThemeContext";
import { useElderMode } from "../../../context/ElderModeContext"; // ✅ usa o hook
import { getDashboardStyles } from "./styles";
import { useScale } from '../../../utils/scale'; // ✅ Hook global para escalonamento
import { useAuth } from "../../../context/AuthContext";
import NotificationIcon from "../../../components/Notification";
import { MessageSquare, Pill, Clock, FileText } from "lucide-react-native";

export default function DashboardScreen() {
  const navigation = useNavigation();
  const { user, loading } = useAuth();
  const { theme } = useContext(ThemeContext);
  const { fontSize, fontIndex, increaseFont, decreaseFont } = useElderMode(); // ✅ acessa os valores do contexto
  const { scaleIcon } = useScale(fontSize); // ✅ agora pegamos a função direto do utils

  // Passa fontSize para o style
  const styles = getDashboardStyles(theme, fontSize);

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
        <NotificationIcon initialCount={3} iconSize={scaleIcon(22)} />
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
        </View>
      </ScrollView>
    </View>
  );
}
