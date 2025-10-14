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
        // SCHEMAS EXISTENTES (mantenha os que você já tem)
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
        
        // NOVO SCHEMA - Composition
        Composition: {
          type: 'object',
          required: ['paciente_id', 'template_id', 'composition_data'],
          properties: {
            id: { 
              type: 'integer', 
              example: 1,
              description: 'ID interno da composição'
            },
            composition_id: {
              type: 'string',
              example: 'comp_1704038400000_abc123def',
              description: 'ID único da composição openEHR'
            },
            paciente_id: {
              type: 'integer',
              example: 1,
              description: 'ID do paciente relacionado'
            },
            template_id: {
              type: 'string',
              enum: ['BLOOD_PRESSURE_V1', 'HEART_RATE_V1', 'TEMPERATURE_V1', 'SYMPTOMS_V1', 'MEDICATION_V1'],
              example: 'BLOOD_PRESSURE_V1',
              description: 'Template openEHR utilizado'
            },
            composition_data: {
              type: 'object',
              description: 'Dados clínicos no formato openEHR',
              example: {
                systolic: 120,
                diastolic: 80,
                heart_rate: 72,
                position: 'sentado',
                arm: 'direito',
                timestamp: '2024-01-15T10:30:00Z',
                notes: 'Paciente em repouso'
              }
            },
            version: {
              type: 'integer',
              example: 1,
              description: 'Versão da composição'
            },
            status: {
              type: 'string',
              enum: ['active', 'modified', 'inactive'],
              example: 'active',
              description: 'Status da composição'
            },
            author: {
              type: 'string',
              example: 'dr.silva',
              description: 'Autor da composição'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00Z'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00Z'
            },
            paciente_nome: {
              type: 'string',
              example: 'João Silva',
              description: 'Nome do paciente (apenas em consultas)'
            }
          }
        },

        // Blood Pressure Data Schema
        BloodPressureData: {
          type: 'object',
          required: ['systolic', 'diastolic'],
          properties: {
            systolic: {
              type: 'integer',
              minimum: 50,
              maximum: 250,
              example: 120,
              description: 'Pressão arterial sistólica (mmHg)'
            },
            diastolic: {
              type: 'integer',
              minimum: 30,
              maximum: 150,
              example: 80,
              description: 'Pressão arterial diastólica (mmHg)'
            },
            heart_rate: {
              type: 'integer',
              minimum: 30,
              maximum: 250,
              example: 72,
              description: 'Frequência cardíaca (bpm)'
            },
            position: {
              type: 'string',
              enum: ['sentado', 'deitado', 'em pé'],
              example: 'sentado',
              description: 'Posição do paciente durante a medição'
            },
            arm: {
              type: 'string',
              enum: ['direito', 'esquerdo'],
              example: 'direito',
              description: 'Braço utilizado para medição'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00Z'
            },
            notes: {
              type: 'string',
              example: 'Paciente relatou tontura'
            }
          }
        },

        // Heart Rate Data Schema
        HeartRateData: {
          type: 'object',
          required: ['rate'],
          properties: {
            rate: {
              type: 'integer',
              minimum: 30,
              maximum: 250,
              example: 72,
              description: 'Frequência cardíaca (bpm)'
            },
            rhythm: {
              type: 'string',
              enum: ['regular', 'irregular'],
              example: 'regular',
              description: 'Ritmo cardíaco'
            },
            method: {
              type: 'string',
              enum: ['manual', 'eletrônico'],
              example: 'manual',
              description: 'Método de medição'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00Z'
            },
            notes: {
              type: 'string',
              example: 'Medido após repouso de 5 minutos'
            }
          }
        },

        // Temperature Data Schema
        TemperatureData: {
          type: 'object',
          required: ['value'],
          properties: {
            value: {
              type: 'number',
              format: 'float',
              minimum: 35,
              maximum: 42,
              example: 36.5,
              description: 'Temperatura corporal (°C)'
            },
            method: {
              type: 'string',
              enum: ['axilar', 'oral', 'retal', 'timpânica'],
              example: 'axilar',
              description: 'Método de medição'
            },
            time_of_day: {
              type: 'string',
              example: 'manhã',
              description: 'Período do dia da medição'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00Z'
            },
            notes: {
              type: 'string',
              example: 'Paciente com febre baixa'
            }
          }
        },

        // Symptoms Data Schema
        SymptomsData: {
          type: 'object',
          required: ['symptoms'],
          properties: {
            symptoms: {
              type: 'array',
              items: { type: 'string' },
              example: ['cefaleia', 'tontura', 'náusea'],
              description: 'Lista de sintomas'
            },
            severity: {
              type: 'string',
              enum: ['leve', 'moderado', 'grave'],
              example: 'moderado',
              description: 'Severidade dos sintomas'
            },
            duration: {
              type: 'string',
              example: '2 horas',
              description: 'Duração dos sintomas'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00Z'
            },
            notes: {
              type: 'string',
              example: 'Sintomas começaram após alimentação'
            }
          }
        },

        // Medication Data Schema
        MedicationData: {
          type: 'object',
          required: ['name'],
          properties: {
            name: {
              type: 'string',
              example: 'Paracetamol',
              description: 'Nome da medicação'
            },
            dose: {
              type: 'string',
              example: '500mg',
              description: 'Dosagem'
            },
            frequency: {
              type: 'string',
              example: '8/8 horas',
              description: 'Frequência de administração'
            },
            route: {
              type: 'string',
              enum: ['oral', 'sublingual', 'tópico', 'inalatório', 'injetável'],
              example: 'oral',
              description: 'Via de administração'
            },
            start_date: {
              type: 'string',
              format: 'date',
              example: '2024-01-15'
            },
            end_date: {
              type: 'string',
              format: 'date',
              example: '2024-01-20'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00Z'
            },
            notes: {
              type: 'string',
              example: 'Tomar após as refeições'
            }
          }
        },

        // SCHEMAS EXISTENTES (mantenha todos os outros que você já tem)
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
    },
    security: [
      { bearerAuth: [] }
    ]
  },
  apis: ['./routes/*.js', './routes/openEHR/*.js'] // ← ATUALIZEI AQUI para incluir as rotas openEHR
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;