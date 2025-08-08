const service = require('../services/bulaServices');

class BulaController {
  async create(req, res) {
    try {
      const bula = await service.create(req.body);
      res.status(201).json({
        message: 'Bula criada com sucesso',
        data: bula
      });
    } catch (err) {
      console.error('Erro ao criar bula:', err);
      if (err.name === 'ValidationError') {
        return res.status(400).json({ error: 'Dados inválidos: ' + err.message });
      }
      res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  async findAll(req, res) {
    try {
      const bulas = await service.findAll();
      res.status(200).json(bulas);
    } catch (err) {
      console.error('Erro ao listar bulas:', err);
      res.status(500).json({ error: 'Erro ao buscar bulas.' });
    }
  }

  async findById(req, res) {
    const { id } = req.params;

    try {
      const bula = await service.findById(id);
      if (!bula) {
        return res.status(404).json({ error: 'Bula não encontrada' });
      }
      res.status(200).json(bula);
    } catch (err) {
      console.error('Erro ao buscar bula:', err);
      if (err.name === 'CastError') {
        return res.status(400).json({ error: 'ID inválido. Formato incorreto.' });
      }
      res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  async findByMedicamentoId(req, res) {
    const { id_medicamento } = req.params;

    try {
      const bula = await service.findByMedicamentoId(id_medicamento);
      if (!bula) {
        return res.status(404).json({ error: 'Bula não encontrada para este medicamento' });
      }
      res.status(200).json(bula);
    } catch (err) {
      console.error('Erro ao buscar bula por medicamento:', err);
      if (err.name === 'CastError') {
        return res.status(400).json({ error: 'ID do medicamento inválido. Formato incorreto.' });
      }
      res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  async update(req, res) {
    const { id } = req.params;

    try {
      const bula = await service.update(id, req.body);
      if (!bula) {
        return res.status(404).json({ error: 'Bula não encontrada' });
      }
      res.status(200).json({
        message: 'Bula atualizada com sucesso',
        data: bula
      });
    } catch (err) {
      console.error('Erro ao atualizar bula:', err);
      if (err.name === 'ValidationError') {
        return res.status(400).json({ error: 'Dados inválidos: ' + err.message });
      }
      if (err.name === 'CastError') {
        return res.status(400).json({ error: 'ID inválido. Formato incorreto.' });
      }
      res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  async remove(req, res) {
    const { id } = req.params;

    try {
      const removed = await service.remove(id);
      if (!removed) {
        return res.status(404).json({ error: 'Bula não encontrada' });
      }
      res.status(200).json({
        message: 'Bula removida com sucesso',
        data: removed
      });
    } catch (err) {
      console.error('Erro ao remover bula:', err);
      if (err.name === 'CastError') {
        return res.status(400).json({ error: 'ID inválido. Formato incorreto.' });
      }
      res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }
}

module.exports = new BulaController();
