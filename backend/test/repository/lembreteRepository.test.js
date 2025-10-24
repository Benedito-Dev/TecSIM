const LembreteRepository = require('../../repository/lembreteRepository');
const Lembrete = require('../../models/lembretesModel');
const db = require('../../db/db');

jest.mock('../../db/db');
jest.mock('../../models/lembretesModel');

describe('LembreteRepository', () => {
  let mockLembreteInstance, mockQuery;

  beforeEach(() => {
    jest.clearAllMocks();
    mockQuery = { rows: [] };
    
    mockLembreteInstance = {
      isValid: jest.fn().mockReturnValue(true),
      isCanalEnvioValido: jest.fn().mockReturnValue(true)
    };

    Lembrete.mockImplementation((data) => ({ ...mockLembreteInstance, ...data }));
    db.query = jest.fn().mockResolvedValue(mockQuery);
  });

  // Testes básicos para métodos que retornam arrays
  describe('métodos de busca', () => {
    const searchMethods = [
      'findAll',
      'findByPaciente', 
      'findByPrescricao',
      'findLembretesAtivos',
      'findLembretesPendentes'
    ];

    searchMethods.forEach(method => {
      it(`${method} deve retornar array de lembretes`, async () => {
        mockQuery.rows = [{ id_lembrete: 1 }, { id_lembrete: 2 }];
        const result = await LembreteRepository[method](method.includes('Paciente') ? 1 : 
                                                        method.includes('Prescricao') ? 1 : undefined);
        expect(db.query).toHaveBeenCalled();
        expect(result).toHaveLength(2);
      });

      it(`${method} deve retornar array vazio`, async () => {
        mockQuery.rows = [];
        const result = await LembreteRepository[method](method.includes('Paciente') ? 1 : 
                                                        method.includes('Prescricao') ? 1 : undefined);
        expect(result).toEqual([]);
      });
    });
  });

  // Testes para métodos que retornam objeto único
  describe('métodos de objeto único', () => {
    const singleResultMethods = [
      { method: 'findById', args: [1] },
      { method: 'marcarComoEnviado', args: [1] },
      { method: 'atualizarStatus', args: [1, true] }
    ];

    singleResultMethods.forEach(({ method, args }) => {
      it(`${method} deve retornar lembrete`, async () => {
        mockQuery.rows = [{ id_lembrete: 1 }];
        const result = await LembreteRepository[method](...args);
        expect(db.query).toHaveBeenCalled();
        expect(result).toBeInstanceOf(Object);
      });

      it(`${method} deve retornar null quando não encontra`, async () => {
        mockQuery.rows = [];
        const result = await LembreteRepository[method](...args);
        expect(result).toBeNull();
      });
    });
  });

  // Testes para create e update
  describe('métodos de escrita', () => {
    const validData = {
      id_paciente: 1, id_prescricao: 1, id_medicamento: 1,
      horario: '08:00', data_inicio: '2024-01-01', data_fim: '2024-12-31',
      canal_envio: 'email'
    };

    it('create deve criar lembrete', async () => {
      mockQuery.rows = [{ id_lembrete: 1, ...validData }];
      const result = await LembreteRepository.create(validData);
      expect(db.query).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Object);
    });

    it('update deve atualizar lembrete', async () => {
      mockQuery.rows = [{ id_lembrete: 1, ...validData }];
      const result = await LembreteRepository.update(1, validData);
      expect(db.query).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Object);
    });

    it('update deve retornar null quando não existe', async () => {
      mockQuery.rows = [];
      const result = await LembreteRepository.update(999, validData);
      expect(result).toBeNull();
    });

    it('deve lançar erro para dados inválidos', async () => {
      mockLembreteInstance.isValid.mockReturnValue(false);
      await expect(LembreteRepository.create(validData)).rejects.toThrow('Dados do lembrete inválidos');
    });

    it('deve lançar erro para canal inválido', async () => {
      mockLembreteInstance.isCanalEnvioValido.mockReturnValue(false);
      await expect(LembreteRepository.create(validData)).rejects.toThrow('Canal de envio inválido');
    });
  });

  // Testes para delete
  describe('métodos de delete', () => {
    it('delete deve retornar lembrete deletado', async () => {
      mockQuery.rows = [{ id_lembrete: 1 }];
      const result = await LembreteRepository.delete(1);
      expect(db.query).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Object);
    });

    it('delete deve retornar null quando não existe', async () => {
      mockQuery.rows = [];
      const result = await LembreteRepository.delete(999);
      expect(result).toBeNull();
    });

    it('deleteByPaciente deve retornar array', async () => {
      mockQuery.rows = [{ id_lembrete: 1 }, { id_lembrete: 2 }];
      const result = await LembreteRepository.deleteByPaciente(1);
      expect(db.query).toHaveBeenCalled();
      expect(result).toHaveLength(2);
    });

    it('deleteByPaciente deve retornar array vazio', async () => {
      mockQuery.rows = [];
      const result = await LembreteRepository.deleteByPaciente(999);
      expect(result).toEqual([]);
    });
  });

  // Testes específicos
  describe('resetarEnvios', () => {
    it('deve resetar para paciente específico', async () => {
      mockQuery.rows = [{ id_lembrete: 1 }, { id_lembrete: 2 }];
      const result = await LembreteRepository.resetarEnvios(1);
      expect(result).toHaveLength(2);
    });

    it('deve resetar para todos os pacientes', async () => {
      mockQuery.rows = [{ id_lembrete: 1 }, { id_lembrete: 2 }];
      const result = await LembreteRepository.resetarEnvios();
      expect(result).toHaveLength(2);
    });
  });

  describe('create com valores padrão', () => {
    it('deve usar valores padrão', async () => {
      const dataSemDefaults = {
        id_paciente: 1, id_prescricao: 1, id_medicamento: 1,
        horario: '08:00', data_inicio: '2024-01-01', data_fim: '2024-12-31',
        canal_envio: 'email'
      };
      mockQuery.rows = [{ id_lembrete: 1, ...dataSemDefaults }];
      
      await LembreteRepository.create(dataSemDefaults);
      
      expect(db.query).toHaveBeenCalled();
      // Verifica que os valores padrão são passados
      const callArgs = db.query.mock.calls[0][1];
      expect(callArgs).toContain(false); // enviado padrão
      expect(callArgs).toContain(true);  // status padrão
    });
  });

  // Testes de erro
  describe('erros', () => {
    it('deve propagar erro do banco', async () => {
      db.query.mockRejectedValue(new Error('Erro de banco'));
      await expect(LembreteRepository.findAll()).rejects.toThrow('Erro de banco');
    });
  });
});