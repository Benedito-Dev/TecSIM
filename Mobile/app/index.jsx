<<<<<<< HEAD
// index.jsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import WelcomeScreen from "./screens/AuthWelcome/AuthWelcome";
import Login from "./screens/Login/Login";
import Register from "./screens/Register/Register";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Stack.Navigator initialRouteName="AuthWelcome" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AuthWelcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
=======
import React from 'react';
import { AuthProvider } from './context/AuthContext';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
>>>>>>> 5-feature-Reestruturando-Banco-De-Dados
  );
}