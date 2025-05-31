import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import DashboardContent from '../screens/Content/DashboardContent/DashboardContent'; // Seu conteúdo atual

const Tab = createBottomTabNavigator();

export default function TabMenu() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Início') {
            iconName = 'home';
          } else if (route.name === 'Consultas') {
            iconName = 'calendar';
          } else if (route.name === 'Perfil') {
            iconName = 'user';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#00c4cd',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Início" component={DashboardContent} />
      {/* <Tab.Screen name="Consultas" component={ConsultasScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} /> */}
    </Tab.Navigator>
  );
}