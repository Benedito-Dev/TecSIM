import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

// Screens auth
import WelcomeScreen from '../Pages/auth/Welcome/WelcomeScreen';
import LoginScreen from '../Pages/auth/Login/LoginScreen';
import RegisterScreen from '../Pages/auth/Register/RegisterScreen';
import ForgotPasswordScreen from '../Pages/auth/ForgotPassword/ForgotPasswordScreen';
import ResetPasswordScreen from '../Pages/auth/ForgotPassword/ResetPassword/ResetPasswordScreen';

import MainTabNavigator from './TabNavigator';
import CodeScreen from '../Pages/auth/code/code';

// Import ThemeContext
import { ThemeProvider } from '../context/ThemeContext'

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <ThemeProvider>
        <Stack.Navigator initialRouteName="App" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="App" component={MainTabNavigator} options={{ gestureEnabled: false }} />
          <Stack.Screen name="Code" component={CodeScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        </Stack.Navigator>
    </ThemeProvider>
  );
}
