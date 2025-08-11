const db = require('../db/db');
const Prescricao = require('../models/prescricaoModel');

class PrescricaoRepository {
  async findAll() {
    const result = await db.query('SELECT * FROM prescricoes');
    return result.rows.map(row => new Prescricao(row));
  }

  async findDuplicate(pacienteId, medicamentoId, data) {
    return await this.collection.findOne({
      pacienteId: new ObjectId(pacienteId),
      medicamentoId: new ObjectId(medicamentoId),
      data: data
    });
  }

  async findById(id) {
    const result = await db.query('SELECT * FROM prescricoes WHERE id = $1', [id]);
    return result.rows[0] ? new Prescricao(result.rows[0]) : null;
  }

  async findByPacienteId(id_paciente) {
    const result = await db.query('SELECT * FROM prescricoes WHERE id_paciente = $1', [id_paciente]);
    return result.rows.map(row => new Prescricao(row));
  }

  async findByMedicoId(crm) {
    const result = await db.query('SELECT * FROM prescricoes WHERE crm = $1', [crm]);
    return result.rows.map(row => new Prescricao(row));
  }

  async create({
    id_paciente,
    crm,
    diagnostico,
    data_prescricao,
    validade
  }) {
    const result = await db.query(
      `INSERT INTO prescricoes 
       (id_paciente, crm, diagnostico, data_prescricao, validade)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [id_paciente, crm, diagnostico, data_prescricao, validade]
    );
    return new Prescricao(result.rows[0]);
  }

  async update(id, {
    id_paciente,
    crm,
    diagnostico,
    data_prescricao,
    validade
  }) {
    const result = await db.query(
      `UPDATE prescricoes SET
       id_paciente = $1,
       crm = $2,
       diagnostico = $3,
       data_prescricao = $4,
       validade = $5
       WHERE id = $6
       RETURNING *`,
      [id_paciente, crm, diagnostico, data_prescricao, validade, id]
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
