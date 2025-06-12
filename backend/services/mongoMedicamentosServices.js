const connectMongo = require('../db/mongo');

async function inserirMedicamento(dados) {
  const db = await connectMongo();
  const colecao = db.collection('medicamentos');
  return await colecao.insertOne(dados);
}

async function listarMedicamentos() {
  const db = await connectMongo();
  const colecao = db.collection('medicamentos');
  return await colecao.find().toArray();
}

module.exports = {
  inserirMedicamento,
  listarMedicamentos,
};
