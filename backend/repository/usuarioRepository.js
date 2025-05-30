const db = require('../db/db');
const Usuario = require('../models/usuarioModel');

class UsuarioRepository {
  // Método para buscar todos os usuários
  async findAll() {
    const result = await db.query('SELECT * FROM usuarios');
    return result.rows.map(row => new Usuario(row));
  }

  // Método para buscar um usuário por ID
  async findById(id) {
    const result = await db.query('SELECT * FROM usuarios WHERE id_usuario = $1', [id]);
    return result.rows[0] ? new Usuario(result.rows[0]) : null;
  }

  // Método para buscar um usuário por email
  async findByEmail(email) {
    const result = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    return result.rows[0] ? new Usuario(result.rows[0]) : null;
  }

  // Método para criar um novo usuário
  async create({ nome, email, senha, data_nascimento, peso_kg, aceite_termos }) {
    const result = await db.query(
      `INSERT INTO usuarios 
      (nome, email, senha, data_nascimento, peso_kg, aceite_termos) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *`,
      [nome, email, senha, data_nascimento, peso_kg, aceite_termos]
    );
    return new Usuario(result.rows[0]);
  }

  // Método para atualizar um usuário
  async update(id, { nome, email, data_nascimento, peso_kg }) {
    const result = await db.query(
      `UPDATE usuarios 
      SET nome=$1, email=$2, data_nascimento=$3, peso_kg=$4 
      WHERE id_usuario=$5 
      RETURNING *`,
      [nome, email, data_nascimento, peso_kg, id]
    );
    return new Usuario(result.rows[0]);
  }

  // Método para atualizar a senha
  async updatePassword(id, novaSenha) {
    const result = await db.query(
      'UPDATE usuarios SET senha=$1 WHERE id_usuario=$2 RETURNING *',
      [novaSenha, id]
    );
    return new Usuario(result.rows[0]);
  }

  // Método para remover um usuário
  async remove(id) {
    const result = await db.query(
      'DELETE FROM usuarios WHERE id_usuario = $1 RETURNING *', 
      [id]
    );
    return result.rows[0] ? new Usuario(result.rows[0]) : null;
  }
}

module.exports = new UsuarioRepository();