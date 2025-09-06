import api from '../api/api';

// 🟢 [GET] Lista medicamentos com filtros e paginação
export const getMedicamentos = async (params = {}) => {
  try {
    const response = await api.get(`/medicamentos`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar medicamentos:', error.message);
    throw error;
  }
};

// 🟢 [GET] Busca medicamentos por termo (para autocomplete)
export const searchMedicamentos = async (searchTerm = '') => {
  try {
    if (!searchTerm || searchTerm.length < 2) {
      return []; // Não buscar com menos de 2 caracteres
    }
    
    const response = await api.get(`/medicamentos/search?q=${encodeURIComponent(searchTerm)}`);
    
    // A API retorna { data: [], pagination: {} } - precisamos extrair o array data
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('Erro ao buscar medicamentos:', error.message);
    
    // Em caso de erro, retornar array vazio para não quebrar o autocomplete
    return [];
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