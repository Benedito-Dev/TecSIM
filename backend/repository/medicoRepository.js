const db = require('../db/db');
const bcrypt = require('bcrypt');
const Medico = require('../models/medicoModel');

const SALT_ROUNDS = 10;

class MedicoRepository {
  async findAll(includeInactive = false) {
    const query = includeInactive 
      ? `SELECT id, nome, crm, especialidade, email, telefone, ativo FROM medicos`
      : `SELECT id, nome, crm, especialidade, email, telefone, ativo FROM medicos WHERE ativo = true`;
    
    const result = await db.query(query);
    return result.rows.map(row => new Medico(row));
  }

  async findById(id, includeInactive = false) {
    const query = includeInactive
      ? `SELECT id, nome, crm, especialidade, email, telefone, ativo FROM medicos WHERE id = $1`
      : `SELECT id, nome, crm, especialidade, email, telefone, ativo FROM medicos WHERE id = $1 AND ativo = true`;
    
    const result = await db.query(query, [id]);
    return result.rows[0] ? new Medico(result.rows[0]) : null;
  }

  async findByEmail(email, includeInactive = false) {
    const query = includeInactive
      ? `SELECT * FROM medicos WHERE email = $1`
      : `SELECT * FROM medicos WHERE email = $1 AND ativo = true`;
    
    const result = await db.query(query, [email]);
    return result.rows[0] ? new Medico(result.rows[0]) : null;
  }

  async findByCrm(crm, includeInactive = false) {
    const query = includeInactive
      ? `SELECT * FROM medicos WHERE crm = $1`
      : `SELECT * FROM medicos WHERE crm = $1 AND ativo = true`;
    
    const result = await db.query(query, [crm]);
    return result.rows[0] ? new Medico(result.rows[0]) : null;
  }

  async findByEspecialidade(especialidade, includeInactive = false) {
    const query = includeInactive
      ? `SELECT id, nome, crm, especialidade, email, telefone, ativo FROM medicos WHERE especialidade = $1`
      : `SELECT id, nome, crm, especialidade, email, telefone, ativo FROM medicos WHERE especialidade = $1 AND ativo = true`;
    
    const result = await db.query(query, [especialidade]);
    return result.rows.map(row => new Medico(row));
  }

  async create({ nome, crm, especialidade, email, senha, telefone }) {
    // Verifica se CRM já existe (incluindo inativos)
    const existeCrm = await this.findByCrm(crm, true);
    if (existeCrm) throw new Error('CRM já cadastrado');

    // Verifica se email já existe (incluindo inativos)
    const existeEmail = await this.findByEmail(email, true);
    if (existeEmail) throw new Error('Email já cadastrado');

    const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);

    const result = await db.query(`
      INSERT INTO medicos 
      (nome, crm, especialidade, email, senha, telefone, ativo) 
      VALUES ($1, $2, $3, $4, $5, $6, true) 
      RETURNING id, nome, crm, especialidade, email, telefone, ativo
    `, [nome, crm, especialidade, email, senhaHash, telefone]);

    return new Medico(result.rows[0]);
  }

  async update(id, { nome, crm, especialidade, email, telefone, ativo }) {
    // Verifica se o médico existe
    const medicoExistente = await this.findById(id, true);
    if (!medicoExistente) throw new Error('Médico não encontrado');

    // Verifica se o novo CRM já pertence a outro médico (incluindo inativos)
    if (crm) {
      const medicoComCrm = await this.findByCrm(crm, true);
      if (medicoComCrm && medicoComCrm.id !== id) {
        throw new Error('CRM já está em uso por outro médico');
      }
    }

    const result = await db.query(`
      UPDATE medicos 
      SET nome = COALESCE($1, nome), 
          crm = COALESCE($2, crm), 
          especialidade = COALESCE($3, especialidade), 
          email = COALESCE($4, email),
          telefone = COALESCE($5, telefone),
          ativo = COALESCE($6, ativo)
      WHERE id = $7 
      RETURNING id, nome, crm, especialidade, email, telefone, ativo
    `, [
      nome || medicoExistente.nome,
      crm || medicoExistente.crm,
      especialidade || medicoExistente.especialidade,
      email || medicoExistente.email,
      telefone || medicoExistente.telefone,
      ativo !== undefined ? ativo : medicoExistente.ativo,
      id
    ]);

    return new Medico(result.rows[0]);
  }

  async updatePassword(id, senhaAtual, novaSenha) {
    const medico = await db.query('SELECT senha, ativo FROM medicos WHERE id = $1', [id]);
    if (!medico.rows[0]) throw new Error('Médico não encontrado');
    if (!medico.rows[0].ativo) throw new Error('Médico inativo');

    const senhaMatch = await bcrypt.compare(senhaAtual, medico.rows[0].senha);
    if (!senhaMatch) throw new Error('Senha atual incorreta');

    if (senhaAtual === novaSenha) throw new Error('A nova senha deve ser diferente da senha atual');

    const novaSenhaHash = await bcrypt.hash(novaSenha, SALT_ROUNDS);

    const result = await db.query(`
      UPDATE medicos SET senha = $1 
      WHERE id = $2 
      RETURNING id, nome, crm, especialidade, email, telefone, ativo
    `, [novaSenhaHash, id]);

    return new Medico(result.rows[0]);
  }

  async verifyCredentials(email, senha) {
    const medico = await this.findByEmail(email, true);
    if (!medico) throw new Error('Credenciais inválidas');
    if (!medico.ativo) throw new Error('Médico inativo');

    const senhaMatch = await bcrypt.compare(senha, medico.senha);
    if (!senhaMatch) throw new Error('Credenciais inválidas');

    return new Medico({
      id: medico.id,
      nome: medico.nome,
      crm: medico.crm,
      especialidade: medico.especialidade,
      email: medico.email,
      telefone: medico.telefone,
      ativo: medico.ativo
    });
  }

  async remove(id) {
    const result = await db.query(`
      DELETE FROM medicos 
      WHERE id = $1 
      RETURNING id, nome, crm, especialidade, email, telefone, ativo
    `, [id]);
    return result.rows[0] ? new Medico(result.rows[0]) : null;
  }

  async deactivate(id) {
    const result = await db.query(`
      UPDATE medicos 
      SET ativo = false 
      WHERE id = $1 
      RETURNING id, nome, crm, especialidade, email, telefone, ativo
    `, [id]);
    
    return result.rows[0] ? new Medico(result.rows[0]) : null;
  }

  async activate(id) {
    const result = await db.query(`
      UPDATE medicos 
      SET ativo = true 
      WHERE id = $1 
      RETURNING id, nome, crm, especialidade, email, telefone, ativo
    `, [id]);
    
    return result.rows[0] ? new Medico(result.rows[0]) : null;
  }
}

module.exports = new MedicoRepository();
