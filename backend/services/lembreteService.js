const lembreteRepository = require('../repository/lembreteRepository');

class LembreteService {
  async getAll() {
    return await lembreteRepository.findAll();
  }

  async getById(id) {
    const lembrete = await lembreteRepository.findById(id);
    if (!lembrete) throw new Error('Lembrete não encontrado');
    return lembrete;
  }

  async create(data) {
    return await lembreteRepository.create(data);
  }

  async update(id, data) {
    await this.getById(id);
    return await lembreteRepository.update(id, data);
  }

  async delete(id) {
    await this.getById(id);
    return await lembreteRepository.delete(id);
  }
}

module.exports = new LembreteService();
