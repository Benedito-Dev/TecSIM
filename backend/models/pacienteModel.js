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
    foto_perfil, // Adicionado
    cpf // Adicionado pois vi que vem do banco (opcional)
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
    this.foto_perfil = foto_perfil; // Adicionado
    this.cpf = cpf; // Adicionado (opcional)
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
      foto_perfil: this.foto_perfil, // Adicionado
      cpf: this.cpf // Adicionado (opcional)
    };
  }

  // Método para serialização com dados básicos
  toAuthJSON() {
    return {
      id: this.id,
      nome: this.nome,
      email: this.email,
      foto_perfil: this.foto_perfil // Adicionado (opcional)
    };
  }
}

module.exports = Paciente;