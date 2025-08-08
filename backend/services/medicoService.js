const repository = require('../repository/medicoRepository');

class MedicoService {
  static async getAll() {
    const medicos = await repository.findAll();
    return medicos;
  }

  static async getById(id) {
    if (isNaN(id)) throw new Error('ID inválido.');
    const medico = await repository.findById(id);
    if (!medico) throw new Error('Médico não encontrado.');
    return medico;
  }

  static async getByEmail(email) {
    const medico = await repository.findByEmail(email);
    if (!medico) throw new Error('Médico não encontrado.');
    return medico;
  }

  static async getByCrm(crm) {
    const medico = await repository.findByCrm(crm);
    if (!medico) throw new Error('Médico não encontrado.');
    return medico;
  }

  static async getByEspecialidade(especialidade) {
    const medicos = await repository.findByEspecialidade(especialidade);
    if (medicos.length === 0) throw new Error('Nenhum médico encontrado para esta especialidade.');
    return medicos;
  }

  static async create(dados) {
    const novoMedico = await repository.create(dados);
    return novoMedico;
  }

  static async update(id, dados) {
    const medicoAtualizado = await repository.update(id, dados);
    if (!medicoAtualizado) throw new Error('Médico não encontrado.');
    return medicoAtualizado;
  }

  static async updatePassword(id, senhaAtual, novaSenha) {
    const medicoSenhaAtualizada = await repository.updatePassword(id, senhaAtual, novaSenha);
    return medicoSenhaAtualizada;
  }

  static async remove(id) {
    const medicoRemovido = await repository.remove(id);
    if (!medicoRemovido) throw new Error('Médico não encontrado.');
    return medicoRemovido;
  }
}

module.exports = MedicoService;
