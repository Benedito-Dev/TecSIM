// db/index.js
require('dotenv').config();

const { Pool } = require('pg');

// Cria pool usando a DATABASE_URL inteira
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // ssl: {
  //   rejectUnauthorized: false, // Necessário para conexões com SSL como na Neon
  // },
});

const query = (text, params) => pool.query(text, params);

// Adicione estas linhas para exportar os métodos necessários
module.exports = {
  query,
  connect: () => pool.connect(), // Isso resolve o erro "db.connect is not a function"
  pool // Exporta o pool completo se necessário
};