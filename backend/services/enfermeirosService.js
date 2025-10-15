const repository = require('../repository/enfermeirosRepository');
const { ValidationError, ConflictError, NotFoundError } = require('../utils/errors');
const { isValidEmail } = require('../utils/validationUtils');
const bcrypt = require('bcrypt');

class EnfermeirosService {
  static async getAll() {
    const enfermeiros = await repository.findAll();
    return enfermeiros;
  }

  static async getById(id) {
    if (isNaN(id)) throw new ValidationError('ID inválido. Informe um número válido.');
    
    const enfermeiro = await repository.findById(id);
    if (!enfermeiro) throw new NotFoundError('Enfermeiro não encontrado.');
    
    return enfermeiro;
  }

  static async getByEmail(email) {
    if (!email || !isValidEmail(email)) {
      throw new ValidationError('Email inválido.');
    }

    const enfermeiro = await repository.findByEmail(email);
    if (!enfermeiro) throw new NotFoundError('Enfermeiro não encontrado.');
    
    return enfermeiro;
  }

  static async getByCoren(registro_coren) {
    if (!registro_coren || registro_coren.trim().length === 0) {
      throw new ValidationError('Registro COREN inválido.');
    }

    const enfermeiro = await repository.findByCOREN(registro_coren.trim());
    if (!enfermeiro) throw new NotFoundError('Enfermeiro não encontrado.');
    
    return enfermeiro;
  }

