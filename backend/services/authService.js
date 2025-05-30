const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const usuarioRepository = require('../repository/usuarioRepository');

class AuthService {
  async login(email, senha) {
    try {
      // Usa o repository existente para verificar credenciais
      const usuario = await usuarioRepository.verifyCredentials(email, senha);
      
      // Gera o token JWT
      const token = jwt.sign(
        { id: usuario.id_usuario }, 
        authConfig.secret, 
        { expiresIn: authConfig.expiresIn }
      );

      return {
        usuario: {
          id: usuario.id_usuario,
          nome: usuario.nome,
          email: usuario.email
        },
        token
      };
    } catch (error) {
      throw new Error('Falha na autenticação: ' + error.message);
    }
  }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, authConfig.secret);
      return await usuarioRepository.findById(decoded.id);
    } catch (error) {
      throw new Error('Token inválido: ' + error.message);
    }
  }
}

module.exports = new AuthService();