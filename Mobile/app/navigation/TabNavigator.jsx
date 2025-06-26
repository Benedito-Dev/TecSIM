import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import { StyleSheet, View } from 'react-native';

// Importando telas
import DashboardScreen from '../screens/home/Dashboard/Dashboard';
import ProfileScreen from '../screens/home/Profile/Profile';
import ChatScreen from '../screens/home/Chat/Chat';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'Dashboard') iconName = 'home';
          if (route.name === 'Chat') iconName = 'message-square';
          if (route.name === 'Profile') iconName = 'user';
          
          // Aumenta o ícone quando está ativo
          const iconSize = focused ? size + 2 : size;
          
          return (
            <View style={focused ? styles.iconContainerFocused : styles.iconContainer}>
              <Icon name={iconName} size={iconSize} color={color} />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          );
        },
        tabBarActiveTintColor: '#0c87c4',
        tabBarInactiveTintColor: '#95a5a6',
        headerShown: false,
        tabBarShowLabel: false, // Remove os labels para um visual mais limpo
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 10,
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{ title: 'Início' }} 
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen} 
        options={{ 
          title: 'Assistente IA',
          // Adiciona um badge para indicar novas mensagens (opcional)
          // tabBarBadge: hasNewMessages ? '' : null 
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Perfil' }} 
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  iconContainerFocused: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  activeIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0c87c4',
    marginTop: 4,
  },
});