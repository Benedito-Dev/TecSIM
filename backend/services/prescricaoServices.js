const repository = require('../repository/prescricaoRepository');
const { ConflictError, NotFoundError } = require('../utils/errors');

class PrescricaoService {
  async findAll() {
    return await repository.findAll();
  }

  async findById(id) {
    const prescricao = await repository.findById(id);
    if (!prescricao) throw new NotFoundError('Prescrição não encontrada');
    return prescricao;
  }

  async findByPacienteId(id_paciente) {
    const prescricoes = await repository.findByPacienteId(id_paciente);
    if (!prescricoes || prescricoes.length === 0) {
      throw new NotFoundError('Nenhuma prescrição encontrada para este paciente');
    }
    return prescricoes;
  }

  async findByMedicoId(crm) {
    const prescricoes = await repository.findByMedicoId(crm);
    if (!prescricoes || prescricoes.length === 0) {
      throw new NotFoundError('Nenhuma prescrição encontrada para este médico');
    }
    return prescricoes;
  }

  async create(data) {
    const existe = await repository.findDuplicate(data);
    if (existe) {
      throw new ConflictError('Prescrição já existe');
    }

    return await repository.create(data);
  }

  async update(id, data) {
    const prescricao = await repository.update(id, data);
    if (!prescricao) throw new NotFoundError('Prescrição não encontrada para atualização');
    return prescricao;
  }

  async remove(id) {
    const prescricao = await repository.remove(id);
    if (!prescricao) throw new NotFoundError('Prescrição não encontrada para remoção');
    return prescricao;
  }
}

module.exports = new PrescricaoService();
