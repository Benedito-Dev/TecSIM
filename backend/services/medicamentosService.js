const repository = require('../repository/medicamentoRepository');
const { ValidationError, NotFoundError, ConflictError, DatabaseError } = require('../utils/errors');

class MedicamentoService {
  async create(data) {
    if (!data || typeof data !== 'object') {
      throw new ValidationError('Dados do medicamento inválidos.');
    }

    if (!data.nome || typeof data.nome !== 'string' || !data.nome.trim()) {
      throw new ValidationError('O campo "nome" é obrigatório e deve ser uma string válida.');
    }

    try {
      const medicamento = await repository.create(data);
      return medicamento;
    } catch (err) {
      if (err.code === '23505') {
        // Violação de chave única, erro de conflito (409)
        throw new ConflictError('Medicamento já cadastrado.');
      }
      // Erro inesperado do banco
      throw new DatabaseError('Erro interno ao criar medicamento.');
    }
  }

  async findAll() {
    const medicamentos = await repository.findAll();
    if (!Array.isArray(medicamentos) || medicamentos.length === 0) {
      throw new NotFoundError('Nenhum medicamento encontrado.');
    }
    return medicamentos;
  }

  async findById(id) {
    if (!id || isNaN(Number(id))) {
      throw new ValidationError('ID inválido.');
    }
    const medicamento = await repository.findById(id);
    if (!medicamento) throw new NotFoundError('Medicamento não encontrado.');
    return medicamento;
  }

  async update(id, data) {
    if (!id || isNaN(Number(id))) {
      throw new ValidationError('ID inválido.');
    }
    if (!data || typeof data !== 'object') {
      throw new ValidationError('Dados do medicamento inválidos.');
    }
    const medicamentoUpdated = await repository.update(id, data);
    if (!medicamentoUpdated) throw new NotFoundError('Medicamento não encontrado.');
    return medicamentoUpdated;
  }

  async remove(id) {
    if (!id || isNaN(Number(id))) {
      throw new ValidationError('ID inválido.');
    }
    const medicamentoRemoved = await repository.remove(id);
    if (!medicamentoRemoved) throw new NotFoundError('Medicamento não encontrado.');
    return medicamentoRemoved;
  }
}

module.exports = new MedicamentoService();
