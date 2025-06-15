require('dotenv').config();

const otpRepository = require('../repository/otpRepository');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
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
      from: process.env.EMAIL_USER,
      to: email,
      subject: '🔐 Seu código OTP de verificação',
      text: `Seu código OTP é: ${otpCode}. Ele expira em 5 minutos.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px;">
          <h2 style="color:rgb(19, 190, 233);">Código de Verificação (OTP)</h2>
          <strong><p>Olá,</p></strong>
          <strong><p>Você solicitou um código de verificação para acessar sua conta.</p></strong>
          <p style="font-size: 18px;">Seu código é:</p>
          <div style="background-color: #f1f1f1; padding: 15px; border-radius: 8px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 3px;">
            ${otpCode}
          </div>
          <p style="margin-top: 20px; color:rgb(233, 18, 18); font-weight:bold;">Este código expira em 5 minutos.</p>
          <p style="color: #888;">Se você não solicitou este código, ignore este e-mail.</p>
          <br>
          <p style="color:rgb(1, 161, 41);">Atenciosamente,<br><strong>Equipe TecSim</strong></p>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Email OTP enviado para ${email}`);
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      // Pode tratar erro, ou lançar para a camada acima lidar
    }

    return otpData;
  }

  async verifyOtp(email, otp) {
    const storedOtp = await otpRepository.findByEmail(email);
    console.log(storedOtp)

    if (!storedOtp) return false;

    const now = new Date();
    const isExpired = new Date(storedOtp.expires_at) < now;

    // if (isExpired || storedOtp.verified) {
    //   return false;
    // }

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
