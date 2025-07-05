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
        Paciente: {
          type: 'object',
          properties: {
            cpf: { type: 'string', example: '224.297.389-48' },
            nome: { type: 'string', example: 'João Silva' },
            email: { type: 'string', format: 'email', example: 'joao@example.com' },
            senha: { type: 'string', example: 'senha123', writeOnly: true },
            data_nascimento: { type: 'string', format: 'date', example: '1990-05-15' },
            peso_kg: { type: 'number', example: 75.5 },
            genero: { type: 'string', example: 'man'  },
            aceite_termos: { type: 'boolean', example: true }
          }
        },
        Medicamento: {
          type: 'object',
          required: ['nome', 'dosagem_padrao'],
          properties: {
            id_medicamento: { type: 'integer', example: 1 },
            nome: { type: 'string', example: 'Dipirona' },
            tipo: { type: 'string', example: 'analgésico' },
            descricao: { type: 'string', example: 'Analgésico e antitérmico' },
            faixa_etaria_minima: { type: 'integer', example: 12 },
            faixa_etaria_maxima: { type: 'integer', example: 99 },
            contraindicacoes: { type: 'string', example: 'Hipersensibilidade' },
            interacoes_comuns: { type: 'string', example: 'Interação com anticoagulantes' },
            composicao: { type: 'string', example: 'Dipirona sódica 500mg' },
            dosagem_padrao: { type: 'string', example: '500mg' },
            bula_detalhada: { type: 'string', example: 'Tomar 1 comprimido...' }
          }
        },
        Medico: {
          type: 'object',
          required: ['nome', 'crm', 'especialidade'],
          properties: {
            nome: { type: 'string', example: 'Dr. Carlos Alberto' },
            crm: { type: 'string', example: 'CRM/SP 123456' },
            especialidade: { type: 'string', example: 'Cardiologia' },
            email: { type: 'string', format: 'email', example: 'carlos.alberto@exemplo.com' },
            senha: { type: 'string', example: 'senha123', writeOnly: true },
            telefone: { type: 'string', example: '(11) 99999-8888' },
            ativo: { type: 'boolean', example: true }
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
          required: ['email'],
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
        },
        Bula: {
          type: 'object',
          required: ['id_medicamento'],
          properties: {
            id: { type: 'integer', example: 1 },
            id_medicamento: { type: 'integer', example: 101 },
            dosagem_e_administracao: {
              type: 'array',
              items: { type: 'string' },
              example: ['Tomar 1 comprimido a cada 8h', 'Administrar via oral com água']
            },
            indicacoes: {
              type: 'array',
              items: { type: 'string' },
              example: ['Dor de cabeça', 'Febre']
            },
            contraindicacoes: {
              type: 'array',
              items: { type: 'string' },
              example: ['Alergia à dipirona', 'Insuficiência hepática grave']
            },
            advertencias: {
              type: 'array',
              items: { type: 'string' },
              example: ['Evitar uso com bebidas alcoólicas', 'Não dirigir após o uso']
            },
            interacoes_medicamentosas: {
              type: 'array',
              items: { type: 'string' },
              example: ['Interage com anticoagulantes', 'Potencializa efeito de sedativos']
            },
            armazenamento_e_validade: {
              type: 'array',
              items: { type: 'string' },
              example: ['Conservar em temperatura ambiente', 'Validade de 2 anos']
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;