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

  async search(searchTerm) {
    if (!searchTerm || typeof searchTerm !== 'string' || searchTerm.trim().length < 2) {
      throw new ValidationError('Termo de busca deve ter pelo menos 2 caracteres.');
    }

    try {
      const medicamentos = await repository.search(searchTerm.trim());
      
      if (!Array.isArray(medicamentos) || medicamentos.length === 0) {
        throw new NotFoundError('Nenhum medicamento encontrado para o termo de busca.');
      }
      
      return medicamentos;
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw err;
      }
      throw new DatabaseError('Erro interno ao buscar medicamentos.');
    }
  }

  async findById(id) {
    if (!id || isNaN(Number(id))) {
      throw new ValidationError('ID inválido.');
    }
    
    try {
      const medicamento = await repository.findById(id);
      if (!medicamento) throw new NotFoundError('Medicamento não encontrado.');
      return medicamento;
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw err;
      }
      throw new DatabaseError('Erro interno ao buscar medicamento.');
    }
  }

  async update(id, data) {
    if (!id || isNaN(Number(id))) {
      throw new ValidationError('ID inválido.');
    }
    if (!data || typeof data !== 'object') {
      throw new ValidationError('Dados do medicamento inválidos.');
    }
    
    try {
      const medicamentoUpdated = await repository.update(id, data);
      if (!medicamentoUpdated) throw new NotFoundError('Medicamento não encontrado.');
      return medicamentoUpdated;
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw err;
      }
      throw new DatabaseError('Erro interno ao atualizar medicamento.');
    }
  }

  async remove(id) {
    if (!id || isNaN(Number(id))) {
      throw new ValidationError('ID inválido.');
    }
    
    try {
      const medicamentoRemoved = await repository.remove(id);
      if (!medicamentoRemoved) throw new NotFoundError('Medicamento não encontrado.');
      return medicamentoRemoved;
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw err;
      }
      throw new DatabaseError('Erro interno ao remover medicamento.');
    }
  }
}

module.exports = new MedicamentoService();