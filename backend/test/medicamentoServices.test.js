// test/medicamentoService.test.js
const MedicamentoService = require('../services/medicamentosService');
const medicamentoRepository = require('../repository/medicamentoRepository');
const { ValidationError, NotFoundError, ConflictError, DatabaseError } = require('../utils/errors');

jest.mock('../repository/medicamentoRepository');

describe('MedicamentoService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockMedicamentoData = {
    id_medicamento: 1,
    nome: 'Paracetamol',
    tipo: 'Analgésico',
    descricao: 'Usado para dor e febre',
    faixa_etaria_minima: 6,
    faixa_etaria_maxima: 65,
    contraindicacoes: 'Doença hepática',
    interacoes_comuns: 'Álcool',
    composicao: 'Paracetamol 500mg',
    dosagem_padrao: '2x/dia',
    bula_detalhada: 'Tomar após as refeições'
  };

  const mockDadosCriacao = {
    nome: 'Paracetamol',
    tipo: 'Analgésico',
    descricao: 'Usado para dor e febre',
    faixa_etaria_minima: 6,
    faixa_etaria_maxima: 65,
    contraindicacoes: 'Doença hepática',
    interacoes_comuns: 'Álcool',
    composicao: 'Paracetamol 500mg',
    dosagem_padrao: '2x/dia',
    bula_detalhada: 'Tomar após as refeições'
  };

  describe('create', () => {
    it('deve criar medicamento com dados válidos', async () => {
      medicamentoRepository.create.mockResolvedValue(mockMedicamentoData);

      const result = await MedicamentoService.create(mockDadosCriacao);

      expect(medicamentoRepository.create).toHaveBeenCalledWith(mockDadosCriacao);
      expect(result).toEqual(mockMedicamentoData);
    });

    it('deve lançar ValidationError para dados inválidos', async () => {
      await expect(MedicamentoService.create(null))
        .rejects.toThrow(ValidationError);
      
      await expect(MedicamentoService.create('string'))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar ValidationError para nome inválido', async () => {
      const dadosInvalidos = { ...mockDadosCriacao, nome: '' };
      
      await expect(MedicamentoService.create(dadosInvalidos))
        .rejects.toThrow(ValidationError);
      
      await expect(MedicamentoService.create({ nome: null }))
        .rejects.toThrow(ValidationError);
      
      await expect(MedicamentoService.create({ nome: '   ' }))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar ConflictError para medicamento duplicado', async () => {
      const duplicateError = new Error('Duplicate key');
      duplicateError.code = '23505';
      
      medicamentoRepository.create.mockRejectedValue(duplicateError);

      await expect(MedicamentoService.create(mockDadosCriacao))
        .rejects.toThrow(ConflictError);
    });

    it('deve lançar DatabaseError para erro inesperado do banco', async () => {
      const dbError = new Error('Database connection failed');
      
      medicamentoRepository.create.mockRejectedValue(dbError);

      await expect(MedicamentoService.create(mockDadosCriacao))
        .rejects.toThrow(DatabaseError);
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os medicamentos', async () => {
      const medicamentosList = [mockMedicamentoData, { ...mockMedicamentoData, id_medicamento: 2 }];
      medicamentoRepository.findAll.mockResolvedValue(medicamentosList);

      const result = await MedicamentoService.findAll();

      expect(medicamentoRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(medicamentosList);
    });

    it('deve lançar NotFoundError quando não encontrar medicamentos', async () => {
      medicamentoRepository.findAll.mockResolvedValue([]);

      await expect(MedicamentoService.findAll())
        .rejects.toThrow(NotFoundError);
    });

    it('deve lançar NotFoundError quando retornar não-array', async () => {
      medicamentoRepository.findAll.mockResolvedValue(null);

      await expect(MedicamentoService.findAll())
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('findById', () => {
    it('deve retornar medicamento pelo ID válido', async () => {
      medicamentoRepository.findById.mockResolvedValue(mockMedicamentoData);

      const result = await MedicamentoService.findById(1);

      expect(medicamentoRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockMedicamentoData);
    });

    it('deve lançar ValidationError para ID inválido', async () => {
      await expect(MedicamentoService.findById(null))
        .rejects.toThrow(ValidationError);
      
      await expect(MedicamentoService.findById('abc'))
        .rejects.toThrow(ValidationError);
      
      await expect(MedicamentoService.findById(''))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar NotFoundError se medicamento não existir', async () => {
      medicamentoRepository.findById.mockResolvedValue(null);

      await expect(MedicamentoService.findById(99))
        .rejects.toThrow(NotFoundError);
    });

    it('deve lançar DatabaseError para erro interno do banco', async () => {
      const dbError = new Error('Database error');
      medicamentoRepository.findById.mockRejectedValue(dbError);

      await expect(MedicamentoService.findById(1))
        .rejects.toThrow(DatabaseError);
    });
  });

  describe('search', () => {
    it('deve retornar medicamentos pelo termo de busca válido', async () => {
      const medicamentosList = [mockMedicamentoData];
      medicamentoRepository.search.mockResolvedValue(medicamentosList);

      const result = await MedicamentoService.search('paracetamol');

      expect(medicamentoRepository.search).toHaveBeenCalledWith('paracetamol');
      expect(result).toEqual(medicamentosList);
    });

    it('deve lançar ValidationError para termo de busca inválido', async () => {
      await expect(MedicamentoService.search(''))
        .rejects.toThrow(ValidationError);
      
      await expect(MedicamentoService.search(null))
        .rejects.toThrow(ValidationError);
      
      await expect(MedicamentoService.search('a'))
        .rejects.toThrow(ValidationError);
      
      await expect(MedicamentoService.search('  '))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar NotFoundError quando não encontrar resultados', async () => {
      medicamentoRepository.search.mockResolvedValue([]);

      await expect(MedicamentoService.search('inexistente'))
        .rejects.toThrow(NotFoundError);
    });

    it('deve lançar DatabaseError para erro interno do banco', async () => {
      const dbError = new Error('Database error');
      medicamentoRepository.search.mockRejectedValue(dbError);

      await expect(MedicamentoService.search('paracetamol'))
        .rejects.toThrow(DatabaseError);
    });

    it('deve repassar NotFoundError do repository', async () => {
      const notFoundError = new NotFoundError('Nenhum medicamento encontrado');
      medicamentoRepository.search.mockRejectedValue(notFoundError);

      await expect(MedicamentoService.search('paracetamol'))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('update', () => {
    const dadosUpdate = {
      nome: 'Paracetamol 750mg',
      tipo: 'Analgésico Forte',
      descricao: 'Atualizado para versão mais forte'
    };

    it('deve atualizar medicamento com dados válidos', async () => {
      const medicamentoAtualizado = { ...mockMedicamentoData, ...dadosUpdate };
      medicamentoRepository.update.mockResolvedValue(medicamentoAtualizado);

      const result = await MedicamentoService.update(1, dadosUpdate);

      expect(medicamentoRepository.update).toHaveBeenCalledWith(1, dadosUpdate);
      expect(result).toEqual(medicamentoAtualizado);
    });

    it('deve lançar ValidationError para ID inválido', async () => {
      await expect(MedicamentoService.update('abc', dadosUpdate))
        .rejects.toThrow(ValidationError);
      
      await expect(MedicamentoService.update(null, dadosUpdate))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar ValidationError para dados inválidos', async () => {
      await expect(MedicamentoService.update(1, null))
        .rejects.toThrow(ValidationError);
      
      await expect(MedicamentoService.update(1, 'string'))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar NotFoundError se medicamento não existir', async () => {
      medicamentoRepository.update.mockResolvedValue(null);

      await expect(MedicamentoService.update(99, dadosUpdate))
        .rejects.toThrow(NotFoundError);
    });

    it('deve lançar DatabaseError para erro interno do banco', async () => {
      const dbError = new Error('Database error');
      medicamentoRepository.update.mockRejectedValue(dbError);

      await expect(MedicamentoService.update(1, dadosUpdate))
        .rejects.toThrow(DatabaseError);
    });

    it('deve repassar NotFoundError do repository', async () => {
      const notFoundError = new NotFoundError('Medicamento não encontrado');
      medicamentoRepository.update.mockRejectedValue(notFoundError);

      await expect(MedicamentoService.update(1, dadosUpdate))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('remove', () => {
    it('deve remover medicamento com ID válido', async () => {
      const resultadoRemocao = { id: 1 };
      medicamentoRepository.remove.mockResolvedValue(resultadoRemocao);

      const result = await MedicamentoService.remove(1);

      expect(medicamentoRepository.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(resultadoRemocao);
    });

    it('deve lançar ValidationError para ID inválido', async () => {
      await expect(MedicamentoService.remove('abc'))
        .rejects.toThrow(ValidationError);
      
      await expect(MedicamentoService.remove(null))
        .rejects.toThrow(ValidationError);
    });

    it('deve lançar NotFoundError se medicamento não existir', async () => {
      medicamentoRepository.remove.mockResolvedValue(null);

      await expect(MedicamentoService.remove(99))
        .rejects.toThrow(NotFoundError);
    });

    it('deve lançar DatabaseError para erro interno do banco', async () => {
      const dbError = new Error('Database error');
      medicamentoRepository.remove.mockRejectedValue(dbError);

      await expect(MedicamentoService.remove(1))
        .rejects.toThrow(DatabaseError);
    });

    it('deve repassar NotFoundError do repository', async () => {
      const notFoundError = new NotFoundError('Medicamento não encontrado');
      medicamentoRepository.remove.mockRejectedValue(notFoundError);

      await expect(MedicamentoService.remove(1))
        .rejects.toThrow(NotFoundError);
    });
  });
});