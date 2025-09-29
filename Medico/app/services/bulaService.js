import api from '../api/api'

export const getBulaPorMedicamento = async (id) => {
  try {
    const response = await api.get(`/bulas/medicamento/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar bula do medicamento', {
      message: error.message,
    });
  }
};
