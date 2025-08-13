import api from '../api/api';

// 🟢 [GET] Lista todos os pacientes
export const getPacientes = async () => {
  try {
    const response = await api.get('/pacientes');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar pacientes:', error.message);
    throw error;
  }
};

// 🟢 [GET] Busca paciente por ID
export const getPacienteById = async (id) => {
  try {
    const response = await api.get(`/pacientes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar paciente ID ${id}:`, error.message);
    throw error;
  }
};

// 🟡 [POST] Cria um novo paciente
export const createPaciente = async (pacienteData) => {
  try {
    const response = await api.post('/pacientes', pacienteData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar paciente:', error.message);
    throw error;
  }
};

// 🟠 [PUT] Atualiza um paciente existente
export const updatePaciente = async (id, pacienteData) => {
  try {
    const response = await api.put(`/pacientes/${id}`, pacienteData);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar paciente ID ${id}:`, error.message);
    throw error;
  }
};

// 🔵 [PATCH] Atualiza a senha de um paciente existente
export const updatePassword = async (id, senhaAtual, novaSenha) => {
  try {
    const response = await api.patch(`/pacientes/${id}/password`, {
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

// 🟠 [Inative] Inativar um paciente
export const inativarPaciente = async (id) => {
  try {
    const response = await api.patch(`/pacientes/${id}/inativar`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao inativar paciente ID ${id}:`, error.message);
    throw error;
  }
}

// 🔴 [DELETE] Remove um paciente
export const deletePaciente = async (id) => {
  try {
    const response = await api.delete(`/pacientes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao deletar paciente ID ${id}:`, error.message);
    throw error;
  }
};

// 🟣 [POST] Upload de foto de perfil do paciente
export const uploadFotoPaciente = async (id, imagemFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imagemFile);

    const response = await api.post(`/pacientes/${id}/foto`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  } catch (error) {
    console.error(`Erro ao enviar imagem do paciente ID ${id}:`, error.message);
    throw error;
  }
};
