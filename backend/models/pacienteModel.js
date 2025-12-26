const crypto = require('crypto');

class Paciente {
  constructor({
    id,
    nome,
    email,
    senha,
    data_nascimento,
    peso_kg,
    genero,
    aceite_termos,
    data_cadastro,
    ativo,
    foto_perfil,
    cpf,
    telefone,
    endereco,
    alergias = [],
    medicacoes = [],
    condicoes = []
  }) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.senha = senha;
    this.data_nascimento = data_nascimento;
    this.peso_kg = peso_kg;
    this.genero = genero;
    this.aceite_termos = aceite_termos;
    this.data_cadastro = data_cadastro;
    this.ativo = ativo;
    this.foto_perfil = foto_perfil;
    this.cpf = cpf;
    this.telefone = telefone;
    this.endereco = endereco;
    this.alergias = alergias;
    this.medicacoes = medicacoes;
    this.condicoes = condicoes;
  }

  // Método para serialização segura
  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      email: this.email,
      data_nascimento: this.data_nascimento,
      peso_kg: this.peso_kg,
      genero: this.genero,
      aceite_termos: this.aceite_termos,
      data_cadastro: this.data_cadastro,
      ativo: this.ativo,
      foto_perfil: this.foto_perfil,
      cpf: this.cpf,
      telefone: this.telefone,
      endereco: this.endereco,
      alergias: this.alergias,
      medicacoes: this.medicacoes,
      condicoes: this.condicoes
    };
  }

  // Método para serialização com dados básicos
  toAuthJSON() {
    return {
      id: this.id,
      nome: this.nome,
      email: this.email,
      foto_perfil: this.foto_perfil
    };
  }

  // Retorno especial para o GET /id -> inclui senha criptografada
  toJSONWithEncryptedSenha(secret) {
    const base = this.toJSON();
    const key = secret || process.env.SHOW_PASS_SECRET || 'fallback-secret';

    let senhaCriptografada = null;
    if (this.senha) {
      senhaCriptografada = crypto
        .createHmac('sha256', key)
        .update(String(this.senha))
        .digest('hex');
    }

    return {
      ...base,
      senha: senhaCriptografada
    };
  }
}

module.exports = Paciente;