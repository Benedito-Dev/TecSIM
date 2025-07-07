const repository = require('../repository/prescricaoRepository');

class PrescricaoService {
  async findAll() {
    return await repository.findAll();
  }

  async findById(id) {
    const prescricao = await repository.findById(id);
    if (!prescricao) throw new Error('Prescrição não encontrada');
    return prescricao;
  }

  async findByPacienteId(id_paciente) {
    const prescricoes = await repository.findByPacienteId(id_paciente);
    if (prescricoes.length === 0) throw new Error('Nenhuma prescrição encontrada para este paciente');
    return prescricoes;
  }

  async findByMedicoId(id_medico) {
    const prescricoes = await repository.findByMedicoId(id_medico);
    if (prescricoes.length === 0) throw new Error('Nenhuma prescrição encontrada para este médico');
    return prescricoes;
  }

  async create(data) {
    return await repository.create(data); // data inclui: id_paciente, id_medico, crm, diagnostico, data_prescricao, validade
  }

  async update(id, data) {
    const prescricao = await repository.update(id, data);
    if (!prescricao) throw new Error('Prescrição não encontrada para atualização');
    return prescricao;
  }

  async remove(id) {
    const prescricao = await repository.remove(id);
    if (!prescricao) throw new Error('Prescrição não encontrada para remoção');
    return prescricao;
  }
}

module.exports = new PrescricaoService();
