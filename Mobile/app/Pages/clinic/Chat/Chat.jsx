import React, { useState, useRef, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  ScrollView, 
  Platform,
  ActivityIndicator,
  Alert,
  Animated
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../../context/AuthContext';
import { ThemeContext } from '../../../context/ThemeContext';
import { useElderMode } from "../../../context/ElderModeContext"; // ✅ usa o hook
import { getAIResponse } from '../../../services/aiService';
import { getChatStyles } from './styles';
import { useScale } from '../../../utils/scale'; // ✅ Hook global para escalonamento
import QuickActionButtons from '../../../components/QuickActionButtons'; // Importação do novo componente

// Componente para os pontos animados
const BouncingDots = ({ color = '#00c4cd' }) => {
  const [animations] = useState([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]);

  useEffect(() => {
    const animateDots = () => {
      const timing = (dotIndex, delay) => {
        return Animated.sequence([
          Animated.delay(delay),
          Animated.loop(
            Animated.sequence([
              Animated.timing(animations[dotIndex], {
                toValue: -8,
                duration: 300,
                useNativeDriver: true,
              }),
              Animated.timing(animations[dotIndex], {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
              }),
              Animated.delay(400),
            ])
          )
        ]);
      };

      Animated.parallel([
        timing(0, 0),
        timing(1, 150),
        timing(2, 300),
      ]).start();
    };

    animateDots();
    
    return () => {
      animations.forEach(anim => anim.stopAnimation());
    };
  }, []);

  return (
    <View style={{ flexDirection: 'row', padding: 10 }}>
      {animations.map((anim, index) => (
        <Animated.Text
          key={index}
          style={{
            fontSize: 24,
            color,
            transform: [{ translateY: anim }],
            marginHorizontal: 2,
          }}
        >
          •
        </Animated.Text>
      ))}
    </View>
  );
};

export default function ChatScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef();
  const inputRef = useRef(null);

  const { fontSize, fontIndex, increaseFont, decreaseFont } = useElderMode(); // ✅ acessa os valores do contexto
  const { scaleIcon } = useScale(fontSize); // ✅ agora pegamos a função direto do utils

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const { theme } = useContext(ThemeContext)
  const styles = getChatStyles(theme, fontSize);

  useEffect(() => {
    const initialMessages = [
      { 
        id: 1, 
        text: 'Olá! Sou o TecSim, seu assistente virtual de saúde.', 
        isBot: true,
        time: getCurrentTime() 
      }
    ];
    
    setMessages(initialMessages);
  }, []);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: newMessage,
      isBot: false,
      time: getCurrentTime()
    };
    
    setMessages(prev => [...prev, userMessage]);
    const messageText = newMessage;
    setNewMessage('');
    setIsLoading(true);

    // Verifica se é a mensagem para alterar dados pessoais
    if (messageText.trim() === "Preciso alterar meus dados pessoais") {
      const redirectMessage = {
        id: Date.now() + 1,
        text: "Redirecionando você para a tela de edição de perfil...",
        isBot: true,
        time: getCurrentTime()
      };
      
      setMessages(prev => [...prev, redirectMessage]);
      setIsLoading(false);
      
      // Redireciona após 2 segundos
      setTimeout(() => {
        navigation.navigate('Profile', { screen: 'EditProfile' });
      }, 2000);
      
      return;
    }

    // Verifica se é a mensagem sobre medicamentos
    if (messageText.trim() === "Tenho dúvidas sobre meus medicamentos") {
      const redirectMessage = {
        id: Date.now() + 1,
        text: "Redirecionando você para a tela de medicamentos...",
        isBot: true,
        time: getCurrentTime()
      };
      
      setMessages(prev => [...prev, redirectMessage]);
      setIsLoading(false);
      
      // Redireciona após 2 segundos
      setTimeout(() => {
        navigation.navigate('Dashboard', { screen: 'Medicamentos' });
      }, 2000);
      
      return;
    }

    // Verifica se é a mensagem sobre prescrição
    if (messageText.trim() === "Como solicitar uma nova prescrição médica?") {
      const redirectMessage = {
        id: Date.now() + 1,
        text: "Redirecionando você para a tela de prescrições...",
        isBot: true,
        time: getCurrentTime()
      };
      
      setMessages(prev => [...prev, redirectMessage]);
      setIsLoading(false);
      
      // Redireciona após 2 segundos
      setTimeout(() => {
        navigation.navigate('Dashboard', { screen: 'Prescricao' });
      }, 2000);
      
      return;
    }

    try {
      // Filtra e formata o histórico corretamente
      const apiHistory = messages
        .filter(msg => msg.id !== 1) // Remove mensagem inicial fixa
        .map(msg => ({
          isBot: msg.isBot,
          text: msg.text
        }));

      const aiResponse = await getAIResponse(messageText, apiHistory);

      if (aiResponse.success) {
        const botMessage = {
          id: Date.now() + 1,
          text: aiResponse.response,
          isBot: true,
          time: getCurrentTime()
        };

        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(aiResponse.error);
      }
    } catch (error) {
      console.error("Erro na chamada da API:", error);
      
      const errorMessage = {
        id: Date.now() + 1,
        text: '⚠️ ' + (error.message || 'Desculpe, ocorreu um erro. Tente novamente.'),
        isBot: true,
        time: getCurrentTime()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      if (error.message.includes('API key')) {
        Alert.alert('Erro', 'Problema com a chave de API. Verifique as configurações.');
      }
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  // Função para lidar com o pressionar dos botões de ação rápida
  const handleQuickActionPress = (message) => {
    setNewMessage(message);
    // Dispara o envio da mensagem após um pequeno delay
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#00c4cd', '#0c87c4']}
        style={styles.TopContainer}
      >
        <View style={styles.headerContent}>
          <Text style={styles.usernameText}>Chat - TecSim  </Text>
          <View style={styles.statusIndicator}>
            <View style={[styles.statusDot, { backgroundColor: isLoading ? '#FFC107' : '#4CAF50' }]} />
            <Text style={styles.statusText}>
              {isLoading ? 'Processando...' : 'Online'}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((message) => (
          <View 
            key={message.id} 
            style={[
              styles.messageBubble, 
              message.isBot ? styles.botMessage : styles.userMessage,
              message.text.startsWith('⚠️') && styles.errorMessage
            ]}
          >
            {message.isBot && (
              <Text style={styles.botName}>TecSim</Text>
            )}
            <Text style={[
              styles.messageText,
              message.isBot ? styles.botMessageText : styles.userMessageText,
              message.text.startsWith('⚠️') && styles.errorText
            ]}>
              {message.text}
            </Text>
            <Text style={[
              styles.timeText,
              message.isBot ? styles.botTime : styles.userTime
            ]}>
              {message.time}
            </Text>
          </View>
        ))}
        
        {isLoading && (
          <View style={[styles.messageBubble, styles.botMessage]}>
            <BouncingDots color={theme.primary} />
          </View>
        )}
      </ScrollView>

      {/* Adicione o componente de botões rápidos */}
      <QuickActionButtons 
        onButtonPress={handleQuickActionPress} 
        isLoading={isLoading} 
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
        keyboardVerticalOffset={Platform.select({ ios: 90, android: 0 })}
      >
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Digite sua mensagem..."
          placeholderTextColor="#999"
          editable={!isLoading}
          multiline={false}
          blurOnSubmit={true}
          onSubmitEditing={handleSendMessage}
        />
        <TouchableOpacity 
          style={[
            styles.sendButton,
            (newMessage.trim() === '' || isLoading) && styles.disabledButton
          ]}
          onPress={handleSendMessage}
          disabled={newMessage.trim() === '' || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Icon name="send" size={scaleIcon(20)} color="#fff" />
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}