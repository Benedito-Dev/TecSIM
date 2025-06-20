const connectMongo = require('../db/mongo');
const { ObjectId } = require('mongodb');

class MedicamentoRepository {
  constructor() {
    this.collectionName = 'Medicamentos';
  }

  async getCollection() {
    const db = await connectMongo();
    return db.collection(this.collectionName);
  }

  async create(data) {
    const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
    const documentToInsert = Array.isArray(parsedData) ? parsedData[0] : parsedData;

    const col = await this.getCollection();
    const result = await col.insertOne(documentToInsert);

    return { id: result.insertedId, ...documentToInsert };
  }

  async findAll() {
    const col = await this.getCollection();
    const documentos = await col.find().toArray();

    console.log('Documentos encontrados:', documentos.length);
    return documentos;
  }

  async findById(id) {
    const col = await this.getCollection();
    const documento = await col.findOne({ _id: new ObjectId(id) });

    console.log('Documento buscado por ID:', documento);
    return documento;
  }

  async update(id, data) {
    const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
    const updateData = Array.isArray(parsedData) ? parsedData[0] : parsedData;

    const col = await this.getCollection();
    const result = await col.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
    );

    console.log(result.value)

    return result.value;
  }

  async remove(id) {
    console.log('Removendo documento com ID:', id);

    const col = await this.getCollection();
    const result = await col.findOneAndDelete({ _id: new ObjectId(id) });

    return result.value;
  }
}

module.exports = new MedicamentoRepository();
