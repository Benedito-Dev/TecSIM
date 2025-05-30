// db/dbInit.js
const db = require('./db'); // Importa a conexão com o banco de dados

// Script SQL para criar a tabela usuarios
const createTable = async () => {
  const checkTableQuery = `SELECT to_regclass('public.usuarios');`;

  try {
    const result = await db.query(checkTableQuery);

    // Verifica se a tabela já existe
    if (result.rows[0].to_regclass === null) {
      // Se a tabela não existir, cria a tabela
      const createQuery = `
        CREATE TABLE usuarios (
            id_usuario SERIAL PRIMARY KEY,
            nome VARCHAR(100) NOT NULL,
            email VARCHAR(150) UNIQUE NOT NULL,
            senha VARCHAR(255) NOT NULL,
            data_nascimento DATE,
            peso_kg DECIMAL(5,2),
            aceite_termos BOOLEAN DEFAULT TRUE,
            data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;
      await db.query(createQuery);  // Executa a criação da tabela
      console.log('Tabela "usuarios" criada com sucesso!');  // Exibe a mensagem apenas se a tabela foi criada
    } else {
      // Se a tabela já existir, não faz nada
      console.log('Tabela "usuarios" já existe.');
    }
  } catch (err) {
    console.error('Erro ao criar tabela "usuarios":', err.message);
  }
};

module.exports = createTable;