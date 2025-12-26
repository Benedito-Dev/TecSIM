const db = require('./db');

const tables = [
  {
    name: 'paciente',
    createQuery: `
      CREATE TABLE paciente (
        id SERIAL PRIMARY KEY,
        cpf VARCHAR(14) UNIQUE NOT NULL,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        data_nascimento DATE,
        peso_kg NUMERIC(5,2),
        genero VARCHAR(100) NOT NULL,
        aceite_termos BOOLEAN DEFAULT TRUE,
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ativo BOOLEAN,
        foto_perfil TEXT,
        CONSTRAINT paciente_cpf_key UNIQUE (cpf),
        CONSTRAINT paciente_email_key UNIQUE (email)
      );
    `
  },
  {
    name: 'login_attempts',
    createQuery: `
      CREATE TABLE login_attempts (
        id SERIAL PRIMARY KEY,           
        email VARCHAR(255) NOT NULL,     
        ip_address VARCHAR(45),          
        attempts INT DEFAULT 0,          
        blocked_until BIGINT NULL,
        last_attempt TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `
  },
  {
    name: 'medicos',
    createQuery: `
      CREATE TABLE medicos (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        crm VARCHAR(20) NOT NULL,
        especialidade VARCHAR(100),
        email VARCHAR(150) NOT NULL,
        senha VARCHAR(255) NOT NULL,
        telefone VARCHAR(16) NOT NULL,
        ativo BOOLEAN NOT NULL DEFAULT TRUE,
        CONSTRAINT medicos_crm_key UNIQUE (crm),
        CONSTRAINT medicos_email_key UNIQUE (email)
      );
    `
  },
  {
    name: 'farmaceuticos',
    createQuery: `
      CREATE TABLE farmaceuticos (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        telefone VARCHAR(16) NOT NULL,
        registro_crf VARCHAR(30) UNIQUE NOT NULL,
        cargo VARCHAR(100) DEFAULT 'Farmacêutico',
        unidade VARCHAR(150),
        turno VARCHAR(50),
        data_admissao DATE,
        especialidade VARCHAR(100),
        anos_experiencia INTEGER,
        status VARCHAR(20) DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Inativo', 'Férias', 'Licença')),
        foto_perfil TEXT,
        data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ativo BOOLEAN DEFAULT TRUE
      );
    `
  },
  {
    name: 'medicamentos',
    createQuery: `
      CREATE TABLE medicamentos (
        id_medicamento SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        tipo VARCHAR(50),
        descricao TEXT,
        faixa_etaria_minima INTEGER,
        faixa_etaria_maxima INTEGER,
        contraindicacoes TEXT,
        interacoes_comuns TEXT,
        composicao TEXT,
        dosagem_padrao VARCHAR(50),
        bula_detalhada TEXT
      );
    `
  },
  {
    name: 'bulas',
    createQuery: `
      CREATE TABLE bulas (
        id SERIAL PRIMARY KEY,
        id_medicamento INTEGER NOT NULL,
        dosagem_e_administracao TEXT[],
        indicacoes TEXT[],
        contraindicacoes TEXT[],
        advertencias TEXT[],
        interacoes_medicamentosas TEXT[],
        armazenamento_e_validade TEXT[],
        CONSTRAINT bulas_id_medicamento_key UNIQUE (id_medicamento),
        CONSTRAINT fk_bula_medicamento FOREIGN KEY (id_medicamento) REFERENCES medicamentos(id_medicamento) ON DELETE CASCADE
      );
    `
  },
  {
    name: 'prescricoes',
    createQuery: `
      CREATE TABLE prescricoes (
        id_prescricao SERIAL PRIMARY KEY,
        id_paciente INTEGER NOT NULL,
        crm VARCHAR(20),
        diagnostico TEXT NOT NULL,
        data_prescricao DATE NOT NULL,
        validade DATE,
        data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT prescricoes_crm_fkey FOREIGN KEY (crm) REFERENCES medicos(crm) ON UPDATE CASCADE ON DELETE SET NULL,
        CONSTRAINT prescricoes_paciente_fkey FOREIGN KEY (id_paciente) REFERENCES paciente(id) ON DELETE CASCADE
      );
    `
  },
  {
    name: 'medicamentos_prescritos',
    createQuery: `
      CREATE TABLE medicamentos_prescritos (
        id_medicamento_prescrito SERIAL PRIMARY KEY,
        id_prescricao INTEGER NOT NULL,
        id_medicamento INTEGER NOT NULL,
        dosagem VARCHAR(50),
        frequencia VARCHAR(50),
        duracao_dias INTEGER,
        horarios VARCHAR(255),
        via VARCHAR(50),
        CONSTRAINT medicamentos_prescritos_id_prescricao_fkey FOREIGN KEY (id_prescricao) REFERENCES prescricoes(id_prescricao) ON UPDATE CASCADE ON DELETE CASCADE,
        CONSTRAINT medicamentos_prescritos_id_medicamento_fkey FOREIGN KEY (id_medicamento) REFERENCES medicamentos(id_medicamento)
      );
    `
  },
  {
    name: 'lembretes',
    createQuery: `
      CREATE TABLE lembretes (
        id_lembrete SERIAL PRIMARY KEY,
        id_paciente INTEGER NOT NULL,
        id_prescricao INTEGER NOT NULL,
        id_medicamento INTEGER NOT NULL,
        horario TIME NOT NULL,
        data_inicio DATE NOT NULL,
        data_fim DATE NOT NULL,
        canal_envio VARCHAR(20) NOT NULL CHECK (canal_envio IN ('App', 'WhatsApp', 'Email')),
        enviado BOOLEAN NOT NULL DEFAULT FALSE,
        CONSTRAINT lembretes_id_prescricao_fkey FOREIGN KEY (id_prescricao) REFERENCES prescricoes(id_prescricao) ON UPDATE CASCADE ON DELETE RESTRICT,
        CONSTRAINT lembretes_id_paciente_fkey FOREIGN KEY (id_paciente) REFERENCES paciente(id) ON DELETE CASCADE,
        CONSTRAINT lembretes_id_medicamento_fkey FOREIGN KEY (id_medicamento) REFERENCES medicamentos(id_medicamento)
      );
    `
  },
  {
    name: 'favoritos',
    createQuery: `
      CREATE TABLE favoritos (
        id_favorito SERIAL PRIMARY KEY,
        id_paciente INTEGER NOT NULL,
        tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('medicamento', 'sintoma')),
        referencia_id INTEGER NOT NULL,
        data_favoritado TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT favoritos_id_paciente_fkey FOREIGN KEY (id_paciente) REFERENCES paciente(id) ON DELETE CASCADE
      );
    `
  },
  {
    name: 'historico_interacoes',
    createQuery: `
      CREATE TABLE historico_interacoes (
        id_historico SERIAL PRIMARY KEY,
        id_paciente INTEGER NOT NULL,
        tipo VARCHAR(30) NOT NULL CHECK (tipo IN ('busca', 'dosagem', 'interacao', 'simulacao')),
        descricao TEXT,
        data_hora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT historico_interacoes_id_paciente_fkey FOREIGN KEY (id_paciente) REFERENCES paciente(id) ON DELETE CASCADE
      );
    `
  },
  {
    name: 'otps',
    createQuery: `
      CREATE TABLE otps (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        otp VARCHAR(10) NOT NULL,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        verified BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        attempts INTEGER NOT NULL DEFAULT 0
      );
    `
  }
];

const createTables = async () => {
  try {
    for (const table of tables) {
      const checkTableQuery = `SELECT to_regclass('public.${table.name}');`;
      const result = await db.query(checkTableQuery);

      if (result.rows[0].to_regclass === null) {
        await db.query(table.createQuery);
        console.log(`✅ Tabela "${table.name}" criada com sucesso!`);
      } else {
        console.log(`ℹ️  Tabela "${table.name}" já existe.`);
      }
    }
  } catch (err) {
    console.error('❌ Erro ao criar tabelas:', err.message);
  }
};

module.exports = createTables;