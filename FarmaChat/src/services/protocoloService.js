import api from '../api/api';

// 🟢 [GET] Lista todos os protocolos
export const getProtocolos = async () => {
  try {
    const response = await api.get('/protocolos');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar protocolos:', error.message);
    throw error;
  }
};

// 🟢 [GET] Busca protocolo por ID
export const getProtocoloById = async (id) => {
  try {
    const response = await api.get(`/protocolos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar protocolo ID ${id}:`, error.message);
    throw error;
  }
};

// 🟢 [GET] Busca protocolos por paciente
export const getProtocolosByPaciente = async (pacienteId) => {
  try {
    const response = await api.get(`/protocolos/paciente/${pacienteId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar protocolos do paciente ${pacienteId}:`, error.message);
    throw error;
  }
};

// 🟡 [POST] Cria um novo protocolo
export const createProtocolo = async (protocoloData) => {
  try {
    const response = await api.post('/protocolos', protocoloData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar protocolo:', error.message);
    throw error;
  }
};

// 🟠 [PUT] Atualiza um protocolo existente
export const updateProtocolo = async (id, protocoloData) => {
  try {
    const response = await api.put(`/protocolos/${id}`, protocoloData);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar protocolo ID ${id}:`, error.message);
    throw error;
  }
};