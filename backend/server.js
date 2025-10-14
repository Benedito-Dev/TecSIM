require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const pacientesRoutes = require('./routes/pacientesRoutes');
const medicosRoutes = require('./routes/medicoRoutes');
const authRoutes = require('./routes/authRoutes');
const dbInit = require('./db/dbinit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swaggerConfig');
const medicamentoRoutes = require('./routes/medicamentosRoutes');
const prescricaoRoutes = require('./routes/prescricaoRoutes');
const bulaRoutes = require('./routes/bulaRoutes');
const compositionRoutes = require('./routes/openEHR/compositionRoutes');
const errorHandler = require('./middleware/errorHandler');

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
    this.app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { 
      swaggerOptions: { persistAuthorization: true } 
    }));
  }

  routes() {
    // Rotas existentes
    this.app.use('/pacientes', pacientesRoutes);
    this.app.use('/medicos', medicosRoutes);
    this.app.use('/auth', authRoutes);
    this.app.use('/medicamentos', medicamentoRoutes);
    this.app.use('/bulas', bulaRoutes);
    this.app.use('/prescricoes', prescricaoRoutes);

    // Rotas openEHR
    this.app.use('/ehr', compositionRoutes);

    // Rota base
    this.app.get('/', (req, res) => {
      res.send('API backend Tecsim de Pé!');
    });

    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        success: true,
        message: 'API funcionando normalmente',
        timestamp: new Date().toISOString()
      });
    });

    // Middlewares de erro
    this.app.use(errorHandler);
    this.app.use((req, res) => {
      res.status(404).json({
        success: false,
        message: 'Rota não encontrada'
      });
    });
  }

  async initDb() {
    try {
      await dbInit();
      console.log('✅ Banco de dados inicializado');
    } catch (err) {
      console.error('❌ Erro ao inicializar banco de dados:', err);
    }
  }

  async start() {
    try {
      await this.initDb();
      this.app.listen(this.port, () => {
        console.log(`🚀 Servidor rodando na porta ${this.port}`);
        console.log(`📚 Documentação: http://localhost:${this.port}/api-docs`);
        console.log(`❤️  Health Check: http://localhost:${this.port}/health`);
      });
    } catch (error) {
      console.error('💥 Falha crítica ao iniciar servidor:', error);
      process.exit(1);
    }
  }
}

module.exports = Server;