// db/dbInit.js
const db = require('./db');

const tables = [
  {
    name: 'pacientes',
    createQuery: `
      CREATE TABLE pacientes (
        id_usuario SERIAL PRIMARY KEY,
        CPF VARCHAR(11) UNIQUE NOT NULL,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        data_nascimento DATE,
        peso_kg DECIMAL(5,2),
        genero VARCHAR(100) NOT NULL,
        aceite_termos BOOLEAN DEFAULT TRUE,
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `
  },
  {
    name: 'medicos',
    createQuery: `
      CREATE TABLE medicos (
        id_medico SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        crm VARCHAR(20) UNIQUE NOT NULL,
        especialidade VARCHAR(100)
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
        faixa_etaria_minima INT,
        faixa_etaria_maxima INT,
        contraindicacoes TEXT,
        interacoes_comuns TEXT,
        composicao TEXT,
        dosagem_padrao VARCHAR(50),
        bula_detalhada TEXT
      );
    `
  },
  {
    name: 'prescricoes',
    createQuery: `
      CREATE TABLE prescricoes (
        id_prescricao SERIAL PRIMARY KEY,
        id_usuario INT NOT NULL,
        id_medico INT NOT NULL,
        diagnostico TEXT NOT NULL,
        data_prescricao DATE NOT NULL,
        validade DATE,
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
        FOREIGN KEY (id_medico) REFERENCES medicos(id_medico)
      );
    `
  },
  {
    name: 'medicamentos_prescritos',
    createQuery: `
      CREATE TABLE medicamentos_prescritos (
        id_medicamento_prescrito SERIAL PRIMARY KEY,
        id_prescricao INT NOT NULL,
        id_medicamento INT NOT NULL,
        dosagem VARCHAR(50),
        frequencia VARCHAR(50),
        duracao_dias INT,
        horarios VARCHAR(255),
        via VARCHAR(50),
        FOREIGN KEY (id_prescricao) REFERENCES prescricoes(id_prescricao),
        FOREIGN KEY (id_medicamento) REFERENCES medicamentos(id_medicamento)
      );
    `
  },
  {
    name: 'lembretes',
    createQuery: `
      CREATE TABLE lembretes (
        id_lembrete SERIAL PRIMARY KEY,
        id_usuario INT NOT NULL,
        id_prescricao INT NOT NULL,
        id_medicamento INT NOT NULL,
        horario TIME NOT NULL,
        data_inicio DATE NOT NULL,
        data_fim DATE NOT NULL,
        canal_envio VARCHAR(20) CHECK (canal_envio IN ('App', 'WhatsApp', 'Email')),
        enviado BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
        FOREIGN KEY (id_prescricao) REFERENCES prescricoes(id_prescricao),
        FOREIGN KEY (id_medicamento) REFERENCES medicamentos(id_medicamento)
      );
    `
  },
  {
    name: 'favoritos',
    createQuery: `
      CREATE TABLE favoritos (
        id_favorito SERIAL PRIMARY KEY,
        id_usuario INT NOT NULL,
        tipo VARCHAR(20) CHECK (tipo IN ('medicamento', 'sintoma')),
        referencia_id INT NOT NULL,
        data_favoritado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
      );
    `
  },
  {
    name: 'historico_interacoes',
    createQuery: `
      CREATE TABLE historico_interacoes (
        id_historico SERIAL PRIMARY KEY,
        id_usuario INT NOT NULL,
        tipo VARCHAR(30) CHECK (tipo IN ('busca', 'dosagem', 'interacao', 'simulacao')),
        descricao TEXT,
        data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
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
        verified BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        attempts INTEGER DEFAULT 0
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
