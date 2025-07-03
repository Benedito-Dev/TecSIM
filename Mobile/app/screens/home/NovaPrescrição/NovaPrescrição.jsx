import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import FeatherIcon from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import styles from "./styles";

export default function RegistroPrescricaoScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <FeatherIcon name="arrow-left" size={24} color="#2563EB" />
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
            <MaterialCommunityIcons name="camera" size={32} color="#2563EB" />
            <Text style={styles.optionTitle}>Tirar uma foto</Text>
            <Text style={styles.optionDescription}>
              Use a câmera do seu telefone para capturar sua prescrição.
            </Text>
          </View>
        </TouchableOpacity>

        {/* Opção 2 - Preencher manualmente */}
        <TouchableOpacity 
          style={styles.optionCard}
          onPress={() => navigation.navigate("NovaPrescricao")}
        >
          <View style={styles.optionContent}>
            <FeatherIcon name="edit-3" size={32} color="#2563EB" />
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