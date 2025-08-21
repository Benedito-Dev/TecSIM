// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Verifica se o header existe
  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  // Separa "Bearer" e o token
  const [scheme, token] = authHeader.split(' ');

  // Valida o formato "Bearer <token>"
  if (!/^Bearer$/i.test(scheme) || !token) {
    return res.status(401).json({ error: 'Formato do token inválido. Use: Bearer <token>' });
  }

  try {
    const decoded = jwt.verify(token, authConfig.secret);

    // Salva infos no request para uso posterior
    req.userId = decoded.id || decoded.sub;
    req.user = decoded;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};
