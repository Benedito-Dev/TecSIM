const repository = require('../repository/medicoRepository');
const { ValidationError, ConflictError, NotFoundError } = require('../utils/errors');
const { isValidEmail, isValidCRM } = require('../utils/validationUtils');

class MedicoService {
  static async getAll() {
    const medicos = await repository.findAll();
    return medicos;
  }

  static async getById(id) {
    if (isNaN(id)) throw new ValidationError('ID inválido. Informe um número válido.');
    
    const medico = await repository.findById(id);
    if (!medico) throw new NotFoundError('Médico não encontrado.');
    
    return medico;
  }

  static async getByEmail(email) {
    if (!email || !isValidEmail(email)) {
      throw new ValidationError('Email inválido.');
    }

    const medico = await repository.findByEmail(email);
    if (!medico) throw new NotFoundError('Médico não encontrado.');
    
    return medico;
  }

  static async getByCrm(crm) {
    if (!crm || !isValidCRM(crm)) {
      throw new ValidationError('CRM inválido ou não fornecido.');
    }

    const medico = await repository.findByCrm(crm);
    if (!medico) throw new NotFoundError('Médico não encontrado.');
    
    return medico;
  }

  static async create(dados) {
    const { nome, email, crm, especialidade, senha } = dados;

    // Validações básicas
    if (!nome || nome.trim().length < 3) {
      throw new ValidationError('Nome deve ter pelo menos 3 caracteres.');
    }
    
    if (!email || !isValidEmail(email)) {
      throw new ValidationError('Email inválido ou não fornecido.');
    }
    
    if (!crm || !isValidCRM(crm)) {
      throw new ValidationError('CRM inválido ou não fornecido.');
    }
    
    if (!especialidade || especialidade.trim().length < 2) {
      throw new ValidationError('Especialidade inválida ou não fornecida.');
    }
    
    if (!senha || senha.length < 6) {
      throw new ValidationError('Senha deve ter pelo menos 6 caracteres.');
    }

    // Verificar duplicatas
    const existingByEmail = await repository.findByEmail(email);
    if (existingByEmail) {
      throw new ConflictError('Email já cadastrado.');
    }

    const existingByCRM = await repository.findByCrm(crm);
    if (existingByCRM) {
      throw new ConflictError('CRM já cadastrado.');
    }

    const novoMedico = await repository.create(dados);
    return novoMedico;
  }

  static async update(id, dados) {
    if (isNaN(id)) throw new ValidationError('ID inválido.');

    // Remover campos que não devem ser atualizados
    delete dados.senha;
    delete dados.id_medico;
    delete dados.data_cadastro;

    // Verificar se médico existe
    const existing = await repository.findById(id);
    if (!existing) throw new NotFoundError('Médico não encontrado.');

    // Verificar duplicatas se email ou CRM estão sendo alterados
    if (dados.email && dados.email !== existing.email) {
      const existingByEmail = await repository.findByEmail(dados.email);
      if (existingByEmail) {
        throw new ConflictError('Email já cadastrado.');
      }
    }

    if (dados.crm && dados.crm !== existing.crm) {
      const existingByCRM = await repository.findByCrm(dados.crm);
      if (existingByCRM) {
        throw new ConflictError('CRM já cadastrado.');
      }
    }

    const medicoAtualizado = await repository.update(id, dados);
    return medicoAtualizado;
  }

  static async updatePassword(id, senhaAtual, novaSenha) {
    if (!senhaAtual || !novaSenha) {
      throw new ValidationError('Senha atual e nova senha são obrigatórias.');
    }

    if (novaSenha.length < 6) {
      throw new ValidationError('Nova senha deve ter pelo menos 6 caracteres.');
    }

    const medico = await repository.findById(id);
    if (!medico) throw new NotFoundError('Médico não encontrado.');

    const resultado = await repository.updatePassword(id, senhaAtual, novaSenha);
    if (!resultado) {
      throw new ValidationError('Senha atual incorreta.');
    }

    return resultado;
  }

  static async remove(id) {
    if (isNaN(id)) throw new ValidationError('ID inválido.');

    const resultado = await repository.remove(id);
    if (!resultado) throw new NotFoundError('Médico não encontrado.');

    return resultado;
  }
}

module.exports = MedicoService;
