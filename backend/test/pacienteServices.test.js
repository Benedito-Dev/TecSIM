// test/pacienteService.test.js
const PacienteService = require('../services/pacientesService');
const pacientesRepository = require('../repository/pacientesRepository');
const { ValidationError, NotFoundError, ConflictError } = require('../utils/errors');
const { isValidEmail, isValidCPF } = require('../utils/validationUtils');
const bcrypt = require('bcrypt');
const Paciente = require('../models/pacienteModel');

// Mock das dependências
jest.mock('../repository/pacientesRepository');
jest.mock('../utils/validationUtils');
jest.mock('bcrypt');

describe('PacienteService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockPacienteData = {
    id: 1,
    cpf: '12345678900',
    nome: 'Fulano da Silva',
    email: 'fulano@example.com',
    senha: 'senhaHasheada',
    data_nascimento: '1990-01-01',
    peso_kg: 70,
    genero: 'M',
    aceite_termos: true,
    data_cadastro: '2025-01-01T00:00:00.000Z',
    ativo: true,
    foto_perfil: null
  };

  const mockDadosCriacao = {
    cpf: '12345678900',
    nome: 'Fulano da Silva',
    email: 'fulano@example.com',
    senha: '123456',
    data_nascimento: '1990-01-01',
    peso_kg: 70,
    genero: 'M',
    aceite_termos: true
  };

  describe('getAll', () => {
    it('deve retornar todos os pacientes', async () => {
      const pacientesList = [new Paciente(mockPacienteData), new Paciente({ ...mockPacienteData, id: 2 })];
      pacientesRepository.findAll.mockResolvedValue(pacientesList);

      const result = await PacienteService.getAll();

      expect(pacientesRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(pacientesList);
    });
  });

  describe('getById', () => {
    it('deve retornar paciente pelo ID válido', async () => {
      pacientesRepository.findById.mockResolvedValue(new Paciente(mockPacienteData));

      const result = await PacienteService.getById(1);

      expect(pacientesRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toBeInstanceOf(Paciente);
      expect(result.id).toBe(1);
    });

    it('deve lançar ValidationError para ID inválido', async () => {
      await expect(PacienteService.getById('abc'))
        .rejects.toThrow(ValidationError);
      
      await expect(PacienteService.getById(null))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar NotFoundError se paciente não existir', async () => {
      pacientesRepository.findById.mockResolvedValue(null);

      await expect(PacienteService.getById(99))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('getByEmail', () => {
    it('deve retornar paciente pelo email válido', async () => {
      isValidEmail.mockReturnValue(true);
      pacientesRepository.findByEmail.mockResolvedValue(new Paciente(mockPacienteData));

      const result = await PacienteService.getByEmail('fulano@example.com');

      expect(isValidEmail).toHaveBeenCalledWith('fulano@example.com');
      expect(result).toBeInstanceOf(Paciente);
      expect(result.email).toBe('fulano@example.com');
    });

    it('deve lançar ValidationError para email inválido', async () => {
      isValidEmail.mockReturnValue(false);

      await expect(PacienteService.getByEmail('email-invalido'))
        .rejects.toThrow(ValidationError);
      
      expect(pacientesRepository.findByEmail).not.toHaveBeenCalled();
    });

    it('deve lançar NotFoundError se email não existir', async () => {
      isValidEmail.mockReturnValue(true);
      pacientesRepository.findByEmail.mockResolvedValue(null);

      await expect(PacienteService.getByEmail('inexistente@email.com'))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('create', () => {
    it('deve criar paciente com dados válidos', async () => {
      isValidEmail.mockReturnValue(true);
      isValidCPF.mockReturnValue(true);
      pacientesRepository.findByEmail.mockResolvedValue(null);
      pacientesRepository.findByCPF.mockResolvedValue(null);
      pacientesRepository.create.mockResolvedValue(new Paciente(mockPacienteData));

      const result = await PacienteService.create(mockDadosCriacao);

      expect(pacientesRepository.create).toHaveBeenCalledWith(mockDadosCriacao);
      expect(result).toBeInstanceOf(Paciente);
      expect(result.nome).toBe('Fulano da Silva');
    });

    it('deve lançar ValidationError para email inválido', async () => {
      isValidEmail.mockReturnValue(false);

      await expect(PacienteService.create(mockDadosCriacao))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar ValidationError para CPF inválido', async () => {
      isValidEmail.mockReturnValue(true);
      isValidCPF.mockReturnValue(false);

      await expect(PacienteService.create(mockDadosCriacao))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar ValidationError para nome inválido', async () => {
      isValidEmail.mockReturnValue(true);
      isValidCPF.mockReturnValue(true);
      const dadosInvalidos = { ...mockDadosCriacao, nome: 'Ab' };

      await expect(PacienteService.create(dadosInvalidos))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar ConflictError para email duplicado', async () => {
      isValidEmail.mockReturnValue(true);
      isValidCPF.mockReturnValue(true);
      pacientesRepository.findByEmail.mockResolvedValue(new Paciente(mockPacienteData));

      await expect(PacienteService.create(mockDadosCriacao))
        .rejects.toThrow(ConflictError);
    });

    it('deve lançar ConflictError para CPF duplicado', async () => {
      isValidEmail.mockReturnValue(true);
      isValidCPF.mockReturnValue(true);
      pacientesRepository.findByEmail.mockResolvedValue(null);
      pacientesRepository.findByCPF.mockResolvedValue(new Paciente(mockPacienteData));

      await expect(PacienteService.create(mockDadosCriacao))
        .rejects.toThrow(ConflictError);
    });
  });

  describe('update', () => {
    const dadosUpdate = {
      nome: 'Fulano Atualizado',
      email: 'novo@example.com',
      data_nascimento: '1992-02-02',
      peso_kg: 75,
      genero: 'F'
    };

    it('deve atualizar paciente com dados válidos', async () => {
      pacientesRepository.findById.mockResolvedValue(new Paciente(mockPacienteData));
      pacientesRepository.findByEmail.mockResolvedValue(null);
      pacientesRepository.findByCPF.mockResolvedValue(null);
      pacientesRepository.update.mockResolvedValue(new Paciente({ ...mockPacienteData, ...dadosUpdate }));

      const result = await PacienteService.update(1, dadosUpdate);

      expect(pacientesRepository.update).toHaveBeenCalledWith(1, dadosUpdate);
      expect(result).toBeInstanceOf(Paciente);
      expect(result.nome).toBe('Fulano Atualizado');
    });

    it('deve lançar ValidationError para ID inválido', async () => {
      await expect(PacienteService.update('abc', dadosUpdate))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar NotFoundError se paciente não existir', async () => {
      pacientesRepository.findById.mockResolvedValue(null);

      await expect(PacienteService.update(99, dadosUpdate))
        .rejects.toThrow(NotFoundError);
    });

    it('deve lançar ConflictError para email duplicado', async () => {
      pacientesRepository.findById.mockResolvedValue(new Paciente(mockPacienteData));
      pacientesRepository.findByEmail.mockResolvedValue(new Paciente({ ...mockPacienteData, id: 2 }));

      await expect(PacienteService.update(1, { email: 'existente@email.com' }))
        .rejects.toThrow(ConflictError);
    });

    it('deve lançar ConflictError para CPF duplicado', async () => {
      pacientesRepository.findById.mockResolvedValue(new Paciente(mockPacienteData));
      pacientesRepository.findByEmail.mockResolvedValue(null);
      pacientesRepository.findByCPF.mockResolvedValue(new Paciente({ ...mockPacienteData, id: 2 }));

      await expect(PacienteService.update(1, { cpf: 'CPF-EXISTENTE' }))
        .rejects.toThrow(ConflictError);
    });

    it('deve remover campos sensíveis antes do update', async () => {
      pacientesRepository.findById.mockResolvedValue(new Paciente(mockPacienteData));
      pacientesRepository.findByEmail.mockResolvedValue(null);
      pacientesRepository.findByCPF.mockResolvedValue(null);
      pacientesRepository.update.mockResolvedValue(new Paciente(mockPacienteData));

      const dadosComSensiveis = {
        ...dadosUpdate,
        senha: 'should-be-removed',
        id_paciente: 'should-be-removed',
        data_cadastro: 'should-be-removed'
      };

      await PacienteService.update(1, dadosComSensiveis);

      expect(pacientesRepository.update).toHaveBeenCalledWith(1, dadosUpdate);
    });
  });

  describe('updatePassword', () => {
    it('deve atualizar senha com dados válidos', async () => {
      pacientesRepository.findById.mockResolvedValue(new Paciente(mockPacienteData));
      pacientesRepository.updatePassword.mockResolvedValue(new Paciente(mockPacienteData));

      const result = await PacienteService.updatePassword(1, 'senha_antiga', 'nova_senha_123');

      expect(pacientesRepository.updatePassword).toHaveBeenCalledWith(1, 'senha_antiga', 'nova_senha_123');
      expect(result).toBeInstanceOf(Paciente);
    });

    it('deve lançar ValidationError para senhas vazias', async () => {
      await expect(PacienteService.updatePassword(1, '', 'nova_senha'))
        .rejects.toThrow(ValidationError);
      
      await expect(PacienteService.updatePassword(1, 'senha_antiga', ''))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar ValidationError para nova senha curta', async () => {
      await expect(PacienteService.updatePassword(1, 'senha_antiga', '123'))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar NotFoundError se paciente não existir', async () => {
      pacientesRepository.findById.mockResolvedValue(null);

      await expect(PacienteService.updatePassword(99, 'senha_antiga', 'nova_senha'))
        .rejects.toThrow(NotFoundError);
    });

    it('deve lançar ValidationError se senha atual estiver incorreta', async () => {
      pacientesRepository.findById.mockResolvedValue(new Paciente(mockPacienteData));
      pacientesRepository.updatePassword.mockResolvedValue(null);

      await expect(PacienteService.updatePassword(1, 'senha_errada', 'nova_senha'))
        .rejects.toThrow(ValidationError);
    });
  });

  describe('desativar', () => {
    it('deve desativar paciente com ID válido', async () => {
      const pacienteDesativado = new Paciente({ ...mockPacienteData, ativo: false });
      pacientesRepository.desativar.mockResolvedValue(pacienteDesativado);

      const result = await PacienteService.desativar(1);

      expect(pacientesRepository.desativar).toHaveBeenCalledWith(1);
      expect(result).toBeInstanceOf(Paciente);
      expect(result.ativo).toBe(false);
    });

    it('deve lançar ValidationError para ID inválido', async () => {
      await expect(PacienteService.desativar('abc'))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar NotFoundError se paciente não existir', async () => {
      pacientesRepository.desativar.mockResolvedValue(null);

      await expect(PacienteService.desativar(99))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('remove', () => {
    it('deve remover paciente com ID válido', async () => {
      pacientesRepository.remove.mockResolvedValue(new Paciente(mockPacienteData));

      const result = await PacienteService.remove(1);

      expect(pacientesRepository.remove).toHaveBeenCalledWith(1);
      expect(result).toBeInstanceOf(Paciente);
    });

    it('deve lançar ValidationError para ID inválido', async () => {
      await expect(PacienteService.remove('abc'))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar NotFoundError se paciente não existir', async () => {
      pacientesRepository.remove.mockResolvedValue(null);

      await expect(PacienteService.remove(99))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('verifyCredentials', () => {
    it('deve verificar credenciais com sucesso e reativar conta se desativada', async () => {
      const pacienteDesativado = new Paciente({ ...mockPacienteData, ativo: false });
      pacientesRepository.verifyCredentials.mockResolvedValue(pacienteDesativado);
      pacientesRepository.reativar.mockResolvedValue(new Paciente({ ...mockPacienteData, ativo: true }));

      const result = await PacienteService.verifyCredentials('fulano@example.com', 'senha_correta');

      expect(pacientesRepository.verifyCredentials).toHaveBeenCalledWith('fulano@example.com');
      expect(pacientesRepository.reativar).toHaveBeenCalledWith(pacienteDesativado.id);
      expect(result).toBeInstanceOf(Paciente);
      expect(result.ativo).toBe(true);
    });

    it('deve verificar credenciais com sucesso para conta ativa', async () => {
      pacientesRepository.verifyCredentials.mockResolvedValue(new Paciente(mockPacienteData));

      const result = await PacienteService.verifyCredentials('fulano@example.com', 'senha_correta');

      expect(result).toBeInstanceOf(Paciente);
      expect(result.ativo).toBe(true);
    });

    it('deve lançar erro se credenciais forem inválidas', async () => {
      pacientesRepository.verifyCredentials.mockRejectedValue(new Error('Credenciais inválidas'));

      await expect(PacienteService.verifyCredentials('fulano@example.com', 'senha_errada'))
        .rejects.toThrow('Credenciais inválidas');
    });
  });

  describe('atualizarFoto', () => {
    it('deve atualizar foto com dados válidos', async () => {
      pacientesRepository.findById.mockResolvedValue(new Paciente(mockPacienteData));
      pacientesRepository.atualizarFoto.mockResolvedValue();

      const result = await PacienteService.atualizarFoto(1, '/caminho/da/foto.jpg');

      expect(pacientesRepository.atualizarFoto).toHaveBeenCalledWith(1, '/caminho/da/foto.jpg');
      expect(result).toEqual({ message: 'Foto atualizada com sucesso' });
    });

    it('deve lançar ValidationError para ID inválido', async () => {
      await expect(PacienteService.atualizarFoto('abc', '/caminho/foto.jpg'))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar ValidationError para caminho vazio', async () => {
      await expect(PacienteService.atualizarFoto(1, ''))
        .rejects.toThrow(ValidationError);
      
      await expect(PacienteService.atualizarFoto(1, null))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar NotFoundError se paciente não existir', async () => {
      pacientesRepository.findById.mockResolvedValue(null);

      await expect(PacienteService.atualizarFoto(99, '/caminho/foto.jpg'))
        .rejects.toThrow(NotFoundError);
    });
  });
});