import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens auth
import WelcomeScreen from '../screens/auth/Welcome/WelcomeScreen';
import LoginScreen from '../screens/auth/Login/LoginScreen';
import RegisterScreen from '../screens/auth/Register/RegisterScreen';
import MainTabNavigator from './TabNavigator';

// Screens Medicenes
import MedicineScreen from '../screens/home/Medicines/Medicines'
import BulaScreen from '../screens/home/Medicines/Bula/Bula';
import CodeScreen from '../screens/auth/code/code';

// Screens Profile
import EditProfileScreen from '../screens/home/Profile/Edit-Profile/edit-Profile';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="Welcome" 
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="App" component={MainTabNavigator} />
      <Stack.Screen name="Medicamentos" component={MedicineScreen} />
      <Stack.Screen name="Bula" component={BulaScreen} />
      <Stack.Screen name="Edit-Profile" component={EditProfileScreen} />
      <Stack.Screen name="Code" component={CodeScreen} />
    </Stack.Navigator>
  );
}