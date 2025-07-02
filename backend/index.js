const Server = require('./server');

// Inicia o servidor imediatamente quando o arquivo é executado
const server = new Server();
server.start();

// Exporta o app do Express para testes ou outros usos
module.exports = server.app;