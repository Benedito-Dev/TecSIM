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
            }
        }
        }
  },
  apis: ['./routes/*.js'], // arquivos com os comentários Swagger
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;