// src/screens/Dashboard/Dashboard.js
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getCurrentUser, isAuthenticated } from '../../src/services/authService';
import TabMenu from '../../components/AppTabs';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      try {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
          return;
        }

        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Erro:', error);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoad();
  }, [navigation]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return <TabMenu />;
}