const db = require('../db/db');
const PrescricaoRepository = require('../repository/prescricaoRepository');
const Prescricao = require('../models/prescricaoModel');
const { NotFoundError, DatabaseError } = require('../utils/errors');

jest.mock('../db/db');

const mockPrescricaoData = {
  id: 1,
  id_paciente: 1,
  crm: '12345',
  diagnostico: 'Hipertensão',
  data_prescricao: '2025-10-01',
  validade: '2025-12-01',
  data_cadastro: '2025-10-01T12:00:00.000Z'
};

describe('PrescricaoRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('deve retornar todas as prescrições', async () => {
      db.query.mockResolvedValueOnce({ rows: [mockPrescricaoData] });
      const result = await PrescricaoRepository.findAll();
      expect(result[0]).toBeInstanceOf(Prescricao);
      expect(result[0].crm).toBe('12345');
    });

    it('deve lançar DatabaseError se houver falha no DB', async () => {
      db.query.mockRejectedValueOnce(new Error('Erro DB'));
      await expect(PrescricaoRepository.findAll()).rejects.toThrow(DatabaseError);
    });
  });

  describe('findById', () => {
    it('deve retornar prescrição pelo id', async () => {
      db.query.mockResolvedValueOnce({ rows: [mockPrescricaoData] });
      const result = await PrescricaoRepository.findById(1);
      expect(result).toBeInstanceOf(Prescricao);
      expect(result.id_paciente).toBe(1);
    });

    it('deve lançar NotFoundError se não encontrado', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });
      await expect(PrescricaoRepository.findById(99)).rejects.toThrow(NotFoundError);
    });

    it('deve lançar DatabaseError se houver outro erro', async () => {
      db.query.mockRejectedValueOnce(new Error('Erro inesperado'));
      await expect(PrescricaoRepository.findById(1)).rejects.toThrow(DatabaseError);
    });
  });

  describe('findByPacienteId', () => {
    it('deve retornar prescrições de um paciente', async () => {
      db.query.mockResolvedValueOnce({ rows: [mockPrescricaoData] });
      const result = await PrescricaoRepository.findByPacienteId(1);
      expect(result[0]).toBeInstanceOf(Prescricao);
      expect(result[0].id_paciente).toBe(1);
    });

    it('deve lançar NotFoundError se paciente não tiver prescrições', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });
      await expect(PrescricaoRepository.findByPacienteId(99)).rejects.toThrow(NotFoundError);
    });

    it('deve lançar DatabaseError se houver erro', async () => {
      db.query.mockRejectedValueOnce(new Error('Erro DB'));
      await expect(PrescricaoRepository.findByPacienteId(1)).rejects.toThrow(DatabaseError);
    });
  });

  describe('findByMedicoCrm', () => {
    it('deve retornar prescrições de um médico', async () => {
      db.query.mockResolvedValueOnce({ rows: [mockPrescricaoData] });
      const result = await PrescricaoRepository.findByMedicoCrm('12345');
      expect(result[0]).toBeInstanceOf(Prescricao);
      expect(result[0].crm).toBe('12345');
    });

    it('deve lançar NotFoundError se médico não tiver prescrições', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });
      await expect(PrescricaoRepository.findByMedicoCrm('99999')).rejects.toThrow(NotFoundError);
    });

    it('deve lançar DatabaseError se houver erro', async () => {
      db.query.mockRejectedValueOnce(new Error('Erro DB'));
      await expect(PrescricaoRepository.findByMedicoCrm('12345')).rejects.toThrow(DatabaseError);
    });
  });

  describe('create', () => {
    it('deve criar nova prescrição', async () => {
    const mockPrescricaoCreate = {
        id_prescricao: 1,
        id_paciente: 1,
        crm: '12345',
        diagnostico: 'Hipertensão',
        data_prescricao: '2025-10-01',
        validade: '2025-12-01'
    };
    db.query.mockResolvedValueOnce({ rows: [mockPrescricaoCreate] });
    const result = await PrescricaoRepository.create({
        id_paciente: 1,
        crm: '12345',
        diagnostico: 'Hipertensão',
        data_prescricao: '2025-10-01',
        validade: '2025-12-01'
    });
      expect(result.id).toBe(1);
      expect(result.id_prescricao).toBe(1);
    });

    it('deve lançar DatabaseError se houver falha no DB', async () => {
      db.query.mockRejectedValueOnce(new Error('Erro DB'));
      await expect(PrescricaoRepository.create({
        id_paciente: 1,
        crm: '12345',
        diagnostico: 'Hipertensão',
        data_prescricao: '2025-10-01',
        validade: '2025-12-01'
      })).rejects.toThrow(DatabaseError);
    });
  });

  describe('update', () => {
    it('deve atualizar prescrição', async () => {
      db.query.mockResolvedValueOnce({ rows: [mockPrescricaoData] });
      const result = await PrescricaoRepository.update(1, { diagnostico: 'Novo diagnóstico' });
      expect(result).toBeInstanceOf(Prescricao);
    });

    it('deve lançar NotFoundError se prescrição não encontrada', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });
      await expect(PrescricaoRepository.update(99, { diagnostico: 'X' })).rejects.toThrow(NotFoundError);
    });

    it('deve lançar DatabaseError se houver outro erro', async () => {
      db.query.mockRejectedValueOnce(new Error('Erro DB'));
      await expect(PrescricaoRepository.update(1, { diagnostico: 'X' })).rejects.toThrow(DatabaseError);
    });
  });

  describe('remove', () => {
    it('deve remover prescrição', async () => {
      db.query.mockResolvedValueOnce({ rows: [mockPrescricaoData] });
      const result = await PrescricaoRepository.remove(1);
      expect(result).toBeInstanceOf(Prescricao);
      expect(result.id).toBe(1);
    });

    it('deve lançar NotFoundError se prescrição não encontrada', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });
      await expect(PrescricaoRepository.remove(99)).rejects.toThrow(NotFoundError);
    });

    it('deve lançar DatabaseError se houver erro', async () => {
      db.query.mockRejectedValueOnce(new Error('Erro DB'));
      await expect(PrescricaoRepository.remove(1)).rejects.toThrow(DatabaseError);
    });
  });
});
