const db = require('../db/db');

class LoginAttemptsRepository {
  async findByEmail(email) {
    const result = await db.query(
      'SELECT * FROM login_attempts WHERE email = $1 LIMIT 1',
      [email]
    );
    console.log('findByEmail result:', result.rows[0]);
    return result.rows[0];
  }

  async create(email, ip) {
    console.log('Criando registro para:', email);
    await db.query(
      `INSERT INTO login_attempts (email, ip_address, attempts, created_at, updated_at) 
       VALUES ($1, $2, 1, NOW(), NOW())`,
      [email, ip]
    );
  }

  async increment(email) {
    console.log('Incrementando tentativas para:', email);
    await db.query(
      `UPDATE login_attempts 
       SET attempts = attempts + 1, last_attempt = NOW(), updated_at = NOW() 
       WHERE email = $1`,
      [email]
    );
  }

  async reset(email) {
    console.log('Resetando tentativas para email:', email);
    await db.query(
      `UPDATE login_attempts 
       SET attempts = 0, blocked_until = NULL, updated_at = NOW() 
       WHERE email = $1`,
      [email]
    );
  }

  async block(email, seconds) {
    console.log('Bloqueando', email, 'por', seconds, 'segundos');
    const result = await db.query(
      `UPDATE login_attempts 
       SET blocked_until = (NOW() AT TIME ZONE 'UTC') + ($1 || ' seconds')::interval,
           updated_at = NOW() 
       WHERE email = $2
       RETURNING *`,
      [seconds, email]
    );
    console.log('Resultado do bloqueio:', result.rows[0]);
  }
}

module.exports = new LoginAttemptsRepository();
