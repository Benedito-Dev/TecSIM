const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');
const refreshRepo = require('../../repository/auth/refreshTokenRepository');
const pacienteRepository = require('../../repository/pacientesRepository');
const enfermeirosRepository = require('../../repository/enfermeirosRepository');

function generateRandomToken() {
  return crypto.randomBytes(48).toString('hex');
}

class RefreshService {
  async generateForUser(userId, tipo, deviceId = null) {
    const token = generateRandomToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 dias
    await refreshRepo.create({ userId, tipo, token, expiresAt, deviceId });
    return { token, expiresAt };
  }

  async revoke(token) {
    await refreshRepo.revokeToken(token);
  }

  async revokeAllForUser(userId) {
    await refreshRepo.revokeByUser(userId);
  }

  async verifyAndRotate(token) {
    const record = await refreshRepo.findByToken(token);
    if (!record) {
      const error = new Error('Refresh token inválido');
      error.code = 401;
      throw error;
    }

    if (record.revoked) {
      // possível replay attack — revogar todos
      await refreshRepo.revokeByUser(record.user_id);
      const error = new Error('Refresh token revogado');
      error.code = 401;
      throw error;
    }

    const now = new Date();
    if (record.expires_at && new Date(record.expires_at) < now) {
      await refreshRepo.revokeById(record.id);
      const error = new Error('Refresh token expirado');
      error.code = 401;
      throw error;
    }

    // Encontrar usuário
    let usuario;
    if (record.tipo === 'enfermeiro') {
      usuario = await enfermeirosRepository.findById(record.user_id);
    } else {
      usuario = await pacienteRepository.findById(record.user_id);
    }

    if (!usuario) {
      const error = new Error('Usuário não encontrado');
      error.code = 401;
      throw error;
    }

    // Rotacionar: revoga o atual e cria outro
    await refreshRepo.revokeById(record.id);
    const newToken = generateRandomToken();
    const newExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await refreshRepo.create({ userId: record.user_id, tipo: record.tipo, token: newToken, expiresAt: newExpires, deviceId: record.device_id });

    // Gerar novo access token
    const accessToken = jwt.sign({ id: usuario.id, tipo: record.tipo, email: usuario.email }, authConfig.secret, { expiresIn: authConfig.expiresIn });

    return { accessToken, refreshToken: newToken, refreshExpiresAt: newExpires };
  }
}

module.exports = new RefreshService();
