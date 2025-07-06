import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DashboardScreen from '../screens/home/Dashboard/Dashboard';
import MedicineScreen from '../screens/home/Medicines/Medicines';
import BulaScreen from '../screens/home/Medicines/Bula/Bula';
import PrescricaoScreen from '../screens/home/Prescricao/Prescricao';
import NovaPrescricaoScreen from '../screens/home/NovaPrescricao/NovaPrescricao';
import PrescricaoManualScreen from '../screens/home/PrescricaoManual/PrescricaoManual';
import LembretesScreen from '../screens/home/Lembretes/LembreteScreen';

const Stack = createNativeStackNavigator();

export default function DashboardStack() {
  return (
    <Stack.Navigator 
      initialRouteName="DashboardMain" 
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="DashboardMain" component={DashboardScreen} />
      <Stack.Screen name="Lembretes" component={LembretesScreen} />
      <Stack.Screen name="Medicamentos" component={MedicineScreen} />
      <Stack.Screen name="Bula" component={BulaScreen} />
      <Stack.Screen name="Prescricao" component={PrescricaoScreen} />
      <Stack.Screen name="NovaPrescricao" component={NovaPrescricaoScreen} />
      <Stack.Screen name="PrescricaoManual" component={PrescricaoManualScreen} options={{ title: 'Prescrição Manual' }}/>
    </Stack.Navigator>
  );
}
