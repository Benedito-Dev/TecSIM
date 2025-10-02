// require('dotenv').config();

// module.exports = {
//   secret: process.env.JWT_SECRET,
//   expiresIn: process.env.JWT_EXPIRES_IN || '1d'
// };

require('dotenv').config();

module.exports = {
  secret: process.env.JWT_SECRET || 'seu-segredo-de-acesso-super-secreto',
  expiresIn: '15m', // Token de acesso expira em 15 minutos
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'seu-segredo-de-refresh-ainda-mais-secreto',
  refreshExpiresIn: '7d' // Refresh token expira em 7 dias
};