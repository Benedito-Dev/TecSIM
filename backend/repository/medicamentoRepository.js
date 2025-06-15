const connectMongo = require('../db/mongo');
const { ObjectId } = require('mongodb');

class MedicamentoRepository {
    constructor() {
        this.collectionName = 'Medicamentos';
    }

    async getCollection() {
        const db = await connectMongo();
        return db.collection(this.collectionName)
    }

    async create(data) {
      // Verifica se data é uma string e faz o parse para objeto/array
      const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
      
      // Se for um array, pega o primeiro elemento (como no seu exemplo)
      const documentToInsert = Array.isArray(parsedData) ? parsedData[0] : parsedData;
      
      console.log('Dados a serem inseridos:', documentToInsert);
      
      const col = await this.getCollection();
      const result = await col.insertOne(documentToInsert);
      
      return { id: result.insertedId, ...documentToInsert }; // Corrigido para insertedId
  }

    async findAll() {
        const col = await this.getCollection();
        return await col.find().toArray();
    }

    async findById(id) {
    const col = await this.getCollection();
    return await col.findOne({ _id: new ObjectId(id) });
  }

  async update(id, data) {
    const col = await this.getCollection();
    const result = await col.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: 'after' }
    );
    return result.value;
  }

  async remove(id) {
    const col = await this.getCollection();
    const result = await col.findOneAndDelete({ _id: new ObjectId(id) });
    return result.value;
  }
}

module.exports = new MedicamentoRepository();



