const crypto = require('crypto');

class Composition {
  constructor({
    id,
    composition_id,
    paciente_id, // ← RELACIONAMENTO COM SEU PACIENTE
    template_id,
    composition_data,
    version = 1,
    status = 'active',
    author,
    created_at,
    updated_at
  }) {
    this.id = id;
    this.composition_id = composition_id;
    this.paciente_id = paciente_id; // Chave estrangeira para seu paciente
    this.template_id = template_id;
    this.composition_data = composition_data;
    this.version = version;
    this.status = status;
    this.author = author;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // Método para serialização
  toJSON() {
    return {
      id: this.id,
      composition_id: this.composition_id,
      paciente_id: this.paciente_id,
      template_id: this.template_id,
      composition_data: this.composition_data,
      version: this.version,
      status: this.status,
      author: this.author,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }

  // Gerar ID único para composição
  static generateCompositionId() {
    return 'comp_' + Date.now() + '_' + crypto.randomBytes(8).toString('hex');
  }

  // Validação básica
  validate() {
    const errors = [];

    if (!this.paciente_id) {
      errors.push('paciente_id é obrigatório');
    }

    if (!this.template_id) {
      errors.push('template_id é obrigatório');
    }

    if (!this.composition_data) {
      errors.push('composition_data é obrigatório');
    }

    return errors;
  }
}

module.exports = Composition;