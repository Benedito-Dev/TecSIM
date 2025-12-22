const db = require('../db/db');
const bcrypt = require('bcrypt');
const Enfermeiro = require('../models/enfermeiroModel');

const SALT_ROUNDS = 10;

class EnfermeirosRepository {
  async findAll() {
    const result = await db.query(`
      SELECT id, nome, email, telefone, registro_coren, cargo, unidade, turno, data_admissao, especialidade, anos_experiencia, status, foto_perfil, data_cadastro, ativo
      FROM enfermeiros
    `);
    return result.rows.map(row => new Enfermeiro(row));
  }

  async findById(id) {
    const result = await db.query(`
      SELECT * FROM enfermeiros WHERE id = $1
    `, [id]);
    return result.rows[0] ? new Enfermeiro(result.rows[0]) : null;
  }

  async findByEmail(email) {
    const result = await db.query(`
      SELECT * FROM enfermeiros WHERE email = $1
    `, [email]);
    return result.rows[0] ? new Enfermeiro(result.rows[0]) : null;
  }

  async findByCOREN(registro_coren) {
    const result = await db.query(`
      SELECT * FROM enfermeiros WHERE registro_coren = $1
    `, [registro_coren]);
    return result.rows[0] ? new Enfermeiro(result.rows[0]) : null;
  }

  async create({ nome, email, senha, telefone, registro_coren, cargo, unidade, turno, data_admissao, especialidade, anos_experiencia, status }) {
    const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);

    const result = await db.query(`
      INSERT INTO enfermeiros 
      (nome, email, senha, telefone, registro_coren, cargo, unidade, turno, data_admissao, especialidade, anos_experiencia, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *
    `, [nome, email, senhaHash, telefone, registro_coren, cargo, unidade, turno, data_admissao, especialidade, anos_experiencia, status]);

    return new Enfermeiro(result.rows[0]);
  }

  async update(id, { nome, email, telefone, cargo, unidade, turno, data_admissao, especialidade, anos_experiencia, status }) {
    const result = await db.query(`
      UPDATE enfermeiros
      SET nome=$1, email=$2, telefone=$3, cargo=$4, unidade=$5, turno=$6, data_admissao=$7, especialidade=$8, anos_experiencia=$9, status=$10, data_atualizacao=NOW()
      WHERE id=$11
      RETURNING *
    `, [nome, email, telefone, cargo, unidade, turno, data_admissao, especialidade, anos_experiencia, status, id]);

    return result.rows[0] ? new Enfermeiro(result.rows[0]) : null;
  }

  async atualizarFoto(id, caminho) {
    await db.query('UPDATE enfermeiros SET foto_perfil = $1 WHERE id = $2', [caminho, id]);
  }

  async updatePassword(id, senhaAtual, novaSenha) {
    // Buscar senha atual diretamente do banco
    const result = await db.query('SELECT senha FROM enfermeiros WHERE id = $1', [id]);
    if (!result.rows[0]) {
      const error = new Error('Enfermeiro não encontrado.');
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
      UPDATE enfermeiros SET senha = $1, data_atualizacao = NOW()
      WHERE id = $2 RETURNING *
    `, [novaSenhaHash, id]);

    return new Enfermeiro(updateResult.rows[0]);
  }

  async verifyCredentials(email, senha) {
      // Buscar diretamente do banco para ter acesso à senha criptografada
      const result = await db.query(`
        SELECT * FROM enfermeiros WHERE email = $1
      `, [email]);
      
      const enfermeiroRaw = result.rows[0];
      
      if (!enfermeiroRaw) {
        const error = new Error('Credenciais inválidas');
        error.code = 401;
        throw error;
      }

      // Use a senha fornecida no login para comparar
      const senhaMatch = await bcrypt.compare(senha, enfermeiroRaw.senha);
      
      if (!senhaMatch) {
        const error = new Error('Credenciais inválidas');
        error.code = 401;
        throw error;
      }

      if (enfermeiroRaw.ativo === false) {
        const error = new Error('Conta desativada');
        error.code = 403;
        throw error;
      }

      // Retornar a model sem a senha
      const { senha: _, ...enfermeiroSemSenha } = enfermeiroRaw;
      return new Enfermeiro(enfermeiroSemSenha);
  }

  async debugSenha(email) {
    const result = await db.query(`SELECT senha FROM enfermeiros WHERE email = $1`, [email]);
    return result.rows[0];
  }

  async desativar(id) {
    const result = await db.query(`
      UPDATE enfermeiros SET ativo = FALSE, status = 'Inativo', data_atualizacao = NOW()
      WHERE id = $1 RETURNING *
    `, [id]);
    return result.rows[0] ? new Enfermeiro(result.rows[0]) : null;
  }

  async reativar(id) {
    const result = await db.query(`
      UPDATE enfermeiros SET ativo = TRUE, status = 'Ativo', data_atualizacao = NOW()
      WHERE id = $1 RETURNING *
    `, [id]);
    return result.rows[0] ? new Enfermeiro(result.rows[0]) : null;
  }

  async remove(id) {
    const result = await db.query(`
      DELETE FROM enfermeiros WHERE id = $1 RETURNING *
    `, [id]);
    return result.rows[0] ? new Enfermeiro(result.rows[0]) : null;
  }

  async search(searchTerm) {
    const result = await db.query(`
      SELECT id, nome, email, telefone, registro_coren, cargo, unidade, turno, data_admissao, especialidade, anos_experiencia, status, foto_perfil, data_cadastro, ativo
      FROM enfermeiros 
      WHERE nome ILIKE $1 
         OR email ILIKE $1 
         OR registro_coren ILIKE $1 
         OR cargo ILIKE $1 
         OR especialidade ILIKE $1
    `, [`%${searchTerm}%`]);
    
    return result.rows.map(row => new Enfermeiro(row));
  }
}

module.exports = new EnfermeirosRepository();