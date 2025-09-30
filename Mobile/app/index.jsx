import React, { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import AppNavigator from './navigation/AppNavigator';
import { setupNotifications, testWaterNotification } from './services/notifications';

export default function App() {
  useEffect(() => {
    // Inicializar notificações ao abrir o app
    const initializeNotifications = async () => {
      try {
        console.log('💧 Inicializando notificações...');
        const token = await setupNotifications();

        if (token) {
          console.log('✅ Notificações ativadas! FCM Token:', token);
        } else {
          console.log('⚠️ Notificações não ativadas');
        }
      } catch (error) {
        console.error('❌ Erro ao inicializar notificações:', error);
      }
    };

    initializeNotifications();

    // 🔥 Teste rápido: disparar notificação local em 3 segundos
    const testTimeout = setTimeout(async () => {
      try {
        console.log('🧪 Enviando notificação de teste...');
        const success = await testWaterNotification();
        console.log(success ? '✅ Notificação de teste enviada!' : '❌ Falha no teste');
      } catch (error) {
        console.error('❌ Erro no teste de notificação:', error);
      }
    }, 3000);

    // Cleanup caso o componente desmonte
    return () => clearTimeout(testTimeout);

  }, []);

  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
