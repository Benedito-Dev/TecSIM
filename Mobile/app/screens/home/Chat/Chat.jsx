import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../../context/AuthContext';
import { styles } from './styles';

export default function ChatScreen() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollViewRef = useRef();

  // Formata a hora atual
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Mensagens iniciais do bot
  useEffect(() => {
    setMessages([
      { 
        id: 1, 
        text: 'Olá! Sou o HealthBot, como posso te ajudar hoje?', 
        isBot: true,
        time: getCurrentTime() 
      },
      { 
        id: 2, 
        text: 'Você pode me perguntar sobre sintomas, medicamentos ou agendamentos.', 
        isBot: true,
        time: getCurrentTime()
      }
    ]);
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    // Adiciona mensagem do usuário
    const userMessage = {
      id: messages.length + 1,
      text: newMessage,
      isBot: false,
      time: getCurrentTime()
    };
    
    setMessages([...messages, userMessage]);
    setNewMessage('');

    // Simula resposta do bot após 1 segundo
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: `Recebi sua mensagem: "${newMessage}". Estou processando sua solicitação...`,
        isBot: true,
        time: getCurrentTime()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho igual ao Dashboard */}
      <LinearGradient
        colors={['#00c4cd', '#0c87c4']}
        style={styles.TopContainer}
      >
        <View style={styles.headerContent}>
          <Text style={styles.usernameText}>Chat - TecSim</Text>
        </View>
      </LinearGradient>

      {/* Área de mensagens */}
      <ScrollView 
        style={styles.content}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
      >
        {messages.map((message) => (
          <View 
            key={message.id} 
            style={[
              styles.messageBubble, 
              message.isBot ? styles.botMessage : styles.userMessage
            ]}
          >
            <Text style={styles.messageText}>{message.text}</Text>
            <Text style={[
              styles.timeText,
              message.isBot ? styles.botTime : styles.userTime
            ]}>
              {message.time}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Input de mensagem */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
        keyboardVerticalOffset={50}
      >
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Digite sua mensagem..."
          placeholderTextColor="#999"
        />
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={handleSendMessage}
          disabled={newMessage.trim() === ''}
        >
          <Icon name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}