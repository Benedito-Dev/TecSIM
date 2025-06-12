const repository = require('../repository/medicamentoRepository');

class MedicamentoService {
  async create(data) {
    return await repository.create(data);
  }

  async findAll() {
    return await repository.findAll();
  }
}

module.exports = new MedicamentoService();


