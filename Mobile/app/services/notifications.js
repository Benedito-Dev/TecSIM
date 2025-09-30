import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import messaging from '@react-native-firebase/messaging';

// Função única para inicializar notificações
export async function setupNotifications() {
  if (!Device.isDevice) {
    console.log('Push notifications funcionam apenas em dispositivo físico!');
    return null;
  }

  // Pedir permissão
  const authStatus = await Notifications.requestPermissionsAsync();
  const granted =
    authStatus.status === 'granted' || authStatus.status === 'provisional';

  if (!granted) {
    console.log('Permissão para notificações negada!');
    return null;
  }

  // Pegar token FCM
  const fcmToken = await messaging().getToken();
  console.log('FCM Token:', fcmToken);

  // Listener para mensagens em foreground
  messaging().onMessage(async remoteMessage => {
    console.log('Mensagem recebida:', remoteMessage);
    Notifications.presentNotificationAsync({
      title: remoteMessage.notification?.title,
      body: remoteMessage.notification?.body,
    });
  });

  return fcmToken;
}

// Função de teste: envia notificação local
export async function testWaterNotification() {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '💧 Hora de beber água!',
        body: 'Esta é uma notificação de teste.',
      },
      trigger: null, // dispara imediatamente
    });
    return true;
  } catch (error) {
    console.error('Erro ao enviar notificação de teste:', error);
    return false;
  }
}
