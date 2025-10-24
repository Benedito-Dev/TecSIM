const db = require('../db/db');
const PacienteCondicao = require('../models/pacienteCondicaoModel');

class PacienteCondicaoRepository {
  
  async buscarCondicoesPorPaciente(id_paciente) {
    const query = `
      SELECT * FROM paciente_condicoes 
      WHERE id_paciente = $1 AND ativo = true
      ORDER BY data_cadastro DESC
    `;
    
    const result = await db.query(query, [id_paciente]);
    return result.rows.map(row => new PacienteCondicao(row));
  }

  async adicionarCondicao(dadosCondicao) {
    const query = `
      INSERT INTO paciente_condicoes 
      (id_paciente, condicao, severidade, data_diagnostico, medicamentos_uso, observacoes)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const values = [
      dadosCondicao.id_paciente,
      dadosCondicao.condicao,
      dadosCondicao.severidade || 'leve',
      dadosCondicao.data_diagnostico,
      dadosCondicao.medicamentos_uso,
      dadosCondicao.observacoes
    ];
    
    const result = await db.query(query, values);
    return new PacienteCondicao(result.rows[0]);
  }

  async atualizarCondicao(id_condicao, dados) {
    const query = `
      UPDATE paciente_condicoes 
      SET severidade = $2, medicamentos_uso = $3, observacoes = $4
      WHERE id_condicao = $1
      RETURNING *
    `;
    
    const values = [id_condicao, dados.severidade, dados.medicamentos_uso, dados.observacoes];
    const result = await db.query(query, values);
    
    return result.rows.length > 0 ? new PacienteCondicao(result.rows[0]) : null;
  }

  async removerCondicao(id_condicao) {
    const query = `
      UPDATE paciente_condicoes 
      SET ativo = false 
      WHERE id_condicao = $1
      RETURNING *
    `;
    
    const result = await db.query(query, [id_condicao]);
    return result.rows.length > 0;
  }

  async buscarCondicoesPorTipo(condicao) {
    const query = `
      SELECT pc.*, p.nome as nome_paciente
      FROM paciente_condicoes pc
      JOIN paciente p ON pc.id_paciente = p.id
      WHERE pc.condicao = $1 AND pc.ativo = true
    `;
    
    const result = await db.query(query, [condicao]);
    return result.rows;
  }
}

module.exports = new PacienteCondicaoRepository();