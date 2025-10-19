import api from '../api/api';

// 🟡 [POST] Envia mensagem para IA
export const enviarMensagemIA = async (mensagem, pacienteId = null) => {
  try {
    const response = await api.post('/chat/ia', {
      mensagem,
      pacienteId
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar mensagem para IA:', error.message);
    throw error;
  }
};

// 🟢 [GET] Busca histórico de chat por paciente
export const getHistoricoChat = async (pacienteId) => {
  try {
    const response = await api.get(`/chat/historico/${pacienteId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar histórico de chat do paciente ${pacienteId}:`, error.message);
    throw error;
  }
};

// 🟡 [POST] Salva conversa do chat
export const salvarConversa = async (pacienteId, mensagens) => {
  try {
    const response = await api.post('/chat/salvar', {
      pacienteId,
      mensagens
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao salvar conversa:', error.message);
    throw error;
  }
};