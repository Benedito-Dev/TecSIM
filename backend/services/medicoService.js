const repository = require('../repository/medicoRepository');

class MedicoService {
  static async getAll() {
    const medicos = await repository.findAll();
    return medicos;
  }

  static async getById(id) {
    const medico = await repository.findById(id);
    return medico;
  }

  static async getByEmail(email) {
    const medico = await repository.findByEmail(email);
    return medico;
  }

  static async getByCrm(crm) {
    const medico = await repository.findByCrm(crm);
    return medico;
  }

  static async getByEspecialidade(especialidade) {
    const medico = await repository.findByEspecialidade(especialidade);
    return medico
  }

  static async create(dados) {
    const novoMedico = await repository.create(dados);
    console.log(dados)
    return novoMedico;
  }

  static async update(id, dados) {
    const medicoAtualizado = await repository.update(id, dados);
    return medicoAtualizado;
  }

  static async updatePassword(id, senhaAtual, novaSenha) {
    const medicoSenhaAtualizada = await repository.updatePassword(id, senhaAtual, novaSenha);
    return medicoSenhaAtualizada
  }

  static async verifyCredentials(email, senha) {
    const medico = await repository.verifyCredentials(email, senha);
    return medico;
  }

  static async remove(id) {
    const medicoRemovido = await repository.remove(id);
    return medicoRemovido;;
  }
}

module.exports = MedicoService;