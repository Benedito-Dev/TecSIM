const repository = require('../repository/farmaceuticosRepository');
const { ValidationError, ConflictError, NotFoundError } = require('../utils/errors');
const { isValidEmail } = require('../utils/validationUtils');

class FarmaceuticosService {
  static async getAll() {
    const farmaceuticos = await repository.findAll();
    return farmaceuticos;
  }

  static async getById(id) {
    if (isNaN(id)) throw new ValidationError('ID inválido. Informe um número válido.');
    
    const farmaceutico = await repository.findById(id);
    if (!farmaceutico) throw new NotFoundError('Farmacêutico não encontrado.');
    
    return farmaceutico;
  }

  static async getByEmail(email) {
    if (!email || !isValidEmail(email)) {
      throw new ValidationError('Email inválido.');
    }

    const farmaceutico = await repository.findByEmail(email);
    if (!farmaceutico) throw new NotFoundError('Farmacêutico não encontrado.');
    
    return farmaceutico;
  }

  static async getByCrf(registro_crf) {
    if (!registro_crf || registro_crf.trim().length === 0) {
      throw new ValidationError('Registro CRF inválido.');
    }

    const farmaceutico = await repository.findByCRF(registro_crf.trim());
    if (!farmaceutico) throw new NotFoundError('Farmacêutico não encontrado.');
    
    return farmaceutico;
  }

  static async create(dados) {
    const { email, registro_crf, nome, senha } = dados;

    if (!email || !isValidEmail(email)) {
      throw new ValidationError('Email inválido ou não fornecido.');
    }
    
    if (!registro_crf || registro_crf.trim().length === 0) {
      throw new ValidationError('Registro CRF inválido ou não fornecido.');
    }
    
    if (!nome || nome.trim().length < 3) {
      throw new ValidationError('Nome deve ter pelo menos 3 caracteres.');
    }

    if (!senha || senha.length < 6) {
      throw new ValidationError('Senha deve ter pelo menos 6 caracteres.');
    }

    const existingByEmail = await repository.findByEmail(email);
    if (existingByEmail) {
      throw new ConflictError('Email já cadastrado.');
    }

    const existingByCrf = await repository.findByCRF(registro_crf);
    if (existingByCrf) {
      throw new ConflictError('Registro CRF já cadastrado.');
    }

    const farmaceuticoData = {
      ...dados,
      nome: dados.nome.trim(),
      email: dados.email.trim().toLowerCase(),
      registro_crf: dados.registro_crf.trim(),
      telefone: dados.telefone ? dados.telefone.trim() : null,
      senha: dados.senha,
      cargo: dados.cargo || 'Farmacêutico',
      status: dados.status || 'Ativo',
      ativo: dados.ativo !== undefined ? dados.ativo : true
    };

    const novoFarmaceutico = await repository.create(farmaceuticoData);
    return novoFarmaceutico;
  }

  static async update(id, dados) {
    if (isNaN(id)) throw new ValidationError('ID inválido.');

    delete dados.senha;
    delete dados.id_farmaceutico;
    delete dados.data_cadastro;

    const existing = await repository.findById(id);
    if (!existing) throw new NotFoundError('Farmacêutico não encontrado.');

    if (dados.email && dados.email !== existing.email) {
      const existingByEmail = await repository.findByEmail(dados.email);
      if (existingByEmail) {
        throw new ConflictError('Email já cadastrado.');
      }
    }

    if (dados.registro_crf && dados.registro_crf !== existing.registro_crf) {
      const existingByCrf = await repository.findByCRF(dados.registro_crf);
      if (existingByCrf) {
        throw new ConflictError('Registro CRF já cadastrado.');
      }
    }

    const updateData = { ...dados };
    if (updateData.nome) updateData.nome = updateData.nome.trim();
    if (updateData.email) updateData.email = updateData.email.trim().toLowerCase();
    if (updateData.registro_crf) updateData.registro_crf = updateData.registro_crf.trim();
    if (updateData.telefone) updateData.telefone = updateData.telefone.trim();

    const farmaceuticoAtualizado = await repository.update(id, updateData);
    return farmaceuticoAtualizado;
  }

  static async updatePassword(id, senhaAtual, novaSenha) {
    if (!senhaAtual || !novaSenha) {
      throw new ValidationError('Senha atual e nova senha são obrigatórias.');
    }

    if (novaSenha.length < 6) {
      throw new ValidationError('Nova senha deve ter pelo menos 6 caracteres.');
    }

    const farmaceutico = await repository.findById(id);
    if (!farmaceutico) throw new NotFoundError('Farmacêutico não encontrado.');

    const resultado = await repository.updatePassword(id, senhaAtual, novaSenha);
    if (!resultado) {
      throw new ValidationError('Senha atual incorreta.');
    }

    return resultado;
  }

  static async desativar(id) {
    if (isNaN(id)) throw new ValidationError('ID inválido.');

    const farmaceutico = await repository.desativar(id);
    if (!farmaceutico) throw new NotFoundError('Farmacêutico não encontrado.');

    return farmaceutico;
  }

  static async reativar(id) {
    if (isNaN(id)) throw new ValidationError('ID inválido.');

    const farmaceutico = await repository.reativar(id);
    if (!farmaceutico) throw new NotFoundError('Farmacêutico não encontrado.');

    return farmaceutico;
  }

  static async remove(id) {
    if (isNaN(id)) throw new ValidationError('ID inválido.');

    const resultado = await repository.remove(id);
    if (!resultado) throw new NotFoundError('Farmacêutico não encontrado.');

    return resultado;
  }

  static async atualizarFoto(id, caminhoImagem) {
    if (!id || isNaN(id)) {
      throw new ValidationError('ID inválido.');
    }

    if (!caminhoImagem) {
      throw new ValidationError('Caminho da imagem não fornecido.');
    }

    const farmaceutico = await repository.findById(id);
    if (!farmaceutico) throw new NotFoundError('Farmacêutico não encontrado.');

    await repository.atualizarFoto(id, caminhoImagem);
    return { message: 'Foto atualizada com sucesso' };
  }

  static async search(searchTerm) {
    if (!searchTerm || searchTerm.trim().length < 2) {
      throw new ValidationError('Termo de busca deve ter pelo menos 2 caracteres.');
    }

    const resultados = await repository.search(searchTerm.trim());
    if (!resultados || resultados.length === 0) {
      throw new NotFoundError('Nenhum farmacêutico encontrado para o termo de busca.');
    }

    return resultados;
  }
}

module.exports = FarmaceuticosService;
