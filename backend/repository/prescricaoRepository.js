const db = require('../db/db');
const Prescricao = require('../models/prescricaoModel');

class PrescricaoRepository {
  async findAll() {
    const result = await db.query('SELECT * FROM prescricoes');
    return result.rows.map(row => new Prescricao(row));
  }

  async findById(id) {
    const result = await db.query('SELECT * FROM prescricoes WHERE id = $1', [id]);
    return result.rows[0] ? new Prescricao(result.rows[0]) : null;
  }

  async findByPacienteId(id_paciente) {
    const result = await db.query('SELECT * FROM prescricoes WHERE id_paciente = $1', [id_paciente]);
    return result.rows.map(row => new Prescricao(row));
  }

  async findByMedicoId(id_medico) {
    const result = await db.query('SELECT * FROM prescricoes WHERE id_medico = $1', [id_medico]);
    return result.rows.map(row => new Prescricao(row));
  }

  async create({
    id_paciente,
    id_medico,
    crm,
    diagnostico,
    data_prescricao,
    validade
  }) {
    const result = await db.query(
      `INSERT INTO prescricoes 
       (id_paciente, id_medico, crm, diagnostico, data_prescricao, validade)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [id_paciente, id_medico, crm, diagnostico, data_prescricao, validade]
    );
    return new Prescricao(result.rows[0]);
  }

  async update(id, {
    id_paciente,
    id_medico,
    crm,
    diagnostico,
    data_prescricao,
    validade
  }) {
    const result = await db.query(
      `UPDATE prescricoes SET
       id_paciente = $1,
       id_medico = $2,
       crm = $3,
       diagnostico = $4,
       data_prescricao = $5,
       validade = $6
       WHERE id = $7
       RETURNING *`,
      [id_paciente, id_medico, crm, diagnostico, data_prescricao, validade, id]
    );
    return result.rows[0] ? new Prescricao(result.rows[0]) : null;
  }

  async remove(id) {
    const result = await db.query(
      'DELETE FROM prescricoes WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0] ? new Prescricao(result.rows[0]) : null;
  }
}

module.exports = new PrescricaoRepository();
