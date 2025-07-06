// navigation/ProfileStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProfileScreen from '../screens/home/Profile/Profile';
import EditProfileScreen from '../screens/home/Profile/Edit-Profile/edit-Profile';
import PrivacyScreen from '../screens/home/Profile/PrivacyProfile/PrivacyScreen';

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
    </Stack.Navigator>
  );
}
