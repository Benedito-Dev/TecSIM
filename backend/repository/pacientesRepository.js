const db = require('../db/db');
const bcrypt = require('bcrypt');
const Paciente = require('../models/pacienteModel');

const SALT_ROUNDS = 10;

class PacienteRepository {
  async findAll() {
    const result = await db.query(`
      SELECT id, cpf, nome, email, data_nascimento, peso_kg, genero, aceite_termos, data_cadastro 
      FROM paciente
    `);
    return result.rows.map(row => new Paciente(row));
  }

  async findById(id) {
    const result = await db.query(`
      SELECT id, cpf, nome, email, data_nascimento, peso_kg, genero, aceite_termos, data_cadastro, ativo
      FROM paciente WHERE id = $1
    `, [id]);
    return result.rows[0] ? new Paciente(result.rows[0]) : null;
  }

  async findByEmail(email) {
    const result = await db.query(`SELECT id, cpf, nome, email, senha, data_nascimento, peso_kg, genero, aceite_termos, data_cadastro, ativo
    FROM paciente WHERE email = $1`, [email]);
    return result.rows[0] ? new Paciente(result.rows[0]) : null;
  }

  async create({ cpf, nome, email, senha, data_nascimento, peso_kg, genero, aceite_termos }) {
    const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);

    const result = await db.query(`
      INSERT INTO paciente 
      (cpf, nome, email, senha, data_nascimento, peso_kg, genero, aceite_termos) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING id, cpf, nome, email, data_nascimento, peso_kg, genero, aceite_termos, data_cadastro
    `, [cpf, nome, email, senhaHash, data_nascimento, peso_kg, genero, aceite_termos]);

    return new Paciente(result.rows[0]);
  }

  async update(id, {nome, email, data_nascimento, peso_kg, genero }) {
    const result = await db.query(`
      UPDATE paciente 
      SET nome = $1, email = $2, data_nascimento = $3, peso_kg = $4, genero = $5
      WHERE id = $6 
      RETURNING id, cpf, nome, email, data_nascimento, peso_kg, genero, aceite_termos, data_cadastro
    `, [nome, email, data_nascimento, peso_kg, genero, id]);

    return result.rows[0] ? new Paciente(result.rows[0]) : null;
  }

  async updatePassword(id, senhaAtual, novaSenha) {
    const usuario = await db.query('SELECT senha FROM paciente WHERE id = $1', [id]);
    if (!usuario.rows[0]) throw new Error('Usuário não encontrado');

    const senhaMatch = await bcrypt.compare(senhaAtual, usuario.rows[0].senha);
    if (!senhaMatch) throw new Error('Senha atual incorreta');

    if (senhaAtual === novaSenha) throw new Error('A nova senha deve ser diferente da senha atual');

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
    if (!usuario) throw new Error('Credenciais inválidas');

    const senhaMatch = await bcrypt.compare(senha, usuario.senha);
    if (!senhaMatch) throw new Error('Credenciais inválidas');

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
      ativo: usuario.ativo
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
