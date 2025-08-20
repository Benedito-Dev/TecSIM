const repository = require('../repository/bulaRepository');
const medicamentoRepository = require('../repository/medicamentoRepository');
const { ValidationError, NotFoundError, ConflictError, DatabaseError } = require('../utils/errors');

class BulaService {
  async create(data) {
    if (!data || typeof data !== 'object') {
      throw new ValidationError('Dados da bula inválidos.');
    }

    if (!data.id_medicamento || isNaN(Number(data.id_medicamento))) {
      throw new ValidationError('ID do medicamento é obrigatório e deve ser um número válido.');
    }

    // Verifica se medicamento existe
    const medicamentoExiste = await medicamentoRepository.findById(Number(data.id_medicamento));
    if (!medicamentoExiste) {
      throw new ValidationError('Medicamento não encontrado para o ID fornecido.');
    }

    try {
      const bula = await repository.create(data);
      return bula;
    } catch (err) {
      console.log('Erro no banco:', err);  // Para diagnosticar o erro real
      if (err.code === '23505') { // Violação de chave única
        throw new ConflictError('Bula já existe para este medicamento.');
      }
      throw new DatabaseError('Erro interno ao criar bula: ' + err.message);
    }
  }

  async findAll() {
    return await repository.findAll();
  }

  async findById(id) {
    if (isNaN(id)) {
      throw new ValidationError('ID inválido. Informe um número válido.');
    }

    const bula = await repository.findById(id);
    if (!bula) throw new NotFoundError('Bula não encontrada');
    return bula;
  }

  async findByMedicamentoId(id_medicamento) {
    if (isNaN(id_medicamento)) {
      throw new ValidationError('ID do medicamento inválido. Informe um número válido.');
    }

    const bula = await repository.findByMedicamentoId(id_medicamento);
    if (!bula) throw new NotFoundError('Bula não encontrada para este medicamento');
    return bula;
  }

  async update(id, data) {
    if (isNaN(id)) {
      throw new ValidationError('ID inválido. Informe um número válido.');
    }

    const bulaAtualizada = await repository.update(id, data);
    if (!bulaAtualizada) throw new NotFoundError('Bula não encontrada');
    return bulaAtualizada;
  }

  async remove(id) {
    if (isNaN(id)) {
      throw new ValidationError('ID inválido. Informe um número válido.');
    }

    const bulaRemovida = await repository.remove(id);
    if (!bulaRemovida) throw new NotFoundError('Bula não encontrada');
    return bulaRemovida;
  }
}

module.exports = new BulaService();
