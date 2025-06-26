const service = require('../services/medicamentosService');
const { ObjectId } = require('mongodb');

class MedicamentoController {
  async create(req, res) {
    try {
      const medicamento = await service.create(req.body);
      res.status(201).json({
        message: 'Medicamento criado com sucesso',
        data: medicamento
      });
    } catch (err) {
      console.error('Erro ao criar medicamento:', err);
      res.status(400).json({ error: err.message });
    }
  }

  async findAll(req, res) {
    try {
      const medicamentos = await service.findAll();
      res.status(200).json(medicamentos);
    } catch (err) {
      console.error('Erro ao listar medicamentos:', err);
      res.status(500).json({ error: 'Erro ao buscar medicamentos.' });
    }
  }

  async findById(req, res) {
    const { id } = req.params;
    
    try {
      const medicamento = await service.findById(id);
      if (!medicamento) {
        return res.status(404).json({ error: 'Medicamento não encontrado' });
      }
      res.status(200).json(medicamento);
    } catch (err) {
      console.error('Erro ao buscar medicamento:', err);
      res.status(500).json({ error: err.message });
    }
  }

  async update(req, res) {
    const { id } = req.params;

    try {
      const medicamento = await service.update(id, req.body);
      console.log(id)
      if (!medicamento) {
        return res.status(404).json({ error: 'Medicamento não encontrado' });
      }
      res.status(200).json({
        message: 'Medicamento atualizado com sucesso',
        data: medicamento
      });
    } catch (err) {
      console.error('Erro ao atualizar medicamento:', err);
      res.status(500).json({ error: err.message });
    }
  }

  async remove(req, res) {
    const { id } = req.params;

    try {
      const removed = await service.remove(id);
      if (!removed) {
        return res.status(404).json({ error: 'Medicamento não encontrado' });
      }
      res.status(200).json({
        message: 'Medicamento removido com sucesso',
        data: removed
      });
    } catch (err) {
      console.error('Erro ao remover medicamento:', err);
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new MedicamentoController();
