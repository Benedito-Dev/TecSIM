const db = require('../db/db');
const InteracaoMedicamentos = require('../models/interacoesModel');

class InteracaoMedicamentosRepository {
  // Buscar todas as interações medicamentosas
  async findAll() {
    const result = await db.query(`
      SELECT id, medicamento_a_id, medicamento_b_id, descricao_interacao, nivel_risco 
      FROM interacoes_medicamentosas
    `);

    return result.rows.map(row => new InteracaoMedicamentos(row));
  }

  // Buscar uma interação por ID
  async findById(id) {
    const result = await db.query(`
      SELECT id, medicamento_a_id, medicamento_b_id, descricao_interacao, nivel_risco 
      FROM interacoes_medicamentosas 
      WHERE id = $1
    `, [id]);

    return result.rows[0] ? new InteracaoMedicamentos(result.rows[0]) : null;
  }

  // Criar nova interação medicamentosa
  async create({ medicamento_a_id, medicamento_b_id, descricao, nivel_risco }) {
    const result = await db.query(`
      INSERT INTO interacoes_medicamentosas 
      (medicamento_a_id, medicamento_b_id, descricao, nivel_risco) 
      VALUES ($1, $2, $3, $4) 
      RETURNING id, medicamento_a_id, medicamento_b_id, descricao, nivel_risco
    `, [medicamento_a_id, medicamento_b_id, descricao, nivel_risco]);

    return new InteracaoMedicamentos(result.rows[0]);
  }

  // Atualizar uma interação existente
  async update(id, { medicamento_a_id, medicamento_b_id, descricao_interacao, nivel_risco }) {
    const result = await db.query(`
      UPDATE interacoes_medicamentosas 
      SET medicamento_a_id = $1, medicamento_b_id = $2, descricao_interacao = $3, nivel_risco = $4 
      WHERE id = $5 
      RETURNING id, medicamento_a_id, medicamento_b_id, descricao_interacao, nivel_risco
    `, [medicamento_a_id, medicamento_b_id, descricao_interacao, nivel_risco, id]);

    return result.rows[0] ? new InteracaoMedicamentos(result.rows[0]) : null;
  }

  // Remover uma interação por ID
  async remove(id) {
    const result = await db.query(`
      DELETE FROM interacoes_medicamentosas 
      WHERE id = $1 
      RETURNING id, medicamento_a_id, medicamento_b_id, descricao_interacao, nivel_risco
    `, [id]);

    return result.rows[0] ? new InteracaoMedicamentos(result.rows[0]) : null;
  }
}

module.exports = new InteracaoMedicamentosRepository();
