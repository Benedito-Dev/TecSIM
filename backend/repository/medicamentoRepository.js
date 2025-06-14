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
        const col = await this.getCollection();
        const result = await col.insertOne(data);
        return { id: result.insertId, ...data };
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



