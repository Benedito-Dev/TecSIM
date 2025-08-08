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
      const prescricao = await service.findById(id);
      if (!prescricao) {
        return res.status(404).json({ error: 'Prescrição não encontrada.' });
      }
      res.status(200).json(prescricao);
    } catch (error) {
      if (error.message.includes('não encontrada')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro ao buscar prescrição' });
      }
    }
  }

  async findByPacienteId(req, res) {
    try {
      const { id_paciente } = req.params;
      const prescricoes = await service.findByPacienteId(id_paciente);
      res.status(200).json(prescricoes);
    } catch (error) {
      if (error.message.includes('Nenhuma prescrição')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro ao buscar prescrições' });
      }
    }
  }

  async findByMedicoId(req, res) {
    try {
      const { id_medico } = req.params;
      const prescricoes = await service.findByMedicoId(id_medico);
      res.status(200).json(prescricoes);
    } catch (error) {
      if (error.message.includes('Nenhuma prescrição')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro ao buscar prescrições' });
      }
    }
  }

  async create(req, res) {
    try {
      const prescricao = await service.create(req.body); // req.body precisa conter: id_paciente, id_medico, crm, diagnostico, data_prescricao, validade
      res.status(201).json({
        message: 'Prescrição criada com sucesso',
        data: prescricao
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const prescricao = await service.update(id, req.body); // req.body também deve conter crm
      if (!prescricao) {
        return res.status(404).json({ error: 'Prescrição não encontrada.' });
      }
      res.status(200).json({
        message: 'Prescrição atualizada com sucesso',
        data: prescricao
      });
    } catch (error) {
      if (error.message.includes('não encontrada')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro ao atualizar prescrição' });
      }
    }
  }

  async remove(req, res) {
    try {
      const { id } = req.params;
      const prescricao = await service.remove(id);
      if (!prescricao) {
        return res.status(404).json({ error: 'Prescrição não encontrada.' });
      }
      res.status(200).json({
        message: 'Prescrição removida com sucesso',
        data: prescricao
      });
    } catch (error) {
      if (error.message.includes('não encontrada')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro ao remover prescrição' });
      }
    }
  }
}

module.exports = new PrescricaoController();
