const db = require('./db'); // ajuste o caminho se precisar

db.query('SELECT NOW()')
  .then(res => {
    console.log('Conexão OK, hora do banco:', res.rows[0]);
    process.exit(0);
  })
  .catch(err => {
    console.error('Erro de conexão:', err);
    process.exit(1);
  });
