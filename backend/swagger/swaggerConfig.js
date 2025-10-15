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
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
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
            genero: { type: 'string', example: 'masculino' },
            aceite_termos: { type: 'boolean', example: true },
            alergias: { type: 'array', items: { type: 'string', example: 'Amendoim' }, example: ['Amendoim', 'Lactose'] },
            medicacoes: { type: 'array', items: { type: 'string', example: 'Dipirona' }, example: ['Dipirona', 'Ibuprofeno'] },
            condicoes: { type: 'array', items: { type: 'string', example: 'Asma' }, example: ['Asma', 'Hipertensão'] },
          }
        },


        PacienteWithSenha: {
          type: 'object',
          properties: {
            cpf: { type: 'string', example: '224.297.389-48' },
            nome: { type: 'string', example: 'João Silva' },
            email: { type: 'string', format: 'email', example: 'joao@example.com' },
            senha: { type: 'string', example: 'd41d8cd98f00b204e9800998ecf8427e', readOnly: true, description: 'Senha criptografada (apenas neste endpoint)' },
            data_nascimento: { type: 'string', format: 'date', example: '1990-05-15' },
            peso_kg: { type: 'number', example: 75.5 },
            genero: { type: 'string', example: 'man' },
            aceite_termos: { type: 'boolean', example: true },
            data_cadastro: { type: 'string', format: 'date-time', example: '2025-06-30T12:34:56Z' },
            ativo: { type: 'boolean', example: true },
            foto_perfil: { type: 'string', example: 'http://localhost:3000/images/avatar.png' }
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


        Prescricao: {
          type: 'object',
          required: ['id_paciente', 'crm', 'diagnostico', 'data_prescricao'],
          properties: {
            id: { type: 'integer', example: 1 },
            id_paciente: { type: 'integer', example: 101 },
            crm: { type: 'string', example: 'CRM/SP 987654', description: 'CRM do médico responsável' },
            diagnostico: { type: 'string', example: 'Infecção urinária' },
            data_prescricao: { type: 'string', format: 'date', example: '2025-06-30' },
            validade: { type: 'string', format: 'date', example: '2025-07-15' },
            data_cadastro: { type: 'string', format: 'date-time', example: '2025-06-30T12:34:56Z' }
          }
        },


        PrescricaoRequest: {
          type: 'object',
          required: ['id_paciente', 'crm', 'diagnostico', 'data_prescricao', 'medicamentos'],
          properties: {
            id_paciente: { type: 'integer', example: 54 },
            crm: { type: 'string', example: 'CE23299', description: 'CRM do médico responsável' },
            diagnostico: { type: 'string', example: 'Paciente com infecção bacteriana' },
            observacoes: { type: 'string', example: 'Tomar bastante água', nullable: true },
            data_prescricao: { type: 'string', format: 'date', example: '2024-01-15' },
            medicamentos: {
              type: 'array',
              items: {
                type: 'object',
                required: ['id_medicamento', 'dosagem', 'frequencia', 'duracao_dias', 'via'],
                properties: {
                  id_medicamento: { type: 'integer', example: 10 },
                  dosagem: { type: 'string', example: '500mg' },
                  frequencia: { type: 'string', example: '8/8h' },
                  // nome: { type: 'string', example: 'Ibuprofeno' },
                  duracao_dias: { type: 'integer', example: 7 },
                  via: { type: 'string', example: 'oral', enum: ['oral', 'intravenosa', 'intramuscular', 'subcutânea', 'tópica', 'inalatória'] },
                  horarios: { type: 'string', example: '08h, 16h, 00h', nullable: true }
                }
              }
            }
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
            email: { type: 'string', format: 'email', example: 'usuario@exemplo.com' }
          }
        },


        OTPVerifyRequest: {
          type: 'object',
          required: ['email', 'otp'],
          properties: {
            email: { type: 'string', format: 'email', example: 'usuario@exemplo.com' },
            otp: { type: 'string', example: '483920' }
          }
        },


        Bula: {
          type: 'object',
          required: ['id_medicamento'],
          properties: {
            id: { type: 'integer', example: 1 },
            id_medicamento: { type: 'integer', example: 101 },
            dosagem_e_administracao: { type: 'array', items: { type: 'string' }, example: ['Tomar 1 comprimido a cada 8h', 'Administrar via oral com água'] },
            indicacoes: { type: 'array', items: { type: 'string' }, example: ['Dor de cabeça', 'Febre'] },
            contraindicacoes: { type: 'array', items: { type: 'string' }, example: ['Alergia à dipirona', 'Insuficiência hepática grave'] },
            advertencias: { type: 'array', items: { type: 'string' }, example: ['Evitar uso com bebidas alcoólicas', 'Não dirigir após o uso'] },
            interacoes_medicamentosas: { type: 'array', items: { type: 'string' }, example: ['Interage com anticoagulantes', 'Potencializa efeito de sedativos'] },
            armazenamento_e_validade: { type: 'array', items: { type: 'string' }, example: ['Conservar em temperatura ambiente', 'Validade de 2 anos']}
          }
        },

        Enfermeiro: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nome: { type: 'string', example: 'Ana Souza' },
            email: { type: 'string', format: 'email', example: 'ana.souza@example.com' },
            telefone: { type: 'string', example: '(11) 98888-7777' },
            registro_coren: { type: 'string', example: 'COREN/SP 123456' },
            cargo: { type: 'string', example: 'Enfermeiro' },
            unidade: { type: 'string', example: 'Unidade Centro' },
            turno: { type: 'string', example: 'Manhã' },
            data_admissao: { type: 'string', format: 'date', example: '2023-01-15' },
            especialidade: { type: 'string', example: 'Pediatria' },
            anos_experiencia: { type: 'integer', example: 5 },
            status: { type: 'string', example: 'Ativo', enum: ['Ativo', 'Inativo', 'Férias', 'Licença'] },
            foto_perfil: { type: 'string', example: 'http://localhost:3000/images/enfermeiro.png' },
            data_atualizacao: { type: 'string', format: 'date-time', example: '2025-06-30T12:34:56Z' },
            data_cadastro: { type: 'string', format: 'date-time', example: '2025-06-01T08:00:00Z' },
            ativo: { type: 'boolean', example: true }
          }
        },


        EnfermeiroWithSenha: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nome: { type: 'string', example: 'Ana Souza' },
            email: { type: 'string', format: 'email', example: 'ana.souza@example.com' },
            senha: { type: 'string', example: 'd41d8cd98f00b204e9800998ecf8427e', readOnly: true, description: 'Senha criptografada (apenas neste endpoint)' },
            telefone: { type: 'string', example: '(11) 98888-7777' },
            registro_coren: { type: 'string', example: 'COREN/SP 123456' },
            cargo: { type: 'string', example: 'Enfermeiro' },
            unidade: { type: 'string', example: 'Unidade Centro' },
            turno: { type: 'string', example: 'Manhã' },
            data_admissao: { type: 'string', format: 'date', example: '2023-01-15' },
            especialidade: { type: 'string', example: 'Pediatria' },
            anos_experiencia: { type: 'integer', example: 5 },
            status: { type: 'string', example: 'Ativo', enum: ['Ativo', 'Inativo', 'Férias', 'Licença'] },
            foto_perfil: { type: 'string', example: 'http://localhost:3000/images/enfermeiro.png' },
            data_atualizacao: { type: 'string', format: 'date-time', example: '2025-06-30T12:34:56Z' },
            data_cadastro: { type: 'string', format: 'date-time', example: '2025-06-01T08:00:00Z' },
            ativo: { type: 'boolean', example: true }
          }
        },


        Lembrete: {
          type: 'object',
          required: ['id_paciente', 'id_prescricao', 'id_medicamento', 'horario', 'data_inicio', 'data_fim', 'canal_envio'],
          properties: {
            id_lembrete: { type: 'integer', example: 1, description: 'ID único do lembrete (gerado automaticamente)' },
            id_paciente: { type: 'integer', example: 54, description: 'ID do paciente associado ao lembrete' },
            id_prescricao: { type: 'integer', example: 10, description: 'ID da prescrição associada ao lembrete' },
            id_medicamento: { type: 'integer', example: 5, description: 'ID do medicamento associado ao lembrete' },
            horario: { type: 'string', example: '08:00', description: 'Horário do lembrete no formato HH:MM' },
            data_inicio: { type: 'string', format: 'date', example: '2024-01-15', description: 'Data de início do lembrete' },
            data_fim: { type: 'string', format: 'date', example: '2024-01-22', description: 'Data de fim do lembrete' },
            canal_envio: { type: 'string', example: 'email', enum: ['email', 'sms', 'push', 'whatsapp'], description: 'Canal de envio do lembrete' },
            enviado: { type: 'boolean', example: false, default: false, description: 'Indica se o lembrete já foi enviado' },
            status: { type: 'boolean', example: true, default: true, description: 'Status do lembrete (ativo/inativo)' }
          }
        },


        LembreteRequest: {
          type: 'object',
          required: ['id_paciente', 'id_prescricao', 'id_medicamento', 'horario', 'data_inicio', 'data_fim', 'canal_envio'],
          properties: {
            id_paciente: { type: 'integer', example: 54, description: 'ID do paciente associado ao lembrete' },
            id_prescricao: { type: 'integer', example: 10, description: 'ID da prescrição associada ao lembrete' },
            id_medicamento: { type: 'integer', example: 5, description: 'ID do medicamento associado ao lembrete' },
            horario: { type: 'string', example: '08:00', description: 'Horário do lembrete no formato HH:MM' },
            data_inicio: { type: 'string', format: 'date', example: '2024-01-15', description: 'Data de início do lembrete' },
            data_fim: { type: 'string', format: 'date', example: '2024-01-22', description: 'Data de fim do lembrete' },
            canal_envio: { type: 'string', example: 'email', enum: ['email', 'sms', 'push', 'whatsapp'], description: 'Canal de envio do lembrete' },
            enviado: { type: 'boolean', example: false, default: false, description: 'Indica se o lembrete já foi enviado' },
            status: { type: 'boolean', example: true, default: true, description: 'Status do lembrete (ativo/inativo)' }
          }
        },


        LembreteUpdateRequest: {
          type: 'object',
          properties: {
            id_paciente: { type: 'integer', example: 54, description: 'ID do paciente associado ao lembrete' },
            id_prescricao: { type: 'integer', example: 10, description: 'ID da prescrição associada ao lembrete' },
            id_medicamento: { type: 'integer', example: 5, description: 'ID do medicamento associado ao lembrete' },
            horario: { type: 'string', example: '09:00', description: 'Horário do lembrete no formato HH:MM' },
            data_inicio: { type: 'string', format: 'date', example: '2024-01-16', description: 'Data de início do lembrete' },
            data_fim: { type: 'string', format: 'date', example: '2024-01-23', description: 'Data de fim do lembrete' },
            canal_envio: { type: 'string', example: 'sms', enum: ['email', 'sms', 'push', 'whatsapp'], description: 'Canal de envio do lembrete' },
            enviado: { type: 'boolean', example: true, description: 'Indica se o lembrete já foi enviado' },
            status: { type: 'boolean', example: false, description: 'Status do lembrete (ativo/inativo)' }
          }
        },

      }
    },
    security: [
      { bearerAuth: [] }
    ]
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;