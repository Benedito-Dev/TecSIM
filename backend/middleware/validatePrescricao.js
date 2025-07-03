class ValidatePrescricao {
  static validateCreate(req, res, next) {
    const { id_paciente, id_medico, crm, diagnostico, data_prescricao } = req.body;

    if (!id_paciente || !id_medico || !crm || !diagnostico || !data_prescricao) {
      return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos' });
    }

    next();
  }

  static validateUpdate(req, res, next) {
    // Adicione validações específicas para atualização se necessário
    next();
  }
}

module.exports = ValidatePrescricao;
