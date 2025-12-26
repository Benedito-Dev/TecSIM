const crypto = require('crypto');

class Farmaceutico {
  constructor({
    id,
    nome,
    email,
    senha,
    telefone,
    registro_crf,
    cargo,
    unidade,
    turno,
    data_admissao,
    especialidade,
    anos_experiencia,
    status,
    foto_perfil,
    data_atualizacao,
    data_cadastro,
    ativo
  }) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.senha = senha;
    this.telefone = telefone;
    this.registro_crf = registro_crf;
    this.cargo = cargo;
    this.unidade = unidade;
    this.turno = turno;
    this.data_admissao = data_admissao;
    this.especialidade = especialidade;
    this.anos_experiencia = anos_experiencia;
    this.status = status;
    this.foto_perfil = foto_perfil;
    this.data_atualizacao = data_atualizacao;
    this.data_cadastro = data_cadastro;
    this.ativo = ativo;
  }

  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      email: this.email,
      telefone: this.telefone,
      registro_crf: this.registro_crf,
      cargo: this.cargo,
      unidade: this.unidade,
      turno: this.turno,
      data_admissao: this.data_admissao,
      especialidade: this.especialidade,
      anos_experiencia: this.anos_experiencia,
      status: this.status,
      foto_perfil: this.foto_perfil,
      data_atualizacao: this.data_atualizacao,
      data_cadastro: this.data_cadastro,
      ativo: this.ativo
    };
  }

  toAuthJSON() {
    return {
      id: this.id,
      nome: this.nome,
      email: this.email,
      foto_perfil: this.foto_perfil,
      cargo: this.cargo,
      unidade: this.unidade
    };
  }

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

module.exports = Farmaceutico;
