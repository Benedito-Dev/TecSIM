const repository = require('../repository/medicamentoRepository');

class MedicamentoService {
  async create(data) {
    try {
      const medicamento = await repository.create(data);
      return medicamento;
    } catch (err) {
      if (err.code === '23505') {
        throw err; // ou throw um erro customizado mantendo err.code
      }

      throw new Error('Erro ao criar medicamento: ' + err.message);
    }
  }

  async findAll() {
    return await repository.findAll();
  }

  async findById(id) {
    const medicamento = await repository.findById(id);
    if (!medicamento) throw new Error('Medicamento não encontrado');
    return medicamento;
  }

  async update(id, data) {
    const medicamentoUpdated = await repository.update(id, data);
    if (!medicamentoUpdated) throw new Error('Medicamento não encontrado');
    return medicamentoUpdated;
  }

  async remove(id) {
    const medicamentoRemoved = await repository.remove(id);
    if (!medicamentoRemoved) throw new Error('Medicamento não encontrado');
    return medicamentoRemoved;
  }
}

module.exports = new MedicamentoService();
