const lembreteService = require('../services/lembreteService');

class LembreteController {
  async getAll(req, res) {
    try {
      const lembretes = await lembreteService.getAll();
      res.json(lembretes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const lembrete = await lembreteService.getById(req.params.id);
      res.json(lembrete);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async create(req, res) {
    try {
      const novoLembrete = await lembreteService.create(req.body);
      res.status(201).json(novoLembrete);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const lembreteAtualizado = await lembreteService.update(req.params.id, req.body);
      res.json(lembreteAtualizado);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async delete(req, res) {
    try {
      await lembreteService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
}

module.exports = new LembreteController();
