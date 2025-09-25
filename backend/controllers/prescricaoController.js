const service = require('../services/prescricaoServices');
const generatePrescriptionPDF = require('../utils/Prescription-Pdf')

class PrescricaoController {
  async findAll(req, res, next) {
    try {
      const prescricoes = await service.findAll();
      res.status(200).json(prescricoes);
    } catch (error) {
      next(error);
    }
  }

  async findById(req, res, next) {
    try {
      const { id } = req.params;
      const prescricao = await service.findById(id);
      res.status(200).json(prescricao);
    } catch (error) {
      next(error);
    }
  }

  async findByPacienteId(req, res, next) {
    try {
      const { id_paciente } = req.params;
      const prescricoes = await service.findByPacienteId(id_paciente);
      res.status(200).json(prescricoes);
    } catch (error) {
      next(error);
    }
  }

  async findByMedicoCrm(req, res, next) {
    try {
      const { crm } = req.params;
      const prescricoes = await service.findByMedicoCrm(crm);
      res.status(200).json(prescricoes);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const prescricao = await service.create(req.body); // usar service, não repository diretamente
      return res.status(201).json(prescricao);
    } catch (error) {
      next(error); // delega ao middleware global
    }
  }
  

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const prescricao = await service.update(id, req.body);
      res.status(200).json({
        message: 'Prescrição atualizada com sucesso',
        data: prescricao
      });
    } catch (error) {
      next(error);
    }
  }

  async remove(req, res, next) {
    try {
      const { id } = req.params;
      const prescricao = await service.remove(id);
      res.status(200).json({
        message: 'Prescrição removida com sucesso',
        data: prescricao
      });
    } catch (error) {
      next(error);
    }
  }

  async download(req, res) {
    try {
      const { id } = req.params;
      const prescricao = await service.findById(id, { include: ['medicamentos'] }); 

      if (!prescricao) {
        return res.status(404).json({ message: 'Prescrição não encontrada' });
      }

      const pdfBuffer = generatePrescriptionPDF(prescricao);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=prescricao_${id}.pdf`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      res.status(500).json({ message: 'Erro ao gerar PDF' });
    }
  };

}

module.exports = new PrescricaoController();
