import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import WelcomeScreen from '../screens/auth/Welcome/WelcomeScreen';
import LoginScreen from '../screens/auth/Login/LoginScreen';
import RegisterScreen from '../screens/auth/Register/RegisterScreen';
import MainTabNavigator from './TabNavigator';

import MedicineScreen from '../screens/home/Medicines/Medicines'
import CodeScreen from '../screens/auth/code/code';
import PrescricaoScreen from '../screens/home/Prescricao/Prescricao';
import NovaPrescricaoScreen from '../screens/home/NovaPrescricao/NovaPrescricao';
import PrescricaoManualScreen from '../screens/home/PrescricaoManual/PrescricaoManual';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="Register" 
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="App" component={MainTabNavigator} />
      <Stack.Screen name="Medicamentos" component={MedicineScreen} />
      <Stack.Screen name="Code" component={CodeScreen} />
      <Stack.Screen name="Prescricao" component={PrescricaoScreen} />
      <Stack.Screen name="NovaPrescricao" component={NovaPrescricaoScreen} />
      <Stack.Screen name="PrescricaoManual" component={PrescricaoManualScreen} options={{ title: 'Prescrição Manual' }}
/>
    </Stack.Navigator>
  );
}