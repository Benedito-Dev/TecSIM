const BulaService = require('../../services/bulaServices');
const BulaRepository = require('../../repository/bulaRepository');
const MedicamentoRepository = require('../../repository/medicamentoRepository');
const { ValidationError, NotFoundError, ConflictError, DatabaseError } = require('../../utils/errors');
const Bula = require('../../models/bulaModel');

// Mock das dependências
jest.mock('../../repository/bulaRepository');
jest.mock('../../repository/medicamentoRepository');

describe('BulaService', () => {
  const mockBulaData = {
    id: 1,
    id_medicamento: 10,
    dosagem_e_administracao: '2x ao dia',
    indicacoes: 'Dor e febre',
    contraindicacoes: 'Hipersensibilidade',
    advertencias: 'Não exceder a dose recomendada',
    interacoes_medicamentosas: 'Evitar com álcool',
    armazenamento_e_validade: 'Ambiente seco, 2 anos'
  };

  const mockMedicamentoData = {
    id: 10,
    nome: 'Paracetamol',
    tipo: 'Analgésico'
  };

  const mockDadosCriacao = {
    id_medicamento: 10,
    dosagem_e_administracao: '2x ao dia',
    indicacoes: 'Dor e febre',
    contraindicacoes: 'Hipersensibilidade',
    advertencias: 'Não exceder a dose recomendada',
    interacoes_medicamentosas: 'Evitar com álcool',
    armazenamento_e_validade: 'Ambiente seco, 2 anos'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock do console para evitar logs
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  describe('create', () => {
    it('deve criar bula com dados válidos', async () => {
      MedicamentoRepository.findById.mockResolvedValue(mockMedicamentoData);
      BulaRepository.create.mockResolvedValue(new Bula(mockBulaData));

      const result = await BulaService.create(mockDadosCriacao);

      expect(MedicamentoRepository.findById).toHaveBeenCalledWith(10);
      expect(BulaRepository.create).toHaveBeenCalledWith(mockDadosCriacao);
      expect(result).toBeInstanceOf(Bula);
    });

    it('deve lançar ValidationError para dados inválidos', async () => {
      await expect(BulaService.create(null)).rejects.toThrow(ValidationError);
      await expect(BulaService.create('string')).rejects.toThrow(ValidationError);
      await expect(BulaService.create({})).rejects.toThrow(ValidationError);
    });

    it('deve lançar ValidationError para ID do medicamento inválido', async () => {
      const casosInvalidos = [
        { id_medicamento: null },
        { id_medicamento: '' },
        { id_medicamento: 'abc' },
        { id_medicamento: 0 }
      ];

      for (const caso of casosInvalidos) {
        await expect(BulaService.create(caso)).rejects.toThrow(ValidationError);
      }
    });

    it('deve lançar ValidationError quando medicamento não existe', async () => {
      MedicamentoRepository.findById.mockResolvedValue(null);

      await expect(BulaService.create(mockDadosCriacao))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar ConflictError para bula duplicada', async () => {
      MedicamentoRepository.findById.mockResolvedValue(mockMedicamentoData);
      
      const duplicateError = new Error('Duplicate key');
      duplicateError.code = '23505';
      BulaRepository.create.mockRejectedValue(duplicateError);

      await expect(BulaService.create(mockDadosCriacao))
        .rejects.toThrow(ConflictError);
    });

    it('deve lançar DatabaseError para erro genérico do banco', async () => {
      MedicamentoRepository.findById.mockResolvedValue(mockMedicamentoData);
      BulaRepository.create.mockRejectedValue(new Error('Database error'));

      await expect(BulaService.create(mockDadosCriacao))
        .rejects.toThrow(DatabaseError);
    });
  });

  describe('findAll', () => {
    it('deve retornar todas as bulas', async () => {
      const bulas = [new Bula(mockBulaData), new Bula({ ...mockBulaData, id: 2 })];
      BulaRepository.findAll.mockResolvedValue(bulas);

      const result = await BulaService.findAll();

      expect(result).toEqual(bulas);
      expect(BulaRepository.findAll).toHaveBeenCalled();
    });

    it('deve lançar DatabaseError em caso de erro', async () => {
      BulaRepository.findAll.mockRejectedValue(new Error('DB error'));

      await expect(BulaService.findAll()).rejects.toThrow(DatabaseError);
    });
  });

  describe('findById', () => {
    it('deve retornar bula para ID válido', async () => {
      BulaRepository.findById.mockResolvedValue(new Bula(mockBulaData));

      const result = await BulaService.findById(1);

      expect(result).toBeInstanceOf(Bula);
      expect(BulaRepository.findById).toHaveBeenCalledWith(1);
    });

    it('deve retornar null se bula não existir', async () => {
      BulaRepository.findById.mockResolvedValue(null);

      const result = await BulaService.findById(999);

      expect(result).toBeNull();
    });

    it('deve lançar DatabaseError em caso de erro', async () => {
      BulaRepository.findById.mockRejectedValue(new Error('DB error'));

      await expect(BulaService.findById(1)).rejects.toThrow(DatabaseError);
    });
  });

  describe('findByMedicamentoId', () => {
    it('deve retornar bula para ID do medicamento válido', async () => {
      BulaRepository.findByMedicamentoId.mockResolvedValue(new Bula(mockBulaData));

      const result = await BulaService.findByMedicamentoId(10);

      expect(result).toBeInstanceOf(Bula);
      expect(BulaRepository.findByMedicamentoId).toHaveBeenCalledWith(10);
    });

    it('deve lançar ValidationError para ID do medicamento inválido', async () => {
      const idsInvalidos = [null, undefined, '', 'abc'];

      for (const id of idsInvalidos) {
        await expect(BulaService.findByMedicamentoId(id)).rejects.toThrow(ValidationError);
      }
    });

    it('deve lançar NotFoundError se bula não existir', async () => {
      BulaRepository.findByMedicamentoId.mockResolvedValue(null);

      await expect(BulaService.findByMedicamentoId(99))
        .rejects.toThrow(NotFoundError);
    });

    it('deve lançar DatabaseError em caso de erro', async () => {
      BulaRepository.findByMedicamentoId.mockRejectedValue(new Error('DB error'));

      await expect(BulaService.findByMedicamentoId(10))
        .rejects.toThrow(DatabaseError);
    });
  });

  describe('update', () => {
    const dadosUpdate = {
      dosagem_e_administracao: '3x ao dia'
    };

    it('deve atualizar bula com dados válidos', async () => {
      const bulaAtualizada = new Bula({ ...mockBulaData, ...dadosUpdate });
      BulaRepository.update.mockResolvedValue(bulaAtualizada);

      const result = await BulaService.update(1, dadosUpdate);

      expect(result).toBeInstanceOf(Bula);
      expect(result.dosagem_e_administracao).toBe('3x ao dia');
      expect(BulaRepository.update).toHaveBeenCalledWith(1, dadosUpdate);
    });

    it('deve lançar ValidationError para ID inválido', async () => {
      const idsInvalidos = [null, undefined, '', 'abc'];

      for (const id of idsInvalidos) {
        await expect(BulaService.update(id, dadosUpdate))
          .rejects.toThrow(ValidationError);
      }
    });

    it('deve lançar ValidationError para dados inválidos', async () => {
      await expect(BulaService.update(1, null)).rejects.toThrow(ValidationError);
      await expect(BulaService.update(1, 'string')).rejects.toThrow(ValidationError);
    });

    it('deve lançar NotFoundError se bula não existir', async () => {
      BulaRepository.update.mockResolvedValue(null);

      await expect(BulaService.update(99, dadosUpdate))
        .rejects.toThrow(NotFoundError);
    });

    it('deve lançar DatabaseError em caso de erro', async () => {
      BulaRepository.update.mockRejectedValue(new Error('DB error'));

      await expect(BulaService.update(1, dadosUpdate))
        .rejects.toThrow(DatabaseError);
    });
  });

  describe('remove', () => {
    it('deve remover bula com ID válido', async () => {
      BulaRepository.remove.mockResolvedValue(new Bula(mockBulaData));

      const result = await BulaService.remove(1);

      expect(result).toBeInstanceOf(Bula);
      expect(BulaRepository.remove).toHaveBeenCalledWith(1);
    });

    it('deve lançar ValidationError para ID inválido', async () => {
      const idsInvalidos = [null, undefined, '', 'abc'];

      for (const id of idsInvalidos) {
        await expect(BulaService.remove(id)).rejects.toThrow(ValidationError);
      }
    });

    it('deve lançar NotFoundError se bula não existir', async () => {
      BulaRepository.remove.mockResolvedValue(null);

      await expect(BulaService.remove(99)).rejects.toThrow(NotFoundError);
    });

    it('deve lançar DatabaseError em caso de erro', async () => {
      BulaRepository.remove.mockRejectedValue(new Error('DB error'));

      await expect(BulaService.remove(1)).rejects.toThrow(DatabaseError);
    });
  });
});