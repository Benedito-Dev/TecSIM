import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

// Configurar comportamento das notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Inicializar notificações
export const setupNotifications = async () => {
  try {
    // Verificar se é dispositivo físico
    if (!Device.isDevice) {
      console.log('📱 Notificações só funcionam em dispositivos físicos');
      return null;
    }

    // Pedir permissão
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('❌ Permissão para notificações negada');
      return null;
    }

    // Pegar token Expo Push
    const token = (await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    })).data;

    console.log('✅ Notificações de água configuradas!');
    
    // INICIAR NOTIFICAÇÕES DE ÁGUA AUTOMATICAMENTE
    startWaterReminders();
    
    return token;

  } catch (error) {
    console.error('❌ Erro ao configurar notificações:', error);
    return null;
  }
};

// NOTIFICAÇÕES ESPECÍFICAS PARA ÁGUA
export const startWaterReminders = () => {
  console.log('💧 Iniciando lembretes de água...');
  
  // Cancelar notificações antigas primeiro
  Notifications.cancelAllScheduledNotificationsAsync();
  
  // AGENDAR NOTIFICAÇÕES DE ÁGUA (8h às 22h, a cada 2 horas)
  const waterMessages = [
    "💧 Hora de se hidratar! Uma água vai bem agora?",
    "🚰 Lembrete de água: seu corpo agradece cada gole!",
    "💦 Não espere ter sede! Tome um copo de água.",
    "🌊 Momento de hidratação! Sua saúde em primeiro lugar.",
    "🥤 Pausa para água: seu organismo precisa de líquidos!",
    "💧 Hidrate-se! Água é essencial para seu bem-estar.",
    "🚰 Hora de recarregar! Tome um copo de água.",
    "💦 Lembrete amigo: está na hora de tomar água!"
  ];
  
  // Agendar para vários horários do dia
  const reminderTimes = [8, 10, 12, 14, 16, 18, 20]; // Horários (7 notificações/dia)
  
  reminderTimes.forEach((hour, index) => {
    const messageIndex = index % waterMessages.length;
    const message = waterMessages[messageIndex];
    
    // Calcular segundos até o próximo horário
    const now = new Date();
    const targetTime = new Date();
    targetTime.setHours(hour, 0, 0, 0);
    
    // Se já passou do horário hoje, agenda para amanhã
    if (now > targetTime) {
      targetTime.setDate(targetTime.getDate() + 1);
    }
    
    const secondsUntilTarget = (targetTime - now) / 1000;
    
    // Agendar notificação única que se repete diariamente
    Notifications.scheduleNotificationAsync({
      content: {
        title: '💧 Lembrete de Água',
        body: message,
        sound: true,
        priority: 'high',
      },
      trigger: {
        seconds: secondsUntilTarget,
        repeats: true, // Repete diariamente
      },
    });
    
    console.log(`⏰ Lembrete de água agendado para ${hour}h`);
  });
  
  console.log('✅ Lembretes de água configurados para o dia!');
};

// Função para parar todas as notificações de água
export const stopWaterReminders = () => {
  Notifications.cancelAllScheduledNotificationsAsync();
  console.log('⏹️ Lembretes de água parados');
};

// Testar notificação de água imediata
export const testWaterNotification = async () => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '💧 Teste de Lembrete de Água',
        body: 'Funcionou! Você receberá lembretes regulares para se hidratar.',
        sound: true,
      },
      trigger: null, // Imediato
    });
    return true;
  } catch (error) {
    console.error('Erro no teste:', error);
    return false;
  }
};