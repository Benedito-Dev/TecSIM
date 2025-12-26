const service = require('../services/farmaceuticosService');

class FarmaceuticosController {
  async create(req, res) {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Dados do farmacêutico não fornecidos.' });
      }

      const farmaceutico = await service.create(req.body);

      res.status(201).json({
        message: 'Farmacêutico criado com sucesso',
        data: farmaceutico
      });
    } catch (err) {
      console.error('Erro ao criar farmacêutico:', err);

      if (err.statusCode) {
        return res.status(err.statusCode).json({ error: err.message });
      }

      res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  async findAll(req, res) {
    try {
      const farmaceuticos = await service.getAll();
      res.status(200).json(farmaceuticos);
    } catch (err) {
      console.error('Erro ao listar farmacêuticos:', err);

      if (err.statusCode) {
        return res.status(err.statusCode).json({ error: err.message });
      }

      res.status(500).json({ error: 'Erro ao buscar farmacêuticos.' });
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

      const farmaceuticos = await service.search(q.trim());
      res.status(200).json(farmaceuticos);
    } catch (err) {
      console.error('Erro ao buscar farmacêuticos:', err);

      if (err.statusCode) {
        return res.status(err.statusCode).json({ error: err.message });
      }

      res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  async findById(req, res) {
    const { id } = req.params;
    try {
      if (!id || isNaN(Number(id))) {
        return res.status(400).json({ error: 'ID inválido. Deve ser um número.' });
      }

      const farmaceutico = await service.getById(id);
      res.status(200).json(farmaceutico);
    } catch (err) {
      console.error('Erro ao buscar farmacêutico por ID:', err);

      if (err.statusCode) {
        return res.status(err.statusCode).json({ error: err.message });
      }

      res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  async update(req, res) {
    const { id } = req.params;
    try {
      if (!id || isNaN(Number(id))) {
        return res.status(400).json({ error: 'ID inválido. Deve ser um número.' });
      }

      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Nenhum dado fornecido para atualização.' });
      }

      const farmaceutico = await service.update(id, req.body);
      res.status(200).json({
        message: 'Farmacêutico atualizado com sucesso',
        data: farmaceutico
      });
    } catch (err) {
      console.error('Erro ao atualizar farmacêutico:', err);

      if (err.statusCode) {
        return res.status(err.statusCode).json({ error: err.message });
      }

      res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  async remove(req, res) {
    const { id } = req.params;
    try {
      if (!id || isNaN(Number(id))) {
        return res.status(400).json({ error: 'ID inválido. Deve ser um número.' });
      }

      const removed = await service.remove(id);
      res.status(200).json({
        message: 'Farmacêutico removido com sucesso',
        data: removed
      });
    } catch (err) {
      console.error('Erro ao remover farmacêutico:', err);

      if (err.statusCode) {
        return res.status(err.statusCode).json({ error: err.message });
      }

      res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }
}

module.exports = new FarmaceuticosController();
