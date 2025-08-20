const loginAttemptsRepository = require('../repository/loginAttemptsRepository');

class RateLimiter {
  async check(email, ip) {
    const attempt = await loginAttemptsRepository.findByEmail(email);
    console.log('CHECK - Attempt encontrado:', attempt);

    if (!attempt) return { blocked: false, attempts: 0 };

    if (attempt.blocked_until) {
      const nowUTC = Date.now(); // timestamp em ms
      const blockedUntilUTC = new Date(attempt.blocked_until).getTime();
      
      console.log('CHECK - Now UTC:', nowUTC);
      console.log('CHECK - Blocked until UTC:', blockedUntilUTC);

      if (blockedUntilUTC > nowUTC) {
        const cooldown = Math.ceil((blockedUntilUTC - nowUTC) / 1000);
        console.log('CHECK - Cooldown seconds:', cooldown);
        return { blocked: true, cooldown };
      }
    }

    return { blocked: false, attempts: attempt.attempts };
  }

  async registerFailure(email, ip) {
    let attempt = await loginAttemptsRepository.findByEmail(email);
    console.log('Tentativa atual encontrada:', attempt);

    if (!attempt) {
      console.log('Primeira tentativa - criando registro');
      await loginAttemptsRepository.create(email, ip);
      return;
    }

    await loginAttemptsRepository.increment(email);
    const newAttempts = attempt.attempts + 1;
    console.log('Novo número de tentativas:', newAttempts);

    let blockSeconds = 0;
    if (newAttempts >= 10) blockSeconds = 3600; // 1 hora
    else if (newAttempts >= 5) blockSeconds = 300; // 5 min
    else if (newAttempts >= 3) blockSeconds = 30; // 30 s

    if (blockSeconds > 0) {
      console.log('Aplicando bloqueio de', blockSeconds, 'segundos');
      await loginAttemptsRepository.block(email, blockSeconds);
    } else {
      console.log('Ainda não atingiu limite para bloqueio');
    }
  }

  async reset(email) {
    console.log('Resetando tentativas para email:', email);
    await loginAttemptsRepository.reset(email);
  }
}

module.exports = new RateLimiter();
