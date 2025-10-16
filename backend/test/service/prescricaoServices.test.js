// test/prescricaoService.test.js
const PrescricaoService = require('../../services/prescricaoServices');
const prescricaoRepository = require('../../repository/prescricaoRepository');
const medicamentoPrescritoRepository = require('../../repository/medicamentosPrescritosRepository');
const db = require('../../db/db');
const { NotFoundError, DatabaseError } = require('../../utils/errors');
const Prescricao = require('../../models/prescricaoModel');

// Mock das dependências
jest.mock('../../repository/prescricaoRepository');
jest.mock('../../repository/medicamentosPrescritosRepository');
jest.mock('../../db/db');

// Mock do console para evitar vazamento de logs
beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  console.log.mockRestore();
  console.error.mockRestore();
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('PrescricaoService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockPrescricaoData = {
    id: 1,
    id_paciente: 1,
    crm: '12345',
    diagnostico: 'Hipertensão',
    data_prescricao: '2025-10-01',
    validade: '2025-12-01',
    data_cadastro: '2025-10-01T12:00:00.000Z'
  };

  const mockMedicamentoData = [
    {
      id_medicamento_prescrito: 1,
      id_prescricao: 1,
      id_medicamento: 5,
      dosagem: '500mg',
      frequencia: '2x ao dia',
      duracao_dias: 30,
      horarios: ['08:00', '20:00'],
      via: 'oral',
      nome: 'Paracetamol'
    }
  ];

  const mockDadosCriacao = {
    id_paciente: 1,
    crm: '12345',
    diagnostico: 'Hipertensão',
    data_prescricao: '2025-10-01',
    validade: '2025-12-01',
    medicamentos: [
      {
        id_medicamento: 5,
        dosagem: '500mg',
        frequencia: '2x ao dia',
        duracao_dias: 30,
        horarios: ['08:00', '20:00'],
        via: 'oral'
      }
    ]
  };

  describe('findAll', () => {
    it('deve retornar todas as prescrições', async () => {
      const prescricoesList = [new Prescricao(mockPrescricaoData)];
      prescricaoRepository.findAll.mockResolvedValue(prescricoesList);

      const result = await PrescricaoService.findAll();

      expect(prescricaoRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(prescricoesList);
    });
  });

  describe('findById', () => {
    it('deve retornar prescrição com medicamentos pelo ID', async () => {
      prescricaoRepository.findById.mockResolvedValue(new Prescricao(mockPrescricaoData));
      medicamentoPrescritoRepository.findByPrescricaoId.mockResolvedValue(mockMedicamentoData);

      const result = await PrescricaoService.findById(1);

      expect(prescricaoRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        ...mockPrescricaoData,
        medicamentos: mockMedicamentoData
      });
    });

    it('deve lançar NotFoundError se prescrição não existir', async () => {
      prescricaoRepository.findById.mockRejectedValue(new NotFoundError('Prescrição não encontrada'));

      await expect(PrescricaoService.findById(99))
        .rejects.toThrow(NotFoundError);
    });

    it('deve retornar prescrição com array vazio se não houver medicamentos', async () => {
      prescricaoRepository.findById.mockResolvedValue(new Prescricao(mockPrescricaoData));
      medicamentoPrescritoRepository.findByPrescricaoId.mockResolvedValue([]);

      const result = await PrescricaoService.findById(1);

      expect(result).toEqual({
        ...mockPrescricaoData,
        medicamentos: []
      });
    });
  });

  describe('findByPacienteId', () => {
    it('deve retornar prescrições com medicamentos pelo ID do paciente', async () => {
      const prescricoesList = [new Prescricao(mockPrescricaoData)];
      prescricaoRepository.findByPacienteId.mockResolvedValue(prescricoesList);
      medicamentoPrescritoRepository.findByPrescricaoId.mockResolvedValue(mockMedicamentoData);

      const result = await PrescricaoService.findByPacienteId(1);

      expect(prescricaoRepository.findByPacienteId).toHaveBeenCalledWith(1);
      expect(result).toEqual([{
        ...mockPrescricaoData,
        medicamentos: mockMedicamentoData
      }]);
    });

    it('deve lançar NotFoundError se paciente não tiver prescrições', async () => {
      prescricaoRepository.findByPacienteId.mockRejectedValue(new NotFoundError('Nenhuma prescrição encontrada'));

      await expect(PrescricaoService.findByPacienteId(99))
        .rejects.toThrow(NotFoundError);
    });

    it('deve retornar array vazio de medicamentos para prescrição sem medicamentos', async () => {
      const prescricoesList = [new Prescricao(mockPrescricaoData)];
      prescricaoRepository.findByPacienteId.mockResolvedValue(prescricoesList);
      medicamentoPrescritoRepository.findByPrescricaoId.mockResolvedValue([]);

      const result = await PrescricaoService.findByPacienteId(1);

      expect(result).toEqual([{
        ...mockPrescricaoData,
        medicamentos: []
      }]);
    });
  });

  describe('findByMedicoCrm', () => {
    it('deve retornar prescrições pelo CRM do médico', async () => {
      const prescricoesList = [new Prescricao(mockPrescricaoData)];
      prescricaoRepository.findByMedicoCrm.mockResolvedValue(prescricoesList);

      const result = await PrescricaoService.findByMedicoCrm('12345');

      expect(prescricaoRepository.findByMedicoCrm).toHaveBeenCalledWith('12345');
      expect(result).toEqual(prescricoesList);
    });

    it('deve lançar NotFoundError se médico não tiver prescrições', async () => {
      prescricaoRepository.findByMedicoCrm.mockRejectedValue(new NotFoundError('Nenhuma prescrição encontrada'));

      await expect(PrescricaoService.findByMedicoCrm('99999'))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('create', () => {
    const mockClient = {
      query: jest.fn(),
      release: jest.fn()
    };

    beforeEach(() => {
      db.pool = {
        connect: jest.fn().mockResolvedValue(mockClient)
      };
      mockClient.query.mockClear();
      mockClient.release.mockClear();
    });

    it('deve criar prescrição com medicamentos em transação', async () => {
      const prescricaoCriada = { id_prescricao: 1, ...mockPrescricaoData };
      
      // Mock da transação
      mockClient.query
        .mockResolvedValueOnce() // BEGIN
        .mockResolvedValueOnce() // COMMIT
        .mockResolvedValueOnce(); // (qualquer outra chamada)

      prescricaoRepository.create.mockResolvedValue(prescricaoCriada);
      medicamentoPrescritoRepository.create.mockResolvedValue(mockMedicamentoData[0]);
      medicamentoPrescritoRepository.findByPrescricaoId.mockResolvedValue(mockMedicamentoData);

      const result = await PrescricaoService.create(mockDadosCriacao);

      expect(db.pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
      expect(prescricaoRepository.create).toHaveBeenCalledWith(mockDadosCriacao, mockClient);
      expect(medicamentoPrescritoRepository.create).toHaveBeenCalledWith(
        { ...mockDadosCriacao.medicamentos[0], id_prescricao: 1 },
        mockClient
      );
      expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
      expect(mockClient.release).toHaveBeenCalled();
      expect(result).toEqual({
        ...prescricaoCriada,
        medicamentos: mockMedicamentoData
      });
    });

    it('deve criar prescrição sem medicamentos quando array vazio', async () => {
      const dadosSemMedicamentos = { ...mockDadosCriacao, medicamentos: [] };
      const prescricaoCriada = { id_prescricao: 1, ...mockPrescricaoData };

      mockClient.query
        .mockResolvedValueOnce() // BEGIN
        .mockResolvedValueOnce() // COMMIT
        .mockResolvedValueOnce(); // (qualquer outra chamada)

      prescricaoRepository.create.mockResolvedValue(prescricaoCriada);
      medicamentoPrescritoRepository.findByPrescricaoId.mockResolvedValue([]);

      const result = await PrescricaoService.create(dadosSemMedicamentos);

      expect(medicamentoPrescritoRepository.create).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...prescricaoCriada,
        medicamentos: []
      });
    });

    it('deve criar prescrição sem medicamentos quando medicamentos for undefined', async () => {
      const dadosSemMedicamentos = { ...mockDadosCriacao };
      delete dadosSemMedicamentos.medicamentos;
      const prescricaoCriada = { id_prescricao: 1, ...mockPrescricaoData };

      mockClient.query
        .mockResolvedValueOnce() // BEGIN
        .mockResolvedValueOnce() // COMMIT
        .mockResolvedValueOnce(); // (qualquer outra chamada)

      prescricaoRepository.create.mockResolvedValue(prescricaoCriada);
      medicamentoPrescritoRepository.findByPrescricaoId.mockResolvedValue([]);

      const result = await PrescricaoService.create(dadosSemMedicamentos);

      expect(medicamentoPrescritoRepository.create).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...prescricaoCriada,
        medicamentos: []
      });
    });

    it('deve fazer rollback e lançar DatabaseError em caso de erro', async () => {
      const dbError = new Error('Erro no banco');

      mockClient.query
        .mockResolvedValueOnce() // BEGIN
        .mockResolvedValueOnce() // ROLLBACK
        .mockResolvedValueOnce(); // (qualquer outra chamada)

      prescricaoRepository.create.mockRejectedValue(dbError);

      await expect(PrescricaoService.create(mockDadosCriacao))
        .rejects.toThrow(DatabaseError);

      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
      expect(mockClient.release).toHaveBeenCalled();
    });

    it('deve fazer rollback se erro ao criar medicamento', async () => {
      const prescricaoCriada = { id_prescricao: 1, ...mockPrescricaoData };
      const medicamentoError = new Error('Erro ao criar medicamento');

      mockClient.query
        .mockResolvedValueOnce() // BEGIN
        .mockResolvedValueOnce() // ROLLBACK
        .mockResolvedValueOnce(); // (qualquer outra chamada)

      prescricaoRepository.create.mockResolvedValue(prescricaoCriada);
      medicamentoPrescritoRepository.create.mockRejectedValue(medicamentoError);

      await expect(PrescricaoService.create(mockDadosCriacao))
        .rejects.toThrow(DatabaseError);

      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
      expect(mockClient.release).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('deve atualizar prescrição', async () => {
      const dadosUpdate = { diagnostico: 'Novo diagnóstico' };
      prescricaoRepository.update.mockResolvedValue(new Prescricao({ ...mockPrescricaoData, ...dadosUpdate }));

      const result = await PrescricaoService.update(1, dadosUpdate);

      expect(prescricaoRepository.update).toHaveBeenCalledWith(1, dadosUpdate);
      expect(result).toBeInstanceOf(Prescricao);
      expect(result.diagnostico).toBe('Novo diagnóstico');
    });

    it('deve lançar NotFoundError se prescrição não existir', async () => {
      prescricaoRepository.update.mockRejectedValue(new NotFoundError('Prescrição não encontrada'));

      await expect(PrescricaoService.update(99, { diagnostico: 'X' }))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('remove', () => {
    it('deve remover prescrição', async () => {
      prescricaoRepository.remove.mockResolvedValue(new Prescricao(mockPrescricaoData));

      const result = await PrescricaoService.remove(1);

      expect(prescricaoRepository.remove).toHaveBeenCalledWith(1);
      expect(result).toBeInstanceOf(Prescricao);
    });

    it('deve lançar NotFoundError se prescrição não existir', async () => {
      prescricaoRepository.remove.mockRejectedValue(new NotFoundError('Prescrição não encontrada'));

      await expect(PrescricaoService.remove(99))
        .rejects.toThrow(NotFoundError);
    });
  });
});