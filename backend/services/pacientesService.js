const repository = require('../repository/pacientesRepository');

class PacienteService {
  static async getAll() {
    const pacientes = await repository.findAll();
    return pacientes;  // Já é um array de objetos Paciente
  }

  static async getById(id) {
    if (isNaN(id)) throw new Error('ID inválido.'); // Verificação de ID inválido
    const paciente = await repository.findById(id);
    if (!paciente) throw new Error('Paciente não encontrado.'); // Verificação se o paciente existe
    return paciente;  // Pode ser null ou um objeto Paciente
  }

  static async getByEmail(email) {
    const paciente = await repository.findByEmail(email);
    if (!paciente) throw new Error('Paciente não encontrado.'); // Verificação se o paciente existe
    return paciente;  // Pode ser null ou um objeto Paciente
  }

  static async create(dados) {
    const novoPaciente = await repository.create(dados);
    return novoPaciente;  // Retorna um objeto Paciente
  }

  static async atualizarFoto(id, caminhoImagem) {
    const paciente = await repository.findById(id);
    if (!paciente) {
      throw new Error('Paciente não encontrado.'); // Verificação se o paciente existe
    }
    await repository.atualizarFoto(id, caminhoImagem);
  }

  static async update(id, dados) {
    const pacienteAtualizado = await repository.update(id, dados);
    if (!pacienteAtualizado) throw new Error('Paciente não encontrado.'); // Verificação se o paciente existe
    return pacienteAtualizado;  // Retorna um objeto Paciente
  }

  static async updatePassword(id, senhaAtual, novaSenha) {
    const pacienteSenhaAtualizado = await repository.updatePassword(id, senhaAtual, novaSenha);
    return pacienteSenhaAtualizado;  // Retorna um objeto Paciente
  }

  static async desativar(id) {
    const paciente = await repository.desativar(id);
    if (!paciente) throw new Error('Paciente não encontrado para desativação'); // Verificação se o paciente existe
    return paciente;
  }

  static async remove(id) {
    const pacienteRemovido = await repository.remove(id);
    if (!pacienteRemovido) throw new Error('Paciente não encontrado para remoção.'); // Verificação se o paciente existe
    return pacienteRemovido;  // Retorna um objeto Paciente ou null
  }
}

module.exports = PacienteService;
