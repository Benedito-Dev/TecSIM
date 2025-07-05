const repository = require('../repository/bulaRepository');

class BulaService {
  async create(data) {
    const bula = await repository.create(data);
    return bula;
  }

  async findAll() {
    return await repository.findAll();
  }

  async findById(id) {
    const bula = await repository.findById(id);
    if (!bula) throw new Error('Bula não encontrada');
    return bula;
  }

  async findByMedicamentoId(id_medicamento) {
    const bula = await repository.findByMedicamentoId(id_medicamento);
    if (!bula) throw new Error('Bula não encontrada para este medicamento');
    return bula;
  }

  async update(id, data) {
    const bulaAtualizada = await repository.update(id, data);
    if (!bulaAtualizada) throw new Error('Bula não encontrada');
    return bulaAtualizada;
  }

  async remove(id) {
    const bulaRemovida = await repository.remove(id);
    if (!bulaRemovida) throw new Error('Bula não encontrada');
    return bulaRemovida;
  }
}

module.exports = new BulaService();
