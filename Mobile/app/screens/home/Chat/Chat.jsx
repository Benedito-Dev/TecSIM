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
import { getAIResponse } from '../../../services/aiService';
import { styles } from './styles';

export default function ChatScreen() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef();

  // Formata a hora atual
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  // Mensagens iniciais do bot
  useEffect(() => {
    const initialMessages = [
      { 
        id: 1, 
        text: 'Olá! Sou o TecSim, seu assistente virtual de saúde. Como posso te ajudar hoje?', 
        isBot: true,
        time: getCurrentTime() 
      },
      { 
        id: 2, 
        text: 'Você pode me perguntar sobre sintomas, medicamentos ou orientações gerais de saúde.', 
        isBot: true,
        time: getCurrentTime()
      }
    ];
    
    setMessages(initialMessages);
  }, []);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || isLoading) return;

    // Adiciona mensagem do usuário
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
      // Obtém resposta do Gemini via seu aiService.js
      const aiResponse = await getAIResponse(newMessage, messages);

      if (aiResponse.success) {
        const botMessage = {
          id: Date.now() + 1,
          text: aiResponse.response,
          isBot: true,
          time: getCurrentTime()
        };

        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(aiResponse.error || 'Erro ao processar sua mensagem');
      }
    } catch (error) {
      Alert.alert(
        'Erro',
        error.message,
        [{ text: 'OK' }]
      );
      
      // Mensagem de erro no chat
      const errorMessage = {
        id: Date.now() + 1,
        text: '⚠️ ' + error.message,
        isBot: true,
        time: getCurrentTime()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
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

      {/* Área de mensagens */}
      <ScrollView 
        style={styles.content}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        keyboardDismissMode="interactive"
      >
        {messages.map((message) => (
          <View 
            key={message.id} 
            style={[
              styles.messageBubble, 
              message.isBot ? styles.botMessage : styles.userMessage
            ]}
          >
            {message.isBot && (
              <Text style={styles.botName}>TecSim</Text>
            )}
            <Text style={[
              styles.messageText,
              message.isBot ? styles.botMessageText : styles.userMessageText
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

      {/* Input de mensagem */}
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
          multiline
          blurOnSubmit={false}
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