const EnfermeirosService = require('../../services/enfermeirosService');
const repository = require('../../repository/enfermeirosRepository');
const { ValidationError, ConflictError, NotFoundError } = require('../../utils/errors');
const { isValidEmail } = require('../../utils/validationUtils');
const bcrypt = require('bcrypt');

// Mock das dependências
jest.mock('../../repository/enfermeirosRepository');
jest.mock('../../utils/validationUtils');
jest.mock('bcrypt');

describe('EnfermeirosService', () => {
  let mockEnfermeiro;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockEnfermeiro = {
      id: 1,
      nome: 'João Silva',
      email: 'joao.silva@hospital.com',
      senha: 'hashedPassword',
      telefone: '(11) 99999-9999',
      registro_coren: 'COREN-SP 123.456',
      cargo: 'Enfermeiro Chefe',
      unidade: 'UTI',
      turno: 'Noturno',
      data_admissao: '2020-01-15',
      especialidade: 'UTI Adulto',
      anos_experiencia: 8,
      status: 'Ativo',
      foto_perfil: '/fotos/joao.jpg',
      data_atualizacao: '2023-10-01',
      data_cadastro: '2020-01-15',
      ativo: true
    };
  });

  describe('getAll', () => {
    it('deve retornar todos os enfermeiros', async () => {
      const mockEnfermeiros = [mockEnfermeiro, { ...mockEnfermeiro, id: 2 }];
      repository.findAll.mockResolvedValue(mockEnfermeiros);

      const result = await EnfermeirosService.getAll();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockEnfermeiros);
    });
  });

  describe('getById', () => {
    it('deve retornar enfermeiro quando ID for válido e existir', async () => {
      repository.findById.mockResolvedValue(mockEnfermeiro);

      const result = await EnfermeirosService.getById(1);

      expect(repository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockEnfermeiro);
    });

    it('deve lançar ValidationError quando ID não for número', async () => {
      await expect(EnfermeirosService.getById('abc'))
        .rejects.toThrow(ValidationError);
      
      expect(repository.findById).not.toHaveBeenCalled();
    });

    it('deve lançar NotFoundError quando enfermeiro não existir', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(EnfermeirosService.getById(999))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('getByEmail', () => {
    it('deve retornar enfermeiro quando email for válido e existir', async () => {
      isValidEmail.mockReturnValue(true);
      repository.findByEmail.mockResolvedValue(mockEnfermeiro);

      const result = await EnfermeirosService.getByEmail('test@test.com');

      expect(isValidEmail).toHaveBeenCalledWith('test@test.com');
      expect(repository.findByEmail).toHaveBeenCalledWith('test@test.com');
      expect(result).toEqual(mockEnfermeiro);
    });

    it('deve lançar ValidationError quando email for inválido', async () => {
      isValidEmail.mockReturnValue(false);

      await expect(EnfermeirosService.getByEmail('email-invalido'))
        .rejects.toThrow(ValidationError);
      
      expect(repository.findByEmail).not.toHaveBeenCalled();
    });

    it('deve lançar ValidationError quando email for vazio', async () => {
      await expect(EnfermeirosService.getByEmail(''))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar NotFoundError quando email não existir', async () => {
      isValidEmail.mockReturnValue(true);
      repository.findByEmail.mockResolvedValue(null);

      await expect(EnfermeirosService.getByEmail('naoexiste@test.com'))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('getByCoren', () => {
    it('deve retornar enfermeiro quando COREN for válido e existir', async () => {
      repository.findByCOREN.mockResolvedValue(mockEnfermeiro);

      const result = await EnfermeirosService.getByCoren('COREN123');

      expect(repository.findByCOREN).toHaveBeenCalledWith('COREN123');
      expect(result).toEqual(mockEnfermeiro);
    });

    it('deve lançar ValidationError quando COREN for vazio', async () => {
      await expect(EnfermeirosService.getByCoren(''))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar ValidationError quando COREN for apenas espaços', async () => {
      await expect(EnfermeirosService.getByCoren('   '))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar NotFoundError quando COREN não existir', async () => {
      repository.findByCOREN.mockResolvedValue(null);

      await expect(EnfermeirosService.getByCoren('COREN999'))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('create', () => {
    const dadosValidos = {
      nome: 'Novo Enfermeiro',
      email: 'novo@test.com',
      senha: 'senha123',
      registro_coren: 'COREN456',
      telefone: '(11) 88888-8888',
      cargo: 'Enfermeiro',
      unidade: 'UTI',
      turno: 'Noturno'
    };

    beforeEach(() => {
      isValidEmail.mockReturnValue(true);
      repository.findByEmail.mockResolvedValue(null);
      repository.findByCOREN.mockResolvedValue(null);
    });

    it('deve criar enfermeiro com dados válidos', async () => {
      const novoEnfermeiro = { ...mockEnfermeiro, id: 2 };
      repository.create.mockResolvedValue(novoEnfermeiro);

      const result = await EnfermeirosService.create(dadosValidos);

      expect(repository.create).toHaveBeenCalledWith({
        ...dadosValidos,
        nome: 'Novo Enfermeiro',
        email: 'novo@test.com',
        registro_coren: 'COREN456',
        telefone: '(11) 88888-8888',
        senha: 'senha123',
        cargo: 'Enfermeiro',
        status: 'Ativo',
        ativo: true
      });
      expect(result).toEqual(novoEnfermeiro);
    });

    it('deve usar valores padrão quando não fornecidos', async () => {
      const dadosMinimos = {
        nome: 'Enfermeiro Minimo',
        email: 'minimo@test.com',
        senha: 'senha123',
        registro_coren: 'COREN789'
      };

      repository.create.mockResolvedValue(mockEnfermeiro);

      await EnfermeirosService.create(dadosMinimos);

      expect(repository.create).toHaveBeenCalledWith({
        ...dadosMinimos,
        nome: 'Enfermeiro Minimo',
        email: 'minimo@test.com',
        registro_coren: 'COREN789',
        telefone: null,
        senha: 'senha123',
        cargo: 'Enfermeiro',
        status: 'Ativo',
        ativo: true
      });
    });

    it('deve lançar ValidationError quando email for inválido', async () => {
      isValidEmail.mockReturnValue(false);

      await expect(EnfermeirosService.create(dadosValidos))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar ValidationError quando nome for muito curto', async () => {
      await expect(EnfermeirosService.create({
        ...dadosValidos,
        nome: 'Ab'
      })).rejects.toThrow(ValidationError);
    });

    it('deve lançar ValidationError quando senha for muito curta', async () => {
      await expect(EnfermeirosService.create({
        ...dadosValidos,
        senha: '123'
      })).rejects.toThrow(ValidationError);
    });

    it('deve lançar ValidationError quando registro_coren for vazio', async () => {
      await expect(EnfermeirosService.create({
        ...dadosValidos,
        registro_coren: ''
      })).rejects.toThrow('Registro COREN inválido ou não fornecido.');
    });

    it('deve lançar ValidationError quando registro_coren for apenas espaços', async () => {
      await expect(EnfermeirosService.create({
        ...dadosValidos,
        registro_coren: '   '
      })).rejects.toThrow('Registro COREN inválido ou não fornecido.');
    });

    it('deve lançar ConflictError quando email já existir', async () => {
      repository.findByEmail.mockResolvedValue(mockEnfermeiro);

      await expect(EnfermeirosService.create(dadosValidos))
        .rejects.toThrow(ConflictError);
    });

    it('deve lançar ConflictError quando COREN já existir', async () => {
      repository.findByCOREN.mockResolvedValue(mockEnfermeiro);

      await expect(EnfermeirosService.create(dadosValidos))
        .rejects.toThrow(ConflictError);
    });

    it('deve manter ativo=false quando fornecido', async () => {
      const dadosComAtivo = { ...dadosValidos, ativo: false };
      repository.create.mockResolvedValue(mockEnfermeiro);

      await EnfermeirosService.create(dadosComAtivo);

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({ ativo: false })
      );
    });

    it('deve manter status personalizado quando fornecido', async () => {
      const dadosComStatus = { ...dadosValidos, status: 'Folga' };
      repository.create.mockResolvedValue(mockEnfermeiro);

      await EnfermeirosService.create(dadosComStatus);

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'Folga' })
      );
    });
  });

  describe('update', () => {
    const updateData = {
      nome: 'Nome Atualizado',
      email: 'atualizado@test.com',
      registro_coren: 'COREN999',
      telefone: '(11) 77777-7777'
    };

    beforeEach(() => {
      repository.findById.mockResolvedValue(mockEnfermeiro);
      repository.findByEmail.mockResolvedValue(null);
      repository.findByCOREN.mockResolvedValue(null);
    });

    it('deve atualizar enfermeiro com dados válidos', async () => {
      const enfermeiroAtualizado = { ...mockEnfermeiro, ...updateData };
      repository.update.mockResolvedValue(enfermeiroAtualizado);

      const result = await EnfermeirosService.update(1, updateData);

      expect(repository.update).toHaveBeenCalledWith(1, {
        nome: 'Nome Atualizado',
        email: 'atualizado@test.com',
        registro_coren: 'COREN999',
        telefone: '(11) 77777-7777'
      });
      expect(result).toEqual(enfermeiroAtualizado);
    });

    it('deve remover campos sensíveis antes de atualizar', async () => {
      const dadosComSensiveis = {
        ...updateData,
        senha: 'novaSenha',
        id_enfermeiro: 999,
        data_cadastro: '2024-01-01'
      };

      await EnfermeirosService.update(1, dadosComSensiveis);

      expect(repository.update).toHaveBeenCalledWith(1, {
        nome: 'Nome Atualizado',
        email: 'atualizado@test.com',
        registro_coren: 'COREN999',
        telefone: '(11) 77777-7777'
      });
    });

    it('deve lançar ValidationError quando ID for inválido', async () => {
      await expect(EnfermeirosService.update('abc', updateData))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar NotFoundError quando enfermeiro não existir', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(EnfermeirosService.update(999, updateData))
        .rejects.toThrow(NotFoundError);
    });

    it('deve lançar ConflictError quando email já existir', async () => {
      repository.findByEmail.mockResolvedValue({ ...mockEnfermeiro, id: 2 });

      await expect(EnfermeirosService.update(1, { email: 'existente@test.com' }))
        .rejects.toThrow(ConflictError);
    });

    it('deve permitir atualização quando email for o mesmo', async () => {
      repository.findByEmail.mockResolvedValue(mockEnfermeiro); // Mesmo enfermeiro

      await EnfermeirosService.update(1, { email: mockEnfermeiro.email });

      expect(repository.update).toHaveBeenCalled();
    });

    it('deve lançar ConflictError quando COREN já existir', async () => {
      repository.findByCOREN.mockResolvedValue({ ...mockEnfermeiro, id: 2 });

      await expect(EnfermeirosService.update(1, { registro_coren: 'COREN_EXISTENTE' }))
        .rejects.toThrow(ConflictError);
    });

    it('deve permitir atualização quando COREN for o mesmo', async () => {
      repository.findByCOREN.mockResolvedValue(mockEnfermeiro); // Mesmo enfermeiro

      await EnfermeirosService.update(1, { registro_coren: mockEnfermeiro.registro_coren });

      expect(repository.update).toHaveBeenCalled();
    });

    it('deve normalizar dados antes de atualizar', async () => {
      const dadosComEspacos = {
        nome: '  Nome Com Espaços  ',
        email: '  EMAIL@TEST.COM  ',
        registro_coren: '  COREN123  ',
        telefone: '  (11) 99999-9999  '
      };

      await EnfermeirosService.update(1, dadosComEspacos);

      expect(repository.update).toHaveBeenCalledWith(1, {
        nome: 'Nome Com Espaços',
        email: 'email@test.com',
        registro_coren: 'COREN123',
        telefone: '(11) 99999-9999'
      });
    });
  });

  describe('updatePassword', () => {
    beforeEach(() => {
      repository.findById.mockResolvedValue(mockEnfermeiro);
    });

    it('deve atualizar senha com dados válidos', async () => {
      repository.updatePassword.mockResolvedValue(mockEnfermeiro);

      const result = await EnfermeirosService.updatePassword(1, 'senhaAtual', 'novaSenha123');

      expect(repository.updatePassword).toHaveBeenCalledWith(1, 'senhaAtual', 'novaSenha123');
      expect(result).toEqual(mockEnfermeiro);
    });

    it('deve lançar ValidationError quando senhas não forem fornecidas', async () => {
      await expect(EnfermeirosService.updatePassword(1, '', 'novaSenha'))
        .rejects.toThrow('Senha atual e nova senha são obrigatórias.');

      await expect(EnfermeirosService.updatePassword(1, 'senhaAtual', ''))
        .rejects.toThrow('Senha atual e nova senha são obrigatórias.');
    });

    it('deve lançar ValidationError quando nova senha for muito curta', async () => {
      await expect(EnfermeirosService.updatePassword(1, 'senhaAtual', '123'))
        .rejects.toThrow('Nova senha deve ter pelo menos 6 caracteres.');
    });

    it('deve lançar NotFoundError quando enfermeiro não existir', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(EnfermeirosService.updatePassword(999, 'senhaAtual', 'novaSenha'))
        .rejects.toThrow(NotFoundError);
    });

    it('deve lançar ValidationError quando repository.updatePassword retornar null', async () => {
      repository.updatePassword.mockResolvedValue(null);

      await expect(EnfermeirosService.updatePassword(1, 'senhaAtual', 'novaSenha123'))
        .rejects.toThrow('Senha atual incorreta.');
    });
  });

  describe('desativar', () => {
    it('deve desativar enfermeiro com ID válido', async () => {
      const enfermeiroDesativado = { ...mockEnfermeiro, ativo: false, status: 'Inativo' };
      repository.desativar.mockResolvedValue(enfermeiroDesativado);

      const result = await EnfermeirosService.desativar(1);

      expect(repository.desativar).toHaveBeenCalledWith(1);
      expect(result).toEqual(enfermeiroDesativado);
    });

    it('deve lançar ValidationError quando ID for inválido', async () => {
      await expect(EnfermeirosService.desativar('abc'))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar NotFoundError quando enfermeiro não existir', async () => {
      repository.desativar.mockResolvedValue(null);

      await expect(EnfermeirosService.desativar(999))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('reativar', () => {
    it('deve reativar enfermeiro com ID válido', async () => {
      const enfermeiroReativado = { ...mockEnfermeiro, ativo: true, status: 'Ativo' };
      repository.reativar.mockResolvedValue(enfermeiroReativado);

      const result = await EnfermeirosService.reativar(1);

      expect(repository.reativar).toHaveBeenCalledWith(1);
      expect(result).toEqual(enfermeiroReativado);
    });

    it('deve lançar ValidationError quando ID for inválido', async () => {
      await expect(EnfermeirosService.reativar('abc'))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar NotFoundError quando enfermeiro não existir', async () => {
      repository.reativar.mockResolvedValue(null);

      await expect(EnfermeirosService.reativar(999))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('remove', () => {
    it('deve remover enfermeiro com ID válido', async () => {
      repository.remove.mockResolvedValue(mockEnfermeiro);

      const result = await EnfermeirosService.remove(1);

      expect(repository.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockEnfermeiro);
    });

    it('deve lançar ValidationError quando ID for inválido', async () => {
      await expect(EnfermeirosService.remove('abc'))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar NotFoundError quando enfermeiro não existir', async () => {
      repository.remove.mockResolvedValue(null);

      await expect(EnfermeirosService.remove(999))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('atualizarFoto', () => {
    it('deve atualizar foto com dados válidos', async () => {
      repository.findById.mockResolvedValue(mockEnfermeiro);
      repository.atualizarFoto.mockResolvedValue();

      const result = await EnfermeirosService.atualizarFoto(1, '/caminho/foto.jpg');

      expect(repository.atualizarFoto).toHaveBeenCalledWith(1, '/caminho/foto.jpg');
      expect(result).toEqual({ message: 'Foto atualizada com sucesso' });
    });

    it('deve lançar ValidationError quando ID for inválido', async () => {
      await expect(EnfermeirosService.atualizarFoto('abc', '/caminho/foto.jpg'))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar ValidationError quando caminho não for fornecido', async () => {
      await expect(EnfermeirosService.atualizarFoto(1, ''))
        .rejects.toThrow('Caminho da imagem não fornecido.');
    });

    it('deve lançar ValidationError quando caminho for null', async () => {
      await expect(EnfermeirosService.atualizarFoto(1, null))
        .rejects.toThrow('Caminho da imagem não fornecido.');
    });

    it('deve lançar NotFoundError quando enfermeiro não existir', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(EnfermeirosService.atualizarFoto(999, '/caminho/foto.jpg'))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('search', () => {
    it('deve buscar enfermeiros com termo válido', async () => {
      const resultados = [mockEnfermeiro];
      repository.search.mockResolvedValue(resultados);

      const result = await EnfermeirosService.search('joão');

      expect(repository.search).toHaveBeenCalledWith('joão');
      expect(result).toEqual(resultados);
    });

    it('deve lançar ValidationError quando termo for muito curto', async () => {
      await expect(EnfermeirosService.search('a'))
        .rejects.toThrow('Termo de busca deve ter pelo menos 2 caracteres.');
    });

    it('deve lançar ValidationError quando termo for vazio', async () => {
      await expect(EnfermeirosService.search(''))
        .rejects.toThrow('Termo de busca deve ter pelo menos 2 caracteres.');
    });

    it('deve lançar ValidationError quando termo for apenas espaços', async () => {
      await expect(EnfermeirosService.search('   '))
        .rejects.toThrow('Termo de busca deve ter pelo menos 2 caracteres.');
    });

    it('deve lançar NotFoundError quando nenhum resultado for encontrado', async () => {
      repository.search.mockResolvedValue([]);

      await expect(EnfermeirosService.search('termo-inexistente'))
        .rejects.toThrow('Nenhum enfermeiro encontrado para o termo de busca.');
    });

    it('deve lançar NotFoundError quando resultados forem null', async () => {
      repository.search.mockResolvedValue(null);

      await expect(EnfermeirosService.search('teste'))
        .rejects.toThrow('Nenhum enfermeiro encontrado para o termo de busca.');
    });
  });
});