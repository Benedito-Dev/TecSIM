import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  ScrollView, 
  Platform,
  ActivityIndicator,
  Alert 
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../../context/AuthContext';
import { getAIResponse, listAvailableModels } from '../../../services/aiService';
import { styles } from './styles';


export default function ChatScreen() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef();

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

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
    setNewMessage('');
    setIsLoading(true);

    try {
      // Filtra e formata o histórico corretamente
      const apiHistory = messages
        .filter(msg => msg.id !== 1) // Remove mensagem inicial fixa
        .map(msg => ({
          isBot: msg.isBot,
          text: msg.text
        }));

      const aiResponse = await getAIResponse(newMessage, apiHistory);

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
    }
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
            <ActivityIndicator size="small" color="#00c4cd" />
          </View>
        )}
      </ScrollView>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
        keyboardVerticalOffset={Platform.select({ ios: 90, android: 0 })}
      >
        <TextInput
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
            <Icon name="send" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}