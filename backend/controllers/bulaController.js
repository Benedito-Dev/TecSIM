const mongoose = require('mongoose');
const service = require('../services/bulaServices');

class BulaController {
  async create(req, res) {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'O corpo da requisição não pode estar vazio.' });
      }
      const bula = await service.create(req.body);
      res.status(201).json({ message: 'Bula criada com sucesso', data: bula });
    } catch (err) {
      console.error('Erro ao criar bula:', err);

      if (err.statusCode) {
        return res.status(err.statusCode).json({ error: err.message });
      }

      if (err.name === 'ValidationError') {
        return res.status(400).json({ error: `Dados inválidos: ${err.message}` });
      }

      if (err.name === 'ConflictError') {
        return res.status(409).json({ error: err.message });
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

      if (err.statusCode) {
        return res.status(err.statusCode).json({ error: err.message });
      }

      res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  async findById(req, res) {
    const { id } = req.params;
    // Como você está usando um banco relacional (Postgres) e não MongoDB, remova a validação com mongoose.
    // Usaremos a validação do serviço (isNaN)
    if (isNaN(Number(id))) {
      return res.status(400).json({ error: 'ID inválido. Informe um número válido.' });
    }

    try {
      const bula = await service.findById(Number(id));
      res.status(200).json(bula);
    } catch (err) {
      console.error('Erro ao buscar bula:', err);

      if (err.statusCode) {
        return res.status(err.statusCode).json({ error: err.message });
      }

      res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  async findByMedicamentoId(req, res) {
    const { id_medicamento } = req.params;
    if (isNaN(Number(id_medicamento))) {
      return res.status(400).json({ error: 'ID do medicamento inválido. Informe um número válido.' });
    }
    try {
      const bula = await service.findByMedicamentoId(Number(id_medicamento));
      res.status(200).json(bula);
    } catch (err) {
      console.error('Erro ao buscar bula por medicamento:', err);

      if (err.statusCode) {
        return res.status(err.statusCode).json({ error: err.message });
      }

      res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  async update(req, res) {
    const { id } = req.params;
    if (isNaN(Number(id))) {
      return res.status(400).json({ error: 'ID inválido. Informe um número válido.' });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'Nenhum dado fornecido para atualização.' });
    }

    try {
      const bula = await service.update(Number(id), req.body);
      res.status(200).json({ message: 'Bula atualizada com sucesso', data: bula });
    } catch (err) {
      console.error('Erro ao atualizar bula:', err);

      if (err.statusCode) {
        return res.status(err.statusCode).json({ error: err.message });
      }

      if (err.name === 'ValidationError') {
        return res.status(400).json({ error: `Dados inválidos: ${err.message}` });
      }

      res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  async remove(req, res) {
    const { id } = req.params;
    if (isNaN(Number(id))) {
      return res.status(400).json({ error: 'ID inválido. Informe um número válido.' });
    }
    try {
      const removed = await service.remove(Number(id));
      res.status(200).json({ message: 'Bula removida com sucesso', data: removed });
    } catch (err) {
      console.error('Erro ao remover bula:', err);

      if (err.statusCode) {
        return res.status(err.statusCode).json({ error: err.message });
      }

      res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }
}

module.exports = new BulaController();
