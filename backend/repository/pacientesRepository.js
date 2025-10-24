const db = require('../db/db');
const bcrypt = require('bcrypt');
const Paciente = require('../models/pacienteModel');

const SALT_ROUNDS = 10;

class PacienteRepository {
  async findAll() {
    const result = await db.query(`
      SELECT id, cpf, nome, email, data_nascimento, peso_kg, genero, aceite_termos, data_cadastro, ativo, alergias, medicacoes, condicoes
      FROM paciente
    `);
    return result.rows.map(row => new Paciente(row));
  }

  async findById(id) {
    const result = await db.query(`
      SELECT id, cpf, nome, email, senha, data_nascimento, peso_kg, genero, aceite_termos, data_cadastro, ativo, foto_perfil, alergias, medicacoes, condicoes
      FROM paciente WHERE id = $1
    `, [id]);

    return result.rows[0] ? new Paciente(result.rows[0]) : null;
  }

  async findByCPF(CPF) {
    const result = await db.query(
      `SELECT id, cpf, nome, email, senha, data_nascimento, peso_kg, genero, aceite_termos, data_cadastro, ativo, foto_perfil, alergias, medicacoes, condicoes
      FROM paciente WHERE CPF = $1`, [CPF]);
    return result.rows[0] ? new Paciente(result.rows[0]) : null;
  }

  async findByEmail(email) {
    const result = await db.query(
      `SELECT id, cpf, nome, email, senha, data_nascimento, peso_kg, genero, aceite_termos, data_cadastro, ativo, foto_perfil, alergias, medicacoes, condicoes
      FROM paciente WHERE email = $1`, [email]);
    return result.rows[0] ? new Paciente(result.rows[0]) : null;
  }

  async create({ cpf, nome, email, senha, data_nascimento, peso_kg, genero, alergias, medicacoes, condicoes, aceite_termos }) {
    const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);

    const result = await db.query(`
      INSERT INTO paciente 
      (cpf, nome, email, senha, data_nascimento, peso_kg, genero, aceite_termos, alergias, medicacoes, condicoes) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
      RETURNING id, cpf, nome, email, data_nascimento, peso_kg, genero, aceite_termos, data_cadastro, alergias, medicacoes, condicoes
    `, [cpf, nome, email, senhaHash, data_nascimento, peso_kg, genero, aceite_termos, alergias, medicacoes, condicoes]);

    return new Paciente(result.rows[0]);
  }

  async atualizarFoto(id, caminho) {
    await db.query('UPDATE paciente SET foto_perfil = $1 WHERE id = $2', [caminho, id]);
  }

  async update(id, { nome, email, data_nascimento, peso_kg, genero, alergias, medicacoes, condicoes }) {
    const result = await db.query(`
      UPDATE paciente 
      SET nome = $1, email = $2, data_nascimento = $3, peso_kg = $4, genero = $5,
          alergias = $6, medicacoes = $7, condicoes = $8
      WHERE id = $9 
      RETURNING id, cpf, nome, email, data_nascimento, peso_kg, genero, aceite_termos, data_cadastro, alergias, medicacoes, condicoes
    `, [nome, email, data_nascimento, peso_kg, genero, alergias, medicacoes, condicoes, id]);

    return result.rows[0] ? new Paciente(result.rows[0]) : null;
  }

  async updatePassword(id, senhaAtual, novaSenha) {
    const paciente = await db.query('SELECT senha FROM paciente WHERE id = $1', [id]);
    if (!paciente.rows[0]) {
      const error = new Error('Paciente não encontrado.');
      error.code = 404;
      throw error;
    }

    const senhaMatch = await bcrypt.compare(senhaAtual, paciente.rows[0].senha);
    if (!senhaMatch) {
      const error = new Error('Senha atual incorreta.');
      error.code = 401;
      throw error;
    }

    if (senhaAtual === novaSenha) {
      const error = new Error('A nova senha deve ser diferente da senha atual.');
      error.code = 400;
      throw error;
    }

    const novaSenhaHash = await bcrypt.hash(novaSenha, SALT_ROUNDS);

    const result = await db.query(`
      UPDATE paciente SET senha = $1 
      WHERE id = $2 
      RETURNING id, cpf, nome, email, data_nascimento, peso_kg, genero, aceite_termos, data_cadastro
    `, [novaSenhaHash, id]);

    return new Paciente(result.rows[0]);
  }

  async verifyCredentials(email, senha) {
    const usuario = await this.findByEmail(email);
    if (!usuario) {
      const error = new Error('Credenciais inválidas');
      error.code = 401;
      throw error;
    }

    const senhaMatch = await bcrypt.compare(senha, usuario.senha);
    if (!senhaMatch) {
      const error = new Error('Credenciais inválidas');
      error.code = 401;
      throw error;
    }

    if (usuario.ativo === false) {
      const error = new Error('Conta desativada');
      error.code = 403;
      throw error;
    }

    return new Paciente({
      id: usuario.id,
      cpf: usuario.cpf,
      nome: usuario.nome,
      email: usuario.email,
      data_nascimento: usuario.data_nascimento,
      peso_kg: usuario.peso_kg,
      genero: usuario.genero,
      aceite_termos: usuario.aceite_termos,
      data_cadastro: usuario.data_cadastro,
      ativo: usuario.ativo,
      alergias: usuario.alergias,
      medicacoes: usuario.medicacoes,
      condicoes: usuario.condicoes
    });
  }

  async desativar(id) {
    const result = await db.query(
      'UPDATE paciente SET ativo = FALSE WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0] ? new Paciente(result.rows[0]) : null;
  }

  async reativar(id) {
    const result = await db.query(
      'UPDATE paciente SET ativo = TRUE WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0] ? new Paciente(result.rows[0]) : null;
  }

  async esqueciSenha(email, novaSenha) {
    const novaSenhaHash = await bcrypt.hash(novaSenha, SALT_ROUNDS);

    const result = await db.query(`
      UPDATE paciente SET senha = $1 
      WHERE email = $2 
      RETURNING id, cpf, nome, email, data_nascimento, peso_kg, genero, aceite_termos, data_cadastro
    `, [novaSenhaHash, email]);

    return result.rows[0] ? new Paciente(result.rows[0]) : null;
  }

  async remove(id) {
    const result = await db.query(`
      DELETE FROM paciente 
      WHERE id = $1 
      RETURNING id, cpf, nome, email, data_nascimento, peso_kg, genero, aceite_termos, data_cadastro
    `, [id]);
    return result.rows[0] ? new Paciente(result.rows[0]) : null;
  }
}

module.exports = new PacienteRepository();