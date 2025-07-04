require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const pacientesRoutes = require('./routes/pacientesRoutes');
const medicosRoutes = require('./routes/medicoRoutes')
const authRoutes = require('./routes/authRoutes')
const precricoes = require('./routes/prescricaoRoutes');
const dbInit = require('./db/dbinit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swaggerConfig'); // <- import Swagger config
const connectMongo = require('./db/mongo');
const medicamentoRoutes = require('./routes/medicamentosRoutes');
const bulaRoutes = require('./routes/bulaRoutes');


class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.configureMiddlewares();
    this.routes();
    this.initDb();
  }

  configureMiddlewares() {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(morgan('dev'));

    // Documentação Swagger
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }

  routes() {
    this.app.use('/pacientes', pacientesRoutes);
    this.app.use('/medicos', medicosRoutes)
    this.app.use('/auth', authRoutes);
    this.app.use('/medicamentos', medicamentoRoutes);
    this.app.use('/bulas', bulaRoutes);
    this.app.use('/prescricoes', precricoes);
    this.app.get('/', (req, res) => {
      res.send('API backend Tecsim de Pé!');
    });

    this.app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ error: 'Erro interno do servidor.' });
    });
  }

  async initDb() {
    try {
      await dbInit();
      console.log('Tabela criada com sucesso!');
    } catch (err) {
      console.error('Erro ao criar a tabela: ', err);
    }
  }

  async start() { 
    try {
      await this.initDb(); 
      this.app.listen(this.port, () => {
        console.log(`Servidor rodando na porta ${this.port}`);
        console.log(`Documentação Swagger em http://localhost:${this.port}/api-docs`);
      });
    } catch (error) {
      console.error('Falha crítica ao iniciar o servidor:', error);
      process.exit(1); 
    }
  }
}

module.exports = Server;