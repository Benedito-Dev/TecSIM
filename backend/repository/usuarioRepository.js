const db = require('../db/db');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuarioModel');

// Configurações do bcrypt
const SALT_ROUNDS = 10; // Número de rounds para geração do salt (10 é um bom equilíbrio entre segurança e performance)

class UsuarioRepository {
  // Método para buscar todos os usuários (sem senhas)
  async findAll() {
    const result = await db.query('SELECT id_usuario, nome, email, data_nascimento, peso_kg, aceite_termos, data_cadastro FROM usuarios');
    return result.rows.map(row => new Usuario(row));
  }

  // Método para buscar um usuário por ID (sem senha)
  async findById(id) {
    const result = await db.query(
      'SELECT id_usuario, nome, email, data_nascimento, peso_kg, aceite_termos, data_cadastro FROM usuarios WHERE id_usuario = $1', 
      [id]
    );
    return result.rows[0] ? new Usuario(result.rows[0]) : null;
  }

  // Método para buscar um usuário por email (com senha para login)
  async findByEmail(email) {
    const result = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    return result.rows[0] ? new Usuario(result.rows[0]) : null;
  }

  // Método para criar um novo usuário com senha criptografada
  async create({ nome, email, senha, data_nascimento, peso_kg, aceite_termos }) {
    // Criptografa a senha antes de armazenar
    const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);
    
    const result = await db.query(
      `INSERT INTO usuarios 
      (nome, email, senha, data_nascimento, peso_kg, aceite_termos) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING id_usuario, nome, email, data_nascimento, peso_kg, aceite_termos, data_cadastro`,
      [nome, email, senhaHash, data_nascimento, peso_kg, aceite_termos]
    );
    
    return new Usuario(result.rows[0]);
  }

  // Método para atualizar informações do usuário (sem senha)
  async update(id, { nome, email, data_nascimento, peso_kg }) {
    const result = await db.query(
      `UPDATE usuarios 
      SET nome=$1, email=$2, data_nascimento=$3, peso_kg=$4 
      WHERE id_usuario=$5 
      RETURNING id_usuario, nome, email, data_nascimento, peso_kg, aceite_termos, data_cadastro`,
      [nome, email, data_nascimento, peso_kg, id]
    );
    
    return result.rows[0] ? new Usuario(result.rows[0]) : null;
  }

  // Método para atualizar a senha com todas as validações
  async updatePassword(id, senhaAtual, novaSenha) {
    // 1. Busca o usuário e a senha armazenada
    const usuario = await db.query(
      'SELECT senha FROM usuarios WHERE id_usuario = $1', 
      [id]
    );

    if (!usuario.rows[0]) {
      throw new Error('Usuário não encontrado');
    }

    // 2. Verifica se a senha atual está correta
    const senhaMatch = await bcrypt.compare(senhaAtual, usuario.rows[0].senha);
    
    if (!senhaMatch) {
      throw new Error('Senha atual incorreta');
    }

    // 3. Verifica se a nova senha é diferente da atual
    if (senhaAtual === novaSenha) {
      throw new Error('A nova senha deve ser diferente da senha atual');
    }

    // 4. Criptografa a nova senha
    const novaSenhaHash = await bcrypt.hash(novaSenha, SALT_ROUNDS);

    // 5. Atualiza no banco de dados
    const result = await db.query(
      'UPDATE usuarios SET senha = $1 WHERE id_usuario = $2 RETURNING id_usuario, nome, email, data_nascimento, peso_kg, aceite_termos, data_cadastro',
      [novaSenhaHash, id]
    );

    return new Usuario(result.rows[0]);
  }

  // Método para verificar credenciais (login)
  async verifyCredentials(email, senha) {
    const usuario = await this.findByEmail(email);
    
    if (!usuario) {
      throw new Error('Credenciais inválidas');
    }

    const senhaMatch = await bcrypt.compare(senha, usuario.senha);
    
    if (!senhaMatch) {
      throw new Error('Credenciais inválidas');
    }

    // Retorna usuário sem a senha
    return new Usuario({
      id_usuario: usuario.id_usuario,
      nome: usuario.nome,
      email: usuario.email,
      data_nascimento: usuario.data_nascimento,
      peso_kg: usuario.peso_kg,
      aceite_termos: usuario.aceite_termos,
      data_cadastro: usuario.data_cadastro
    });
  }

  // Método para remover um usuário
  async remove(id) {
    const result = await db.query(
      'DELETE FROM usuarios WHERE id_usuario = $1 RETURNING id_usuario, nome, email, data_nascimento, peso_kg, aceite_termos, data_cadastro', 
      [id]
    );
    return result.rows[0] ? new Usuario(result.rows[0]) : null;
  }
}

module.exports = new UsuarioRepository();