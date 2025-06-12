// db/mongo.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME;

const client = new MongoClient(uri);

async function connectMongo() {
  try {
    if (!client.topology || !client.topology.isConnected()) {
      await client.connect();
      console.log('✅ Conectado ao MongoDB');
    }
    const db = client.db(dbName);
    return db;
  } catch (error) {
    console.error('❌ Erro na conexão com MongoDB:', error.message);
    process.exit(1);
  }
}

module.exports = connectMongo;
