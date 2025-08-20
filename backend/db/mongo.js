// db/mongo.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let dbInstance = null;

async function connectMongo() {
  try {
    if (!dbInstance) {
      await client.connect();
      console.log('✅ Conectado ao MongoDB');
      dbInstance = client.db(dbName);
    }
    return dbInstance;
  } catch (error) {
    console.error('❌ Erro na conexão com MongoDB:', error);
    process.exit(1);
  }
}

module.exports = connectMongo;
