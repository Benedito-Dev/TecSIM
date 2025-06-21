const db = require('../db/db');
const bcrypt = require('bcrypt');
const Medico = require('../models/medicoModel');

const SALT_ROUNDS = 10;

class MedicoRepository {
  async findAll() {
    const result = await db.query(`
      SELECT id_medico, nome, crm, especialidade, email, data_cadastro 
      FROM medicos
    `);
    return result.rows.map(row => new Medico(row));
  }

  async findById(id) {
    const result = await db.query(`
      SELECT id_medico, nome, crm, especialidade, email, data_cadastro 
      FROM medicos WHERE id_medico = $1
    `, [id]);
    return result.rows[0] ? new Medico(result.rows[0]) : null;
  }

  async findByEmail(email) {
    const result = await db.query('SELECT * FROM medicos WHERE email = $1', [email]);
    return result.rows[0] ? new Medico(result.rows[0]) : null;
  }

  async findByCrm(crm) {
    const result = await db.query('SELECT * FROM medicos WHERE crm = $1', [crm]);
    return result.rows[0] ? new Medico(result.rows[0]) : null;
  }

  async findByEspecialidade(especialidade) {
    const result = await db.query('SELECT * FROM medicos WHERE especialidade = $1', [especialidade]);
    return result.rows.map(row => new Medico(row));
  }

  async create({ nome, crm, especialidade, email, senha }) {
    // Verifica se CRM já existe
    const existeCrm = await this.findByCrm(crm);
    if (existeCrm) throw new Error('CRM já cadastrado');

    const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);

    const result = await db.query(`
      INSERT INTO medicos 
      (nome, crm, especialidade, email, senha) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING id_medico, nome, crm, especialidade, email, data_cadastro
    `, [nome, crm, especialidade, email, senhaHash]);

    return new Medico(result.rows[0]);
  }

  async update(id, { nome, crm, especialidade, email }) {
    // Verifica se o novo CRM já pertence a outro médico
    if (crm) {
      const medicoComCrm = await this.findByCrm(crm);
      if (medicoComCrm && medicoComCrm.id_medico !== id) {
        throw new Error('CRM já está em uso por outro médico');
      }
    }

    const result = await db.query(`
      UPDATE medicos 
      SET nome = COALESCE($1, nome), 
          crm = COALESCE($2, crm), 
          especialidade = COALESCE($3, especialidade), 
          email = COALESCE($4, email)
      WHERE id_medico = $5 
      RETURNING id_medico, nome, crm, especialidade, email, data_cadastro
    `, [nome, crm, especialidade, email, id]);

    return result.rows[0] ? new Medico(result.rows[0]) : null;
  }

  async updatePassword(id, senhaAtual, novaSenha) {
    const medico = await db.query('SELECT senha FROM medicos WHERE id_medico = $1', [id]);
    if (!medico.rows[0]) throw new Error('Médico não encontrado');

    const senhaMatch = await bcrypt.compare(senhaAtual, medico.rows[0].senha);
    if (!senhaMatch) throw new Error('Senha atual incorreta');

    if (senhaAtual === novaSenha) throw new Error('A nova senha deve ser diferente da senha atual');

    const novaSenhaHash = await bcrypt.hash(novaSenha, SALT_ROUNDS);

    const result = await db.query(`
      UPDATE medicos SET senha = $1 
      WHERE id_medico = $2 
      RETURNING id_medico, nome, crm, especialidade, email, data_cadastro
    `, [novaSenhaHash, id]);

    return new Medico(result.rows[0]);
  }

  async verifyCredentials(email, senha) {
    const medico = await this.findByEmail(email);
    if (!medico) throw new Error('Credenciais inválidas');

    const senhaMatch = await bcrypt.compare(senha, medico.senha);
    if (!senhaMatch) throw new Error('Credenciais inválidas');

    return new Medico({
      id_medico: medico.id_medico,
      nome: medico.nome,
      crm: medico.crm,
      especialidade: medico.especialidade,
      email: medico.email,
      data_cadastro: medico.data_cadastro
    });
  }

  async remove(id) {
    const result = await db.query(`
      DELETE FROM medicos 
      WHERE id_medico = $1 
      RETURNING id_medico, nome, crm, especialidade, email, data_cadastro
    `, [id]);
    return result.rows[0] ? new Medico(result.rows[0]) : null;
  }
}

module.exports = new MedicoRepository();