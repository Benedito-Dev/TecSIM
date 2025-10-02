// const rateLimiter = require('../../utils/rateLimiter');
// const jwt = require('jsonwebtoken');
// const authConfig = require('../../config/auth');
// const pacienteRepository = require('../../repository/pacientesRepository');

// class AuthService {
//   async login(email, senha, ip) {
//     console.log('Tentativa de login:', email, 'IP:', ip);

//     // 1️⃣ Verifica se o usuário está bloqueado
//     const { blocked, cooldown } = await rateLimiter.check(email, ip);
//     if (blocked) {
//       const error = new Error(`Muitas tentativas. Aguarde ${cooldown} segundos.`);
//       error.code = 429;
//       error.cooldown = cooldown;
//       throw error;
//     }

//     try {
//       // 2️⃣ Verifica credenciais
//       const usuario = await pacienteRepository.verifyCredentials(email, senha);

//       // 3️⃣ Login sucesso → resetar tentativas
//       await rateLimiter.reset(email);

//       // 4️⃣ Calcular idade
//       const idade = this.calcularIdade(usuario.data_nascimento);

//       // 5️⃣ Reativar conta se estiver desativada
//       if (usuario.ativo === false) {
//         await pacienteRepository.reativar(usuario.id_usuario);
//       }

//       // 6️⃣ Gerar JWT
//       const token = jwt.sign(
//         { id: usuario.id_usuario },
//         authConfig.secret,
//         { expiresIn: authConfig.expiresIn }
//       );

//       return {
//         usuario: {
//           id: usuario.id,
//           nome: usuario.nome,
//           email: usuario.email,
//           idade,
//           genero: usuario.genero
//         },
//         token
//       };

//     } catch (error) {
//       // 🔹 Registra falha no rate limiter para erros de credenciais (401)
//       if (error.code === 401) {
//         await rateLimiter.registerFailure(email, ip);
//       }
      
//       // 🔹 IMPORTANTE: Preserva o código e a mensagem original do erro
//       if (error.code) {
//         // Mantém o erro original com código e mensagem
//         throw error;
//       }
      
//       // 🔹 Para outros erros sem código, cria um novo erro com código 400
//       const newError = new Error(error.message);
//       newError.code = 400;
//       throw newError;
//     }
//   }

//   calcularIdade(dataNascimento) {
//     const nascimento = new Date(dataNascimento);
//     const hoje = new Date();
//     let idade = hoje.getFullYear() - nascimento.getFullYear();
//     const m = hoje.getMonth() - nascimento.getMonth();

//     if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
//       idade--;
//     }

//     return idade;
//   }

//   async verifyToken(token) {
//     try {
//       const decoded = jwt.verify(token, authConfig.secret);
//       const usuario = await pacienteRepository.findById(decoded.id);
      
//       if (!usuario) {
//         const error = new Error('Usuário não encontrado');
//         error.code = 401;
//         throw error;
//       }
      
//       if (usuario.ativo === false) {
//         const error = new Error('Conta desativada');
//         error.code = 403;
//         throw error;
//       }
      
//       return usuario;
//     } catch (error) {
//       // Preserva códigos de erro existentes
//       if (error.code) {
//         throw error;
//       }
      
//       // Para erros JWT sem código, define como 401
//       const newError = new Error('Token inválido');
//       newError.code = 401;
//       throw newError;
//     }
//   }
// }

// module.exports = new AuthService();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const authConfig = require('../../config/auth');
const pacienteRepository = require('../../repository/pacientesRepository');
const refreshTokenRepository = require('../../repository/auth/refreshTokenRepository');

class AuthService {
  async login(email, senha, ip) {
    try {
      const usuario = await pacienteRepository.findByEmail(email);
      if (!usuario) {
        const error = new Error('Usuário não encontrado.');
        error.code = 401;
        throw error;
      }

      const isMatch = await bcrypt.compare(senha, usuario.senha);
      if (!isMatch) {
        const error = new Error('Senha incorreta.');
        error.code = 401;
        throw error;
      }

      // Reativar conta se estiver desativada
      if (usuario.ativo === false) {
        await pacienteRepository.reativar(usuario.id);
      }

      // Calcular idade
      const idade = this.calcularIdade(usuario.data_nascimento);

      // Gerar Access Token
      const accessToken = jwt.sign(
        { id: usuario.id },
        authConfig.secret,
        { expiresIn: authConfig.expiresIn }
      );

      // Criar e salvar Refresh Token
      await refreshTokenRepository.deleteByUserId(usuario.id); // remove tokens antigos
      const refreshToken = uuidv4();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dias
      await refreshTokenRepository.save(usuario.id, refreshToken, expiresAt);

      return {
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          idade,
          genero: usuario.genero
        },
        accessToken,
        refreshToken
      };

    } catch (error) {
      if (error.code) {
        throw error;
      }
      const newError = new Error(error.message || 'Erro ao fazer login.');
      newError.code = 400;
      throw newError;
    }
  }

  async refreshToken(token) {
    try {
      const storedToken = await refreshTokenRepository.findByToken(token);
      if (!storedToken) {
        const error = new Error('Refresh token inválido');
        error.code = 401;
        throw error;
      }

      if (new Date(storedToken.expires_at) < new Date()) {
        const error = new Error('Refresh token expirado');
        error.code = 401;
        throw error;
      }

      const newAccessToken = jwt.sign(
        { id: storedToken.user_id },
        authConfig.secret,
        { expiresIn: authConfig.expiresIn }
      );

      return { accessToken: newAccessToken };

    } catch (error) {
      if (error.code) {
        throw error;
      }
      const newError = new Error(error.message || 'Erro ao renovar token.');
      newError.code = 400;
      throw newError;
    }
  }

  async logout(userId) {
    try {
      await refreshTokenRepository.deleteByUserId(userId);
      return { message: 'Logout realizado com sucesso.' };
    } catch (error) {
      const newError = new Error(error.message || 'Erro ao realizar logout.');
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
}

module.exports = new AuthService();
