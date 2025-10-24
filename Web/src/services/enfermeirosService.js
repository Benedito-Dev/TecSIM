import api from '../api/api';

// 🟢 [GET] Lista todos os enfermeiros
export const getEnfermeiros = async () => {
  try {
    const response = await api.get('/enfermeiros');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar enfermeiros:', error.message);
    throw error;
  }
};

// 🟢 [GET] Busca enfermeiro por ID
export const getEnfermeiroById = async (id) => {
  try {
    const response = await api.get(`/enfermeiros/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar enfermeiro ID ${id}:`, error.message);
    throw error;
  }
};

// 🟢 [GET] Busca enfermeiro por email
export const getEnfermeiroByEmail = async (email) => {
  try {
    const response = await api.get(`/enfermeiros/email/${email}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar enfermeiro por email ${email}:`, error.message);
    throw error;
  }
};

// 🟢 [GET] Busca enfermeiro por COREN
export const getEnfermeiroByCoren = async (registro_coren) => {
  try {
    const response = await api.get(`/enfermeiros/coren/${registro_coren}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar enfermeiro por COREN ${registro_coren}:`, error.message);
    throw error;
  }
};

// 🟡 [POST] Cria um novo enfermeiro
export const createEnfermeiro = async (enfermeiroData) => {
  try {
    const response = await api.post('/enfermeiros', enfermeiroData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar enfermeiro:', error.message);
    throw error;
  }
};

// 🟡 [POST] Cria múltiplos enfermeiros em lote
export const createEnfermeirosBatch = async (enfermeirosData) => {
  try {
    const response = await api.post('/enfermeiros/batch', enfermeirosData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar enfermeiros em lote:', error.message);
    throw error;
  }
};

// 🟠 [PUT] Atualiza um enfermeiro existente
export const updateEnfermeiro = async (id, enfermeiroData) => {
  try {
    const response = await api.put(`/enfermeiros/${id}`, enfermeiroData);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar enfermeiro ID ${id}:`, error.message);
    throw error;
  }
};

// 🔵 [PATCH] Atualiza a senha de um enfermeiro existente
export const updatePasswordEnfermeiro = async (id, senhaAtual, novaSenha) => {
  try {
    const response = await api.patch(`/enfermeiros/${id}/password`, {
      senhaAtual,
      novaSenha
    });

    return response.data;
  } catch (error) {
    // Melhor tratamento de erro com mensagens mais específicas
    if (error.response) {
      // Erro vindo do servidor
      throw new Error(error.response.data.message || 'Falha ao atualizar senha');
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      throw new Error('Sem resposta do servidor');
    } else {
      // Erro ao configurar a requisição
      throw new Error('Erro ao configurar a requisição');
    }
  }
};

// 🟠 [PATCH] Desativar um enfermeiro
export const desativarEnfermeiro = async (id) => {
  try {
    const response = await api.patch(`/enfermeiros/${id}/desativar`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao desativar enfermeiro ID ${id}:`, error.message);
    throw error;
  }
};

// 🟠 [PATCH] Reativar um enfermeiro
export const reativarEnfermeiro = async (id) => {
  try {
    const response = await api.patch(`/enfermeiros/${id}/reativar`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao reativar enfermeiro ID ${id}:`, error.message);
    throw error;
  }
};

// 🔴 [DELETE] Remove um enfermeiro
export const deleteEnfermeiro = async (id) => {
  try {
    const response = await api.delete(`/enfermeiros/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao deletar enfermeiro ID ${id}:`, error.message);
    throw error;
  }
};

// 🟣 [POST] Upload de foto de perfil do enfermeiro
export const uploadFotoEnfermeiro = async (id, imagemFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imagemFile);

    const response = await api.post(`/enfermeiros/${id}/foto`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  } catch (error) {
    console.error(`Erro ao enviar imagem do enfermeiro ID ${id}:`, error.message);
    throw error;
  }
};

// 🔍 [GET] Busca enfermeiros por termo (nome, email, COREN, especialidade)
export const searchEnfermeiros = async (searchTerm) => {
  try {
    const response = await api.get(`/enfermeiros/search?q=${encodeURIComponent(searchTerm)}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar enfermeiros por termo "${searchTerm}":`, error.message);
    throw error;
  }
};

// 🔍 [GET] Busca enfermeiros ativos
export const getEnfermeirosAtivos = async () => {
  try {
    const response = await api.get('/enfermeiros/ativos');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar enfermeiros ativos:', error.message);
    throw error;
  }
};