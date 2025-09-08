import api from '../api/api';

// 🟢 [GET] Lista todas as prescrições
export const getPrescricoes = async () => {
  try {
    const response = await api.get('/prescricoes');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar prescrições:', error.message);
    throw error;
  }
};

// 🟢 [GET] Busca prescrição por ID
export const getPrescricaoById = async (id) => {
  try {
    const response = await api.get(`/prescricoes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar prescrição ID ${id}:`, error.message);
    throw error;
  }
};

// 🟢 [GET] Busca prescrições por paciente
export const getPrescricoesByPaciente = async (id_paciente) => {
  try {
    const response = await api.get(`/prescricoes/paciente/${id_paciente}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar prescrições do paciente ${id_paciente}:`, error.message);
    throw error;
  }
};

// 🟢 [GET] Busca prescrições por médico
export const getPrescricoesByMedico = async (crm) => {
  try {
    const response = await api.get(`/prescricoes/medico/${crm}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar prescrições do médico ${crm}:`, error.message);
    throw error;
  }
};

// 🟡 [POST] Cria uma nova prescrição
export const createPrescricao = async (prescricaoData) => {
  try {
    const response = await api.post('/prescricoes', prescricaoData);
    return response.data;
  } catch (error) {
    // Tratamento de erro mais específico
    if (error.response) {
      const errorMsg = error.response.data.error || 'Erro ao criar prescrição';
      console.error('Erro detalhado:', errorMsg);
      throw new Error(errorMsg);
    } else if (error.request) {
      throw new Error('Sem resposta do servidor');
    } else {
      throw new Error('Erro ao configurar a requisição');
    }
  }
};

// 🟠 [PUT] Atualiza uma prescrição existente
export const updatePrescricao = async (id, prescricaoData) => {
  try {
    const response = await api.put(`/prescricoes/${id}`, prescricaoData);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar prescrição ID ${id}:`, error.message);
    throw error;
  }
};

// 🔴 [DELETE] Remove uma prescrição
export const deletePrescricao = async (id) => {
  try {
    const response = await api.delete(`/prescricoes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao deletar prescrição ID ${id}:`, error.message);
    throw error;
  }
};

// 🟣 [GET] Busca medicamentos de uma prescrição
export const getMedicamentosPrescricao = async (id_prescricao) => {
  try {
    const response = await api.get(`/prescricoes/${id_prescricao}/medicamentos`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar medicamentos da prescrição ${id_prescricao}:`, error.message);
    throw error;
  }
};

// 🟣 [POST] Adiciona medicamento a uma prescrição
export const addMedicamentoPrescricao = async (id_prescricao, medicamentoData) => {
  try {
    const response = await api.post(`/prescricoes/${id_prescricao}/medicamentos`, medicamentoData);
    return response.data;
  } catch (error) {
    console.error(`Erro ao adicionar medicamento à prescrição ${id_prescricao}:`, error.message);
    throw error;
  }
};

// 🟣 [DELETE] Remove medicamento de uma prescrição
export const removeMedicamentoPrescricao = async (id_prescricao, id_medicamento) => {
  try {
    const response = await api.delete(`/prescricoes/${id_prescricao}/medicamentos/${id_medicamento}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao remover medicamento ${id_medicamento} da prescrição ${id_prescricao}:`, error.message);
    throw error;
  }
};