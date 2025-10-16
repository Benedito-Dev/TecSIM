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

  describe('create - individual', () => {
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

  describe('create - em lote', () => {
    const dadosLoteValidos = [
      {
        nome: 'Enfermeiro 1',
        email: 'enfermeiro1@test.com',
        senha: 'senha123',
        registro_coren: 'COREN001'
      },
      {
        nome: 'Enfermeiro 2',
        email: 'enfermeiro2@test.com',
        senha: 'senha456',
        registro_coren: 'COREN002'
      }
    ];

    beforeEach(() => {
      isValidEmail.mockReturnValue(true);
      repository.findByEmail.mockResolvedValue(null);
      repository.findByCOREN.mockResolvedValue(null);
      repository.create.mockImplementation(async (dados) => ({
        id: Math.random(),
        ...dados
      }));
    });

    it('deve criar lote com dados válidos', async () => {
      const result = await EnfermeirosService.create(dadosLoteValidos);

      expect(result.total).toBe(2);
      expect(result.sucesso).toHaveLength(2);
      expect(result.erros).toHaveLength(0);
      expect(repository.create).toHaveBeenCalledTimes(2);
    });

    it('deve lançar ValidationError quando não for array', async () => {
      await expect(EnfermeirosService.create({ nome: 'teste' }))
        .rejects.toThrow('Para criação em lote, envie um array de enfermeiros.');
    });

    it('deve lançar ValidationError quando array estiver vazio', async () => {
      await expect(EnfermeirosService.create([]))
        .rejects.toThrow('Array de enfermeiros vazio.');
    });

    it('deve lançar ValidationError quando lote for muito grande', async () => {
      const loteGrande = Array.from({ length: 101 }, (_, i) => ({
        nome: `Enfermeiro ${i}`,
        email: `enfermeiro${i}@test.com`,
        senha: 'senha123',
        registro_coren: `COREN${i}`
      }));

      await expect(EnfermeirosService.create(loteGrande))
        .rejects.toThrow('Número máximo de 100 enfermeiros por lote.');
    });

    it('deve detectar email inválido no lote', async () => {
      const dadosComEmailInvalido = [{
        ...dadosLoteValidos[0],
        email: 'email-invalido'
      }];
      
      isValidEmail.mockReturnValue(false);

      try {
        await EnfermeirosService.create(dadosComEmailInvalido);
        fail('Deveria ter lançado erro');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.details.erros[0].erro).toContain('Email inválido no item 1');
      }
    });

    it('deve detectar registro_coren vazio no lote', async () => {
      const dadosComCorenVazio = [{
        ...dadosLoteValidos[0],
        registro_coren: ''
      }];

      try {
        await EnfermeirosService.create(dadosComCorenVazio);
        fail('Deveria ter lançado erro');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.details.erros[0].erro).toContain('Registro COREN inválido no item 1');
      }
    });

    it('deve detectar nome muito curto no lote', async () => {
      const dadosComNomeCurto = [{
        ...dadosLoteValidos[0],
        nome: 'Ab'
      }];

      try {
        await EnfermeirosService.create(dadosComNomeCurto);
        fail('Deveria ter lançado erro');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.details.erros[0].erro).toContain('Nome deve ter pelo menos 3 caracteres no item 1');
      }
    });

    it('deve detectar senha muito curta no lote', async () => {
      const dadosComSenhaCurta = [{
        ...dadosLoteValidos[0],
        senha: '123'
      }];

      try {
        await EnfermeirosService.create(dadosComSenhaCurta);
        fail('Deveria ter lançado erro');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.details.erros[0].erro).toContain('Senha deve ter pelo menos 6 caracteres no item 1');
      }
    });

    it('deve detectar email duplicado no array', async () => {
      const dadosComDuplicata = [
        ...dadosLoteValidos,
        {
          nome: 'Enfermeiro 3',
          email: 'enfermeiro1@test.com', // Email duplicado
          senha: 'senha789',
          registro_coren: 'COREN003'
        }
      ];

      try {
        await EnfermeirosService.create(dadosComDuplicata);
        fail('Deveria ter lançado erro');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.details.erros[0].erro).toContain('Email duplicado no array: enfermeiro1@test.com');
      }
    });

    it('deve detectar COREN duplicado no array', async () => {
      const dadosComDuplicata = [
        ...dadosLoteValidos,
        {
          nome: 'Enfermeiro 3',
          email: 'enfermeiro3@test.com',
          senha: 'senha789',
          registro_coren: 'COREN001' // COREN duplicado
        }
      ];

      try {
        await EnfermeirosService.create(dadosComDuplicata);
        fail('Deveria ter lançado erro');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.details.erros[0].erro).toContain('COREN duplicado no array: COREN001');
      }
    });

    it('deve detectar email já cadastrado no banco', async () => {
      repository.findByEmail.mockImplementation(async (email) => 
        email === 'enfermeiro1@test.com' ? mockEnfermeiro : null
      );

      try {
        await EnfermeirosService.create(dadosLoteValidos);
        fail('Deveria ter lançado erro');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.details.erros[0].erro).toContain('Email já cadastrado: enfermeiro1@test.com');
      }
    });

    it('deve detectar COREN já cadastrado no banco', async () => {
      repository.findByCOREN.mockImplementation(async (coren) => 
        coren === 'COREN001' ? mockEnfermeiro : null
      );

      try {
        await EnfermeirosService.create(dadosLoteValidos);
        fail('Deveria ter lançado erro');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.details.erros[0].erro).toContain('COREN já cadastrado: COREN001');
      }
    });

    it('deve lidar com erro durante criação individual no lote', async () => {
      repository.create
        .mockResolvedValueOnce({ id: 1, ...dadosLoteValidos[0] })
        .mockRejectedValueOnce(new Error('Erro no banco'));

      const result = await EnfermeirosService.create(dadosLoteValidos);

      expect(result.sucesso).toHaveLength(1);
      expect(result.erros).toHaveLength(1);
      expect(result.erros[0].indice).toBe(1);
      expect(result.erros[0].erro).toBe('Erro no banco');
    });

    it('deve processar lote mesmo com erros de validação parciais', async () => {
      const dadosComErro = [
        { ...dadosLoteValidos[0] }, // Válido
        { ...dadosLoteValidos[1], senha: '123' } // Inválido - senha curta
      ];

      try {
        await EnfermeirosService.create(dadosComErro);
        fail('Deveria ter lançado erro');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.details.erros).toHaveLength(1);
        expect(error.details.erros[0].indice).toBe(1);
      }
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