  static async create(dados) {
    // Verifica se é um array (criação em lote)
    if (Array.isArray(dados)) {
      return await this.createBatch(dados);
    }
    
    // Criação individual (código original)
    const { email, registro_coren, nome, senha } = dados;

    if (!email || !isValidEmail(email)) {
      throw new ValidationError('Email inválido ou não fornecido.');
    }
    
    if (!registro_coren || registro_coren.trim().length === 0) {
      throw new ValidationError('Registro COREN inválido ou não fornecido.');
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

    const existingByCoren = await repository.findByCOREN(registro_coren);
    if (existingByCoren) {
      throw new ConflictError('Registro COREN já cadastrado.');
    }

    // Preparar dados e criptografar senha
    const enfermeiroData = {
      ...dados,
      nome: dados.nome.trim(),
      email: dados.email.trim().toLowerCase(),
      registro_coren: dados.registro_coren.trim(),
      telefone: dados.telefone ? dados.telefone.trim() : null,
      senha: dados.senha,
      cargo: dados.cargo || 'Enfermeiro',
      status: dados.status || 'Ativo',
      ativo: dados.ativo !== undefined ? dados.ativo : true
    };

    const novoEnfermeiro = await repository.create(enfermeiroData);
    return novoEnfermeiro;
  }

  static async createBatch(dadosArray) {
    if (!Array.isArray(dadosArray)) {
      throw new ValidationError('Para criação em lote, envie um array de enfermeiros.');
    }

    if (dadosArray.length === 0) {
      throw new ValidationError('Array de enfermeiros vazio.');
    }

    if (dadosArray.length > 100) {
      throw new ValidationError('Número máximo de 100 enfermeiros por lote.');
    }

    const resultados = {
      sucesso: [],
      erros: [],
      total: dadosArray.length
    };

    // Validar todos os dados primeiro
    for (let i = 0; i < dadosArray.length; i++) {
      const dados = dadosArray[i];
      
      try {
        // Validações básicas
        if (!dados.email || !isValidEmail(dados.email)) {
          throw new ValidationError(`Email inválido no item ${i + 1}`);
        }
        
        if (!dados.registro_coren || dados.registro_coren.trim().length === 0) {
          throw new ValidationError(`Registro COREN inválido no item ${i + 1}`);
        }
        
        if (!dados.nome || dados.nome.trim().length < 3) {
          throw new ValidationError(`Nome deve ter pelo menos 3 caracteres no item ${i + 1}`);
        }

        if (!dados.senha || dados.senha.length < 6) {
          throw new ValidationError(`Senha deve ter pelo menos 6 caracteres no item ${i + 1}`);
        }

        // Verificar duplicatas no array
        const emailDuplicado = dadosArray.slice(0, i).some(item => 
          item.email.toLowerCase() === dados.email.toLowerCase()
        );
        if (emailDuplicado) {
          throw new ConflictError(`Email duplicado no array: ${dados.email}`);
        }

        const corenDuplicado = dadosArray.slice(0, i).some(item => 
          item.registro_coren === dados.registro_coren
        );
        if (corenDuplicado) {
          throw new ConflictError(`COREN duplicado no array: ${dados.registro_coren}`);
        }

        // Verificar duplicatas no banco
        const existingByEmail = await repository.findByEmail(dados.email);
        if (existingByEmail) {
          throw new ConflictError(`Email já cadastrado: ${dados.email}`);
        }

        const existingByCoren = await repository.findByCOREN(dados.registro_coren);
        if (existingByCoren) {
          throw new ConflictError(`COREN já cadastrado: ${dados.registro_coren}`);
        }

      } catch (error) {
        resultados.erros.push({
          indice: i,
          dados: dados,
          erro: error.message
        });
      }
    }

    // Se houver erros de validação, não prossegue
    if (resultados.erros.length > 0) {
      throw new ValidationError('Erros de validação no lote', resultados);
    }

    // Criar todos os enfermeiros
    for (let i = 0; i < dadosArray.length; i++) {
      const dados = dadosArray[i];
      
      try {
        // Preparar dados e criptografar senha
        const enfermeiroData = {
          ...dados,
          nome: dados.nome.trim(),
          email: dados.email.trim().toLowerCase(),
          registro_coren: dados.registro_coren.trim(),
          telefone: dados.telefone ? dados.telefone.trim() : null,
          senha: dados.senha,
          cargo: dados.cargo || 'Enfermeiro',
          status: dados.status || 'Ativo',
          ativo: dados.ativo !== undefined ? dados.ativo : true
        };

        const novoEnfermeiro = await repository.create(enfermeiroData);
        resultados.sucesso.push(novoEnfermeiro);

      } catch (error) {
        resultados.erros.push({
          indice: i,
          dados: dados,
          erro: error.message
        });
      }
    }

    return resultados;
  }

  static async update(id, dados) {
    if (isNaN(id)) throw new ValidationError('ID inválido.');

    // Remover campos que não devem ser atualizados
    delete dados.senha;
    delete dados.id_enfermeiro;
    delete dados.data_cadastro;

    const existing = await repository.findById(id);
    if (!existing) throw new NotFoundError('Enfermeiro não encontrado.');

    if (dados.email && dados.email !== existing.email) {
      const existingByEmail = await repository.findByEmail(dados.email);
      if (existingByEmail) {
        throw new ConflictError('Email já cadastrado.');
      }
    }

    if (dados.registro_coren && dados.registro_coren !== existing.registro_coren) {
      const existingByCoren = await repository.findByCOREN(dados.registro_coren);
      if (existingByCoren) {
        throw new ConflictError('Registro COREN já cadastrado.');
      }
    }

    // Preparar dados para atualização
    const updateData = { ...dados };
    if (updateData.nome) updateData.nome = updateData.nome.trim();
    if (updateData.email) updateData.email = updateData.email.trim().toLowerCase();
    if (updateData.registro_coren) updateData.registro_coren = updateData.registro_coren.trim();
    if (updateData.telefone) updateData.telefone = updateData.telefone.trim();

    const enfermeiroAtualizado = await repository.update(id, updateData);
    return enfermeiroAtualizado;
  }

  static async updatePassword(id, senhaAtual, novaSenha) {
    if (!senhaAtual || !novaSenha) {
      throw new ValidationError('Senha atual e nova senha são obrigatórias.');
    }

    if (novaSenha.length < 6) {
      throw new ValidationError('Nova senha deve ter pelo menos 6 caracteres.');
    }

    const enfermeiro = await repository.findById(id);
    if (!enfermeiro) throw new NotFoundError('Enfermeiro não encontrado.');

    const resultado = await repository.updatePassword(id, senhaAtual, novaSenha);
    if (!resultado) {
      throw new ValidationError('Senha atual incorreta.');
    }

    return resultado;
  }

  static async desativar(id) {
    if (isNaN(id)) throw new ValidationError('ID inválido.');

    const enfermeiro = await repository.desativar(id);
    if (!enfermeiro) throw new NotFoundError('Enfermeiro não encontrado.');

    return enfermeiro;
  }

  static async reativar(id) {
    if (isNaN(id)) throw new ValidationError('ID inválido.');

    const enfermeiro = await repository.reativar(id);
    if (!enfermeiro) throw new NotFoundError('Enfermeiro não encontrado.');

    return enfermeiro;
  }

  static async remove(id) {
    if (isNaN(id)) throw new ValidationError('ID inválido.');

    const resultado = await repository.remove(id);
    if (!resultado) throw new NotFoundError('Enfermeiro não encontrado.');

    return resultado;
  }

  static async atualizarFoto(id, caminhoImagem) {
    if (!id || isNaN(id)) {
      throw new ValidationError('ID inválido.');
    }

    if (!caminhoImagem) {
      throw new ValidationError('Caminho da imagem não fornecido.');
    }

    const enfermeiro = await repository.findById(id);
    if (!enfermeiro) throw new NotFoundError('Enfermeiro não encontrado.');

    await repository.atualizarFoto(id, caminhoImagem);
    return { message: 'Foto atualizada com sucesso' };
  }

  static async search(searchTerm) {
    if (!searchTerm || searchTerm.trim().length < 2) {
      throw new ValidationError('Termo de busca deve ter pelo menos 2 caracteres.');
    }

    const resultados = await repository.search(searchTerm.trim());
    if (!resultados || resultados.length === 0) {
      throw new NotFoundError('Nenhum enfermeiro encontrado para o termo de busca.');
    }

    return resultados;
  }

  static async login(email, senha) {
    if (!email || !senha) {
      throw new ValidationError('Email e senha são obrigatórios.');
    }

    if (!isValidEmail(email)) {
      throw new ValidationError('Email inválido.');
    }

    const enfermeiro = await repository.findByEmail(email.trim().toLowerCase());
    if (!enfermeiro) {
      throw new ValidationError('Credenciais inválidas.');
    }

    const senhaMatch = await bcrypt.compare(senha, enfermeiro.senha);
    if (!senhaMatch) {
      throw new ValidationError('Credenciais inválidas.');
    }

    if (!enfermeiro.ativo) {
      throw new ValidationError('Conta desativada.');
    }

    // Remover senha antes de retornar
    delete enfermeiro.senha;

    return enfermeiro;
  }
}

module.exports = EnfermeirosService;