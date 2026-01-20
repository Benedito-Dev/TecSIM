const Server = require('./server');

// Para Vercel - não inicia o servidor, apenas exporta o app
const server = new Server();

// Exporta o app do Express para o Vercel
module.exports = server.app;