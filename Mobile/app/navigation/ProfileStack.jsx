// navigation/ProfileStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProfileScreen from '../Pages/clinic/Profile/Profile';
import EditProfileScreen from '../Pages/clinic/Profile/Edit-Profile/edit-Profile';
import PrivacyScreen from '../Pages/clinic/Profile/PrivacyProfile/PrivacyScreen';
import ChangePassword from '../Pages/clinic/Profile/PrivacyProfile/ChangePassword/ChangePassword'
import HelpScreen from '../Pages/clinic/Profile/Help/Help';
import AjustesScreen from '../Pages/clinic/Profile/Settings/Settings';

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator 
      initialRouteName="ProfileHome" 
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="ProfileHome" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} />
      <Stack.Screen name="Help" component={HelpScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="Ajustes" component={AjustesScreen} />
    </Stack.Navigator>
  );
}
