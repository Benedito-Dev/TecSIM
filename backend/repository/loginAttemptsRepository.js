const db = require('../db/db');

class LoginAttemptsRepository {
  async findByEmail(email) {
    const result = await db.query(
      'SELECT * FROM login_attempts WHERE email = $1 LIMIT 1',
      [email]
    );
    return result.rows[0];
  }

  async create(email, ip) {
    await db.query(
      `INSERT INTO login_attempts (email, ip_address, attempts, blocked_until, created_at, updated_at)
       VALUES ($1, $2, 1, NULL, NOW(), NOW())`,
      [email, ip]
    );
  }

  async increment(email) {
    await db.query(
      `UPDATE login_attempts 
         SET attempts = attempts + 1, last_attempt = NOW(), updated_at = NOW()
       WHERE email = $1`,
      [email]
    );
  }

  async reset(email) {
    await db.query(
      `UPDATE login_attempts 
         SET attempts = 0, blocked_until = NULL, updated_at = NOW()
       WHERE email = $1`,
      [email]
    );
  }

  async block(email, seconds) {
    const blockedUntilMs = Date.now() + seconds * 1000; // timestamp absoluto em ms
    await db.query(
      `UPDATE login_attempts 
         SET blocked_until = $1, updated_at = NOW()
       WHERE email = $2`,
      [blockedUntilMs, email]
    );
    return blockedUntilMs;
  }
}

module.exports = new LoginAttemptsRepository();
