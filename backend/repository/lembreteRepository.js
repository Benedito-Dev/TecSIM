const db = require('../db/db');
const Lembrete = require('../models/lembretesModel');

class LembreteRepository {
  async findAll() {
    const result = await db.query(`
      SELECT id_lembrete, id_paciente, id_prescricao, id_medicamento,
             horario, data_inicio, data_fim, canal_envio, enviado, status
      FROM lembretes
    `);
    return result.rows.map(row => new Lembrete(row));
  }

  async findById(id) {
    const result = await db.query(`
      SELECT id_lembrete, id_paciente, id_prescricao, id_medicamento,
             horario, data_inicio, data_fim, canal_envio, enviado, status
      FROM lembretes WHERE id_lembrete = $1
    `, [id]);

    return result.rows[0] ? new Lembrete(result.rows[0]) : null;
  }

  async findByPaciente(id_paciente) {
    const result = await db.query(`
      SELECT id_lembrete, id_paciente, id_prescricao, id_medicamento,
             horario, data_inicio, data_fim, canal_envio, enviado, status
      FROM lembretes WHERE id_paciente = $1
    `, [id_paciente]);

    return result.rows.map(row => new Lembrete(row));
  }

  async findByPrescricao(id_prescricao) {
    const result = await db.query(`
      SELECT id_lembrete, id_paciente, id_prescricao, id_medicamento,
             horario, data_inicio, data_fim, canal_envio, enviado, status
      FROM lembretes WHERE id_prescricao = $1
    `, [id_prescricao]);

    return result.rows.map(row => new Lembrete(row));
  }

  async findLembretesAtivos() {
    const result = await db.query(`
      SELECT id_lembrete, id_paciente, id_prescricao, id_medicamento,
             horario, data_inicio, data_fim, canal_envio, enviado, status
      FROM lembretes 
      WHERE status = TRUE
    `);

    return result.rows.map(row => new Lembrete(row));
  }

  async findLembretesPendentes() {
    const result = await db.query(`
      SELECT id_lembrete, id_paciente, id_prescricao, id_medicamento,
             horario, data_inicio, data_fim, canal_envio, enviado, status
      FROM lembretes 
      WHERE enviado = FALSE 
        AND status = TRUE
        AND data_inicio <= CURRENT_DATE 
        AND data_fim >= CURRENT_DATE
    `);

    return result.rows.map(row => new Lembrete(row));
  }

  async create(lembreteData) {
    const {
      id_paciente,
      id_prescricao,
      id_medicamento,
      horario,
      data_inicio,
      data_fim,
      canal_envio,
      enviado = false,
      status = true
    } = lembreteData;

    // Validar dados antes de criar
    const lembrete = new Lembrete({
      id_paciente,
      id_prescricao,
      id_medicamento,
      horario,
      data_inicio,
      data_fim,
      canal_envio,
      enviado,
      status
    });

    if (!lembrete.isValid()) {
      const error = new Error('Dados do lembrete inválidos');
      error.code = 400;
      throw error;
    }

    if (!lembrete.isCanalEnvioValido()) {
      const error = new Error('Canal de envio inválido. Use: email, sms, push ou whatsapp');
      error.code = 400;
      throw error;
    }

    const result = await db.query(
      `INSERT INTO lembretes (
        id_paciente, id_prescricao, id_medicamento,
        horario, data_inicio, data_fim, canal_envio, enviado, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id_lembrete, id_paciente, id_prescricao, id_medicamento,
                horario, data_inicio, data_fim, canal_envio, enviado, status`,
      [id_paciente, id_prescricao, id_medicamento, horario, data_inicio, data_fim, canal_envio, enviado, status]
    );

    return new Lembrete(result.rows[0]);
  }

  async update(id, lembreteData) {
    const {
      id_paciente,
      id_prescricao,
      id_medicamento,
      horario,
      data_inicio,
      data_fim,
      canal_envio,
      enviado,
      status
    } = lembreteData;

    // Validar dados antes de atualizar
    const lembrete = new Lembrete({
      id_paciente,
      id_prescricao,
      id_medicamento,
      horario,
      data_inicio,
      data_fim,
      canal_envio,
      enviado,
      status
    });

    if (!lembrete.isValid()) {
      const error = new Error('Dados do lembrete inválidos');
      error.code = 400;
      throw error;
    }

    if (!lembrete.isCanalEnvioValido()) {
      const error = new Error('Canal de envio inválido. Use: email, sms, push ou whatsapp');
      error.code = 400;
      throw error;
    }

    const result = await db.query(
      `UPDATE lembretes SET 
        id_paciente = $1, id_prescricao = $2, id_medicamento = $3,
        horario = $4, data_inicio = $5, data_fim = $6, 
        canal_envio = $7, enviado = $8, status = $9
      WHERE id_lembrete = $10 
      RETURNING id_lembrete, id_paciente, id_prescricao, id_medicamento,
                horario, data_inicio, data_fim, canal_envio, enviado, status`,
      [id_paciente, id_prescricao, id_medicamento, horario, data_inicio, data_fim, canal_envio, enviado, status, id]
    );

    return result.rows[0] ? new Lembrete(result.rows[0]) : null;
  }

  async marcarComoEnviado(id) {
    const result = await db.query(
      `UPDATE lembretes SET enviado = TRUE 
       WHERE id_lembrete = $1 
       RETURNING id_lembrete, id_paciente, id_prescricao, id_medicamento,
                 horario, data_inicio, data_fim, canal_envio, enviado, status`,
      [id]
    );

    return result.rows[0] ? new Lembrete(result.rows[0]) : null;
  }

  async atualizarStatus(id, status) {
    const result = await db.query(
      `UPDATE lembretes SET status = $1 
       WHERE id_lembrete = $2 
       RETURNING id_lembrete, id_paciente, id_prescricao, id_medicamento,
                 horario, data_inicio, data_fim, canal_envio, enviado, status`,
      [status, id]
    );

    return result.rows[0] ? new Lembrete(result.rows[0]) : null;
  }

  async resetarEnvios(id_paciente = null) {
    if (id_paciente) {
      const result = await db.query(
        `UPDATE lembretes SET enviado = FALSE 
         WHERE id_paciente = $1 AND status = TRUE
         RETURNING id_lembrete, id_paciente, id_prescricao, id_medicamento,
                   horario, data_inicio, data_fim, canal_envio, enviado, status`,
        [id_paciente]
      );
      return result.rows.map(row => new Lembrete(row));
    } else {
      const result = await db.query(
        `UPDATE lembretes SET enviado = FALSE 
         WHERE status = TRUE
         RETURNING id_lembrete, id_paciente, id_prescricao, id_medicamento,
                   horario, data_inicio, data_fim, canal_envio, enviado, status`
      );
      return result.rows.map(row => new Lembrete(row));
    }
  }

  async delete(id) {
    const result = await db.query(
      `DELETE FROM lembretes 
       WHERE id_lembrete = $1 
       RETURNING id_lembrete, id_paciente, id_prescricao, id_medicamento,
                 horario, data_inicio, data_fim, canal_envio, enviado, status`,
      [id]
    );

    return result.rows[0] ? new Lembrete(result.rows[0]) : null;
  }

  async deleteByPaciente(id_paciente) {
    const result = await db.query(
      `DELETE FROM lembretes 
       WHERE id_paciente = $1 
       RETURNING id_lembrete, id_paciente, id_prescricao, id_medicamento,
                 horario, data_inicio, data_fim, canal_envio, enviado, status`,
      [id_paciente]
    );

    return result.rows.map(row => new Lembrete(row));
  }
}

module.exports = new LembreteRepository();