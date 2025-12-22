const refreshService = require('../../services/auth/refreshService');

class RefreshTokenController {
  async refresh(req, res) {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken || refreshToken.trim() === '') {
        return res.status(400).json({ 
          error: 'Refresh token é obrigatório' 
        });
      }

      const result = await refreshService.verifyAndRotate(refreshToken);
      
      return res.status(200).json({
        message: 'Token renovado com sucesso',
        ...result
      });
    } catch (error) {
      if (error.code === 401) {
        return res.status(401).json({ error: error.message });
      }
      
      console.error('Erro no refresh token:', error);
      return res.status(500).json({ 
        error: 'Erro interno no servidor' 
      });
    }
  }

  async revoke(req, res) {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken || refreshToken.trim() === '') {
        return res.status(400).json({ 
          error: 'Refresh token é obrigatório' 
        });
      }

      await refreshService.revoke(refreshToken);
      
      return res.status(200).json({
        message: 'Token revogado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao revogar token:', error);
      return res.status(500).json({ 
        error: 'Erro interno no servidor' 
      });
    }
  }

  async revokeAll(req, res) {
    try {
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ 
          error: 'ID do usuário é obrigatório' 
        });
      }

      await refreshService.revokeAllForUser(userId);
      
      return res.status(200).json({
        message: 'Todos os tokens do usuário foram revogados'
      });
    } catch (error) {
      console.error('Erro ao revogar todos os tokens:', error);
      return res.status(500).json({ 
        error: 'Erro interno no servidor' 
      });
    }
  }
}

module.exports = new RefreshTokenController();