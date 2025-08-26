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
      error.code = 429;
      error.cooldown = cooldown;
      throw error;
    }

    try {
      // 2️⃣ Verifica credenciais
      const usuario = await pacienteRepository.verifyCredentials(email, senha);

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
      // 🔹 Registra falha no rate limiter para erros de credenciais (401)
      if (error.code === 401) {
        await rateLimiter.registerFailure(email, ip);
      }
      
      // 🔹 IMPORTANTE: Preserva o código e a mensagem original do erro
      if (error.code) {
        // Mantém o erro original com código e mensagem
        throw error;
      }
      
      // 🔹 Para outros erros sem código, cria um novo erro com código 400
      const newError = new Error(error.message);
      newError.code = 400;
      throw newError;
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
      const usuario = await pacienteRepository.findById(decoded.id);
      
      if (!usuario) {
        const error = new Error('Usuário não encontrado');
        error.code = 401;
        throw error;
      }
      
      if (usuario.ativo === false) {
        const error = new Error('Conta desativada');
        error.code = 403;
        throw error;
      }
      
      return usuario;
    } catch (error) {
      // Preserva códigos de erro existentes
      if (error.code) {
        throw error;
      }
      
      // Para erros JWT sem código, define como 401
      const newError = new Error('Token inválido');
      newError.code = 401;
      throw newError;
    }
  }
}

module.exports = new AuthService();