class InteracaoMedicamentos {
  constructor({
    id,
    medicamento_a_id,
    medicamento_b_id,
    descricao_interacao,
    nivel_risco
  }) {
    this.id = id;
    this.medicamento_a_id = medicamento_a_id; // ID do medicamento A (provavelmente vindo do MongoDB)
    this.medicamento_b_id = medicamento_b_id; // ID do medicamento B
    this.descricao_interacao = descricao_interacao;
    this.nivel_risco = nivel_risco; // 'baixo' | 'moderado' | 'alto'
  }

  // Retorna todos os dados da interação
  toJSON() {
    return {
      id: this.id,
      medicamento_a_id: this.medicamento_a_id,
      medicamento_b_id: this.medicamento_b_id,
      descricao_interacao: this.descricao_interacao,
      nivel_risco: this.nivel_risco
    };
  }

  // Pode-se adicionar aqui um método para resumo ou exibição compacta
  toSummary() {
    return {
      medicamentos: [this.medicamento_a_id, this.medicamento_b_id],
      nivel_risco: this.nivel_risco
    };
  }
}

module.exports = InteracaoMedicamentos;
