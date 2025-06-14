const OtpService = require('../services/otpService');

class OtpController {
  async sendOtp(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email é obrigatório.' });
      }

      const novoOtp = await OtpService.generateAndSaveOtp(email);

      res.status(201).json({
        message: 'OTP gerado e enviado com sucesso.',
        data: {
          email: novoOtp.email,
          expires_at: novoOtp.expires_at.toISOString(),
        }
      });
    } catch (error) {
      console.error('Erro ao gerar OTP:', error);
      res.status(500).json({ error: 'Erro ao gerar OTP.' });
    }
  }

  async verifyOtp(req, res) {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({ error: 'Email e OTP são obrigatórios.' });
      }

      const isValid = await OtpService.verifyOtp(email, otp);

      if (!isValid) {
        return res.status(400).json({ error: 'OTP inválido, expirado ou tentativas excedidas.' });
      }

      res.status(200).json({ message: 'OTP verificado com sucesso.' });
    } catch (error) {
      console.error('Erro ao verificar OTP:', error);
      res.status(500).json({ error: 'Erro ao verificar OTP.' });
    }
  }

  async getAll(req, res) {
    try {
      const otps = await OtpService.getAll();

      // Serializa para JSON simples (sem métodos)
      const otpsJSON = otps.map(otp => ({
        id: otp.id,
        email: otp.email,
        otp: otp.otp,
        expires_at: otp.expires_at.toISOString(),
        verified: otp.verified,
        created_at: otp.created_at.toISOString(),
        attempts: otp.attempts
      }));

      res.status(200).json(otpsJSON);
    } catch (error) {
      console.error('Erro ao buscar OTPs:', error);
      res.status(500).json({ error: 'Erro ao buscar OTPs.' });
    }
  }

  async getByEmail(req, res) {
    try {
      const { email } = req.params;

      const otp = await OtpService.getByEmail(email);

      if (!otp) {
        return res.status(404).json({ error: 'OTP não encontrado para este e-mail.' });
      }

      const otpJSON = {
        id: otp.id,
        email: otp.email,
        otp: otp.otp,
        expires_at: otp.expires_at.toISOString(),
        verified: otp.verified,
        created_at: otp.created_at.toISOString(),
        attempts: otp.attempts
      };

      res.status(200).json(otpJSON);
    } catch (error) {
      console.error('Erro ao buscar OTP por email:', error);
      res.status(500).json({ error: 'Erro ao buscar OTP.' });
    }
  }

  async removeExpired(req, res) {
    try {
      await OtpService.removeExpiredOtps();
      res.status(200).json({ message: 'OTPs expirados removidos com sucesso.' });
    } catch (error) {
      console.error('Erro ao remover OTPs expirados:', error);
      res.status(500).json({ error: 'Erro ao remover OTPs expirados.' });
    }
  }
}

module.exports = new OtpController();
