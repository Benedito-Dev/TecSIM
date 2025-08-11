class Prescricao {
  constructor({
    id,
    id_paciente,
    crm,
    diagnostico,
    data_prescricao,
    validade,
    data_cadastro
  }) {
    this.id = id;
    this.id_paciente = id_paciente;
    this.crm = crm;
    this.diagnostico = diagnostico;
    this.data_prescricao = data_prescricao;
    this.validade = validade;
    this.data_cadastro = data_cadastro;
  }

  toJSON() {
    return {
      id: this.id,
      id_paciente: this.id_paciente,
      crm: this.crm,
      diagnostico: this.diagnostico,
      data_prescricao: this.data_prescricao,
      validade: this.validade,
      data_cadastro: this.data_cadastro
    };
  }
}

module.exports = Prescricao;
