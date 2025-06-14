const db = require('../db/db');
const Otp = require('../models/OtpModel');

class OtpRepository {
  async save({ email, otp, expires_at }) {
    const result = await db.query(
      `INSERT INTO otps (email, otp, expires_at)
       VALUES ($1, $2, $3)
       RETURNING id, email, otp, expires_at, verified, created_at, attempts`,
      [email, otp, expires_at]
    );
    return result.rows[0] ? new Otp(result.rows[0]) : null;
  }

  async findByEmail(email) {
    const result = await db.query(
      `SELECT id, email, otp, expires_at, verified, created_at, attempts
       FROM otps
       WHERE email = $1
       ORDER BY created_at DESC
       LIMIT 1`,
      [email]
    );
    return result.rows[0] ? new Otp(result.rows[0]) : null;
  }

  async deleteByEmail(email) {
    await db.query('DELETE FROM otps WHERE email = $1', [email]);
  }

  async deleteExpired() {
    await db.query('DELETE FROM otps WHERE expires_at < NOW()');
  }

  async findAll() {
    const result = await db.query(
      `SELECT id, email, otp, expires_at, verified, created_at, attempts
       FROM otps
       ORDER BY created_at DESC`
    );
    return result.rows.map(row => new Otp(row));
  }

  // Incrementa tentativas
  async incrementAttempts(id) {
    await db.query(
      'UPDATE otps SET attempts = attempts + 1 WHERE id = $1',
      [id]
    );
  }

  // Marca como verificado
  async markAsVerified(id) {
    await db.query(
      'UPDATE otps SET verified = TRUE WHERE id = $1',
      [id]
    );
  }
}

module.exports = new OtpRepository();
