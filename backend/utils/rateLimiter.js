const loginAttemptsRepository = require('../repository/loginAttemptsRepository');

class RateLimiter {
  async check(email) {
    const attempt = await loginAttemptsRepository.findByEmail(email);
    if (!attempt) return { blocked: false, attempts: 0 };

    const now = Date.now();

    // Reset de tentativas se última tentativa foi há muito tempo
    if (attempt.last_attempt && now - new Date(attempt.last_attempt).getTime() > 15 * 60 * 1000) {
      await loginAttemptsRepository.reset(email);
      return { blocked: false, attempts: 0 };
    }

    if (attempt.blocked_until && attempt.blocked_until > now) {
      const cooldown = Math.ceil((attempt.blocked_until - now) / 1000);
      return { blocked: true, cooldown };
    }

    return { blocked: false, attempts: attempt.attempts };
  }

  async registerFailure(email, ip) {
    let attempt = await loginAttemptsRepository.findByEmail(email);

    if (!attempt) {
      await loginAttemptsRepository.create(email, ip);
      attempt = await loginAttemptsRepository.findByEmail(email);
    } else {
      await loginAttemptsRepository.increment(email);
      attempt.attempts += 1;
    }

    // Cooldown progressivo
    let blockSeconds = 0;
    switch (attempt.attempts) {
      case 3:
        blockSeconds = 30; break;
      case 4:
        blockSeconds = 60; break;
      case 5:
        blockSeconds = 300; break;
      case 6:
        blockSeconds = 900; break;
      default:
        if (attempt.attempts >= 7) blockSeconds = 3600; // 1h
    }

    if (blockSeconds > 0) {
      await loginAttemptsRepository.block(email, blockSeconds);
    }
  }

  async reset(email) {
    await loginAttemptsRepository.reset(email);
  }
}

module.exports = new RateLimiter();
