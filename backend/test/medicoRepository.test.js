// test/medicoRepository.test.js
const MedicoRepository = require('../repository/medicoRepository');
const db = require('../db/db');
const bcrypt = require('bcrypt');
const Medico = require('../models/medicoModel');

jest.mock('../db/db');
jest.mock('bcrypt');

describe('MedicoRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockMedicoData = {
    id: 1,
    nome: 'Dr. Fulano',
    crm: '12345',
    especialidade: 'Cardiologia',
    email: 'fulano@hospital.com',
    telefone: '123456789',
    ativo: true
  };

  describe('findAll', () => {
    it('deve retornar todos os médicos ativos', async () => {
      db.query.mockResolvedValue({ rows: [mockMedicoData] });
      const result = await MedicoRepository.findAll();
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Medico);
    });

    it('deve retornar todos os médicos incluindo inativos', async () => {
      const medicosAtivosInativos = [
        mockMedicoData,
        { ...mockMedicoData, id: 2, nome: 'Dr. Inativo', ativo: false }
      ];
      
      db.query.mockResolvedValue({ rows: medicosAtivosInativos });
      
      const result = await MedicoRepository.findAll(true);
      expect(result).toHaveLength(2);
      expect(result[1].ativo).toBe(false);
    });
  });

  describe('findById', () => {
    it('deve retornar médico pelo id', async () => {
      db.query.mockResolvedValue({ rows: [mockMedicoData] });
      const result = await MedicoRepository.findById(1);
      expect(result).toBeInstanceOf(Medico);
      expect(result.id).toBe(1);
    });

    it('deve retornar null se não encontrado', async () => {
      db.query.mockResolvedValue({ rows: [] });
      const result = await MedicoRepository.findById(99);
      expect(result).toBeNull();
    });

    it('deve retornar médico inativo quando includeInactive = true', async () => {
      const medicoInativo = { ...mockMedicoData, ativo: false };
      db.query.mockResolvedValue({ rows: [medicoInativo] });
      
      const result = await MedicoRepository.findById(1, true);
      expect(result).toBeInstanceOf(Medico);
      expect(result.ativo).toBe(false);
    });
  });

  describe('findByEmail', () => {
    it('deve retornar médico pelo email', async () => {
      db.query.mockResolvedValue({ rows: [mockMedicoData] });
      const result = await MedicoRepository.findByEmail('fulano@hospital.com');
      expect(result).toBeInstanceOf(Medico);
      expect(result.email).toBe('fulano@hospital.com');
    });

    it('deve retornar médico inativo quando includeInactive = true', async () => {
      const medicoInativo = { ...mockMedicoData, ativo: false };
      db.query.mockResolvedValue({ rows: [medicoInativo] });
      
      const result = await MedicoRepository.findByEmail('inativo@hospital.com', true);
      expect(result).toBeInstanceOf(Medico);
      expect(result.ativo).toBe(false);
    });
  });

  describe('findByCrm', () => {
    it('deve retornar médico pelo CRM', async () => {
      db.query.mockResolvedValue({ rows: [mockMedicoData] });
      const result = await MedicoRepository.findByCrm('12345');
      expect(result).toBeInstanceOf(Medico);
      expect(result.crm).toBe('12345');
    });

    it('deve retornar médico inativo pelo CRM quando includeInactive = true', async () => {
      const medicoInativo = { ...mockMedicoData, ativo: false };
      db.query.mockResolvedValue({ rows: [medicoInativo] });
      
      const result = await MedicoRepository.findByCrm('12345', true);
      expect(result.ativo).toBe(false);
    });

    it('deve retornar null se CRM não encontrado', async () => {
      db.query.mockResolvedValue({ rows: [] });
      const result = await MedicoRepository.findByCrm('99999');
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('deve criar um novo médico', async () => {
      bcrypt.hash.mockResolvedValue('hashed_password');
      db.query
        .mockResolvedValueOnce({ rows: [] }) // check CRM
        .mockResolvedValueOnce({ rows: [] }) // check Email
        .mockResolvedValueOnce({ rows: [{ ...mockMedicoData, senha: 'hashed_password' }] }); // insert

      const newMedico = await MedicoRepository.create({
        nome: 'Dr. Fulano',
        crm: '12345',
        especialidade: 'Cardiologia',
        email: 'fulano@hospital.com',
        senha: '123456',
        telefone: '123456789'
      });

      expect(newMedico).toBeInstanceOf(Medico);
      expect(newMedico.nome).toBe('Dr. Fulano');
    });

    it('deve lançar erro se CRM já existir', async () => {
      db.query.mockResolvedValueOnce({ rows: [mockMedicoData] });
      await expect(MedicoRepository.create({
        nome: 'Dr. Fulano',
        crm: '12345',
        especialidade: 'Cardiologia',
        email: 'outro@hospital.com',
        senha: '123456',
        telefone: '123456789'
      })).rejects.toThrow('CRM já cadastrado');
    });

    it('deve lançar erro se Email já existir', async () => {
      db.query.mockResolvedValueOnce({ rows: [] }) // CRM check
        .mockResolvedValueOnce({ rows: [mockMedicoData] }); // Email check

      await expect(MedicoRepository.create({
        nome: 'Dr. Fulano',
        crm: '54321',
        especialidade: 'Cardiologia',
        email: 'fulano@hospital.com',
        senha: '123456',
        telefone: '123456789'
      })).rejects.toThrow('Email já cadastrado');
    });
  });

  describe('update', () => {
    it('deve atualizar os dados de um médico', async () => {
      const updatedMock = { ...mockMedicoData, nome: 'Dr. Atualizado' };

      db.query
        .mockResolvedValueOnce({ rows: [mockMedicoData] }) // findById
        .mockResolvedValueOnce({ rows: [updatedMock] });   // UPDATE retornando dados atualizados

      const updated = await MedicoRepository.update(1, { nome: 'Dr. Atualizado' });
      expect(updated).toBeInstanceOf(Medico);
      expect(updated.nome).toBe('Dr. Atualizado');
    });

    it('deve lançar erro se médico não existir', async () => {
      db.query.mockResolvedValueOnce({ rows: [] }); // findById retorna nada
      await expect(MedicoRepository.update(99, { nome: 'Outro' }))
        .rejects.toThrow('Médico não encontrado');
    });

    it('deve lançar erro se CRM já estiver em uso por outro médico', async () => {
      const outroMedico = { ...mockMedicoData, id: 2, crm: '54321' };
      
      db.query
        .mockResolvedValueOnce({ rows: [mockMedicoData] }) // findById
        .mockResolvedValueOnce({ rows: [outroMedico] });   // findByCrm (CRM já em uso)

      await expect(MedicoRepository.update(1, { crm: '54321' }))
        .rejects.toThrow('CRM já está em uso por outro médico');
    });
  });

  describe('updatePassword', () => {
    it('deve atualizar a senha com sucesso', async () => {
      const medicoComSenha = { 
        ...mockMedicoData, 
        senha: 'hash_antiga',
        ativo: true 
      };
      
      bcrypt.compare.mockResolvedValue(true);
      bcrypt.hash.mockResolvedValue('hash_nova');
      db.query
        .mockResolvedValueOnce({ rows: [medicoComSenha] }) // SELECT senha
        .mockResolvedValueOnce({ rows: [mockMedicoData] }); // UPDATE

      const result = await MedicoRepository.updatePassword(1, 'senha_antiga', 'nova_senha');
      expect(result).toBeInstanceOf(Medico);
    });

    it('deve lançar erro se médico não encontrado', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });
      
      await expect(MedicoRepository.updatePassword(99, 'senha_antiga', 'nova_senha'))
        .rejects.toThrow('Médico não encontrado');
    });

    it('deve lançar erro se médico inativo', async () => {
      const medicoInativo = { ...mockMedicoData, ativo: false };
      db.query.mockResolvedValueOnce({ rows: [medicoInativo] });
      
      await expect(MedicoRepository.updatePassword(1, 'senha_antiga', 'nova_senha'))
        .rejects.toThrow('Médico inativo');
    });

    it('deve lançar erro se senha atual incorreta', async () => {
      const medicoComSenha = { ...mockMedicoData, senha: 'hash_antiga', ativo: true };
      db.query.mockResolvedValueOnce({ rows: [medicoComSenha] });
      bcrypt.compare.mockResolvedValue(false);

      await expect(MedicoRepository.updatePassword(1, 'senha_errada', 'nova_senha'))
        .rejects.toThrow('Senha atual incorreta');
    });

    it('deve lançar erro se nova senha igual à atual', async () => {
      const medicoComSenha = { ...mockMedicoData, senha: 'hash_antiga', ativo: true };
      db.query.mockResolvedValueOnce({ rows: [medicoComSenha] });
      bcrypt.compare.mockResolvedValue(true);

      await expect(MedicoRepository.updatePassword(1, 'mesma_senha', 'mesma_senha'))
        .rejects.toThrow('A nova senha deve ser diferente da senha atual');
    });
  });

  describe('verifyCredentials', () => {
    it('deve verificar credenciais com sucesso', async () => {
      const medicoComSenha = { 
        ...mockMedicoData, 
        senha: 'hash_senha',
        ativo: true 
      };
      
      db.query.mockResolvedValue({ rows: [medicoComSenha] });
      bcrypt.compare.mockResolvedValue(true);

      const result = await MedicoRepository.verifyCredentials('fulano@hospital.com', 'senha_correta');
      expect(result).toBeInstanceOf(Medico);
      expect(result.email).toBe('fulano@hospital.com');
    });

    it('deve lançar erro se médico não encontrado', async () => {
      db.query.mockResolvedValue({ rows: [] });
      
      await expect(MedicoRepository.verifyCredentials('inexistente@email.com', 'senha'))
        .rejects.toThrow('Credenciais inválidas');
    });

    it('deve lançar erro se médico inativo', async () => {
      const medicoInativo = { ...mockMedicoData, ativo: false };
      db.query.mockResolvedValue({ rows: [medicoInativo] });
      
      await expect(MedicoRepository.verifyCredentials('inativo@hospital.com', 'senha'))
        .rejects.toThrow('Médico inativo');
    });

    it('deve lançar erro se senha incorreta', async () => {
      const medicoComSenha = { ...mockMedicoData, senha: 'hash_senha', ativo: true };
      db.query.mockResolvedValue({ rows: [medicoComSenha] });
      bcrypt.compare.mockResolvedValue(false);

      await expect(MedicoRepository.verifyCredentials('fulano@hospital.com', 'senha_errada'))
        .rejects.toThrow('Credenciais inválidas');
    });
  });

  describe('remove', () => {
    it('deve remover um médico', async () => {
      db.query.mockResolvedValueOnce({ rows: [mockMedicoData] });
      const result = await MedicoRepository.remove(1);
      expect(result).toBeInstanceOf(Medico);
    });

    it('deve retornar null se médico não encontrado', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });
      const result = await MedicoRepository.remove(99);
      expect(result).toBeNull();
    });
  });

  describe('deactivate', () => {
    it('deve desativar um médico', async () => {
      const mockDesativado = { ...mockMedicoData, ativo: false };
      db.query.mockResolvedValueOnce({ rows: [mockDesativado] });

      const result = await MedicoRepository.deactivate(1);
      expect(result).toBeInstanceOf(Medico);
      expect(result.ativo).toBe(false);
    });

    it('deve retornar null se médico não encontrado ao desativar', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });
      const result = await MedicoRepository.deactivate(99);
      expect(result).toBeNull();
    });
  });

  describe('activate', () => {
    it('deve ativar um médico', async () => {
      const medicoAtivado = { ...mockMedicoData, ativo: true };
      db.query.mockResolvedValue({ rows: [medicoAtivado] });

      const result = await MedicoRepository.activate(1);
      expect(result).toBeInstanceOf(Medico);
      expect(result.ativo).toBe(true);
    });

    it('deve retornar null se médico não encontrado ao ativar', async () => {
      db.query.mockResolvedValue({ rows: [] });
      const result = await MedicoRepository.activate(99);
      expect(result).toBeNull();
    });
  });
});