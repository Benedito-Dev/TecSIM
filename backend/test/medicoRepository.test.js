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
  });

  describe('findByEmail', () => {
    it('deve retornar médico pelo email', async () => {
      db.query.mockResolvedValue({ rows: [mockMedicoData] });
      const result = await MedicoRepository.findByEmail('fulano@hospital.com');
      expect(result).toBeInstanceOf(Medico);
      expect(result.email).toBe('fulano@hospital.com');
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

  describe('deactivate ', () => {
    it('deve desativar um médico', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ ...mockMedicoData, ativo: false }] });
      const mockDesativado = { ...mockMedicoData, ativo: false };
      db.query.mockResolvedValueOnce({ rows: [mockDesativado] });

      const result = await MedicoRepository.deactivate(1);

      console.log(result); // <-- para validar se o model está trazendo "ativo"
      expect(result).toBeInstanceOf(Medico);
      expect(result.ativo).toBe(false)
    });
  });
});
