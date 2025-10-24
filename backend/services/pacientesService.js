const repository = require('../repository/pacientesRepository');
const { ValidationError, ConflictError, NotFoundError } = require('../utils/errors');
const { isValidEmail, isValidCPF } = require('../utils/validationUtils');
const bcrypt = require('bcrypt');
const Paciente = require('../models/pacienteModel');

class PacienteService {
  static async getAll() {
    const pacientes = await repository.findAll();
    return pacientes;
  }

  static async getById(id) {
    // Validação mais robusta
    if (id === null || id === undefined || id === '' || isNaN(Number(id))) {
      throw new ValidationError('ID inválido. Informe um número válido.');
    }
    
    const paciente = await repository.findById(id);
    if (!paciente) throw new NotFoundError('Paciente não encontrado.');
    
    return paciente;
  }

  static async getByEmail(email) {
    if (!email || !isValidEmail(email)) {
      throw new ValidationError('Email inválido.');
    }

    const paciente = await repository.findByEmail(email);
    if (!paciente) throw new NotFoundError('Paciente não encontrado.');
    
    return paciente;
  }

  static async create(dados) {
    const { email, cpf, nome } = dados;

    if (!email || !isValidEmail(email)) {
      throw new ValidationError('Email inválido ou não fornecido.');
    }
    
    if (!cpf || !isValidCPF(cpf)) {
      throw new ValidationError('CPF inválido ou não fornecido.');
    }
    
    if (!nome || nome.trim().length < 3) {
      throw new ValidationError('Nome deve ter pelo menos 3 caracteres.');
    }

    const existingByEmail = await repository.findByEmail(email);
    if (existingByEmail) {
      throw new ConflictError('Email já cadastrado.');
    }

    const existingByCPF = await repository.findByCPF(cpf);
    if (existingByCPF) {
      throw new ConflictError('CPF já cadastrado.');
    }

    const novoPaciente = await repository.create(dados);
    return novoPaciente;
  }

  static async update(id, dados) {
    if (isNaN(id)) throw new ValidationError('ID inválido.');

    delete dados.senha;
    delete dados.id_paciente;
    delete dados.data_cadastro;

    const existing = await repository.findById(id);
    if (!existing) throw new NotFoundError('Paciente não encontrado.');

    if (dados.email && dados.email !== existing.email) {
      const existingByEmail = await repository.findByEmail(dados.email);
      if (existingByEmail) {
        throw new ConflictError('Email já cadastrado.');
      }
    }

    if (dados.cpf && dados.cpf !== existing.cpf) {
      const existingByCPF = await repository.findByCPF(dados.cpf);
      if (existingByCPF) {
        throw new ConflictError('CPF já cadastrado.');
      }
    }

    const pacienteAtualizado = await repository.update(id, dados);
    return pacienteAtualizado;
  }

  static async updatePassword(id, senhaAtual, novaSenha) {
    if (!senhaAtual || !novaSenha) {
      throw new ValidationError('Senha atual e nova senha são obrigatórias.');
    }

    if (novaSenha.length < 6) {
      throw new ValidationError('Nova senha deve ter pelo menos 6 caracteres.');
    }

    const paciente = await repository.findById(id);
    if (!paciente) throw new NotFoundError('Paciente não encontrado.');

    const resultado = await repository.updatePassword(id, senhaAtual, novaSenha);
    if (!resultado) {
      throw new ValidationError('Senha atual incorreta.');
    }

    return resultado;
  }

  static async desativar(id) {
    if (isNaN(id)) throw new ValidationError('ID inválido.');

    const paciente = await repository.desativar(id);
    if (!paciente) throw new NotFoundError('Paciente não encontrado.');

    return paciente;
  }

  static async remove(id) {
    if (isNaN(id)) throw new ValidationError('ID inválido.');

    const resultado = await repository.remove(id);
    if (!resultado) throw new NotFoundError('Paciente não encontrado.');

    return resultado;
  }

  static async atualizarFoto(id, caminhoImagem) {
    if (!id || isNaN(id)) {
      throw new ValidationError('ID inválido.');
    }

    if (!caminhoImagem) {
      throw new ValidationError('Caminho da imagem não fornecido.');
    }

    const paciente = await repository.findById(id);
    if (!paciente) throw new NotFoundError('Paciente não encontrado.');

    await repository.atualizarFoto(id, caminhoImagem);
    return { message: 'Foto atualizada com sucesso' };
  }

  static async esqueciSenha(email, novaSenha) {
    if (!email || !isValidEmail(email)) {
      throw new ValidationError('Email inválido.');
    }

    if (!novaSenha || novaSenha.length < 6) {
      throw new ValidationError('Nova senha deve ter pelo menos 6 caracteres.');
    }

    const paciente = await repository.findByEmail(email);
    if (!paciente) throw new NotFoundError('Email não encontrado.');

    const resultado = await repository.esqueciSenha(email, novaSenha);
    return resultado;
  }

  static async verifyCredentials(email, senha) {
    const usuario = await repository.verifyCredentials(email);
    if (!usuario) throw new Error('Credenciais inválidas');

    const senhaMatch = await bcrypt.compare(senha, usuario.senha);
    if (!senhaMatch) throw new Error('Credenciais inválidas');

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
}

module.exports = PacienteService;
