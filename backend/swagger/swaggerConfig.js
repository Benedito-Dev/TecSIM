const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Minha API Node com Swagger',
      version: '1.0.0',
      description: 'Documentação da API com Swagger',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
    components: {
      schemas: {
        Usuario: {
          type: 'object',
          properties: {
            nome: { type: 'string', example: 'João Silva' },
            email: { type: 'string', format: 'email', example: 'joao@example.com' },
            senha: { type: 'string', example: 'senha123', writeOnly: true },
            data_nascimento: { type: 'string', format: 'date', example: '1990-05-15' },
            peso_kg: { type: 'number', example: 75.5 },
            aceite_termos: { type: 'boolean', example: true }
          }
        },
        Medicamento: {
          type: 'object',
          required: ['nome', 'dosagem'],
          properties: {
            nome: { type: 'string', example: 'Dipirona' },
            dosagem: { type: 'string', example: '500mg' },
            laboratorio: { type: 'string', example: 'Neo Química' },
            quantidade: { type: 'integer', example: 10 },
            tipo: { type: 'string', example: 'analgesico' },
          }
        },
        InteracoesMedicamentos: {
          type: 'object',
          required: ['medicamento_id', 'medicamento_interagente_id', 'descricao'],
          properties: {
            medicamento_a_id: { type: 'integer', example: 100 },
            medicamento_b_id: { type: 'integer', example: 200 },
            descricao: { type: 'string', example: 'Pode causar aumento do risco de hemorragia' },
            nivel_risco: { type: 'string', example: 'alto' }
          }
        },
        OTPRequest: {
          type: 'object',
          required: ['email', 'otp'],
          properties: {
            email: { type: 'string', format: 'email', example: 'usuario@exemplo.com' },
          }
        },
        OTPVerifyRequest: {
          type: 'object',
          required: ['email', 'otp'],
          properties: {
            email: { type: 'string', format: 'email', example: 'usuario@exemplo.com' },
            otp: { type: 'string', example: '483920' },
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'], // Caminho dos arquivos onde estão os comentários Swagger
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
