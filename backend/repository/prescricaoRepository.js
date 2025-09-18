const db = require('../db/db');
const Prescricao = require('../models/prescricaoModel');
const { NotFoundError, DatabaseError } = require('../utils/errors');

class PrescricaoRepository {
  constructor() {
    this.collection = null;
  }

  async findAll(client = db) {
    try {
      const result = await client.query('SELECT * FROM prescricoes');
      return result.rows.map(row => new Prescricao(row));
    } catch (err) {
      throw new DatabaseError('Erro ao buscar prescrições no banco');
    }
  }

  async findById(id_prescricao, client = db) {
    try {
      const result = await client.query(
        'SELECT * FROM prescricoes WHERE id = $1',
        [id_prescricao]
      );
      if (!result.rows[0]) throw new NotFoundError('Prescrição não encontrada');
      return new Prescricao(result.rows[0]);
    } catch (err) {
      if (err instanceof NotFoundError) throw err;
      throw new DatabaseError('Erro ao buscar prescrição no banco');
    }
  }

  async findByPacienteId(id_paciente, client = db) {
    try {
      const result = await client.query(
        'SELECT * FROM prescricoes WHERE id_paciente = $1',
        [id_paciente]
      );
      if (!result.rows.length) throw new NotFoundError('Nenhuma prescrição encontrada para este paciente');
      return result.rows.map(row => new Prescricao(row));
    } catch (err) {
      if (err instanceof NotFoundError) throw err;
      throw new DatabaseError('Erro ao buscar prescrições por paciente');
    }
  }

  async findByMedicoCrm(crm, client = db) {
    try {
      const result = await client.query(
        'SELECT * FROM prescricoes WHERE crm = $1',
        [crm]
      );
      if (!result.rows.length) throw new NotFoundError('Nenhuma prescrição encontrada para este médico');
      return result.rows.map(row => new Prescricao(row));
    } catch (err) {
      if (err instanceof NotFoundError) throw err;
      throw new DatabaseError('Erro ao buscar prescrições por médico');
    }
  }

  async create(data, client = db) {
    try {
      const result = await client.query(
        `INSERT INTO prescricoes 
         (id_paciente, crm, diagnostico, data_prescricao, validade)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [
          data.id_paciente, 
          data.crm, 
          data.diagnostico, 
          data.data_prescricao, 
          data.validade
        ]
      );
      return new Prescricao(result.rows[0]);
    } catch (err) {
      throw new DatabaseError('Erro ao criar prescrição no banco');
    }
  }

  async update(id_prescricao, data, client = db) {
    try {
      const result = await client.query(
        `UPDATE prescricoes SET
          id_paciente     = COALESCE($1, id_paciente),
          crm             = COALESCE($2, crm),
          diagnostico     = COALESCE($3, diagnostico),
          data_prescricao = COALESCE($4, data_prescricao),
          validade        = COALESCE($5, validade)
         WHERE id_prescricao = $6 
         RETURNING *`,
        [
          data.id_paciente || null, 
          data.crm || null, 
          data.diagnostico || null, 
          data.data_prescricao || null, 
          data.validade || null, 
          id_prescricao
        ]
      );
      if (!result.rows[0]) throw new NotFoundError('Prescrição não encontrada para atualização');
      return new Prescricao(result.rows[0]);
    } catch (err) {
      if (err instanceof NotFoundError) throw err;
      throw new DatabaseError('Erro ao atualizar prescrição');
    }
  }

  async remove(id_prescricao, client = db) {
    try {
      const result = await client.query(
        'DELETE FROM prescricoes WHERE id = $1 RETURNING *',
        [id_prescricao]
      );
      if (!result.rows[0]) throw new NotFoundError('Prescrição não encontrada para remoção');
      return new Prescricao(result.rows[0]);
    } catch (err) {
      if (err instanceof NotFoundError) throw err;
      throw new DatabaseError('Erro ao remover prescrição');
    }
  }
}

module.exports = new PrescricaoRepository();
