class OTP {
  constructor({ id, email, otp, expires_at, verified = false, created_at = new Date(), attempts = 0 }) {
    this.id = id;
    this.email = email;
    this.otp = otp; // normalmente não expor o OTP diretamente, cuidado
    this.expires_at = expires_at;
    this.verified = verified;
    this.created_at = created_at;
    this.attempts = attempts;
  }

  // Método para serialização segura (exclui o otp, por segurança)
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      expires_at: this.expires_at,
      verified: this.verified,
      created_at: this.created_at,
      attempts: this.attempts
    };
  }

  // Método para serialização básica (útil para respostas mínimas)
  toBasicJSON() {
    return {
      id: this.id,
      email: this.email,
      verified: this.verified
    };
  }
}

module.exports = OTP;
