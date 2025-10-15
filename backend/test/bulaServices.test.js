// test/bulaService.test.js
const BulaService = require('../services/bulaServices');
const bulaRepository = require('../repository/bulaRepository');
const medicamentoRepository = require('../repository/medicamentoRepository');
const { ValidationError, NotFoundError, ConflictError, DatabaseError } = require('../utils/errors');
const Bula = require('../models/bulaModel');

// Mock das dependências
jest.mock('../repository/bulaRepository');
jest.mock('../repository/medicamentoRepository');

describe('BulaService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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
    id_medicamento: 10,
    nome: 'Paracetamol',
    tipo: 'Analgésico'
  };

  const mockDadosCriacao = {
    id_medicamento: 10,
    dosagem_e_administracao: '2x ao dia',
    indicacoes: 'Dor e febre',
    contraindicacoes: 'Hipersensibilidade',
    advertencias: 'Não exceder a dose recomendada',
    interacoes: 'Evitar com álcool',
    armazenamento_e_validade: 'Ambiente seco, 2 anos'
  };

  describe('create', () => {
    it('deve criar bula com dados válidos e medicamento existente', async () => {
      medicamentoRepository.findById.mockResolvedValue(mockMedicamentoData);
      bulaRepository.create.mockResolvedValue(new Bula(mockBulaData));

      const result = await BulaService.create(mockDadosCriacao);

      expect(medicamentoRepository.findById).toHaveBeenCalledWith(10);
      expect(bulaRepository.create).toHaveBeenCalledWith(mockDadosCriacao);
      expect(result).toBeInstanceOf(Bula);
      expect(result.id).toBe(1);
    });

    it('deve lançar ValidationError para dados inválidos', async () => {
      await expect(BulaService.create(null))
        .rejects.toThrow(ValidationError);
      
      await expect(BulaService.create('string'))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar ValidationError para ID do medicamento inválido', async () => {
      const dadosInvalidos = { ...mockDadosCriacao, id_medicamento: 'abc' };
      
      await expect(BulaService.create(dadosInvalidos))
        .rejects.toThrow(ValidationError);
      
      await expect(BulaService.create({ id_medicamento: null }))
        .rejects.toThrow(ValidationError);
      
      await expect(BulaService.create({ id_medicamento: '' }))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar ValidationError quando medicamento não existe', async () => {
      medicamentoRepository.findById.mockResolvedValue(null);

      await expect(BulaService.create(mockDadosCriacao))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar ConflictError para bula duplicada', async () => {
      medicamentoRepository.findById.mockResolvedValue(mockMedicamentoData);
      
      const duplicateError = new Error('Duplicate key');
      duplicateError.code = '23505';
      bulaRepository.create.mockRejectedValue(duplicateError);

      await expect(BulaService.create(mockDadosCriacao))
        .rejects.toThrow(ConflictError);
    });

    it('deve lançar DatabaseError para erro inesperado do banco', async () => {
      medicamentoRepository.findById.mockResolvedValue(mockMedicamentoData);
      
      const dbError = new Error('Database connection failed');
      bulaRepository.create.mockRejectedValue(dbError);

      await expect(BulaService.create(mockDadosCriacao))
        .rejects.toThrow(DatabaseError);
    });
  });

  describe('findAll', () => {
    it('deve retornar todas as bulas', async () => {
      const bulasList = [new Bula(mockBulaData), new Bula({ ...mockBulaData, id: 2 })];
      bulaRepository.findAll.mockResolvedValue(bulasList);

      const result = await BulaService.findAll();

      expect(bulaRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(bulasList);
    });

    it('deve retornar array vazio quando não houver bulas', async () => {
      bulaRepository.findAll.mockResolvedValue([]);

      const result = await BulaService.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('deve retornar bula pelo ID válido', async () => {
      bulaRepository.findById.mockResolvedValue(new Bula(mockBulaData));

      const result = await BulaService.findById(1);

      expect(bulaRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toBeInstanceOf(Bula);
      expect(result.id).toBe(1);
    });

    it('deve lançar ValidationError para ID inválido', async () => {
      await expect(BulaService.findById('abc'))
        .rejects.toThrow(ValidationError);
      
      await expect(BulaService.findById(null))
        .rejects.toThrow(ValidationError);
      
      await expect(BulaService.findById(''))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar NotFoundError se bula não existir', async () => {
      bulaRepository.findById.mockResolvedValue(null);

      await expect(BulaService.findById(99))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('findByMedicamentoId', () => {
    it('deve retornar bula pelo ID do medicamento válido', async () => {
      bulaRepository.findByMedicamentoId.mockResolvedValue(new Bula(mockBulaData));

      const result = await BulaService.findByMedicamentoId(10);

      expect(bulaRepository.findByMedicamentoId).toHaveBeenCalledWith(10);
      expect(result).toBeInstanceOf(Bula);
      expect(result.id_medicamento).toBe(10);
    });

    it('deve lançar ValidationError para ID do medicamento inválido', async () => {
      await expect(BulaService.findByMedicamentoId('abc'))
        .rejects.toThrow(ValidationError);
      
      await expect(BulaService.findByMedicamentoId(null))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar NotFoundError se bula não existir para o medicamento', async () => {
      bulaRepository.findByMedicamentoId.mockResolvedValue(null);

      await expect(BulaService.findByMedicamentoId(99))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('update', () => {
    const dadosUpdate = {
      id_medicamento: 10,
      dosagem_e_administracao: '3x ao dia',
      indicacoes: 'Dor intensa',
      contraindicacoes: 'Hipersensibilidade e gravidez',
      advertencias: 'Consumir com alimentos',
      interacoes: 'Evitar com outros analgésicos',
      armazenamento_e_validade: 'Ambiente fresco, 3 anos'
    };

    it('deve atualizar bula com dados válidos', async () => {
      const bulaAtualizada = new Bula({ ...mockBulaData, ...dadosUpdate });
      bulaRepository.update.mockResolvedValue(bulaAtualizada);

      const result = await BulaService.update(1, dadosUpdate);

      expect(bulaRepository.update).toHaveBeenCalledWith(1, dadosUpdate);
      expect(result).toBeInstanceOf(Bula);
      expect(result.dosagem_e_administracao).toBe('3x ao dia');
    });

    it('deve lançar ValidationError para ID inválido', async () => {
      await expect(BulaService.update('abc', dadosUpdate))
        .rejects.toThrow(ValidationError);
      
      await expect(BulaService.update(null, dadosUpdate))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar NotFoundError se bula não existir', async () => {
      bulaRepository.update.mockResolvedValue(null);

      await expect(BulaService.update(99, dadosUpdate))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('remove', () => {
    it('deve remover bula com ID válido', async () => {
      bulaRepository.remove.mockResolvedValue(new Bula(mockBulaData));

      const result = await BulaService.remove(1);

      expect(bulaRepository.remove).toHaveBeenCalledWith(1);
      expect(result).toBeInstanceOf(Bula);
      expect(result.id).toBe(1);
    });

    it('deve lançar ValidationError para ID inválido', async () => {
      await expect(BulaService.remove('abc'))
        .rejects.toThrow(ValidationError);
      
      await expect(BulaService.remove(null))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar NotFoundError se bula não existir', async () => {
      bulaRepository.remove.mockResolvedValue(null);

      await expect(BulaService.remove(99))
        .rejects.toThrow(NotFoundError);
    });
  });
});