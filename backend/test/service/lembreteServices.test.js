const LembreteService = require('../../services/lembreteService');
const lembreteRepository = require('../../repository/lembreteRepository');

// Mock do repository
jest.mock('../../repository/lembreteRepository');

describe('LembreteService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('deve retornar todos os lembretes', async () => {
      // Arrange
      const mockLembretes = [
        { id_lembrete: 1, horario: '08:00' },
        { id_lembrete: 2, horario: '12:00' }
      ];
      lembreteRepository.findAll.mockResolvedValue(mockLembretes);

      // Act
      const result = await LembreteService.getAll();

      // Assert
      expect(lembreteRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockLembretes);
    });

    it('deve propagar erro do repository', async () => {
      // Arrange
      const mockError = new Error('Erro de banco de dados');
      lembreteRepository.findAll.mockRejectedValue(mockError);

      // Act & Assert
      await expect(LembreteService.getAll()).rejects.toThrow('Erro de banco de dados');
      expect(lembreteRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getById', () => {
    it('deve retornar lembrete quando encontrado', async () => {
      // Arrange
      const mockLembrete = { id_lembrete: 1, horario: '08:00' };
      lembreteRepository.findById.mockResolvedValue(mockLembrete);

      // Act
      const result = await LembreteService.getById(1);

      // Assert
      expect(lembreteRepository.findById).toHaveBeenCalledWith(1);
      expect(lembreteRepository.findById).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockLembrete);
    });

    it('deve lançar erro quando lembrete não existe', async () => {
      // Arrange
      lembreteRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(LembreteService.getById(999)).rejects.toThrow('Lembrete não encontrado');
      expect(lembreteRepository.findById).toHaveBeenCalledWith(999);
    });

    it('deve propagar erro do repository', async () => {
      // Arrange
      const mockError = new Error('Erro de conexão');
      lembreteRepository.findById.mockRejectedValue(mockError);

      // Act & Assert
      await expect(LembreteService.getById(1)).rejects.toThrow('Erro de conexão');
    });
  });

  describe('create', () => {
    it('deve criar lembrete com dados válidos', async () => {
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
      const mockLembreteCriado = { id_lembrete: 1, ...lembreteData };
      lembreteRepository.create.mockResolvedValue(mockLembreteCriado);

      // Act
      const result = await LembreteService.create(lembreteData);

      // Assert
      expect(lembreteRepository.create).toHaveBeenCalledWith(lembreteData);
      expect(lembreteRepository.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockLembreteCriado);
    });

    it('deve propagar erro de validação do repository', async () => {
      // Arrange
      const lembreteDataInvalido = {
        id_paciente: 1,
        // Dados incompletos
      };
      const mockError = new Error('Dados do lembrete inválidos');
      mockError.code = 400;
      lembreteRepository.create.mockRejectedValue(mockError);

      // Act & Assert
      await expect(LembreteService.create(lembreteDataInvalido))
        .rejects
        .toThrow('Dados do lembrete inválidos');
      
      expect(lembreteRepository.create).toHaveBeenCalledWith(lembreteDataInvalido);
    });

    it('deve propagar erro genérico do repository', async () => {
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
      const mockError = new Error('Erro interno do servidor');
      lembreteRepository.create.mockRejectedValue(mockError);

      // Act & Assert
      await expect(LembreteService.create(lembreteData))
        .rejects
        .toThrow('Erro interno do servidor');
    });
  });

  describe('update', () => {
    it('deve atualizar lembrete existente', async () => {
      // Arrange
      const id = 1;
      const updateData = {
        horario: '09:00',
        canal_envio: 'sms'
      };
      const mockLembreteExistente = { id_lembrete: 1, horario: '08:00' };
      const mockLembreteAtualizado = { id_lembrete: 1, ...updateData };
      
      lembreteRepository.findById.mockResolvedValue(mockLembreteExistente);
      lembreteRepository.update.mockResolvedValue(mockLembreteAtualizado);

      // Act
      const result = await LembreteService.update(id, updateData);

      // Assert
      expect(lembreteRepository.findById).toHaveBeenCalledWith(id);
      expect(lembreteRepository.update).toHaveBeenCalledWith(id, updateData);
      expect(result).toEqual(mockLembreteAtualizado);
    });

    it('deve lançar erro quando lembrete não existe para update', async () => {
      // Arrange
      const id = 999;
      const updateData = { horario: '09:00' };
      lembreteRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(LembreteService.update(id, updateData))
        .rejects
        .toThrow('Lembrete não encontrado');
      
      expect(lembreteRepository.findById).toHaveBeenCalledWith(id);
      expect(lembreteRepository.update).not.toHaveBeenCalled();
    });

    it('deve propagar erro do repository no findById durante update', async () => {
      // Arrange
      const id = 1;
      const updateData = { horario: '09:00' };
      const mockError = new Error('Erro de banco');
      lembreteRepository.findById.mockRejectedValue(mockError);

      // Act & Assert
      await expect(LembreteService.update(id, updateData))
        .rejects
        .toThrow('Erro de banco');
      
      expect(lembreteRepository.update).not.toHaveBeenCalled();
    });

    it('deve propagar erro do repository no update', async () => {
      // Arrange
      const id = 1;
      const updateData = { horario: '09:00' };
      const mockLembreteExistente = { id_lembrete: 1, horario: '08:00' };
      const mockError = new Error('Erro ao atualizar');
      
      lembreteRepository.findById.mockResolvedValue(mockLembreteExistente);
      lembreteRepository.update.mockRejectedValue(mockError);

      // Act & Assert
      await expect(LembreteService.update(id, updateData))
        .rejects
        .toThrow('Erro ao atualizar');
      
      expect(lembreteRepository.findById).toHaveBeenCalledWith(id);
      expect(lembreteRepository.update).toHaveBeenCalledWith(id, updateData);
    });
  });

  describe('delete', () => {
    it('deve deletar lembrete existente', async () => {
      // Arrange
      const id = 1;
      const mockLembreteExistente = { id_lembrete: 1, horario: '08:00' };
      const mockLembreteDeletado = { id_lembrete: 1, horario: '08:00' };
      
      lembreteRepository.findById.mockResolvedValue(mockLembreteExistente);
      lembreteRepository.delete.mockResolvedValue(mockLembreteDeletado);

      // Act
      const result = await LembreteService.delete(id);

      // Assert
      expect(lembreteRepository.findById).toHaveBeenCalledWith(id);
      expect(lembreteRepository.delete).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockLembreteDeletado);
    });

    it('deve lançar erro quando lembrete não existe para delete', async () => {
      // Arrange
      const id = 999;
      lembreteRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(LembreteService.delete(id))
        .rejects
        .toThrow('Lembrete não encontrado');
      
      expect(lembreteRepository.findById).toHaveBeenCalledWith(id);
      expect(lembreteRepository.delete).not.toHaveBeenCalled();
    });

    it('deve propagar erro do repository no findById durante delete', async () => {
      // Arrange
      const id = 1;
      const mockError = new Error('Erro de banco');
      lembreteRepository.findById.mockRejectedValue(mockError);

      // Act & Assert
      await expect(LembreteService.delete(id))
        .rejects
        .toThrow('Erro de banco');
      
      expect(lembreteRepository.delete).not.toHaveBeenCalled();
    });

    it('deve propagar erro do repository no delete', async () => {
      // Arrange
      const id = 1;
      const mockLembreteExistente = { id_lembrete: 1, horario: '08:00' };
      const mockError = new Error('Erro ao deletar');
      
      lembreteRepository.findById.mockResolvedValue(mockLembreteExistente);
      lembreteRepository.delete.mockRejectedValue(mockError);

      // Act & Assert
      await expect(LembreteService.delete(id))
        .rejects
        .toThrow('Erro ao deletar');
      
      expect(lembreteRepository.findById).toHaveBeenCalledWith(id);
      expect(lembreteRepository.delete).toHaveBeenCalledWith(id);
    });

    it('deve retornar null quando repository retorna null no delete', async () => {
      // Arrange
      const id = 1;
      const mockLembreteExistente = { id_lembrete: 1, horario: '08:00' };
      
      lembreteRepository.findById.mockResolvedValue(mockLembreteExistente);
      lembreteRepository.delete.mockResolvedValue(null);

      // Act
      const result = await LembreteService.delete(id);

      // Assert
      expect(result).toBeNull();
      expect(lembreteRepository.delete).toHaveBeenCalledWith(id);
    });
  });

  // Testes de integração entre métodos
  describe('integração entre métodos', () => {
    it('deve usar getById para validar existência antes de update e delete', async () => {
      // Arrange
      const id = 1;
      const mockLembrete = { id_lembrete: 1, horario: '08:00' };
      const updateData = { horario: '09:00' };
      
      lembreteRepository.findById.mockResolvedValue(mockLembrete);
      lembreteRepository.update.mockResolvedValue({ ...mockLembrete, ...updateData });
      lembreteRepository.delete.mockResolvedValue(mockLembrete);

      // Act
      await LembreteService.update(id, updateData);
      await LembreteService.delete(id);

      // Assert
      expect(lembreteRepository.findById).toHaveBeenCalledTimes(2);
      expect(lembreteRepository.findById).toHaveBeenNthCalledWith(1, id);
      expect(lembreteRepository.findById).toHaveBeenNthCalledWith(2, id);
    });
  });

  // Testes de instância singleton
  describe('instância do service', () => {
    it('deve exportar uma instância singleton', () => {
      // Arrange & Act
      const instance1 = require('../../services/lembreteService');
      const instance2 = require('../../services/lembreteService');

      // Assert
      expect(instance1).toBe(instance2);
      expect(instance1).toBeInstanceOf(LembreteService.constructor);
    });
  });
});