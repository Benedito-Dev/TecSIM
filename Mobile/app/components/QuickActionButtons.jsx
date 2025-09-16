import React from 'react';
import { TouchableOpacity, Text, View, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { getChatStyles } from '../Pages/clinic/Chat/styles';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const QuickActionButtons = ({ onButtonPress, isLoading }) => {
  const { theme } = useContext(ThemeContext);
  const styles = getChatStyles(theme);

  const quickActions = [
    {
      id: 1,
      title: 'Ver histórico',
      icon: 'clock',
      message: 'Gostaria de ver meu histórico médico'
    },
    {
      id: 2,
      title: 'Nova prescrição',
      icon: 'file-plus',
      message: 'Como solicitar uma nova prescrição médica?'
    },
    {
      id: 3,
      title: 'Alterar dados pessoais',
      icon: 'user',
      message: 'Preciso alterar meus dados pessoais'
    },
    {
      id: 6,
      title: 'Dúvidas sobre medicamentos',
      icon: 'package',
      message: 'Tenho dúvidas sobre meus medicamentos'
    }
  ];

  const handlePress = (message) => {
    if (!isLoading) {
      onButtonPress(message);
    }
  };

  return (
    <View style={styles.quickActionsContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.quickActionsScroll}
      >
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={[
              styles.quickActionButton,
              isLoading && styles.quickActionButtonDisabled
            ]}
            onPress={() => handlePress(action.message)}
            disabled={isLoading}
          >
            <Icon 
              name={action.icon} 
              size={16} 
              color={theme.primary} 
              style={styles.quickActionIcon}
            />
            <Text style={styles.quickActionText}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default QuickActionButtons;