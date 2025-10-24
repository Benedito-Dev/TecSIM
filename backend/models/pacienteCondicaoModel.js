class PacienteCondicao {
  constructor({
    id_condicao,
    id_paciente,
    condicao,
    severidade,
    data_diagnostico,
    medicamentos_uso,
    observacoes,
    ativo,
    data_cadastro
  }) {
    this.id_condicao = id_condicao;
    this.id_paciente = id_paciente;
    this.condicao = condicao;
    this.severidade = severidade;
    this.data_diagnostico = data_diagnostico;
    this.medicamentos_uso = medicamentos_uso;
    this.observacoes = observacoes;
    this.ativo = ativo;
    this.data_cadastro = data_cadastro;
  }

  toJSON() {
    return {
      id_condicao: this.id_condicao,
      id_paciente: this.id_paciente,
      condicao: this.condicao,
      severidade: this.severidade,
      data_diagnostico: this.data_diagnostico,
      medicamentos_uso: this.medicamentos_uso,
      observacoes: this.observacoes,
      ativo: this.ativo,
      data_cadastro: this.data_cadastro
    };
  }

  toAuthJSON() {
    return {
      id_condicao: this.id_condicao,
      condicao: this.condicao,
      severidade: this.severidade
    };
  }
}

module.exports = PacienteCondicao;