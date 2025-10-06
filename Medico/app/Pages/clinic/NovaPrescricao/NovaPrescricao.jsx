import React, { useContext } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from '../../../context/ThemeContext';
import { useElderMode } from "../../../context/ElderModeContext";
import { ArrowLeft, Camera, Edit3 } from "lucide-react-native";
import { getSubscriptionStyles } from "./styles";
import { useScale } from '../../../utils/scale';

export default function NovaPrescricaoScreen() {
  const navigation = useNavigation();

  const { theme } = useContext(ThemeContext);
  const { fontSize } = useElderMode();
  const { scaleIcon } = useScale(fontSize);
  const styles = getSubscriptionStyles(theme, fontSize);

  return (
    <View style={styles.container}>
      {/* Header fixo */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={scaleIcon(24)} color="#2563EB" />
        </TouchableOpacity>
        <Text style={styles.title}>Registrar Minha Prescrição</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Conteúdo com scroll */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 32 }} // garante espaço no final
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>Como você gostaria de registrar sua prescrição?</Text>
        
        {/* Opção 1 - Tirar foto */}
        <TouchableOpacity 
          style={[styles.optionCard, styles.recommendedOption]}
          onPress={() => navigation.navigate("CameraPrescricao")}
        >
          <View style={styles.optionHeader}>
            <View style={styles.recommendedBadge}>
              <Text style={styles.recommendedText}>Recomendado</Text>
            </View>
          </View>
          
          <View style={styles.optionContent}>
            <Camera size={scaleIcon(32)} color="#2563EB" />
            <Text style={styles.optionTitle}>Tirar uma foto</Text>
            <Text style={styles.optionDescription}>
              Use a câmera do seu telefone para capturar sua prescrição.
            </Text>
          </View>
        </TouchableOpacity>

        {/* Opção 2 - Preencher manualmente */}
        <TouchableOpacity 
          style={styles.optionCard}
          onPress={() => navigation.navigate("PrescricaoManual")}
        >
          <View style={styles.optionContent}>
            <Edit3 size={scaleIcon(32)} color="#2563EB" />
            <Text style={styles.optionTitle}>Preencher manualmente</Text>
            <Text style={styles.optionDescription}>
              Insira os detalhes da sua prescrição manualmente.
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
