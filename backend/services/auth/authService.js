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
      const error = new Error(`Muitas tentativas. Aguarde ${cooldown} segundos.`);
      error.code = 429;           // status HTTP
      error.cooldown = cooldown;  // segundos restantes
      throw error;
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

      // 5️⃣ Reativar conta se estiver desativada
      if (usuario.ativo === false) {
        await pacienteRepository.reativar(usuario.id_usuario);
      }

      // 6️⃣ Gerar JWT
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
          idade,
          genero: usuario.genero
        },
        token
      };

    } catch (error) {
      // 🔹 Só registra falha se realmente for erro de credenciais
      if (error.message.includes('Credenciais inválidas')) {
        await rateLimiter.registerFailure(email, ip);
      }
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
