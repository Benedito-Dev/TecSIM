const Server = require('./server');  // Importa a classe Server
const cors = require('cors');

const server = new Server();  // Cria uma instância do servidor
server.start();  // Inicia o servidor