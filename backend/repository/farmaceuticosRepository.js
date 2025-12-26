const db = require('../db/db');
const bcrypt = require('bcrypt');
const Farmaceutico = require('../models/farmaceuticoModel');

const SALT_ROUNDS = 10;

class FarmaceuticosRepository {
  async findAll() {
    const result = await db.query(`
      SELECT id, nome, email, telefone, registro_crf, cargo, unidade, turno, data_admissao, especialidade, anos_experiencia, status, foto_perfil, data_cadastro, ativo
      FROM farmaceuticos
    `);
    return result.rows.map(row => new Farmaceutico(row));
  }

  async findById(id) {
    const result = await db.query(`
      SELECT * FROM farmaceuticos WHERE id = $1
    `, [id]);
    return result.rows[0] ? new Farmaceutico(result.rows[0]) : null;
  }

  async findByEmail(email) {
    const result = await db.query(`
      SELECT * FROM farmaceuticos WHERE email = $1
    `, [email]);
    return result.rows[0] ? new Farmaceutico(result.rows[0]) : null;
  }

  async findByCRF(registro_crf) {
    const result = await db.query(`
      SELECT * FROM farmaceuticos WHERE registro_crf = $1
    `, [registro_crf]);
    return result.rows[0] ? new Farmaceutico(result.rows[0]) : null;
  }

  async create({ nome, email, senha, telefone, registro_crf, cargo, unidade, turno, data_admissao, especialidade, anos_experiencia, status }) {
    const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);

    const result = await db.query(`
      INSERT INTO farmaceuticos 
      (nome, email, senha, telefone, registro_crf, cargo, unidade, turno, data_admissao, especialidade, anos_experiencia, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *
    `, [nome, email, senhaHash, telefone, registro_crf, cargo, unidade, turno, data_admissao, especialidade, anos_experiencia, status]);

    return new Farmaceutico(result.rows[0]);
  }

  async update(id, { nome, email, telefone, cargo, unidade, turno, data_admissao, especialidade, anos_experiencia, status }) {
    const result = await db.query(`
      UPDATE farmaceuticos
      SET nome=$1, email=$2, telefone=$3, cargo=$4, unidade=$5, turno=$6, data_admissao=$7, especialidade=$8, anos_experiencia=$9, status=$10, data_atualizacao=NOW()
      WHERE id=$11
      RETURNING *
    `, [nome, email, telefone, cargo, unidade, turno, data_admissao, especialidade, anos_experiencia, status, id]);

    return result.rows[0] ? new Farmaceutico(result.rows[0]) : null;
  }

  async atualizarFoto(id, caminho) {
    await db.query('UPDATE farmaceuticos SET foto_perfil = $1 WHERE id = $2', [caminho, id]);
  }

  async updatePassword(id, senhaAtual, novaSenha) {
    const result = await db.query('SELECT senha FROM farmaceuticos WHERE id = $1', [id]);
    if (!result.rows[0]) {
      const error = new Error('Farmacêutico não encontrado.');
      error.code = 404;
      throw error;
    }

    const senhaMatch = await bcrypt.compare(senhaAtual, result.rows[0].senha);
    if (!senhaMatch) {
      const error = new Error('Senha atual incorreta.');
      error.code = 401;
      throw error;
    }

    if (senhaAtual === novaSenha) {
      const error = new Error('A nova senha deve ser diferente da atual.');
      error.code = 400;
      throw error;
    }

    const novaSenhaHash = await bcrypt.hash(novaSenha, SALT_ROUNDS);

    const updateResult = await db.query(`
      UPDATE farmaceuticos SET senha = $1, data_atualizacao = NOW()
      WHERE id = $2 RETURNING *
    `, [novaSenhaHash, id]);

    return new Farmaceutico(updateResult.rows[0]);
  }

  async verifyCredentials(email, senha) {
      const result = await db.query(`
        SELECT * FROM farmaceuticos WHERE email = $1
      `, [email]);
      
      const farmaceuticoRaw = result.rows[0];
      
      if (!farmaceuticoRaw) {
        const error = new Error('Credenciais inválidas');
        error.code = 401;
        throw error;
      }

      console.log(farmaceuticoRaw)

      console.log('Senha fornecida:', senha);
      console.log('Senha esperada: Teste123456');

      const senhaMatch = await bcrypt.compare(senha, farmaceuticoRaw.senha);
      console.log('Senha match:', senhaMatch);
      
      if (!senhaMatch) {
        const error = new Error('Credenciais inválidas');
        error.code = 401;
        throw error;
      }

      if (farmaceuticoRaw.ativo === false) {
        const error = new Error('Conta desativada');
        error.code = 403;
        throw error;
      }

      const { senha: _, ...farmaceuticoSemSenha } = farmaceuticoRaw;
      return new Farmaceutico(farmaceuticoSemSenha);
  }

  async debugSenha(email) {
    const result = await db.query(`SELECT senha FROM farmaceuticos WHERE email = $1`, [email]);
    return result.rows[0];
  }

  async desativar(id) {
    const result = await db.query(`
      UPDATE farmaceuticos SET ativo = FALSE, status = 'Inativo', data_atualizacao = NOW()
      WHERE id = $1 RETURNING *
    `, [id]);
    return result.rows[0] ? new Farmaceutico(result.rows[0]) : null;
  }

  async reativar(id) {
    const result = await db.query(`
      UPDATE farmaceuticos SET ativo = TRUE, status = 'Ativo', data_atualizacao = NOW()
      WHERE id = $1 RETURNING *
    `, [id]);
    return result.rows[0] ? new Farmaceutico(result.rows[0]) : null;
  }

  async remove(id) {
    const result = await db.query(`
      DELETE FROM farmaceuticos WHERE id = $1 RETURNING *
    `, [id]);
    return result.rows[0] ? new Farmaceutico(result.rows[0]) : null;
  }

  async search(searchTerm) {
    const result = await db.query(`
      SELECT id, nome, email, telefone, registro_crf, cargo, unidade, turno, data_admissao, especialidade, anos_experiencia, status, foto_perfil, data_cadastro, ativo
      FROM farmaceuticos 
      WHERE nome ILIKE $1 
         OR email ILIKE $1 
         OR registro_crf ILIKE $1 
         OR cargo ILIKE $1 
         OR especialidade ILIKE $1
    `, [`%${searchTerm}%`]);
    
    return result.rows.map(row => new Farmaceutico(row));
  }
}

module.exports = new FarmaceuticosRepository();
