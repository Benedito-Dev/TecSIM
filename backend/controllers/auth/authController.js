const authService = require('../../services/auth/authService');

class AuthController {
  async login(req, res) {
    try {
      const { email, senha } = req.body;
      const ip = req.ip;
      const result = await authService.login(email, senha, ip);
      return res.status(200).json(result);
    } catch (error) {
      // Tratamento específico por código de erro
      console.log(error.code)
      if (error.code === 429) {
        const match = error.message.match(/(\d+)/);
        const cooldown = match ? parseInt(match[1], 10) : 60;
        return res.status(429).json({ 
          message: error.message, 
          cooldown: error.cooldown || cooldown 
        });
      }

      console.log(error.code)
      
      if (error.code === 401) {
        return res.status(401).json({ message: error.message });
      }
      
      if (error.code === 403) {
        return res.status(403).json({ message: error.message });
      }
      
      // Para erros de validação ou outros erros com código 400
      if (error.code === 400) {
        return res.status(400).json({ message: error.message });
      }
      
      // Backup para erros antigos (mantém compatibilidade)
      if (error.message.includes('Aguarde') || error.message.includes('cooldown')) {
        const match = error.message.match(/(\d+)/);
        const cooldown = match ? parseInt(match[1], 10) : 60;
        return res.status(429).json({ 
          message: error.message, 
          cooldown 
        });
      }
      
      // Erro genérico (não deve ocorrer com as novas implementações)
      console.error('Erro não tratado no login:', error);
      return res.status(500).json({ 
        message: 'Erro interno no servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async me(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
      }
      
      const usuario = await authService.verifyToken(token);
      return res.json(usuario);
    } catch (error) {
      // Tratamento específico por código de erro
      if (error.code === 401) {
        return res.status(401).json({ error: error.message });
      }
      
      if (error.code === 403) {
        return res.status(403).json({ error: error.message });
      }
      
      // Para erros sem código específico
      console.error('Erro no me:', error);
      return res.status(500).json({ 
        error: 'Erro interno no servidor',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new AuthController();