const otpRepository = require('../repository/otpRepository');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tecsimassistente@gmail.com',
    pass: 'TecSim123'
  }
});

class OtpService {
  async generateAndSaveOtp(email) {
    const otpCode = this.generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos

    await otpRepository.deleteByEmail(email);

    const otpData = {
      email,
      otp: otpCode,
      expires_at: expiresAt
    };

    await otpRepository.save(otpData);

    // Aqui envia o email
    const mailOptions = {
      from: 'seu-email@gmail.com',
      to: email,
      subject: 'Seu código OTP',
      text: `Seu código OTP é: ${otpCode}. Ele expira em 5 minutos.`,
      // você pode usar html: '<p>Seu código OTP é <b>${otpCode}</b></p>'
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Email OTP enviado para ${email}`);
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      // Pode tratar erro, ou lançar para a camada acima lidar
    }

    console.log(`[OTP Enviado] Para: ${email} | Código: ${otpCode}`);

    return otpData;
  }

  async verifyOtp(email, otp) {
    const storedOtp = await otpRepository.findByEmail(email);

    if (!storedOtp) return false;

    const now = new Date();
    const isExpired = new Date(storedOtp.expires_at) < now;

    if (isExpired || storedOtp.verified) {
      return false;
    }

    if (storedOtp.attempts >= 3) {
      return false;
    }

    const isMatch = storedOtp.otp === otp;

    if (!isMatch) {
      await otpRepository.incrementAttempts(storedOtp.id);
      return false;
    }

    await otpRepository.markAsVerified(storedOtp.id);

    return true;
  }

  async getAll() {
    return await otpRepository.findAll();
  }

  async getByEmail(email) {
    return await otpRepository.findByEmail(email);
  }

  async removeExpiredOtps() {
    return await otpRepository.deleteExpired();
  }

  generateOtp() {
    return crypto.randomInt(100000, 999999).toString();
  }
}

module.exports = new OtpService();
