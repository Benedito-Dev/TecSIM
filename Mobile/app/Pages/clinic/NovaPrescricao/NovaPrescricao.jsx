import React, { useContext } from "react";
import { View, Text, TouchableOpacity, Image} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from '../../../context/ThemeContext';
import { ArrowLeft, Camera, Edit3 } from "lucide-react-native"; // Lucide ícones
import { getSubscriptionStyles } from "./styles";

export default function NovaPrescricaoScreen() {
  const navigation = useNavigation();

  const { theme } = useContext(ThemeContext)
  const styles = getSubscriptionStyles(theme)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#2563EB" />
        </TouchableOpacity>
        <Text style={styles.title}>Registrar Minha Prescrição</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.content}>
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
            <Camera size={32} color="#2563EB" />
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
            <Edit3 size={32} color="#2563EB" />
            <Text style={styles.optionTitle}>Preencher manualmente</Text>
            <Text style={styles.optionDescription}>
              Insira os detalhes da sua prescrição manualmente.
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}