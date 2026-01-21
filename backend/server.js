require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const pacientesRoutes = require('./routes/pacientesRoutes');
const medicosRoutes = require('./routes/medicoRoutes');
const farmaceuticoRoutes = require('./routes/farmaceuticosRoutes')
const authRoutes = require('./routes/authRoutes');
const dbInit = require('./db/dbinit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swaggerConfig');
const medicamentoRoutes = require('./routes/medicamentosRoutes');
const lembretesRoutes = require('./routes/lembreteRoutes')
const prescricaoRoutes = require('./routes/prescricaoRoutes');
const bulaRoutes = require('./routes/bulaRoutes');
const authMiddleware = require('./middleware/authMiddleware');

const errorHandler = require('./middleware/errorHandler'); // middleware global de erro

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

    // Pasta 'uploads' pública
    this.app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    // Swagger UI com CDN para funcionar no Vercel
    this.app.get('/swagger', (req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>TecSim API - Swagger UI</title>
          <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
          <style>
            html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
            *, *:before, *:after { box-sizing: inherit; }
            body { margin:0; background: #fafafa; }
          </style>
        </head>
        <body>
          <div id="swagger-ui"></div>
          <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
          <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
          <script>
            window.onload = function() {
              const ui = SwaggerUIBundle({
                url: '/api-docs.json',
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                  SwaggerUIBundle.presets.apis,
                  SwaggerUIStandalonePreset
                ],
                plugins: [
                  SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout",
                persistAuthorization: true,
                tryItOutEnabled: true
              });
            };
          </script>
        </body>
        </html>
      `);
    });

    // Rota para servir o JSON do Swagger
    this.app.get('/api-docs.json', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerSpec);
    });

    // Rota alternativa para documentação (sem Swagger UI)
    this.app.get('/api-docs', (req, res) => {
      res.setHeader('Content-Type', 'text/html');
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>TecSim API Documentation</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .endpoint { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
            .method { font-weight: bold; color: #fff; padding: 5px 10px; border-radius: 3px; }
            .post { background-color: #49cc90; }
            .get { background-color: #61affe; }
            pre { background-color: #f5f5f5; padding: 10px; border-radius: 3px; overflow-x: auto; }
          </style>
        </head>
        <body>
          <h1>TecSim API Documentation</h1>
          <p>Base URL: <strong>https://tecsim.vercel.app</strong></p>
          
          <div class="endpoint">
            <h3><span class="method post">POST</span> /auth/login</h3>
            <p>Autentica um usuário (paciente ou farmaceutico)</p>
            <pre>{
  "email": "usuario@example.com",
  "senha": "Senha@123",
  "tipo": "paciente"
}</pre>
          </div>
          
          <div class="endpoint">
            <h3><span class="method get">GET</span> /auth/me</h3>
            <p>Obtém informações do usuário autenticado</p>
            <p>Requer: Authorization: Bearer {token}</p>
          </div>
          
          <div class="endpoint">
            <h3><span class="method post">POST</span> /auth/request-otp</h3>
            <p>Envia código OTP para o email</p>
            <pre>{
  "email": "usuario@example.com"
}</pre>
          </div>
          
          <div class="endpoint">
            <h3><span class="method post">POST</span> /auth/verify-otp</h3>
            <p>Verifica código OTP</p>
            <pre>{
  "email": "usuario@example.com",
  "otp": "123456"
}</pre>
          </div>
          
          <p><a href="/swagger">🚀 Ver Swagger UI Completo</a> | <a href="/api-docs.json">Ver JSON</a></p>
        </body>
        </html>
      `);
    });
  }

  routes() {
    // 🔥 NOVA ROTA: Favicon - servindo arquivo real
    this.app.get('/favicon.ico', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
    });

    // Todas as outras rotas permanecem EXATAMENTE iguais
    this.app.use('/pacientes', pacientesRoutes);
    this.app.use('/medicos', medicosRoutes);
    this.app.use('/auth', authRoutes);
    this.app.use('/medicamentos', medicamentoRoutes);
    this.app.use('/bulas', bulaRoutes);
    this.app.use('/prescricoes', prescricaoRoutes);
    this.app.use('/lembretes', lembretesRoutes);
    this.app.use('/farmaceuticos', farmaceuticoRoutes)

    // Rota base
    this.app.get('/', (req, res) => {
      res.send('API backend Tecsim de Pé!');
    });

    // Middleware global de erros (último da cadeia)
    this.app.use(errorHandler);

    this.app.use((req, res, next) => {
      res.status(404).json({
        success: false,
        message: 'Rota não encontrada'
      });
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