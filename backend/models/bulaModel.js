class Bula {
  constructor({
    id,
    id_medicamento,
    dosagem_e_administracao,
    indicacoes,
    contraindicacoes,
    advertencias,
    interacoes_medicamentosas,
    armazenamento_e_validade
  }) {
    this.id = id;
    this.id_medicamento = id_medicamento;
    this.dosagem_e_administracao = dosagem_e_administracao;
    this.indicacoes = indicacoes;
    this.contraindicacoes = contraindicacoes;
    this.advertencias = advertencias;
    this.interacoes_medicamentosas = interacoes_medicamentosas;
    this.armazenamento_e_validade = armazenamento_e_validade;
  }

  // Método para serialização segura (exibe todos os campos, exceto campos sensíveis — se houvesse)
  toJSON() {
    return {
      id: this.id,
      id_medicamento: this.id_medicamento,
      dosagem_e_administracao: this.dosagem_e_administracao,
      indicacoes: this.indicacoes,
      contraindicacoes: this.contraindicacoes,
      advertencias: this.advertencias,
      interacoes_medicamentosas: this.interacoes_medicamentosas,
      armazenamento_e_validade: this.armazenamento_e_validade
    };
  }

  // Método para retornos simples, caso precise apenas dados básicos
  toAuthJSON() {
    return {
      id: this.id,
      id_medicamento: this.id_medicamento
    };
  }
}

module.exports = Bula;
