import React, { useEffect, useState, useContext } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from "react-native";
import {
  MaterialIcons,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { ArrowLeft } from "lucide-react-native"; // seta padrão
import { ThemeContext } from "../../../../context/ThemeContext";
import { useElderMode } from "../../../../context/ElderModeContext"; // ✅ usa o hook
import { getBulaPorMedicamento } from "../../../../services/bulaService";

import { getBulaStyles } from "./styles";
import { useScale } from '../../../../utils/scale'; // ✅ Hook global para escalonamento

export default function BulaScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const {
    idMedicamento,
    nomeMedicamento,
    tipoMedicamento,
    dosagemMedicamento,
  } = route.params;

  const [bula, setBula] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    dosage: true,
    contraindications: true,
    indications: false,
    precautions: false,
    interactions: false,
    storage: false,
  });

  const { theme } = useContext(ThemeContext);
  const { fontSize, fontIndex, increaseFont, decreaseFont } = useElderMode(); // ✅ acessa os valores do contexto
  const { scaleIcon } = useScale(fontSize); // ✅ agora pegamos a função direto do utils
  const styles = getBulaStyles(theme, fontSize);

  useEffect(() => {
    const fetchBula = async () => {
      try {
        const data = await getBulaPorMedicamento(idMedicamento);
        setBula(data);
      } catch (error) {
        console.error("Erro ao buscar bula:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBula();
  }, [idMedicamento]);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Componente reutilizável para seções
  const ExpandableSection = ({
    title,
    icon,
    expanded,
    onToggle,
    items,
    important = false,
  }) => (
    <View style={[styles.card, important && styles.importantCard]}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View style={styles.sectionTitle}>
          {icon}
          <Text
            style={[
              styles.sectionHeaderText,
              important && styles.importantText,
            ]}
          >
            {title}
          </Text>
        </View>
        <MaterialIcons
          name={expanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={scaleIcon(24)}
          color={important ? theme.error : theme.textMuted}
        />
      </TouchableOpacity>
      {expanded && (
        <View style={styles.sectionContent}>
          {items && items.length > 0 ? (
            items.map((text, index) => (
              <InfoItem
                key={index}
                icon={getIconForSection(title)}
                text={text}
                styles={styles}
              />
            ))
          ) : (
            <Text style={styles.infoText}>Nenhuma informação disponível.</Text>
          )}
        </View>
      )}
    </View>
  );

  // Componente de linha com ícone
  const InfoItem = ({ icon, text, styles }) => (
    <View style={styles.infoItem}>
      <Text style={styles.infoIcon}>{icon}</Text>
      <Text style={styles.infoText}>{text}</Text>
    </View>
  );

  const getIconForSection = (sectionTitle) => {
    switch (sectionTitle) {
      case "CONTRAINDICAÇÕES":
        return <MaterialIcons name="block" size={scaleIcon(18)} color={theme.error} />;
      case "INTERAÇÕES MEDICAMENTOSAS":
        return <FontAwesome name="exchange" size={scaleIcon(18)} color={theme.primary} />;
      case "PRECAUÇÕES E ADVERTÊNCIAS":
        return <MaterialCommunityIcons name="alert" size={scaleIcon(18)} color={theme.warning} />;
      case "INDICAÇÕES":
        return <MaterialIcons name="check-circle" size={scaleIcon(18)} color={theme.success} />;
      case "ARMAZENAMENTO E VALIDADE":
        return <MaterialIcons name="inventory" size={scaleIcon(18)} color={theme.primary} />;
      case "DOSAGEM E ADMINISTRAÇÃO":
        return <MaterialIcons name="schedule" size={scaleIcon(18)} color={theme.primary} />;
      default:
        return <MaterialIcons name="circle" size={scaleIcon(10)} color={theme.text} />;
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.primary }]}>
          Carregando bula...
        </Text>
      </View>
    );
  }

  if (!bula) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>Bula não encontrada.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ paddingLeft: 12, paddingTop: 15 }}
        >
          <ArrowLeft size={scaleIcon(38)} color={theme.textOnPrimary} />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.medicineName}>
            {nomeMedicamento?.toUpperCase() || "MEDICAMENTO"}
          </Text>
          <Text style={styles.medicineDetails}>
            {tipoMedicamento || ""} • {dosagemMedicamento || ""}
          </Text>
        </View>

        <View style={styles.headerDecoration}></View>
      </View>

      {/* Conteúdo principal */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ExpandableSection
          title="DOSAGEM E ADMINISTRAÇÃO"
          icon={
            <MaterialIcons name="medication" size={scaleIcon(22)} color={theme.primary} />
          }
          expanded={expandedSections.dosage}
          onToggle={() => toggleSection("dosage")}
          items={bula.dosagem_e_administracao}
        />

        <ExpandableSection
          title="CONTRAINDICAÇÕES"
          icon={<MaterialIcons name="warning" size={scaleIcon(22)} color={theme.error} />}
          expanded={expandedSections.contraindications}
          onToggle={() => toggleSection("contraindications")}
          items={bula.contraindicacoes}
          important
        />

        <ExpandableSection
          title="INDICAÇÕES"
          icon={<FontAwesome name="heart" size={scaleIcon(20)} color={theme.primary} />}
          expanded={expandedSections.indications}
          onToggle={() => toggleSection("indications")}
          items={bula.indicacoes}
        />

        <ExpandableSection
          title="PRECAUÇÕES E ADVERTÊNCIAS"
          icon={
            <MaterialCommunityIcons
              name="alert-circle"
              size={scaleIcon(20)}
              color={theme.warning}
            />
          }
          expanded={expandedSections.precautions}
          onToggle={() => toggleSection("precautions")}
          items={bula.advertencias}
        />

        <ExpandableSection
          title="INTERAÇÕES MEDICAMENTOSAS"
          icon={
            <MaterialCommunityIcons
              name="alert-octagon"
              size={scaleIcon(20)}
              color={theme.warning}
            />
          }
          expanded={expandedSections.interactions}
          onToggle={() => toggleSection("interactions")}
          items={bula.interacoes_medicamentosas}
        />

        <ExpandableSection
          title="ARMAZENAMENTO E VALIDADE"
          icon={
            <MaterialIcons name="inventory" size={scaleIcon(20)} color={theme.primary} />
          }
          expanded={expandedSections.storage}
          onToggle={() => toggleSection("storage")}
          items={bula.armazenamento_e_validade}
        />

        {/* Rodapé */}
        <View style={styles.footerCard}>
          <Text style={styles.footerText}>
            Para informações completas, consulte a bula profissional no site da
            Anvisa
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => Linking.openURL("https://consultas.anvisa.gov.br/")}
          >
            <Text style={styles.buttonText}>ACESSAR BULA COMPLETA</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
