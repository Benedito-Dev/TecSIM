class Medico {
  
constructor({ id, nome, crm, especialidade, email, senha, data_cadastro, ativo }) {
    console.log("constructor recebeu ativo:", ativo, typeof ativo);
    this.id = id;
    this.nome = nome;
    this.crm = crm; // CRM é único por médico
    this.especialidade = especialidade;
    this.email = email; // Adicionei email que é comum em cadastros
    this.senha = senha; // Nota: Em operações normais, evite expor a senha
    this.data_cadastro = data_cadastro || new Date().toISOString();
    this.ativo = ativo;
  }
  // Método para serialização segura (exclui a senha)
  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      crm: this.crm,
      especialidade: this.especialidade,
      email: this.email,
      data_cadastro: this.data_cadastro
    };
  }

  // Método para serialização com dados básicos (útil para JWT)
  toAuthJSON() {
    return {
      id: this.id,
      nome: this.nome,
      email: this.email,
      especialidade: this.especialidade,
      crm: this.crm
    };
  }

  // Método adicional específico para médicos
  getEspecialidade() {
    return this.especialidade;
  }

  // Validação básica do CRM (pode ser expandida)
  validarCRM() {
    return !!(this.crm && this.crm.length >= 4); // ✅ Retorna boolean
  }
}

module.exports = Medico;