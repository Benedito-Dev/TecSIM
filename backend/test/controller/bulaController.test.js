// test/bulaController.test.js
const bulaController = require('../../controllers/bulaController');
const bulaService = require('../../services/bulaServices');
const { ValidationError, NotFoundError, ConflictError } = require('../../utils/errors');

jest.mock('../../services/bulaServices');

// Mock do console para evitar logs nos testes
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('BulaController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {},
      body: {},
      query: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
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

  describe('create', () => {
    it('deve criar bula com sucesso e retornar 201', async () => {
      req.body = mockBulaData;
      bulaService.create.mockResolvedValue(mockBulaData);

      await bulaController.create(req, res);

      expect(bulaService.create).toHaveBeenCalledWith(mockBulaData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Bula criada com sucesso',
        data: mockBulaData
      });
    });

    it('deve retornar 400 quando corpo da requisição estiver vazio', async () => {
      req.body = {};

      await bulaController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'O corpo da requisição não pode estar vazio.'
      });
      expect(bulaService.create).not.toHaveBeenCalled();
    });

    it('deve retornar 400 para ValidationError do service', async () => {
      req.body = mockBulaData;
      const validationError = new ValidationError('Dados inválidos');
      bulaService.create.mockRejectedValue(validationError);

      await bulaController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Dados inválidos'
      });
    });

    it('deve retornar 409 para ConflictError do service', async () => {
      req.body = mockBulaData;
      const conflictError = new ConflictError('Bula já existe');
      bulaService.create.mockRejectedValue(conflictError);

      await bulaController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Bula já existe'
      });
    });

    it('deve retornar 500 para erro genérico do service', async () => {
      req.body = mockBulaData;
      bulaService.create.mockRejectedValue(new Error('Erro interno'));

      await bulaController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Erro interno do servidor.'
      });
    });

    it('deve retornar 400 para ValidationError com nome específico', async () => {
      req.body = mockBulaData;
      const validationError = new Error('Validation error');
      validationError.name = 'ValidationError';
      bulaService.create.mockRejectedValue(validationError);

      await bulaController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Dados inválidos: Validation error'
      });
    });

    it('deve retornar 409 para ConflictError com nome específico', async () => {
      req.body = mockBulaData;
      const conflictError = new Error('Conflito');
      conflictError.name = 'ConflictError';
      bulaService.create.mockRejectedValue(conflictError);

      await bulaController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Conflito'
      });
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de bulas com sucesso', async () => {
      const bulasList = [mockBulaData, { ...mockBulaData, id: 2 }];
      bulaService.findAll.mockResolvedValue(bulasList);

      await bulaController.findAll(req, res);

      expect(bulaService.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(bulasList);
    });

    it('deve retornar erro do service com status code específico', async () => {
      const notFoundError = new NotFoundError('Nenhuma bula encontrada');
      bulaService.findAll.mockRejectedValue(notFoundError);

      await bulaController.findAll(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Nenhuma bula encontrada'
      });
    });

    it('deve retornar 500 para erro genérico', async () => {
      bulaService.findAll.mockRejectedValue(new Error('Erro interno'));

      await bulaController.findAll(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Erro interno do servidor.'
      });
    });
  });

  describe('findById', () => {
    it('deve retornar bula por ID com sucesso', async () => {
      req.params.id = '1';
      bulaService.findById.mockResolvedValue(mockBulaData);

      await bulaController.findById(req, res);

      expect(bulaService.findById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockBulaData);
    });

    it('deve retornar 400 para ID inválido (não numérico)', async () => {
      req.params.id = 'abc';

      await bulaController.findById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'ID inválido. Informe um número válido.'
      });
      expect(bulaService.findById).not.toHaveBeenCalled();
    });

    it('deve retornar erro do service com status code específico', async () => {
      req.params.id = '1';
      const notFoundError = new NotFoundError('Bula não encontrada');
      bulaService.findById.mockRejectedValue(notFoundError);

      await bulaController.findById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Bula não encontrada'
      });
    });

    it('deve retornar 500 para erro genérico', async () => {
      req.params.id = '1';
      bulaService.findById.mockRejectedValue(new Error('Erro interno'));

      await bulaController.findById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Erro interno do servidor.'
      });
    });
  });

  describe('findByMedicamentoId', () => {
    it('deve retornar bula por ID do medicamento com sucesso', async () => {
      req.params.id_medicamento = '10';
      bulaService.findByMedicamentoId.mockResolvedValue(mockBulaData);

      await bulaController.findByMedicamentoId(req, res);

      expect(bulaService.findByMedicamentoId).toHaveBeenCalledWith(10);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockBulaData);
    });

    it('deve retornar 400 para ID do medicamento inválido', async () => {
      req.params.id_medicamento = 'abc';

      await bulaController.findByMedicamentoId(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'ID do medicamento inválido. Informe um número válido.'
      });
      expect(bulaService.findByMedicamentoId).not.toHaveBeenCalled();
    });

    it('deve retornar erro do service com status code específico', async () => {
      req.params.id_medicamento = '10';
      const notFoundError = new NotFoundError('Bula não encontrada para este medicamento');
      bulaService.findByMedicamentoId.mockRejectedValue(notFoundError);

      await bulaController.findByMedicamentoId(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Bula não encontrada para este medicamento'
      });
    });

    it('deve retornar 500 para erro genérico', async () => {
      req.params.id_medicamento = '10';
      bulaService.findByMedicamentoId.mockRejectedValue(new Error('Erro interno'));

      await bulaController.findByMedicamentoId(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Erro interno do servidor.'
      });
    });
  });

  describe('update', () => {
    it('deve atualizar bula com sucesso', async () => {
      req.params.id = '1';
      req.body = { dosagem_e_administracao: '3x ao dia' };
      bulaService.update.mockResolvedValue(mockBulaData);

      await bulaController.update(req, res);

      expect(bulaService.update).toHaveBeenCalledWith(1, req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Bula atualizada com sucesso',
        data: mockBulaData
      });
    });

    it('deve retornar 400 para ID inválido', async () => {
      req.params.id = 'abc';
      req.body = { dosagem_e_administracao: '3x ao dia' };

      await bulaController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'ID inválido. Informe um número válido.'
      });
    });

    it('deve retornar 400 quando corpo da requisição estiver vazio', async () => {
      req.params.id = '1';
      req.body = {};

      await bulaController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Nenhum dado fornecido para atualização.'
      });
    });

    it('deve retornar 400 para ValidationError do service', async () => {
      req.params.id = '1';
      req.body = { dosagem_e_administracao: '3x ao dia' };
      const validationError = new ValidationError('Dados inválidos');
      bulaService.update.mockRejectedValue(validationError);

      await bulaController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Dados inválidos'
      });
    });

    it('deve retornar 400 para ValidationError com nome específico', async () => {
      req.params.id = '1';
      req.body = { dosagem_e_administracao: '3x ao dia' };
      const validationError = new Error('Validation error');
      validationError.name = 'ValidationError';
      bulaService.update.mockRejectedValue(validationError);

      await bulaController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Dados inválidos: Validation error'
      });
    });

    it('deve retornar 500 para erro genérico', async () => {
      req.params.id = '1';
      req.body = { dosagem_e_administracao: '3x ao dia' };
      bulaService.update.mockRejectedValue(new Error('Erro interno'));

      await bulaController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Erro interno do servidor.'
      });
    });
  });

  describe('remove', () => {
    it('deve remover bula com sucesso', async () => {
      req.params.id = '1';
      bulaService.remove.mockResolvedValue(mockBulaData);

      await bulaController.remove(req, res);

      expect(bulaService.remove).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Bula removida com sucesso',
        data: mockBulaData
      });
    });

    it('deve retornar 400 para ID inválido', async () => {
      req.params.id = 'abc';

      await bulaController.remove(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'ID inválido. Informe um número válido.'
      });
      expect(bulaService.remove).not.toHaveBeenCalled();
    });

    it('deve retornar erro do service com status code específico', async () => {
      req.params.id = '1';
      const notFoundError = new NotFoundError('Bula não encontrada');
      bulaService.remove.mockRejectedValue(notFoundError);

      await bulaController.remove(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Bula não encontrada'
      });
    });

    it('deve retornar 500 para erro genérico', async () => {
      req.params.id = '1';
      bulaService.remove.mockRejectedValue(new Error('Erro interno'));

      await bulaController.remove(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Erro interno do servidor.'
      });
    });
  });
});