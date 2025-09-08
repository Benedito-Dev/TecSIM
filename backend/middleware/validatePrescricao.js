class ValidatePrescricao {
  static validateCreate(req, res, next) {
    const { id_paciente, crm, diagnostico, data_prescricao, medicamentos } = req.body;

    // Validação dos campos obrigatórios da prescrição
    if (!id_paciente || !crm || !diagnostico || !data_prescricao) {
      return res.status(400).json({ error: 'Todos os campos obrigatórios da prescrição devem ser preenchidos' });
    }

    // Validação opcional dos medicamentos
    if (medicamentos) {
      if (!Array.isArray(medicamentos)) {
        return res.status(400).json({ error: 'Medicamentos deve ser um array' });
      }

      for (const med of medicamentos) {
        if (!med.id_medicamento || !med.dosagem || !med.frequencia || !med.duracao_dias || !med.via) {
          return res.status(400).json({
            error: 'Cada medicamento deve conter id_medicamento, dosagem, frequencia, duracao_dias e via'
          });
        }
      }
    }

    next();
  }

  static validateUpdate(req, res, next) {
    // Pode validar atualizações específicas no futuro
    next();
  }
}

module.exports = ValidatePrescricao;
