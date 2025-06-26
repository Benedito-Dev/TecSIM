class Paciente {
  constructor({ id_usuario, nome, email, senha, data_nascimento, peso_kg, genero, aceite_termos, data_cadastro }) {
    this.id_usuario = id_usuario;
    this.nome = nome;
    this.email = email;
    this.senha = senha; // Nota: Em operações normais, evite expor a senha
    this.data_nascimento = data_nascimento;
    this.peso_kg = peso_kg;
    this.genero = genero
    this.aceite_termos = aceite_termos;
    this.data_cadastro = data_cadastro;
  }

  // Método para serialização segura (exclui a senha)
  toJSON() {
    return {
      id_usuario: this.id_usuario,
      nome: this.nome,
      email: this.email,
      data_nascimento: this.data_nascimento,
      peso_kg: this.peso_kg,
      genero: this.genero,
      aceite_termos: this.aceite_termos,
      data_cadastro: this.data_cadastro
    };
  }

  // Método para serialização com dados básicos (útil para JWT)
  toAuthJSON() {
    return {
      id_usuario: this.id_usuario,
      nome: this.nome,
      email: this.email
    };
  }
}

module.exports = Paciente;