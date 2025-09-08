const service = require('../services/medicamentosService');
const { ObjectId } = require('mongodb');

class MedicamentoController {
  async create(req, res) {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Dados do medicamento não fornecidos.' });
      }

      const medicamento = await service.create(req.body);

      res.status(201).json({
        message: 'Medicamento criado com sucesso',
        data: medicamento
      });
    } catch (err) {
      console.error('Erro ao criar medicamento:', err);

      // Se erro customizado (possui statusCode), responde conforme
      if (err.statusCode) {
        return res.status(err.statusCode).json({ error: err.message });
      }

      // Erro inesperado
      res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  async findAll(req, res) {
    try {
      const medicamentos = await service.findAll();
      res.status(200).json(medicamentos);
    } catch (err) {
      console.error('Erro ao listar medicamentos:', err);

      if (err.statusCode) {
        return res.status(err.statusCode).json({ error: err.message });
      }

      res.status(500).json({ error: 'Erro ao buscar medicamentos.' });
    }
  }

  async search(req, res) {
    try {
      const { q } = req.query;
      
      if (!q || q.trim().length < 2) {
        return res.status(400).json({ 
          error: 'Parâmetro de busca (q) é obrigatório e deve ter pelo menos 2 caracteres.' 
        });
      }
      
      const medicamentos = await service.search(q.trim());
      res.status(200).json(medicamentos);
    } catch (err) {
      console.error('Erro ao buscar medicamentos:', err);

      if (err.statusCode) {
        return res.status(err.statusCode).json({ error: err.message });
      }

      res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  async findById(req, res) {
    const { id } = req.params;
    try {
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID inválido. Formato incorreto.' });
      }

      const medicamento = await service.findById(id);
      res.status(200).json(medicamento);
    } catch (err) {
      console.error('Erro ao buscar medicamento por ID:', err);

      if (err.statusCode) {
        return res.status(err.statusCode).json({ error: err.message });
      }

      res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  async update(req, res) {
    const { id } = req.params;
    try {
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID inválido. Formato incorreto.' });
      }

      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Nenhum dado fornecido para atualização.' });
      }

      const medicamento = await service.update(id, req.body);
      res.status(200).json({
        message: 'Medicamento atualizado com sucesso',
        data: medicamento
      });
    } catch (err) {
      console.error('Erro ao atualizar medicamento:', err);

      if (err.statusCode) {
        return res.status(err.statusCode).json({ error: err.message });
      }

      res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  async remove(req, res) {
    const { id } = req.params;
    try {
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID inválido. Formato incorreto.' });
      }

      const removed = await service.remove(id);
      res.status(200).json({
        message: 'Medicamento removido com sucesso',
        data: removed
      });
    } catch (err) {
      console.error('Erro ao remover medicamento:', err);

      if (err.statusCode) {
        return res.status(err.statusCode).json({ error: err.message });
      }

      res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }
}

module.exports = new MedicamentoController();