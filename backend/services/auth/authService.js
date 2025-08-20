const rateLimiter = require('../../utils/rateLimiter');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');
const pacienteRepository = require('../../repository/pacientesRepository');

class AuthService {
  async login(email, senha, ip) {
    console.log('Tentativa de login:', email, 'IP:', ip);
    // 1️⃣ Verifica se o usuário está bloqueado
    const { blocked, cooldown } = await rateLimiter.check(email, ip);
    if (blocked) {
      throw new Error(`Muitas tentativas. Aguarde ${cooldown} segundos.`);
    }

    try {
      // 2️⃣ Verifica credenciais
      const usuario = await pacienteRepository.verifyCredentials(email, senha);

      if (!usuario) {
        await rateLimiter.registerFailure(email, ip);
        throw new Error('Credenciais inválidas');
      }
      
      // 3️⃣ Login sucesso → resetar tentativas
      await rateLimiter.reset(email);

      // 4️⃣ Calcular idade
      const idade = this.calcularIdade(usuario.data_nascimento);

      // 5️⃣ Reativar se necessário
      if (usuario.ativo === false) {
      await pacienteRepository.reativar(usuario.id); // reativa no banco
      }
      
      // 6️⃣ Gerar JWT
      const token = jwt.sign(
        { id: usuario.id_usuario }, 
        authConfig.secret, 
        { expiresIn: authConfig.expiresIn }
      );

      return {
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          idade: idade,
          genero: usuario.genero
        },
        token
      };

      
    } catch (error) {
      await rateLimiter.registerFailure(email, ip);
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