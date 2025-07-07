const repository = require('../repository/pacientesRepository');

class PacienteService {
  static async getAll() {
    const usuarios = await repository.findAll();
    return usuarios;  // Já é um array de objetos Usuario
  }

  static async getById(id) {
    const usuario = await repository.findById(id);
    return usuario;  // Pode ser null ou um objeto Usuario
  }

  static async getbyEmail(email) {
    const usuario = await repository.findByEmail(email);
    return usuario;  // Pode ser null ou um objeto Usuario
  }

  static async create(dados) {
    const novoUsuario = await repository.create(dados);
    return novoUsuario;  // Retorna um objeto Usuario
  }

  static async atualizarFoto(id, caminhoImagem) {
    const usuario = await repository.findById(id);

    if (!usuario) {
      throw new Error('Usuário não encontrado.');
    }

    await repository.atualizarFoto(id, caminhoImagem);
  }

  static async update(id, dados) {
    const usuarioAtualizado = await repository.update(id, dados);
    return usuarioAtualizado;  // Retorna um objeto usuario
  }

  static async updatePassword(id, senhaAtual, novaSenha) {
    const usuarioSenhaAtualizado = await repository.updatePassword(id, senhaAtual, novaSenha);
    return usuarioSenhaAtualizado;  // Retorna um objeto Usuario
  }

  static async desativar(id) {
    const paciente = await repository.desativar(id);
    if (!paciente) throw new Error('Paciente não encontrado para desativação');
    return paciente;
  }

  async verifyCredentials(email, senha) {
  const usuario = await repository.verifyCredentials(email);
  if (!usuario) throw new Error('Credenciais inválidas');

  const senhaMatch = await bcrypt.compare(senha, usuario.senha);
  if (!senhaMatch) throw new Error('Credenciais inválidas');
  
  console.log(usuario.ativo)
  if (usuario.ativo === false) {
    await repository.reativar(usuario.id);
    usuario.ativo = true;
  }

  return new Paciente({
    id: usuario.id,
    cpf: usuario.cpf,
    nome: usuario.nome,
    email: usuario.email,
    data_nascimento: usuario.data_nascimento,
    peso_kg: usuario.peso_kg,
    genero: usuario.genero,
    aceite_termos: usuario.aceite_termos,
    data_cadastro: usuario.data_cadastro,
    ativo: usuario.ativo
  }); 
  }

  static async remove(id) {
    const usuarioRemovido = await repository.remove(id);
    return usuarioRemovido;  // Retorna um objeto Usuario ou null
  }
}

module.exports = PacienteService;