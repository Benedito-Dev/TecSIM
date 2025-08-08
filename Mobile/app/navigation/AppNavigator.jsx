import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

// Screens auth
import WelcomeScreen from '../screens/auth/Welcome/WelcomeScreen';
import LoginScreen from '../screens/auth/Login/LoginScreen';
import RegisterScreen from '../screens/auth/Register/RegisterScreen';
import MainTabNavigator from './TabNavigator';
import CodeScreen from '../screens/auth/code/code';

// Import ThemeContext
import { ThemeProvider } from '../context/ThemeContext'

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <ThemeProvider>
        <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="App" component={MainTabNavigator} options={{ gestureEnabled: false }} />
          <Stack.Screen name="Code" component={CodeScreen} />
        </Stack.Navigator>
    </ThemeProvider>
  );
}
