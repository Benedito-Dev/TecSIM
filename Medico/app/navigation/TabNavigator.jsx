import React, { useContext, useMemo } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import { StyleSheet, View } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../constants/temas';

// Import stacks
import DashboardStack from './DashboardStack';
import ProfileStack from './ProfileStack';
import ChatScreen from '../Pages/clinic/Chat/Chat';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const { theme } = useContext(ThemeContext);

  // Usamos useMemo para otimizar a recriação das opções
  const tabBarOptions = useMemo(() => ({
    tabBarActiveTintColor: theme.primary,
    tabBarInactiveTintColor: theme.textMuted,
    headerShown: false,
    tabBarShowLabel: true,
    tabBarStyle: {
      backgroundColor: theme.backgroundCard,
      borderTopWidth: 0,
      height: 60,
      paddingBottom: 5,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 10,
    },
  }), [theme]); // Recria quando colors muda

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') iconName = 'home';
          if (route.name === 'Chat') iconName = 'message-square';
          if (route.name === 'Profile') iconName = 'user';

          const iconSize = focused ? size + 2 : size;

          return (
            <View style={styles.iconContainer}>
              <Icon name={iconName} size={iconSize} color={color} />
            </View>
          );
        },
        ...tabBarOptions, // Spread das opções memorizadas
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardStack} options={{ title: 'Home' }} />
      <Tab.Screen name="Chat" component={ChatScreen} options={{ title: 'Chatbot' }} />
      <Tab.Screen name="Profile" component={ProfileStack} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});