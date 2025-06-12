const repositorysitory = require('../repositorysitory/medicamentorepositorysitory');

class MedicamentoService {
  async create(data) {
    return await repository.create(data);
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


