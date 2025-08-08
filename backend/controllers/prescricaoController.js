const service = require('../services/prescricaoServices');

class PrescricaoController {
  async findAll(req, res) {
    try {
      const prescricoes = await service.findAll();
      res.status(200).json(prescricoes);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar prescrições' });
    }
  }

  async findById(req, res) {
    try {
      const { id } = req.params;
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const prescricao = await service.findById(id);
      if (!prescricao) {
        return res.status(404).json({ error: 'Prescrição não encontrada' });
      }

      res.status(200).json(prescricao);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar prescrição' });
    }
  }

  async findByPacienteId(req, res) {
    try {
      const { id_paciente } = req.params;
      if (isNaN(id_paciente)) {
        return res.status(400).json({ error: 'ID do paciente inválido' });
      }

      const prescricoes = await service.findByPacienteId(id_paciente);
      if (!prescricoes || prescricoes.length === 0) {
        return res.status(404).json({ error: 'Nenhuma prescrição encontrada para este paciente' });
      }

      res.status(200).json(prescricoes);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar prescrições do paciente' });
    }
  }

  async findByMedicoId(req, res) {
    try {
      const { id_medico } = req.params;
      if (isNaN(id_medico)) {
        return res.status(400).json({ error: 'ID do médico inválido' });
      }

      const prescricoes = await service.findByMedicoId(id_medico);
      if (!prescricoes || prescricoes.length === 0) {
        return res.status(404).json({ error: 'Nenhuma prescrição encontrada para este médico' });
      }

      res.status(200).json(prescricoes);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar prescrições do médico' });
    }
  }

  async create(req, res) {
    try {
      const novaPrescricao = await service.create(req.body);
      res.status(201).json({
        message: 'Prescrição criada com sucesso',
        data: novaPrescricao
      });
    } catch (error) {
      if (error.message.includes('já existe')) {
        return res.status(409).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const prescricaoAtualizada = await service.update(id, req.body);
      if (!prescricaoAtualizada) {
        return res.status(404).json({ error: 'Prescrição não encontrado' });
      }

      res.status(200).json({
        message: 'Prescrição atualizada com sucesso',
        data: prescricaoAtualizada
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar prescrição' });
    }
  }

  async remove(req, res) {
    try {
      const { id } = req.params;
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const prescricaoRemovida = await service.remove(id);
      if (!prescricaoRemovida) {
        return res.status(404).json({ error: 'Prescrição não encontrada' });
      }

      res.status(200).json({
        message: 'Prescrição removida com sucesso',
        data: prescricaoRemovida
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao remover prescrição' });
    }
  }
}

module.exports = new PrescricaoController();
