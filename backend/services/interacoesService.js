const repository = require('../repository/interacoesRepository');

class InteracaoMedicamentosService {
  static async getAll() {
    const interacoes = await repository.findAll();
    return interacoes; // Array de objetos InteracaoMedicamentos
  }

  static async getById(id) {
    const interacao = await repository.findById(id);
    return interacao; // Pode ser null ou um objeto InteracaoMedicamentos
  }

  static async create(dados) {
    const novaInteracao = await repository.create(dados);
    return novaInteracao; // Objeto InteracaoMedicamentos criado
  }

  static async update(id, dados) {
    const interacaoAtualizada = await repository.update(id, dados);
    return interacaoAtualizada; // Objeto atualizado ou null
  }

  static async remove(id) {
    const interacaoRemovida = await repository.remove(id);
    return interacaoRemovida; // Objeto removido ou null
  }
}

module.exports = InteracaoMedicamentosService;
