// test/medicoService.test.js
const MedicoService = require('../../services/medicoService');
const medicoRepository = require('../../repository/medicoRepository');
const { ValidationError, ConflictError, NotFoundError } = require('../../utils/errors');
const { isValidEmail, isValidCRM } = require('../../utils/validationUtils');

// Mock das dependências
jest.mock('../../repository/medicoRepository');
jest.mock('../../utils/validationUtils');

describe('MedicoService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockMedicoData = {
    id: 1,
    nome: 'Dr. Fulano',
    crm: '12345-SP',
    especialidade: 'Cardiologia',
    email: 'fulano@hospital.com',
    telefone: '123456789',
    ativo: true
  };

  const mockDadosCriacao = {
    nome: 'Dr. Fulano',
    crm: '12345-SP',
    especialidade: 'Cardiologia',
    email: 'fulano@hospital.com',
    senha: '123456',
    telefone: '123456789'
  };

  describe('getAll', () => {
    it('deve retornar todos os médicos', async () => {
      medicoRepository.findAll.mockResolvedValue([mockMedicoData]);
      
      const result = await MedicoService.getAll();
      
      expect(medicoRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockMedicoData]);
    });
  });

  describe('getById', () => {
    it('deve retornar médico pelo ID válido', async () => {
      medicoRepository.findById.mockResolvedValue(mockMedicoData);
      
      const result = await MedicoService.getById(1);
      
      expect(medicoRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockMedicoData);
    });

    it('deve lançar ValidationError para ID inválido', async () => {
      await expect(MedicoService.getById('abc'))
        .rejects.toThrow(ValidationError);
      
      expect(medicoRepository.findById).not.toHaveBeenCalled();
    });

    it('deve lançar NotFoundError se médico não existir', async () => {
      medicoRepository.findById.mockResolvedValue(null);
      
      await expect(MedicoService.getById(99))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('getByEmail', () => {
    it('deve retornar médico pelo email válido', async () => {
      isValidEmail.mockReturnValue(true);
      medicoRepository.findByEmail.mockResolvedValue(mockMedicoData);
      
      const result = await MedicoService.getByEmail('fulano@hospital.com');
      
      expect(isValidEmail).toHaveBeenCalledWith('fulano@hospital.com');
      expect(result).toEqual(mockMedicoData);
    });

    it('deve lançar ValidationError para email inválido', async () => {
      isValidEmail.mockReturnValue(false);
      
      await expect(MedicoService.getByEmail('email-invalido'))
        .rejects.toThrow(ValidationError);
      
      expect(medicoRepository.findByEmail).not.toHaveBeenCalled();
    });

    it('deve lançar NotFoundError se email não existir', async () => {
      isValidEmail.mockReturnValue(true);
      medicoRepository.findByEmail.mockResolvedValue(null);
      
      await expect(MedicoService.getByEmail('inexistente@email.com'))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('getByCrm', () => {
    it('deve retornar médico pelo CRM válido', async () => {
      isValidCRM.mockReturnValue(true);
      medicoRepository.findByCrm.mockResolvedValue(mockMedicoData);
      
      const result = await MedicoService.getByCrm('12345-SP');
      
      expect(isValidCRM).toHaveBeenCalledWith('12345-SP');
      expect(result).toEqual(mockMedicoData);
    });

    it('deve lançar ValidationError para CRM inválido', async () => {
      isValidCRM.mockReturnValue(false);
      
      await expect(MedicoService.getByCrm('CRM-INVALIDO'))
        .rejects.toThrow(ValidationError);
      
      expect(medicoRepository.findByCrm).not.toHaveBeenCalled();
    });

    it('deve lançar NotFoundError se CRM não existir', async () => {
      isValidCRM.mockReturnValue(true);
      medicoRepository.findByCrm.mockResolvedValue(null);
      
      await expect(MedicoService.getByCrm('99999-SP'))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('create', () => {
    it('deve criar médico com dados válidos', async () => {
      isValidEmail.mockReturnValue(true);
      isValidCRM.mockReturnValue(true);
      medicoRepository.findByEmail.mockResolvedValue(null);
      medicoRepository.findByCrm.mockResolvedValue(null);
      medicoRepository.create.mockResolvedValue(mockMedicoData);
      
      const result = await MedicoService.create(mockDadosCriacao);
      
      expect(medicoRepository.create).toHaveBeenCalledWith(mockDadosCriacao);
      expect(result).toEqual(mockMedicoData);
    });

    it('deve lançar ValidationError para nome inválido', async () => {
      const dadosInvalidos = { ...mockDadosCriacao, nome: 'Ab' };
      
      await expect(MedicoService.create(dadosInvalidos))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar ValidationError para nome vazio', async () => {
      const dadosInvalidos = { ...mockDadosCriacao, nome: '' };
      
      await expect(MedicoService.create(dadosInvalidos))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar ValidationError para email inválido', async () => {
      isValidEmail.mockReturnValue(false);
      
      await expect(MedicoService.create(mockDadosCriacao))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar ValidationError para email vazio', async () => {
      const dadosInvalidos = { ...mockDadosCriacao, email: '' };
      
      await expect(MedicoService.create(dadosInvalidos))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar ValidationError para CRM inválido', async () => {
      isValidEmail.mockReturnValue(true);
      isValidCRM.mockReturnValue(false);
      
      await expect(MedicoService.create(mockDadosCriacao))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar ValidationError para CRM vazio', async () => {
      const dadosInvalidos = { ...mockDadosCriacao, crm: '' };
      
      await expect(MedicoService.create(dadosInvalidos))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar ValidationError para especialidade inválida', async () => {
      isValidEmail.mockReturnValue(true);
      isValidCRM.mockReturnValue(true);
      const dadosInvalidos = { ...mockDadosCriacao, especialidade: 'A' };
      
      await expect(MedicoService.create(dadosInvalidos))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar ValidationError para especialidade vazia', async () => {
      isValidEmail.mockReturnValue(true);
      isValidCRM.mockReturnValue(true);
      const dadosInvalidos = { ...mockDadosCriacao, especialidade: '' };
      
      await expect(MedicoService.create(dadosInvalidos))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar ValidationError para senha inválida', async () => {
      isValidEmail.mockReturnValue(true);
      isValidCRM.mockReturnValue(true);
      const dadosInvalidos = { ...mockDadosCriacao, senha: '123' };
      
      await expect(MedicoService.create(dadosInvalidos))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar ValidationError para senha vazia', async () => {
      isValidEmail.mockReturnValue(true);
      isValidCRM.mockReturnValue(true);
      const dadosInvalidos = { ...mockDadosCriacao, senha: '' };
      
      await expect(MedicoService.create(dadosInvalidos))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar ConflictError para email duplicado', async () => {
      isValidEmail.mockReturnValue(true);
      isValidCRM.mockReturnValue(true);
      medicoRepository.findByEmail.mockResolvedValue(mockMedicoData);
      
      await expect(MedicoService.create(mockDadosCriacao))
        .rejects.toThrow(ConflictError);
    });

    it('deve lançar ConflictError para CRM duplicado', async () => {
      isValidEmail.mockReturnValue(true);
      isValidCRM.mockReturnValue(true);
      medicoRepository.findByEmail.mockResolvedValue(null);
      medicoRepository.findByCrm.mockResolvedValue(mockMedicoData);
      
      await expect(MedicoService.create(mockDadosCriacao))
        .rejects.toThrow(ConflictError);
    });
  });

  describe('update', () => {
    const dadosUpdate = {
      nome: 'Dr. Atualizado',
      email: 'novo@hospital.com',
      crm: '54321-SP'
    };

    it('deve atualizar médico com dados válidos', async () => {
      medicoRepository.findById.mockResolvedValue(mockMedicoData);
      medicoRepository.findByEmail.mockResolvedValue(null);
      medicoRepository.findByCrm.mockResolvedValue(null);
      medicoRepository.update.mockResolvedValue({ ...mockMedicoData, ...dadosUpdate });
      
      const result = await MedicoService.update(1, dadosUpdate);
      
      expect(medicoRepository.update).toHaveBeenCalledWith(1, dadosUpdate);
      expect(result.nome).toBe('Dr. Atualizado');
    });

    it('deve lançar ValidationError para ID inválido', async () => {
      await expect(MedicoService.update('abc', dadosUpdate))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar NotFoundError se médico não existir', async () => {
      medicoRepository.findById.mockResolvedValue(null);
      
      await expect(MedicoService.update(99, dadosUpdate))
        .rejects.toThrow(NotFoundError);
    });

    it('deve lançar ConflictError para email duplicado', async () => {
      medicoRepository.findById.mockResolvedValue(mockMedicoData);
      medicoRepository.findByEmail.mockResolvedValue({ ...mockMedicoData, id: 2 });
      
      await expect(MedicoService.update(1, { email: 'existente@email.com' }))
        .rejects.toThrow(ConflictError);
    });

    it('deve lançar ConflictError para CRM duplicado', async () => {
      medicoRepository.findById.mockResolvedValue(mockMedicoData);
      medicoRepository.findByEmail.mockResolvedValue(null);
      medicoRepository.findByCrm.mockResolvedValue({ ...mockMedicoData, id: 2 });
      
      await expect(MedicoService.update(1, { crm: 'CRM-EXISTENTE' }))
        .rejects.toThrow(ConflictError);
    });

    it('não deve lançar erro quando email não é alterado', async () => {
      medicoRepository.findById.mockResolvedValue(mockMedicoData);
      medicoRepository.update.mockResolvedValue(mockMedicoData);
      
      // Email igual ao atual - não deve verificar duplicata
      await MedicoService.update(1, { email: mockMedicoData.email });
      
      expect(medicoRepository.findByEmail).not.toHaveBeenCalled();
    });

    it('não deve lançar erro quando CRM não é alterado', async () => {
      medicoRepository.findById.mockResolvedValue(mockMedicoData);
      medicoRepository.update.mockResolvedValue(mockMedicoData);
      
      // CRM igual ao atual - não deve verificar duplicata
      await MedicoService.update(1, { crm: mockMedicoData.crm });
      
      expect(medicoRepository.findByCrm).not.toHaveBeenCalled();
    });

    it('deve remover campos sensíveis antes do update', async () => {
      medicoRepository.findById.mockResolvedValue(mockMedicoData);
      medicoRepository.findByEmail.mockResolvedValue(null);
      medicoRepository.findByCrm.mockResolvedValue(null);
      medicoRepository.update.mockResolvedValue(mockMedicoData);
      
      const dadosComSensiveis = {
        ...dadosUpdate,
        senha: 'should-be-removed',
        id_medico: 'should-be-removed',
        data_cadastro: 'should-be-removed'
      };
      
      await MedicoService.update(1, dadosComSensiveis);
      
      // Verifica que campos sensíveis foram removidos
      expect(medicoRepository.update).toHaveBeenCalledWith(1, dadosUpdate);
    });
  });

  describe('updatePassword', () => {
    it('deve atualizar senha com dados válidos', async () => {
      medicoRepository.findById.mockResolvedValue(mockMedicoData);
      medicoRepository.updatePassword.mockResolvedValue(mockMedicoData);
      
      const result = await MedicoService.updatePassword(1, 'senha_antiga', 'nova_senha_123');
      
      expect(medicoRepository.updatePassword).toHaveBeenCalledWith(1, 'senha_antiga', 'nova_senha_123');
      expect(result).toEqual(mockMedicoData);
    });

    it('deve lançar ValidationError para senha atual vazia', async () => {
      await expect(MedicoService.updatePassword(1, '', 'nova_senha'))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar ValidationError para nova senha vazia', async () => {
      await expect(MedicoService.updatePassword(1, 'senha_antiga', ''))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar ValidationError para nova senha curta', async () => {
      await expect(MedicoService.updatePassword(1, 'senha_antiga', '123'))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar NotFoundError se médico não existir', async () => {
      medicoRepository.findById.mockResolvedValue(null);
      
      await expect(MedicoService.updatePassword(99, 'senha_antiga', 'nova_senha'))
        .rejects.toThrow(NotFoundError);
    });

    it('deve lançar ValidationError se senha atual estiver incorreta', async () => {
      medicoRepository.findById.mockResolvedValue(mockMedicoData);
      medicoRepository.updatePassword.mockResolvedValue(null);
      
      await expect(MedicoService.updatePassword(1, 'senha_errada', 'nova_senha'))
        .rejects.toThrow(ValidationError);
    });
  });

  describe('remove', () => {
    it('deve remover médico com ID válido', async () => {
      medicoRepository.remove.mockResolvedValue(mockMedicoData);
      
      const result = await MedicoService.remove(1);
      
      expect(medicoRepository.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockMedicoData);
    });

    it('deve lançar ValidationError para ID inválido', async () => {
      await expect(MedicoService.remove('abc'))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar NotFoundError se médico não existir', async () => {
      medicoRepository.remove.mockResolvedValue(null);
      
      await expect(MedicoService.remove(99))
        .rejects.toThrow(NotFoundError);
    });
  });
});