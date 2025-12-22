const db = require('../../db/db');
const crypto = require('crypto');

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

class RefreshTokenRepository {
  async create({ userId, tipo, token, expiresAt, deviceId = null }) {
    const tokenHash = hashToken(token);
    const query = `
      INSERT INTO refresh_tokens (user_id, tipo, token_hash, device_id, expires_at, revoked, created_at)
      VALUES ($1, $2, $3, $4, $5, false, now())
      RETURNING *
    `;
    const values = [userId, tipo, tokenHash, deviceId, expiresAt];
    const { rows } = await db.query(query, values);
    return rows[0];
  }

  async findByToken(token) {
    const tokenHash = hashToken(token);
    const query = `SELECT * FROM refresh_tokens WHERE token_hash = $1 LIMIT 1`;
    const { rows } = await db.query(query, [tokenHash]);
    return rows[0];
  }

  async revokeById(id) {
    return db.query('UPDATE refresh_tokens SET revoked = true WHERE id = $1', [id]);
  }

  async revokeByUser(userId) {
    return db.query('UPDATE refresh_tokens SET revoked = true WHERE user_id = $1', [userId]);
  }

  async revokeToken(token) {
    const tokenHash = hashToken(token);
    return db.query('UPDATE refresh_tokens SET revoked = true WHERE token_hash = $1', [tokenHash]);
  }
}

module.exports = new RefreshTokenRepository();
