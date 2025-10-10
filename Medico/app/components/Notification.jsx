import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const NotificationIcon = ({ initialCount = 0, onPress }) => {
  const [count, setCount] = useState(initialCount);

  // Atualiza se o initialCount mudar externamente
  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  const handlePress = () => {
    // Reduz o contador ao clicar (mínimo 0)
    const newCount = Math.max(0, count - 1);
    setCount(newCount);
    
    // Chama a função personalizada se fornecida
    if (onPress) {
      onPress(newCount);
    } else {
      console.log('Notificações pressionadas', newCount);
    }
  };

  return (
    <TouchableOpacity 
      onPress={handlePress}
      style={styles.container}
    >
      <Icon name="bell" size={24} color="#0c87c4" />
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {count > 9 ? '9+' : count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: 10,
  },
  badge: {
    position: 'absolute',
    right: 5,
    top: 5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default NotificationIcon;