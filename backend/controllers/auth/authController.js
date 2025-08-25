const authService = require('../../services/auth/authService');

class AuthController {
  async login(req, res) {
    try {
      const { email, senha } = req.body;
      const ip = req.ip;
      const result = await authService.login(email, senha, ip);
      return res.status(200).json(result);
    } catch (error) {
        if (error.message.includes('Aguarde') || error.message.includes('cooldown')) {
          // Bloqueio de tentativas
          const match = error.message.match(/(\d+)/);
          const cooldown = match ? parseInt(match[1], 10) : 60; // default 60s
          return res.status(429).json({ message: error.message, cooldown });
        }
        return res.status(400).json({ message: error.message });
      }
  }

  async me(req, res) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const usuario = await authService.verifyToken(token);
      res.json(usuario);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
}

module.exports = new AuthController();