const repository = require('../repository/prescricaoRepository');
const { ConflictError } = require('../utils/errors');


class PrescricaoService {
  async findAll() {
    return await repository.findAll();
  }

  async findById(id) {
    return await repository.findById(id);
  }

  async findByPacienteId(id_paciente) {
    return await repository.findByPacienteId(id_paciente);
  }

  async findByMedicoId(crm) {
    return await repository.findByMedicoId(crm);
  }

  async create(data) {
    return await repository.create(data);
  }

  async update(id, data) {
    return await repository.update(id, data);
  }

  async remove(id) {
    return await repository.remove(id);
  }
}

module.exports = new PrescricaoService();
