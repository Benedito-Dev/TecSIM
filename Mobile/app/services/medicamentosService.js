import api from '../api/api';

// 🟢 [GET] Lista todos os medicamentos
export const getMedicamentos = async () => {
  try {
    const response = await api.get('/medicamentos');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar medicamentos:', error.message);
    throw error;
  }
};

// 🟢 [GET] Busca medicamento por ID
export const getMedicamentoById = async (id) => {
  try {
    const response = await api.get(`/medicamentos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar medicamento ID ${id}:`, error.message);
    throw error;
  }
};

// 🟡 [POST] Cria um novo medicamento
export const createMedicamento = async (medicamentoData) => {
  try {
    const response = await api.post('/medicamentos', medicamentoData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar medicamento:', error.message);
    throw error;
  }
};

// 🟠 [PUT] Atualiza um medicamento existente
export const updateMedicamento = async (id, medicamentoData) => {
  try {
    const response = await api.put(`/medicamentos/${id}`, medicamentoData);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar medicamento ID ${id}:`, error.message);
    throw error;
  }
};

// 🔴 [DELETE] Remove um medicamento
export const deleteMedicamento = async (id) => {
  try {
    const response = await api.delete(`/medicamentos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao deletar medicamento ID ${id}:`, error.message);
    throw error;
  }
};
