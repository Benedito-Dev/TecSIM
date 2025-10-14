const db = require('../db/db');

class LembreteRepository {
  async findAll() {
    const result = await db.query('SELECT * FROM lembretes');
    return result.rows;
  }

  async findById(id) {
    const result = await db.query('SELECT * FROM lembretes WHERE id_lembrete = $1', [id]);
    return result.rows[0];
  }

  async create(data) {
    const {
      id_paciente,
      id_prescricao,
      id_medicamento,
      horario,
      data_inicio,
      data_fim,
      canal_envio,
      enviado
    } = data;

    const result = await db.query(
      `INSERT INTO lembretes (
        id_paciente, id_prescricao, id_medicamento,
        horario, data_inicio, data_fim, canal_envio, enviado
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *`,
      [id_paciente, id_prescricao, id_medicamento, horario, data_inicio, data_fim, canal_envio, enviado]
    );

    return result.rows[0];
  }

  async update(id, data) {
    const {
      id_paciente,
      id_prescricao,
      id_medicamento,
      horario,
      data_inicio,
      data_fim,
      canal_envio,
      enviado
    } = data;

    const result = await db.query(
      `UPDATE lembretes SET 
        id_paciente=$1, id_prescricao=$2, id_medicamento=$3,
        horario=$4, data_inicio=$5, data_fim=$6, canal_envio=$7, enviado=$8
      WHERE id_lembrete=$9 RETURNING *`,
      [id_paciente, id_prescricao, id_medicamento, horario, data_inicio, data_fim, canal_envio, enviado, id]
    );

    return result.rows[0];
  }

  async delete(id) {
    await db.query('DELETE FROM lembretes WHERE id_lembrete = $1', [id]);
  }
}

module.exports = new LembreteRepository();
