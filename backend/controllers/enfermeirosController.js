const service = require('../services/enfermeirosService');

class EnfermeirosController {
  async create(req, res) {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Dados do enfermeiro não fornecidos.' });
      }

      const enfermeiro = await service.create(req.body);

      res.status(201).json({
        message: 'Enfermeiro criado com sucesso',
        data: enfermeiro
      });
    } catch (err) {
      console.error('Erro ao criar enfermeiro:', err);

      if (err.statusCode) {
        return res.status(err.statusCode).json({ error: err.message });
      }

      res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  async findAll(req, res) {
    try {
      const enfermeiros = await service.getAll();
      res.status(200).json(enfermeiros);
    } catch (err) {
      console.error('Erro ao listar enfermeiros:', err);

      if (err.statusCode) {
        return res.status(err.statusCode).json({ error: err.message });
      }

      res.status(500).json({ error: 'Erro ao buscar enfermeiros.' });
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

      const enfermeiros = await service.search(q.trim());
      res.status(200).json(enfermeiros);
    } catch (err) {
      console.error('Erro ao buscar enfermeiros:', err);

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

      const enfermeiro = await service.getById(id);
      res.status(200).json(enfermeiro);
    } catch (err) {
      console.error('Erro ao buscar enfermeiro por ID:', err);

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

      const enfermeiro = await service.update(id, req.body);
      res.status(200).json({
        message: 'Enfermeiro atualizado com sucesso',
        data: enfermeiro
      });
    } catch (err) {
      console.error('Erro ao atualizar enfermeiro:', err);

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
        message: 'Enfermeiro removido com sucesso',
        data: removed
      });
    } catch (err) {
      console.error('Erro ao remover enfermeiro:', err);

      if (err.statusCode) {
        return res.status(err.statusCode).json({ error: err.message });
      }

      res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }
}

module.exports = new EnfermeirosController();
