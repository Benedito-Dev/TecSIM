const connectMongo = require('../db/mongo');
const { ObjectId } = require('mongodb');

class MedicamentoRepository {
    constructor() {
        this.collectionName = 'medicamentos';
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
}

module.exports = new MedicamentoRepository();



