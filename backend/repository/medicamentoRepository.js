const db = require('../db/db');

class MedicamentoRepository {
  constructor() {
    this.tableName = 'medicamentos';
  }

  async create(data) {
    const {
      nome,
      tipo,
      descricao,
      faixa_etaria_minima,
      faixa_etaria_maxima,
      contraindicacoes,
      interacoes_comuns,
      composicao,
      dosagem_padrao,
      bula_detalhada
    } = typeof data === 'string' ? JSON.parse(data) : data;
    
    const result = await db.query(`
      INSERT INTO ${this.tableName} 
      (
        nome, tipo, descricao, faixa_etaria_minima, faixa_etaria_maxima,
        contraindicacoes, interacoes_comuns, composicao, dosagem_padrao, bula_detalhada
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING 
        id_medicamento, nome, tipo, descricao, faixa_etaria_minima, 
        faixa_etaria_maxima, contraindicacoes, interacoes_comuns, 
        composicao, dosagem_padrao, bula_detalhada
    `, [
      nome, tipo, descricao, faixa_etaria_minima, faixa_etaria_maxima,
      contraindicacoes, interacoes_comuns, composicao, dosagem_padrao, bula_detalhada
    ]);

    return result.rows[0];
  }

  async findAll() {
    const result = await db.query(`
      SELECT 
        id_medicamento, nome, tipo, descricao, faixa_etaria_minima, 
        faixa_etaria_maxima, contraindicacoes, interacoes_comuns, 
        composicao, dosagem_padrao, bula_detalhada
      FROM ${this.tableName}
    `);
    
    console.log('Medicamentos encontrados:', result.rows.length);
    return result.rows;
  }

  async findById(id) {
    const result = await db.query(`
      SELECT 
        id_medicamento, nome, tipo, descricao, faixa_etaria_minima, 
        faixa_etaria_maxima, contraindicacoes, interacoes_comuns, 
        composicao, dosagem_padrao, bula_detalhada
      FROM ${this.tableName} 
      WHERE id = $1
    `, [id]);
    
    console.log('Medicamento buscado por ID:', result.rows[0]);
    return result.rows[0];
  }

  async update(id, data) {
    const {
      nome,
      tipo,
      descricao,
      faixa_etaria_minima,
      faixa_etaria_maxima,
      contraindicacoes,
      interacoes_comuns,
      composicao,
      dosagem_padrao,
      bula_detalhada
    } = typeof data === 'string' ? JSON.parse(data) : data;
    
    const result = await db.query(`
      UPDATE ${this.tableName} 
      SET 
        nome = $1,
        tipo = $2,
        descricao = $3,
        faixa_etaria_minima = $4,
        faixa_etaria_maxima = $5,
        contraindicacoes = $6,
        interacoes_comuns = $7,
        composicao = $8,
        dosagem_padrao = $9,
        bula_detalhada = $10
      WHERE id_medicamento = $11
      RETURNING 
        id_medicamento, nome, tipo, descricao, faixa_etaria_minima, 
        faixa_etaria_maxima, contraindicacoes, interacoes_comuns, 
        composicao, dosagem_padrao, bula_detalhada
    `, [
      nome, tipo, descricao, faixa_etaria_minima, faixa_etaria_maxima,
      contraindicacoes, interacoes_comuns, composicao, dosagem_padrao, bula_detalhada,
      id
    ]);
    
    console.log('Medicamento atualizado:', result.rows[0]);
    return result.rows[0];
  }

  async remove(id) {
    console.log('Removendo medicamento com ID:', id);
    
    const result = await db.query(`
      DELETE FROM ${this.tableName} 
      WHERE id_medicamento = $1
      RETURNING id
    `, [id]);
    
    return { id: result.rows[0]?.id };
  }

  // Métodos adicionais específicos para medicamentos
  async findByNome(nome) {
    const result = await db.query(`
      SELECT 
        id_medicamento, nome, tipo, descricao
      FROM ${this.tableName} 
      WHERE nome ILIKE $1
    `, [`%${nome}%`]);
    
    return result.rows;
  }

  async findByTipo(tipo) {
    const result = await db.query(`
      SELECT 
        id_medicamento, nome, tipo, descricao
      FROM ${this.tableName} 
      WHERE tipo = $1
    `, [tipo]);
    
    return result.rows;
  }

  async findByFaixaEtaria(idade) {
    const result = await db.query(`
      SELECT 
        id_medicamento, nome, tipo, 
        faixa_etaria_minima, faixa_etaria_maxima
      FROM ${this.tableName} 
      WHERE faixa_etaria_minima <= $1 
      AND faixa_etaria_maxima >= $1
    `, [idade]);
    
    return result.rows;
  }

  async searchByComposicao(termo) {
    const result = await db.query(`
      SELECT 
        id_medicamento, nome, tipo, composicao
      FROM ${this.tableName} 
      WHERE composicao ILIKE $1
    `, [`%${termo}%`]);
    
    return result.rows;
  }
}

module.exports = new MedicamentoRepository();