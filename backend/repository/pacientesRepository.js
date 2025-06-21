const db = require('../db/db');
const bcrypt = require('bcrypt');
const Paciente = require('../models/pacientesModel');

const SALT_ROUNDS = 10;

class PacienteRepository {
  async findAll() {
    const result = await db.query(`
      SELECT id_usuario, cpf, nome, email, data_nascimento, peso_kg, genero, aceite_termos, data_cadastro 
      FROM pacientes
    `);
    return result.rows.map(row => new Paciente(row));
  }

  async findById(id) {
    const result = await db.query(`
      SELECT id_usuario, cpf, nome, email, data_nascimento, peso_kg, genero, aceite_termos, data_cadastro 
      FROM pacientes WHERE id_usuario = $1
    `, [id]);
    return result.rows[0] ? new Paciente(result.rows[0]) : null;
  }

  async findByEmail(email) {
    const result = await db.query('SELECT * FROM pacientes WHERE email = $1', [email]);
    return result.rows[0] ? new Paciente(result.rows[0]) : null;
  }

  async create({ cpf, nome, email, senha, data_nascimento, peso_kg, genero, aceite_termos }) {
    const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);

    const result = await db.query(`
      INSERT INTO pacientes 
      (cpf, nome, email, senha, data_nascimento, peso_kg, genero, aceite_termos) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING id_usuario, cpf, nome, email, data_nascimento, peso_kg, genero, aceite_termos, data_cadastro
    `, [cpf, nome, email, senhaHash, data_nascimento, peso_kg, genero, aceite_termos]);

    return new Paciente(result.rows[0]);
  }

  async update(id, { cpf, nome, email, data_nascimento, peso_kg, genero }) {
    const result = await db.query(`
      UPDATE pacientes 
      SET cpf = $1, nome = $2, email = $3, data_nascimento = $4, peso_kg = $5, genero = $6
      WHERE id_usuario = $7 
      RETURNING id_usuario, cpf, nome, email, data_nascimento, peso_kg, genero, aceite_termos, data_cadastro
    `, [cpf, nome, email, data_nascimento, peso_kg, genero, id]);

    return result.rows[0] ? new Paciente(result.rows[0]) : null;
  }

  async updatePassword(id, senhaAtual, novaSenha) {
    const usuario = await db.query('SELECT senha FROM pacientes WHERE id_usuario = $1', [id]);
    if (!usuario.rows[0]) throw new Error('Usuário não encontrado');

    const senhaMatch = await bcrypt.compare(senhaAtual, usuario.rows[0].senha);
    if (!senhaMatch) throw new Error('Senha atual incorreta');

    if (senhaAtual === novaSenha) throw new Error('A nova senha deve ser diferente da senha atual');

    const novaSenhaHash = await bcrypt.hash(novaSenha, SALT_ROUNDS);

    const result = await db.query(`
      UPDATE pacientes SET senha = $1 
      WHERE id_usuario = $2 
      RETURNING id_usuario, cpf, nome, email, data_nascimento, peso_kg, genero, aceite_termos, data_cadastro
    `, [novaSenhaHash, id]);

    return new Paciente(result.rows[0]);
  }

  async verifyCredentials(email, senha) {
    const usuario = await this.findByEmail(email);
    if (!usuario) throw new Error('Credenciais inválidas');

    const senhaMatch = await bcrypt.compare(senha, usuario.senha);
    if (!senhaMatch) throw new Error('Credenciais inválidas');

    return new Paciente({
      id_usuario: usuario.id_usuario,
      cpf: usuario.cpf,
      nome: usuario.nome,
      email: usuario.email,
      data_nascimento: usuario.data_nascimento,
      peso_kg: usuario.peso_kg,
      genero: usuario.genero,
      aceite_termos: usuario.aceite_termos,
      data_cadastro: usuario.data_cadastro
    });
  }

  async remove(id) {
    const result = await db.query(`
      DELETE FROM pacientes 
      WHERE id_usuario = $1 
      RETURNING id_usuario, cpf, nome, email, data_nascimento, peso_kg, genero, aceite_termos, data_cadastro
    `, [id]);
    return result.rows[0] ? new Paciente(result.rows[0]) : null;
  }
}

module.exports = new PacienteRepository();
