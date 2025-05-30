const repository = require('../repository/usuarioRepository');

class UsuarioService {
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

  static async update(id, dados) {
    const usuarioAtualizado = await repository.update(id, dados);
    return usuarioAtualizado;  // Retorna um objeto usuario
  }

  static async updatePassword(id, novaSenha) {
    const usuarioSenhaAtualizado = await repository.updatePassword(id, novaSenha);
    return usuarioSenhaAtualizado;  // Retorna um objeto Usuario
  }

  static async remove(id) {
    const usuarioRemovido = await repository.remove(id);
    return usuarioRemovido;  // Retorna um objeto Usuario ou null
  }
}

module.exports = UsuarioService;