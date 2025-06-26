// db/index.js
require('dotenv').config();

const { Pool } = require('pg');

// Cria pool usando a DATABASE_URL inteira
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Necessário para conexões com SSL como na Neon
  },
});

const query = (text, params) => pool.query(text, params);

module.exports = { query };
