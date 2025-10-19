import api from '../api/api';

// 🟢 [GET] Lista todos os alertas
export const getAlertas = async () => {
  try {
    const response = await api.get('/alertas');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar alertas:', error.message);
    throw error;
  }
};

// 🟢 [GET] Busca alertas por prioridade
export const getAlertasByPrioridade = async (prioridade) => {
  try {
    const response = await api.get(`/alertas/prioridade/${prioridade}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar alertas de prioridade ${prioridade}:`, error.message);
    throw error;
  }
};

// 🟢 [GET] Busca alertas por paciente
export const getAlertasByPaciente = async (pacienteId) => {
  try {
    const response = await api.get(`/alertas/paciente/${pacienteId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar alertas do paciente ${pacienteId}:`, error.message);
    throw error;
  }
};

// 🟠 [PATCH] Marca alerta como resolvido
export const resolverAlerta = async (id) => {
  try {
    const response = await api.patch(`/alertas/${id}/resolver`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao resolver alerta ID ${id}:`, error.message);
    throw error;
  }
};