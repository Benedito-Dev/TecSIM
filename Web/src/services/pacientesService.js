import api from '../api/api';

class PacientesService {
  async getAll() {
    const response = await api.get('/pacientes');
    return response.data;
  }

  async getById(id) {
    const response = await api.get(`/pacientes/${id}`);
    return response.data;
  }

  async update(id, dados) {
    const response = await api.put(`/pacientes/${id}`, dados);
    return response.data;
  }
}

export default new PacientesService();
