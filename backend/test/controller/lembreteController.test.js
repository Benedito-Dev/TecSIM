const LembreteController = require('../../controllers/lembreteController');
const lembreteService = require('../../services/lembreteService');

// Mock do service
jest.mock('../../services/lembreteService');

describe('LembreteController', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    
    req = {
      params: {},
      body: {}
    };
    
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
  });

  describe('getAll', () => {
    it('deve retornar lista de lembretes com status 200', async () => {
      // Arrange
      const mockLembretes = [{ id: 1 }, { id: 2 }];
      lembreteService.getAll.mockResolvedValue(mockLembretes);

      // Act
      await LembreteController.getAll(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith(mockLembretes);
    });

    it('deve retornar erro 500 em caso de falha', async () => {
      // Arrange
      const mockError = new Error('Erro interno');
      lembreteService.getAll.mockRejectedValue(mockError);

      // Act
      await LembreteController.getAll(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro interno' });
    });
  });

  describe('getById', () => {
    it('deve retornar lembrete quando encontrado', async () => {
      // Arrange
      req.params.id = 1;
      const mockLembrete = { id: 1, horario: '08:00' };
      lembreteService.getById.mockResolvedValue(mockLembrete);

      // Act
      await LembreteController.getById(req, res);

      // Assert
      expect(lembreteService.getById).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith(mockLembrete);
    });

    it('deve retornar 404 quando lembrete não existe', async () => {
      // Arrange
      req.params.id = 999;
      const mockError = new Error('Lembrete não encontrado');
      lembreteService.getById.mockRejectedValue(mockError);

      // Act
      await LembreteController.getById(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Lembrete não encontrado' });
    });
  });

  describe('create', () => {
    it('deve criar lembrete e retornar 201', async () => {
      // Arrange
      const lembreteData = { horario: '08:00', canal_envio: 'email' };
      req.body = lembreteData;
      const mockLembreteCriado = { id: 1, ...lembreteData };
      lembreteService.create.mockResolvedValue(mockLembreteCriado);

      // Act
      await LembreteController.create(req, res);

      // Assert
      expect(lembreteService.create).toHaveBeenCalledWith(lembreteData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockLembreteCriado);
    });

    it('deve retornar 400 em caso de dados inválidos', async () => {
      // Arrange
      req.body = { dados: 'invalidos' };
      const mockError = new Error('Dados inválidos');
      lembreteService.create.mockRejectedValue(mockError);

      // Act
      await LembreteController.create(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Dados inválidos' });
    });
  });

  describe('update', () => {
    it('deve atualizar lembrete com sucesso', async () => {
      // Arrange
      req.params.id = 1;
      req.body = { horario: '09:00' };
      const mockLembreteAtualizado = { id: 1, horario: '09:00' };
      lembreteService.update.mockResolvedValue(mockLembreteAtualizado);

      // Act
      await LembreteController.update(req, res);

      // Assert
      expect(lembreteService.update).toHaveBeenCalledWith(1, req.body);
      expect(res.json).toHaveBeenCalledWith(mockLembreteAtualizado);
    });

    it('deve retornar 400 em caso de erro na atualização', async () => {
      // Arrange
      req.params.id = 1;
      req.body = { horario: 'invalid' };
      const mockError = new Error('Erro na atualização');
      lembreteService.update.mockRejectedValue(mockError);

      // Act
      await LembreteController.update(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro na atualização' });
    });
  });

  describe('delete', () => {
    it('deve deletar lembrete e retornar 204', async () => {
      // Arrange
      req.params.id = 1;
      lembreteService.delete.mockResolvedValue();

      // Act
      await LembreteController.delete(req, res);

      // Assert
      expect(lembreteService.delete).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('deve retornar 404 quando lembrete não existe para deletar', async () => {
      // Arrange
      req.params.id = 999;
      const mockError = new Error('Lembrete não encontrado');
      lembreteService.delete.mockRejectedValue(mockError);

      // Act
      await LembreteController.delete(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Lembrete não encontrado' });
    });
  });
});