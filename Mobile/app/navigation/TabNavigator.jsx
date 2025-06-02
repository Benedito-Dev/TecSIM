import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';

// Importando telas (mantendo os paths originais)
import DashboardScreen from '../screens/home/Dashboard/Dashboard';
import ProfileScreen from '../screens/home/Profile/Profile';
import ChatScreen from '../screens/home/Chat/Chat';
import MedicineScreen from '../screens/home/Medicines/Medicines';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          
          if (route.name === 'Dashboard') iconName = 'home';
          if (route.name === 'Medicines') iconName = 'package'; // Ícone para medicamentos
          if (route.name === 'Chat') iconName = 'message-square'; // Ícone para chat
          if (route.name === 'Profile') iconName = 'user';
          
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#00c4cd',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Medicines" component={MedicineScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}