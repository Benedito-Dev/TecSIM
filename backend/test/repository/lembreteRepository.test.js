const LembreteRepository = require('../../repository/lembreteRepository');
const Lembrete = require('../../models/lembretesModel');
const db = require('../../db/db');

// Mock das dependências
jest.mock('../../db/db');
jest.mock('../../models/lembretesModel');

describe('LembreteRepository', () => {
  let mockLembreteInstance;
  let mockQuery;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockQuery = {
      rows: []
    };

    mockLembreteInstance = {
      isValid: jest.fn().mockReturnValue(true),
      isCanalEnvioValido: jest.fn().mockReturnValue(true)
    };

    Lembrete.mockImplementation((data) => {
      return {
        ...mockLembreteInstance,
        ...data
      };
    });

    db.query = jest.fn().mockResolvedValue(mockQuery);
  });

  describe('findAll', () => {
    it('deve retornar todos os lembretes', async () => {
      // Arrange
      const mockLembretes = [
        { id_lembrete: 1, horario: '08:00', status: true },
        { id_lembrete: 2, horario: '12:00', status: true }
      ];
      mockQuery.rows = mockLembretes;

      // Act
      const result = await LembreteRepository.findAll();

      // Assert
      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('SELECT'));
      expect(Lembrete).toHaveBeenCalledTimes(2);
      expect(result).toHaveLength(2);
    });

    it('deve retornar array vazio quando não há lembretes', async () => {
      // Arrange
      mockQuery.rows = [];

      // Act
      const result = await LembreteRepository.findAll();

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('deve retornar lembrete pelo ID', async () => {
      // Arrange
      const mockLembrete = { id_lembrete: 1, horario: '08:00' };
      mockQuery.rows = [mockLembrete];

      // Act
      const result = await LembreteRepository.findById(1);

      // Assert
      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('WHERE id_lembrete = $1'), [1]);
      expect(Lembrete).toHaveBeenCalledWith(mockLembrete);
      expect(result).toBeInstanceOf(Object);
    });

    it('deve retornar null quando lembrete não existe', async () => {
      // Arrange
      mockQuery.rows = [];

      // Act
      const result = await LembreteRepository.findById(999);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('findByPaciente', () => {
    it('deve retornar lembretes do paciente', async () => {
      // Arrange
      const mockLembretes = [
        { id_lembrete: 1, id_paciente: 1 },
        { id_lembrete: 2, id_paciente: 1 }
      ];
      mockQuery.rows = mockLembretes;

      // Act
      const result = await LembreteRepository.findByPaciente(1);

      // Assert
      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('WHERE id_paciente = $1'), [1]);
      expect(Lembrete).toHaveBeenCalledTimes(2);
      expect(result).toHaveLength(2);
    });

    it('deve retornar array vazio quando paciente não tem lembretes', async () => {
      // Arrange
      mockQuery.rows = [];

      // Act
      const result = await LembreteRepository.findByPaciente(999);

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('findByPrescricao', () => {
    it('deve retornar lembretes da prescrição', async () => {
      // Arrange
      const mockLembretes = [
        { id_lembrete: 1, id_prescricao: 1 },
        { id_lembrete: 2, id_prescricao: 1 }
      ];
      mockQuery.rows = mockLembretes;

      // Act
      const result = await LembreteRepository.findByPrescricao(1);

      // Assert
      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('WHERE id_prescricao = $1'), [1]);
      expect(result).toHaveLength(2);
    });
  });

  describe('findLembretesAtivos', () => {
    it('deve retornar apenas lembretes ativos', async () => {
      // Arrange
      const mockLembretes = [
        { id_lembrete: 1, status: true },
        { id_lembrete: 2, status: true }
      ];
      mockQuery.rows = mockLembretes;

      // Act
      const result = await LembreteRepository.findLembretesAtivos();

      // Assert
      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('WHERE status = TRUE'));
      expect(result).toHaveLength(2);
    });
  });

  describe('findLembretesPendentes', () => {
    it('deve retornar lembretes pendentes', async () => {
      // Arrange
      const mockLembretes = [
        { 
          id_lembrete: 1, 
          enviado: false, 
          status: true,
          data_inicio: '2024-01-01',
          data_fim: '2024-12-31'
        }
      ];
      mockQuery.rows = mockLembretes;

      // Act
      const result = await LembreteRepository.findLembretesPendentes();

      // Assert
      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('WHERE enviado = FALSE'));
      expect(result).toHaveLength(1);
    });
  });

  describe('create', () => {
    const lembreteDataValida = {
      id_paciente: 1,
      id_prescricao: 1,
      id_medicamento: 1,
      horario: '08:00',
      data_inicio: '2024-01-01',
      data_fim: '2024-12-31',
      canal_envio: 'email',
      enviado: false,
      status: true
    };

    it('deve criar lembrete com dados válidos', async () => {
      // Arrange
      mockQuery.rows = [{ id_lembrete: 1, ...lembreteDataValida }];

      // Act
      const result = await LembreteRepository.create(lembreteDataValida);

      // Assert
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO lembretes'),
        expect.arrayContaining([
          1, 1, 1, '08:00', '2024-01-01', '2024-12-31', 'email', false, true
        ])
      );
      expect(result).toBeInstanceOf(Object);
    });

    it('deve usar valores padrão quando não fornecidos', async () => {
      // Arrange
      const lembreteData = {
        id_paciente: 1,
        id_prescricao: 1,
        id_medicamento: 1,
        horario: '08:00',
        data_inicio: '2024-01-01',
        data_fim: '2024-12-31',
        canal_envio: 'email'
      };
      mockQuery.rows = [{ id_lembrete: 1, ...lembreteData, enviado: false, status: true }];

      // Act
      const result = await LembreteRepository.create(lembreteData);

      // Assert
      expect(db.query).toHaveBeenCalledWith(
        expect.anything(),
        expect.arrayContaining([false, true])
      );
    });

    it('deve lançar erro quando dados são inválidos', async () => {
      // Arrange
      mockLembreteInstance.isValid.mockReturnValue(false);

      // Act & Assert
      await expect(LembreteRepository.create(lembreteDataValida))
        .rejects
        .toThrow('Dados do lembrete inválidos');
    });

    it('deve lançar erro quando canal de envio é inválido', async () => {
      // Arrange
      const dataComCanalInvalido = {
        ...lembreteDataValida,
        canal_envio: 'invalido'
      };
      mockLembreteInstance.isCanalEnvioValido.mockReturnValue(false);

      // Act & Assert
      await expect(LembreteRepository.create(dataComCanalInvalido))
        .rejects
        .toThrow('Canal de envio inválido');
    });
  });

  describe('update', () => {
    const lembreteDataValida = {
      id_paciente: 1,
      id_prescricao: 1,
      id_medicamento: 1,
      horario: '09:00',
      data_inicio: '2024-01-01',
      data_fim: '2024-12-31',
      canal_envio: 'sms',
      enviado: true,
      status: true
    };

    it('deve atualizar lembrete com dados válidos', async () => {
      // Arrange
      mockQuery.rows = [{ id_lembrete: 1, ...lembreteDataValida }];

      // Act
      const result = await LembreteRepository.update(1, lembreteDataValida);

      // Assert
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE lembretes'),
        expect.arrayContaining([1, 1, 1, '09:00', '2024-01-01', '2024-12-31', 'sms', true, true, 1])
      );
      expect(result).toBeInstanceOf(Object);
    });

    it('deve retornar null quando lembrete não existe', async () => {
      // Arrange
      mockQuery.rows = [];

      // Act
      const result = await LembreteRepository.update(999, lembreteDataValida);

      // Assert
      expect(result).toBeNull();
    });

    it('deve lançar erro quando dados são inválidos', async () => {
      // Arrange
      mockLembreteInstance.isValid.mockReturnValue(false);

      // Act & Assert
      await expect(LembreteRepository.update(1, lembreteDataValida))
        .rejects
        .toThrow('Dados do lembrete inválidos');
    });
  });

  describe('marcarComoEnviado', () => {
    it('deve marcar lembrete como enviado', async () => {
      // Arrange
      const mockLembrete = { id_lembrete: 1, enviado: true };
      mockQuery.rows = [mockLembrete];

      // Act
      const result = await LembreteRepository.marcarComoEnviado(1);

      // Assert
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE lembretes SET enviado = TRUE'),
        [1]
      );
      expect(result).toBeInstanceOf(Object);
    });

    it('deve retornar null quando lembrete não existe', async () => {
      // Arrange
      mockQuery.rows = [];

      // Act
      const result = await LembreteRepository.marcarComoEnviado(999);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('atualizarStatus', () => {
    it('deve atualizar status do lembrete', async () => {
      // Arrange
      const mockLembrete = { id_lembrete: 1, status: false };
      mockQuery.rows = [mockLembrete];

      // Act
      const result = await LembreteRepository.atualizarStatus(1, false);

      // Assert
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE lembretes SET status = $1'),
        [false, 1]
      );
      expect(result).toBeInstanceOf(Object);
    });

    it('deve retornar null quando lembrete não existe', async () => {
      // Arrange
      mockQuery.rows = [];

      // Act
      const result = await LembreteRepository.atualizarStatus(999, true);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('resetarEnvios', () => {
    it('deve resetar envios para um paciente específico', async () => {
      // Arrange
      const mockLembretes = [
        { id_lembrete: 1, id_paciente: 1, enviado: false },
        { id_lembrete: 2, id_paciente: 1, enviado: false }
      ];
      mockQuery.rows = mockLembretes;

      // Act
      const result = await LembreteRepository.resetarEnvios(1);

      // Assert - Corrigido: usar regex para ignorar quebras de linha
      expect(db.query).toHaveBeenCalledWith(
        expect.stringMatching(/WHERE id_paciente = \$1.*AND status = TRUE/s),
        [1]
      );
      expect(result).toHaveLength(2);
    });

    it('deve resetar envios para todos os pacientes', async () => {
      // Arrange
      const mockLembretes = [
        { id_lembrete: 1, enviado: false },
        { id_lembrete: 2, enviado: false },
        { id_lembrete: 3, enviado: false }
      ];
      mockQuery.rows = mockLembretes;

      // Act
      const result = await LembreteRepository.resetarEnvios();

      // Assert - Corrigido: verificar chamada sem segundo parâmetro
      expect(db.query).toHaveBeenCalledWith(
        expect.stringMatching(/WHERE status = TRUE/s)
      );
      // Verificar que foi chamado com apenas um argumento (a query string)
      const call = db.query.mock.calls[0];
      expect(call.length).toBe(1);
      expect(call[0]).toMatch(/WHERE status = TRUE/s);
      expect(result).toHaveLength(3);
    });

    it('deve retornar array vazio quando não há lembretes', async () => {
      // Arrange
      mockQuery.rows = [];

      // Act
      const result = await LembreteRepository.resetarEnvios();

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('delete', () => {
    it('deve deletar lembrete', async () => {
      // Arrange
      const mockLembrete = { id_lembrete: 1 };
      mockQuery.rows = [mockLembrete];

      // Act
      const result = await LembreteRepository.delete(1);

      // Assert
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM lembretes'),
        [1]
      );
      expect(result).toBeInstanceOf(Object);
    });

    it('deve retornar null quando lembrete não existe', async () => {
      // Arrange
      mockQuery.rows = [];

      // Act
      const result = await LembreteRepository.delete(999);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('deleteByPaciente', () => {
    it('deve deletar lembretes do paciente', async () => {
      // Arrange
      const mockLembretes = [
        { id_lembrete: 1, id_paciente: 1 },
        { id_lembrete: 2, id_paciente: 1 }
      ];
      mockQuery.rows = mockLembretes;

      // Act
      const result = await LembreteRepository.deleteByPaciente(1);

      // Assert - Corrigido: usar regex para ignorar quebras de linha
      expect(db.query).toHaveBeenCalledWith(
        expect.stringMatching(/DELETE FROM lembretes.*WHERE id_paciente = \$1/s),
        [1]
      );
      expect(result).toHaveLength(2);
    });

    it('deve retornar array vazio quando paciente não tem lembretes', async () => {
      // Arrange
      mockQuery.rows = [];

      // Act
      const result = await LembreteRepository.deleteByPaciente(999);

      // Assert
      expect(result).toEqual([]);
    });
  });

  // Testes de erro do banco de dados
  describe('erros do banco de dados', () => {
    it('deve propagar erro quando db.query falha', async () => {
      // Arrange
      const dbError = new Error('Erro de conexão com o banco');
      db.query.mockRejectedValue(dbError);

      // Act & Assert
      await expect(LembreteRepository.findAll()).rejects.toThrow('Erro de conexão com o banco');
    });
  });

  // Testes de validação de dados
  describe('validação de dados', () => {
    it('deve validar dados antes de criar', async () => {
      // Arrange
      const lembreteData = {
        id_paciente: 1,
        id_prescricao: 1,
        id_medicamento: 1,
        horario: '08:00',
        data_inicio: '2024-01-01',
        data_fim: '2024-12-31',
        canal_envio: 'email'
      };
      mockLembreteInstance.isValid.mockReturnValue(true);
      mockLembreteInstance.isCanalEnvioValido.mockReturnValue(true);
      mockQuery.rows = [{ id_lembrete: 1, ...lembreteData }];

      // Act
      await LembreteRepository.create(lembreteData);

      // Assert
      expect(mockLembreteInstance.isValid).toHaveBeenCalled();
      expect(mockLembreteInstance.isCanalEnvioValido).toHaveBeenCalled();
    });
  });
});