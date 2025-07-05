import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DashboardScreen from '../screens/home/Dashboard/Dashboard';
import MedicineScreen from '../screens/home/Medicines/Medicines';
import BulaScreen from '../screens/home/Medicines/Bula/Bula';

const Stack = createNativeStackNavigator();

export default function DashboardStack() {
  return (
    <Stack.Navigator 
      initialRouteName="DashboardMain" 
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="DashboardMain" component={DashboardScreen} />
      <Stack.Screen name="Medicamentos" component={MedicineScreen} />
      <Stack.Screen name="Bula" component={BulaScreen} />
    </Stack.Navigator>
  );
}
