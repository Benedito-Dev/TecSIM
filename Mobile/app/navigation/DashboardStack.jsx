import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DashboardScreen from '../Pages/clinic/Dashboard/Dashboard';
import MedicineScreen from '../Pages/clinic/Medicines/Medicines';
import BulaScreen from '../Pages/clinic/Medicines/Bula/Bula';
import PrescricaoScreen from '../Pages/clinic/Prescricao/Prescricao';
import NovaPrescricaoScreen from '../Pages/clinic/NovaPrescricao/NovaPrescricao';
import PrescricaoManualScreen from '../Pages/clinic/PrescricaoManual/PrescricaoManual';
import LembretesScreen from '../Pages/clinic/Lembretes/LembreteScreen';

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
