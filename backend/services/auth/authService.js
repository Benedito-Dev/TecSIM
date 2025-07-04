const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');
const pacienteRepository = require('../../repository/pacientesRepository');

class AuthService {
  async login(email, senha) {
    try {
      // Usa o repository existente para verificar credenciais
      const usuario = await pacienteRepository.verifyCredentials(email, senha);

      const idade = this.calcularIdade(usuario.data_nascimento);

      if (usuario.ativo === false) {
      await pacienteRepository.reativar(usuario.id); // reativa no banco
      }
      
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
          email: usuario.email,
          idade: idade,
          genero: usuario.genero
        },
        token
      };

      
    } catch (error) {
      throw new Error('Falha na autenticação: ' + error.message);
    }
  }

  calcularIdade(dataNascimento) {
      const nascimento = new Date(dataNascimento);
      const hoje = new Date();
      let idade = hoje.getFullYear() - nascimento.getFullYear();
      const m = hoje.getMonth() - nascimento.getMonth();

      if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
      }

      return idade;
    }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, authConfig.secret);
      return await pacienteRepository.findById(decoded.id);
    } catch (error) {
      throw new Error('Token inválido: ' + error.message);
    }
  }
}

module.exports = new AuthService();