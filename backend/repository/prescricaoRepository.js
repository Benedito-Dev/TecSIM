const db = require('../db/db');
const Prescricao = require('../models/prescricaoModel');
const connectMongo = require('../db/mongo')
const { ObjectId } = require('mongodb');
const { NotFoundError, DatabaseError, ConflictError } = require('../utils/errors');

class PrescricaoRepository {
  constructor() {
    this.collection = null
  }

  async findDuplicate(pacienteId, medicamentoId, data) {
    try {
      const result = await db.query(
        `SELECT * FROM prescricoes 
         WHERE id_paciente = $1 
         AND id_medicamento = $2 
         AND data_prescricao = $3`,
        [pacienteId, medicamentoId, data]
      );
      return result.rows[0] || null;
    } catch (err) {
      throw new DatabaseError('Erro ao buscar prescrição duplicada');
    }
  }
  
  async findAll() {
    try {
      const result = await db.query('SELECT * FROM prescricoes');
      return result.rows.map(row => new Prescricao(row));
    } catch (err) {
      throw new DatabaseError('Erro ao buscar prescrições no banco');
    }
  }

  async findById(id) {
    try {
      const result = await db.query('SELECT * FROM prescricoes WHERE id = $1', [id]);
      if (!result.rows[0]) throw new NotFoundError('Prescrição não encontrada');
      return new Prescricao(result.rows[0]);
    } catch (err) {
      if (err instanceof NotFoundError) throw err;
      throw new DatabaseError('Erro ao buscar prescrição no banco');
    }
  }

  async findByPacienteId(id_paciente) {
    try {
      const result = await db.query('SELECT * FROM prescricoes WHERE id_paciente = $1', [id_paciente]);
      if (!result.rows.length) throw new NotFoundError('Nenhuma prescrição encontrada para este paciente');
      return result.rows.map(row => new Prescricao(row));
    } catch (err) {
      if (err instanceof NotFoundError) throw err;
      throw new DatabaseError('Erro ao buscar prescrições por paciente');
    }
  }

  async findByMedicoId(crm) {
    try {
      const result = await db.query('SELECT * FROM prescricoes WHERE crm = $1', [crm]);
      if (!result.rows.length) throw new NotFoundError('Nenhuma prescrição encontrada para este médico');
      return result.rows.map(row => new Prescricao(row));
    } catch (err) {
      if (err instanceof NotFoundError) throw err;
      throw new DatabaseError('Erro ao buscar prescrições por médico');
    }
  }

  async create(data) {
    try {
      // Primeiro verifica se já existe
      const existe = await this.findDuplicate(
        data.id_paciente, 
        data.medicamento_id, 
        data.data_prescricao
      );
      
      if (existe) {
        throw new ConflictError('Prescrição já existe');
      }

      const result = await db.query(
        `INSERT INTO prescricoes 
         (id_paciente, crm, diagnostico, data_prescricao, validade, id_medicamento)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [
          data.id_paciente, 
          data.crm, 
          data.diagnostico, 
          data.data_prescricao, 
          data.validade,
          data.medicamento_id
        ]
      );
      return new Prescricao(result.rows[0]);
    } catch (err) {
      if (err instanceof ConflictError) throw err;
      throw new DatabaseError('Erro ao criar prescrição no banco');
    }
  }

  async update(id, data) {
    try {
      const result = await db.query(
        `UPDATE prescricoes SET
          id_paciente = $1,
          crm = $2,
          diagnostico = $3,
          data_prescricao = $4,
          validade = $5
          WHERE id = $6 RETURNING *`,
        [data.id_paciente, data.crm, data.diagnostico, data.data_prescricao, data.validade, id]
      );
      if (!result.rows[0]) throw new NotFoundError('Prescrição não encontrada para atualização');
      return new Prescricao(result.rows[0]);
    } catch (err) {
      if (err instanceof NotFoundError) throw err;
      throw new DatabaseError('Erro ao atualizar prescrição');
    }
  }

  async remove(id) {
    try {
      const result = await db.query('DELETE FROM prescricoes WHERE id = $1 RETURNING *', [id]);
      if (!result.rows[0]) throw new NotFoundError('Prescrição não encontrada para remoção');
      return new Prescricao(result.rows[0]);
    } catch (err) {
      if (err instanceof NotFoundError) throw err;
      throw new DatabaseError('Erro ao remover prescrição');
    }
  }
}

module.exports = new PrescricaoRepository();
