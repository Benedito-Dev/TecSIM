import React, { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import AppNavigator from './navigation/AppNavigator';
import { setupNotifications } from './services/notifications';

export default function App() {
  useEffect(() => {
    // Inicializar notificações quando o app abrir
    const initializeNotifications = async () => {
      try {
        console.log('💧 Inicializando lembretes de água...');
        const token = await setupNotifications();
        
        if (token) {
          console.log('✅ Lembretes de água ativados!');
        } else {
          console.log('⚠️ Lembretes não ativados');
        }
      } catch (error) {
        console.error('❌ Erro nos lembretes:', error);
      }
    };

    initializeNotifications();

    // 🔥 TESTE: Notificação em 3 segundos (REMOVA DEPOIS DO TESTE)
    setTimeout(async () => {
      try {
        console.log('🧪 Testando notificação em 3 segundos...');
        const { testWaterNotification } = await import('./services/notifications');
        const success = await testWaterNotification();
        
        if (success) {
          console.log('✅ Teste de notificação enviado!');
        } else {
          console.log('❌ Teste de notificação falhou');
        }
      } catch (error) {
        console.error('❌ Erro no teste:', error);
      }
    }, 3000); // ⏰ 3 segundos

  }, []);

  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}