import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import { StyleSheet, View } from 'react-native';

// Import stacks
import DashboardStack from './DashboardStack';
import ProfileStack from './ProfileStack';
import PrescricaoStack from './PrescricaoStack';
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

          const iconSize = focused ? size + 2 : size;

          return (
            <View style={focused ? styles.iconContainerFocused : styles.iconContainer}>
              <Icon name={iconName} size={iconSize} color={color} />
            </View>
          );
        },
        tabBarActiveTintColor: '#0c87c4',
        tabBarInactiveTintColor: '#95a5a6',
        headerShown: false,
        tabBarShowLabel: true,
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
      <Tab.Screen name="Dashboard" component={DashboardStack} options={{ title: 'Home' }}  />
      <Tab.Screen name="Chat" component={ChatScreen} options={{ title: 'Chatbot' }}  />
      <Tab.Screen name="Profile" component={ProfileStack} options={{ title: 'Perfil' }}  />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerFocused: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0c87c4',
    marginTop: 4,
  },
});
