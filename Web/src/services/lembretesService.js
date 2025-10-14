import api from '../api/api';

// 🟢 [GET] Lista todos os lembretes
export const getLembretes = async () => {
  try {
    const response = await api.get('/lembretes');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar lembretes:', error.message);
    throw error;
  }
};

// 🟢 [GET] Busca lembrete por ID
export const getLembreteById = async (id) => {
  try {
    const response = await api.get(`/lembretes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar lembrete ID ${id}:`, error.message);
    throw error;
  }
};

// 🟡 [POST] Cria um novo lembrete
export const createLembrete = async (lembreteData) => {
  try {
    const response = await api.post('/lembretes', lembreteData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar lembrete:', error.message);
    throw error;
  }
};

// 🟠 [PUT] Atualiza um lembrete existente
export const updateLembrete = async (id, lembreteData) => {
  try {
    const response = await api.put(`/lembretes/${id}`, lembreteData);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar lembrete ID ${id}:`, error.message);
    throw error;
  }
};

// 🔵 [PATCH] Atualiza status de envio do lembrete (enviado true/false)
export const updateStatusEnvio = async (id, enviado) => {
  try {
    const response = await api.patch(`/lembretes/${id}/status`, { enviado });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Falha ao atualizar status');
    } else if (error.request) {
      throw new Error('Sem resposta do servidor');
    } else {
      throw new Error('Erro ao configurar a requisição');
    }
  }
};

// 🔴 [DELETE] Remove um lembrete
export const deleteLembrete = async (id) => {
  try {
    const response = await api.delete(`/lembretes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao deletar lembrete ID ${id}:`, error.message);
    throw error;
  }
};

// 🟣 [GET] Busca lembretes de um paciente específico
export const getLembretesByPaciente = async (idPaciente) => {
  try {
    const response = await api.get(`/lembretes/paciente/${idPaciente}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar lembretes do paciente ID ${idPaciente}:`, error.message);
    throw error;
  }
};
