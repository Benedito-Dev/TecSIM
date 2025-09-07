require('dotenv').config();
const { Pool } = require('pg');

// Cria pool usando a variável correta do Neon
const pool = new Pool({
  connectionString: process.env.POSTGRES_URI,  // <- usar a variável correta
  ssl: {
    rejectUnauthorized: false, // necessário para Neon
  },
});

const query = (text, params) => pool.query(text, params);

module.exports = { query };
