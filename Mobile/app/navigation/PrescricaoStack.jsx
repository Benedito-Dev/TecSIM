// navigation/ProfileStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import PrescricaoScreen from '../screens/home/Prescricao/Prescricao';
import NovaPrescricaoScreen from '../screens/home/NovaPrescricao/NovaPrescricao';
import PrescricaoManualScreen from '../screens/home/PrescricaoManual/PrescricaoManual';


const Stack = createNativeStackNavigator();

export default function PrescricaoStack() {
  return (
    <Stack.Navigator 
      initialRouteName="Prescricao" 
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Prescricao" component={PrescricaoScreen} />
      <Stack.Screen name="NovaPrescricao" component={NovaPrescricaoScreen} />
      <Stack.Screen name="PrescricaoManual" component={PrescricaoManualScreen} options={{ title: 'Prescrição Manual' }}/>
    </Stack.Navigator>
  );
}
