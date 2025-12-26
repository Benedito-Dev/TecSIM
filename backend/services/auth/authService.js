const rateLimiter = require('../../utils/rateLimiter');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');
const pacienteRepository = require('../../repository/pacientesRepository');
const farmaceuticosRepository = require('../../repository/farmaceuticosRepository');

class AuthService {
  async login(email, senha, ip, tipo = 'paciente') {
    console.log('Tentativa de login:', email, 'Tipo:', tipo, 'IP:', ip);

    // 1️⃣ Verifica se o usuário está bloqueado
    const { blocked, cooldown } = await rateLimiter.check(email, ip);
    if (blocked) {
      const error = new Error(`Muitas tentativas. Aguarde ${cooldown} segundos.`);
      error.code = 429;
      error.cooldown = cooldown;
      throw error;
    }

    try {
      let usuario;
      
      // 2️⃣ Verifica credenciais baseado no tipo
      if (tipo === 'farmaceutico') {
        usuario = await farmaceuticosRepository.verifyCredentials(email, senha);
      } else {
        usuario = await pacienteRepository.verifyCredentials(email, senha);
      }

      // 3️⃣ Login sucesso → resetar tentativas
      await rateLimiter.reset(email);

      // 4️⃣ Preparar dados do usuário
      let usuarioData = {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: tipo
      };

      // 5️⃣ Adicionar campos específicos por tipo
      if (tipo === 'paciente') {
        const idade = this.calcularIdade(usuario.data_nascimento);
        usuarioData = {
          ...usuarioData,
          idade,
          genero: usuario.genero,
          alergias: usuario.alergias,
          medicacoes: usuario.medicacoes,
          condicoes: usuario.condicoes
        };

        // Reativar conta se estiver desativada
        if (usuario.ativo === false) {
          await pacienteRepository.reativar(usuario.id);
        }
      } else if (tipo === 'enfermeiro') {
        usuarioData = {
          ...usuarioData,
          registro_coren: usuario.registro_coren,
          cargo: usuario.cargo,
          unidade: usuario.unidade,
          especialidade: usuario.especialidade,
          status: usuario.status
        };

        // Reativar conta se estiver desativada
        if (usuario.ativo === false) {
          await farmaceuticosRepository.reativar(usuario.id);
        }
      }

      // 6️⃣ Gerar JWT (inclui tipo no payload)
      const token = jwt.sign(
        { 
          id: usuario.id,
          tipo: tipo,
          email: usuario.email
        },
        authConfig.secret,
        { expiresIn: authConfig.expiresIn }
      );

      return {
        usuario: usuarioData,
        token
      };

    } catch (error) {
      // 🔹 Registra falha no rate limiter para erros de credenciais (401)
      if (error.code === 401) {
        await rateLimiter.registerFailure(email, ip);
      }
      
      // 🔹 IMPORTANTE: Preserva o código e a mensagem original do erro
      if (error.code) {
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
      let usuario;
      
      // Buscar usuário baseado no tipo
      if (decoded.tipo === 'enfermeiro') {
        usuario = await farmaceuticosRepository.findById(decoded.id);
      } else {
        usuario = await pacienteRepository.findById(decoded.id);
      }
      
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
      
      // Adicionar tipo ao retorno
      return {
        ...usuario,
        tipo: decoded.tipo || 'paciente'
      };
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