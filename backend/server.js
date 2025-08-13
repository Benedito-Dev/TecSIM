require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const pacientesRoutes = require('./routes/pacientesRoutes');
const medicosRoutes = require('./routes/medicoRoutes')
const authRoutes = require('./routes/authRoutes')
const dbInit = require('./db/dbinit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swaggerConfig'); // <- import Swagger config
const medicamentoRoutes = require('./routes/medicamentosRoutes');
const prescricaoRoutes = require('./routes/prescricaoRoutes')
const bulaRoutes = require('./routes/bulaRoutes');
const authMiddleware = require('./middleware/authMiddleware');


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

    // 🔓 Torna a pasta 'uploads' pública
    this.app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


    // Documentação Swagger
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { swaggerOptions: { persistAuthorization: true } }));
  }

  routes() {
    //Rotas públicas(sem jwt)
    this.app.use('/auth', authRoutes);
    
    //Rotas com jwt
    this.app.use('/pacientes', authMiddleware, pacientesRoutes);
    this.app.use('/medicos', authMiddleware, medicosRoutes)
    this.app.use('/medicamentos', authMiddleware, medicamentoRoutes);
    this.app.use('/bulas', authMiddleware, bulaRoutes);
    this.app.use('/prescricoes', authMiddleware, prescricaoRoutes)
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