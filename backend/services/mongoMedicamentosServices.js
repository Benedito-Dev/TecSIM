const repository = require('../repository/medicamentoRepository')

class MedicamentoService {
  async create(data) {
    const medicamento = await repository.create(data);
    return medicamento
  }

  async findAll() {
    return await repository.findAll();
  }

  async findById(id) {
    const medicamento = await repository.findById(id);
    if (!medicamento) throw new Error('medicamentoicamento não encontrado');
    return medicamento;
  }

  async update(id, data) {
    const medicamentoUpdated = await repository.update(id, data);
    if (!medicamentoUpdated) throw new Error('medicamentoicamento não encontrado');
    return medicamentoUpdated;
  }

  async remove(id) {
    const medicamentoRemoved = await repository.remove(id);
    if (!medicamentoRemoved) throw new Error('medicamentoicamento não encontrado');
    return medicamentoRemoved;
  }
}

module.exports = new MedicamentoService();


