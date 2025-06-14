const InteracaoMedicamentosService = require('../services/interacoesService');

class InteracaoMedicamentosController {
  // Buscar todas as interações medicamentosas
  async getAll(req, res) {
    try {
      const interacoes = await InteracaoMedicamentosService.getAll();
      res.status(200).json(interacoes);
    } catch (error) {
      console.error('Erro ao buscar interações medicamentosas:', error);
      res.status(500).json({ error: 'Erro ao buscar interações medicamentosas.' });
    }
  }

  // Buscar interação por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const interacao = await InteracaoMedicamentosService.getById(id);

      if (!interacao) {
        return res.status(404).json({ error: 'Interação medicamentosa não encontrada.' });
      }

      res.status(200).json(interacao);
    } catch (error) {
      console.error('Erro ao buscar interação por ID:', error);
      res.status(500).json({ error: 'Erro ao buscar interação medicamentosa.' });
    }
  }

  // Criar nova interação medicamentosa
  async create(req, res) {
    try {
      const dados = req.body;
      const novaInteracao = await InteracaoMedicamentosService.create(dados);

      res.status(201).json({
        message: 'Interação medicamentosa criada com sucesso',
        data: novaInteracao
      });
    } catch (error) {
      console.error('Erro ao criar interação medicamentosa:', error);

      if (error.code === '23503') { // FK constraint (referência inválida)
        return res.status(400).json({ error: 'ID de medicamento inexistente.' });
      }

      res.status(500).json({ error: 'Erro ao criar interação medicamentosa.' });
    }
  }

  // Atualizar interação medicamentosa
  async update(req, res) {
    try {
      const { id } = req.params;
      const dados = req.body;

      // Evita alteração do ID
      delete dados.id;

      const interacaoAtualizada = await InteracaoMedicamentosService.update(id, dados);

      if (!interacaoAtualizada) {
        return res.status(404).json({ error: 'Interação não encontrada para atualizar.' });
      }

      res.status(200).json({
        message: 'Interação medicamentosa atualizada com sucesso',
        data: interacaoAtualizada
      });
    } catch (error) {
      console.error('Erro ao atualizar interação medicamentosa:', error);
      res.status(500).json({ error: 'Erro ao atualizar interação medicamentosa.' });
    }
  }

  // Remover interação medicamentosa
  async remove(req, res) {
    try {
      const { id } = req.params;
      const removida = await InteracaoMedicamentosService.remove(id);

      if (!removida) {
        return res.status(404).json({ error: 'Interação não encontrada para remoção.' });
      }

      res.status(200).json({ message: 'Interação medicamentosa removida com sucesso.' });
    } catch (error) {
      console.error('Erro ao remover interação medicamentosa:', error);
      res.status(500).json({ error: 'Erro ao remover interação medicamentosa.' });
    }
  }
}

module.exports = new InteracaoMedicamentosController();
