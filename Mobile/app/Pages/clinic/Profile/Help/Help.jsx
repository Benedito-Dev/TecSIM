import React, { useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../../../../context/ThemeContext';
import { useElderMode } from "../../../../context/ElderModeContext";
import { ArrowLeft, Mail, Phone, FileText, Globe } from 'lucide-react-native';
import { getHelpStyles } from './styles';
import { useScale } from '../../../../utils/scale';

const faqItems = [
  {
    question: 'Como posso resetar minha senha?',
    answer:
      'Para resetar sua senha, vá até a tela de login e clique em "Esqueci minha senha".',
  },
  {
    question: 'Como contato o suporte?',
    answer:
      'Você pode nos enviar um e-mail ou ligar para o telefone de suporte durante o horário comercial.',
  },
  {
    question: 'Onde encontro os termos de uso?',
    answer:
      'Os termos de uso estão disponíveis no site oficial na seção "Termos de Uso".',
  },
];

export default function HelpScreen() {
  const navigation = useNavigation();
  const { fontSize } = useElderMode();
  const { scaleIcon } = useScale(fontSize);
  const { theme } = useContext(ThemeContext);
  const styles = getHelpStyles(theme, fontSize);

  const contactMethods = [
    {
      icon: <Mail size={scaleIcon(22)} color={theme.primary} />,
      title: 'E-mail de Suporte',
      description: 'Envie suas dúvidas para nossa equipe',
      contact: 'suporte@tecsim.com.br',
      action: () => Linking.openURL('mailto:suporte@tecsim.com.br'),
    },
    {
      icon: <Phone size={scaleIcon(22)} color={theme.primary} />,
      title: 'Telefone',
      description: 'Disponível de seg. a sexta, das 8h às 18h',
      contact: '(11) 3456-7890',
      action: () => Linking.openURL('tel:+551134567890'),
    },
  ];

  const usefulLinks = [
    {
      icon: <FileText size={scaleIcon(18)} color={theme.primary} />,
      label: 'Termos de Uso',
      url: 'https://tecsim.com.br/termos',
    },
    {
      icon: <FileText size={scaleIcon(18)} color={theme.primary} />,
      label: 'Política de Privacidade',
      url: 'https://tecsim.com.br/privacidade',
    },
    {
      icon: <Globe size={scaleIcon(18)} color={theme.primary} />,
      label: 'Site Oficial',
      url: 'https://tecsim.com.br',
    },
  ];

  const openLink = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error('Erro ao abrir URL:', err)
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={scaleIcon(24)} color={theme.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ajuda & Suporte</Text>
        <View style={{ width: 24 }} /> {/* Placeholder para alinhamento */}
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Contato */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Entre em Contato</Text>
          <Text style={styles.sectionDescription}>
            Estamos aqui para ajudar você. Escolha a melhor forma de contato:
          </Text>
          {contactMethods.map((method, index) => (
            <TouchableOpacity
              key={index}
              style={styles.contactCard}
              onPress={method.action}
            >
              <View style={styles.iconContainer}>{method.icon}</View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactTitle}>{method.title}</Text>
                <Text style={styles.contactDescription}>{method.description}</Text>
                <Text style={styles.contactText}>{method.contact}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* FAQ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Perguntas Frequentes</Text>
          {faqItems.map((item, index) => (
            <View key={index} style={styles.faqItem}>
              <Text style={styles.faqQuestion}>{item.question}</Text>
              <Text style={styles.faqAnswer}>{item.answer}</Text>
            </View>
          ))}
        </View>

        {/* Links Úteis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Links Úteis</Text>
          {usefulLinks.map((link, index) => (
            <TouchableOpacity
              key={index}
              style={styles.usefulLink}
              onPress={() => openLink(link.url)}
            >
              {link.icon}
              <Text style={styles.usefulLinkText}>{link.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Versão */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>TecSIM v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
