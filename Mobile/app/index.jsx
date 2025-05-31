// index.jsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import WelcomeScreen from "./screens/AuthWelcome/AuthWelcome";
import Login from "./screens/Login/Login";
import Register from "./screens/Register/Register";
import Dashboard from "./screens/Dashboard/Dashboard";
import EmailRecovery from './screens/EmailRecovery/EmailRecovery'

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Stack.Navigator initialRouteName="AuthWelcome" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AuthWelcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="EmailRecovery" component={EmailRecovery} />
    </Stack.Navigator>
  );
}
