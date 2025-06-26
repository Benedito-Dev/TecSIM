const authService = require('../../services/auth/authService');

class AuthController {
  async login(req, res) {
    try {
      const { email, senha } = req.body;
      const result = await authService.login(email, senha);
      res.json(result);
    } catch (error) {
      res.status(401).json({ error: error.message });
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