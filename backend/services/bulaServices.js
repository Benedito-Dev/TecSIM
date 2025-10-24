const BulaRepository = require('../repository/bulaRepository');
const MedicamentoRepository = require('../repository/medicamentoRepository');
const { ValidationError, NotFoundError, ConflictError, DatabaseError } = require('../utils/errors');
const Bula = require('../models/bulaModel');

class BulaService {
  static async create(bulaData) {
    try {
      // Validação básica
      if (!bulaData || typeof bulaData !== 'object') {
        throw new ValidationError('Dados da bula são obrigatórios');
      }

      const { id_medicamento } = bulaData;

      // Validação do ID do medicamento
      if (!id_medicamento || isNaN(Number(id_medicamento))) {
        throw new ValidationError('ID do medicamento é obrigatório e deve ser um número válido');
      }

      // Verifica se medicamento existe
      const medicamento = await MedicamentoRepository.findById(id_medicamento);
      if (!medicamento) {
        throw new ValidationError('Medicamento não encontrado');
      }

      // Cria a bula
      const novaBula = await BulaRepository.create(bulaData);
      return novaBula;

    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }

      if (error.code === '23505') { // Código de violação de unique constraint
        throw new ConflictError('Já existe uma bula para este medicamento');
      }

      console.error('Erro no banco:', error);
      throw new DatabaseError('Erro interno do banco de dados');
    }
  }

  static async findAll() {
    try {
      return await BulaRepository.findAll();
    } catch (error) {
      console.error('Erro no banco:', error);
      throw new DatabaseError('Erro interno do banco de dados');
    }
  }

  static async findById(id) {
    try {
      // Validação do ID
      if (!id || isNaN(Number(id))) {
        throw new ValidationError('ID inválido');
      }

      const bula = await BulaRepository.findById(Number(id));
      return bula;

    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }

      console.error('Erro no banco:', error);
      throw new DatabaseError('Erro interno do banco de dados');
    }
  }

  static async findByMedicamentoId(medicamentoId) {
    try {
      // Validação do ID do medicamento
      if (!medicamentoId || isNaN(Number(medicamentoId))) {
        throw new ValidationError('ID do medicamento inválido');
      }

      const bula = await BulaRepository.findByMedicamentoId(Number(medicamentoId));
      
      if (!bula) {
        throw new NotFoundError('Bula não encontrada para este medicamento');
      }

      return bula;

    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }

      console.error('Erro no banco:', error);
      throw new DatabaseError('Erro interno do banco de dados');
    }
  }

  static async update(id, bulaData) {
    try {
      // Validação do ID
      if (!id || isNaN(Number(id))) {
        throw new ValidationError('ID inválido');
      }

      // Validação dos dados
      if (!bulaData || typeof bulaData !== 'object') {
        throw new ValidationError('Dados de atualização são obrigatórios');
      }

      const bulaAtualizada = await BulaRepository.update(Number(id), bulaData);
      
      if (!bulaAtualizada) {
        throw new NotFoundError('Bula não encontrada');
      }

      return bulaAtualizada;

    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }

      console.error('Erro no banco:', error);
      throw new DatabaseError('Erro interno do banco de dados');
    }
  }

  static async remove(id) {
    try {
      // Validação do ID
      if (!id || isNaN(Number(id))) {
        throw new ValidationError('ID inválido');
      }

      const bulaRemovida = await BulaRepository.remove(Number(id));
      
      if (!bulaRemovida) {
        throw new NotFoundError('Bula não encontrada');
      }

      return bulaRemovida;

    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }

      console.error('Erro no banco:', error);
      throw new DatabaseError('Erro interno do banco de dados');
    }
  }
}

module.exports = BulaService;