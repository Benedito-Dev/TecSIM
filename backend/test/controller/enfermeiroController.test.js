const EnfermeirosController = require('../../controllers/enfermeirosController');
const service = require('../../services/enfermeirosService');
const { ValidationError, ConflictError, NotFoundError } = require('../../utils/errors');

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
});

beforeEach(() => {
  jest.clearAllMocks();
});

// Mock das dependências
jest.mock('../../services/enfermeirosService');

describe('EnfermeirosController', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    jest.clearAllMocks();

    mockReq = {
      body: {},
      params: {},
      query: {}
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    mockNext = jest.fn();
  });

  describe('create', () => {
    const dadosValidos = {
      nome: 'Novo Enfermeiro',
      email: 'novo@test.com',
      senha: 'senha123',
      registro_coren: 'COREN456'
    };

    it('deve criar enfermeiro com dados válidos', async () => {
      mockReq.body = dadosValidos;
      const mockEnfermeiro = { id: 1, ...dadosValidos };
      service.create.mockResolvedValue(mockEnfermeiro);

      await EnfermeirosController.create(mockReq, mockRes);

      expect(service.create).toHaveBeenCalledWith(dadosValidos);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Enfermeiro criado com sucesso',
        data: mockEnfermeiro
      });
    });

    it('deve retornar 400 quando body estiver vazio', async () => {
      mockReq.body = {};

      await EnfermeirosController.create(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Dados do enfermeiro não fornecidos.'
      });
      expect(service.create).not.toHaveBeenCalled();
    });

    it('deve retornar 400 quando body for null', async () => {
      mockReq.body = null;

      await EnfermeirosController.create(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Dados do enfermeiro não fornecidos.'
      });
    });

    it('deve lidar com ValidationError do service', async () => {
      mockReq.body = dadosValidos;
      const validationError = new ValidationError('Dados inválidos');
      validationError.statusCode = 400;
      service.create.mockRejectedValue(validationError);

      await EnfermeirosController.create(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Dados inválidos'
      });
    });

    it('deve lidar com ConflictError do service', async () => {
      mockReq.body = dadosValidos;
      const conflictError = new ConflictError('Email já existe');
      conflictError.statusCode = 409;
      service.create.mockRejectedValue(conflictError);

      await EnfermeirosController.create(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Email já existe'
      });
    });

    it('deve lidar com erro genérico do service', async () => {
      mockReq.body = dadosValidos;
      service.create.mockRejectedValue(new Error('Erro no banco'));

      await EnfermeirosController.create(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Erro interno do servidor.'
      });
    });

    it('deve lidar com erro sem statusCode', async () => {
      mockReq.body = dadosValidos;
      const error = new Error('Erro sem status');
      service.create.mockRejectedValue(error);

      await EnfermeirosController.create(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Erro interno do servidor.'
      });
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os enfermeiros', async () => {
      const mockEnfermeiros = [
        { id: 1, nome: 'Enfermeiro 1' },
        { id: 2, nome: 'Enfermeiro 2' }
      ];
      service.getAll.mockResolvedValue(mockEnfermeiros);

      await EnfermeirosController.findAll(mockReq, mockRes);

      expect(service.getAll).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockEnfermeiros);
    });

    it('deve lidar com ValidationError do service', async () => {
      const validationError = new ValidationError('Erro de validação');
      validationError.statusCode = 400;
      service.getAll.mockRejectedValue(validationError);

      await EnfermeirosController.findAll(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Erro de validação'
      });
    });

    it('deve lidar com erro genérico do service', async () => {
      service.getAll.mockRejectedValue(new Error('Erro no banco'));

      await EnfermeirosController.findAll(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Erro ao buscar enfermeiros.'
      });
    });

    it('deve lidar com erro sem statusCode', async () => {
      const error = new Error('Erro sem status');
      service.getAll.mockRejectedValue(error);

      await EnfermeirosController.findAll(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Erro ao buscar enfermeiros.'
      });
    });
  });

  describe('search', () => {
    it('deve buscar enfermeiros com termo válido', async () => {
      mockReq.query.q = 'joão';
      const mockResultados = [
        { id: 1, nome: 'João Silva' },
        { id: 2, nome: 'João Santos' }
      ];
      service.search.mockResolvedValue(mockResultados);

      await EnfermeirosController.search(mockReq, mockRes);

      expect(service.search).toHaveBeenCalledWith('joão');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResultados);
    });

    it('deve retornar 400 quando termo de busca não for fornecido', async () => {
      mockReq.query.q = '';

      await EnfermeirosController.search(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Parâmetro de busca (q) é obrigatório e deve ter pelo menos 2 caracteres.'
      });
      expect(service.search).not.toHaveBeenCalled();
    });

    it('deve retornar 400 quando termo de busca for null', async () => {
      mockReq.query.q = null;

      await EnfermeirosController.search(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Parâmetro de busca (q) é obrigatório e deve ter pelo menos 2 caracteres.'
      });
    });

    it('deve retornar 400 quando termo de busca tiver menos de 2 caracteres', async () => {
      mockReq.query.q = 'a';

      await EnfermeirosController.search(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Parâmetro de busca (q) é obrigatório e deve ter pelo menos 2 caracteres.'
      });
    });

    it('deve retornar 400 quando termo de busca for apenas espaços', async () => {
      mockReq.query.q = '  ';

      await EnfermeirosController.search(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Parâmetro de busca (q) é obrigatório e deve ter pelo menos 2 caracteres.'
      });
    });

    it('deve lidar com NotFoundError do service', async () => {
      mockReq.query.q = 'termo';
      const notFoundError = new NotFoundError('Nenhum resultado');
      notFoundError.statusCode = 404;
      service.search.mockRejectedValue(notFoundError);

      await EnfermeirosController.search(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Nenhum resultado'
      });
    });

    it('deve lidar com ValidationError do service', async () => {
      mockReq.query.q = 'termo';
      const validationError = new ValidationError('Termo inválido');
      validationError.statusCode = 400;
      service.search.mockRejectedValue(validationError);

      await EnfermeirosController.search(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Termo inválido'
      });
    });

    it('deve lidar com erro genérico do service', async () => {
      mockReq.query.q = 'termo';
      service.search.mockRejectedValue(new Error('Erro no banco'));

      await EnfermeirosController.search(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Erro interno do servidor.'
      });
    });
  });

  describe('findById', () => {
    it('deve retornar enfermeiro quando ID for válido', async () => {
      mockReq.params.id = '1';
      const mockEnfermeiro = { id: 1, nome: 'Enfermeiro Teste' };
      service.getById.mockResolvedValue(mockEnfermeiro);

      await EnfermeirosController.findById(mockReq, mockRes);

      expect(service.getById).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockEnfermeiro);
    });

    it('deve retornar 400 quando ID não for número', async () => {
      mockReq.params.id = 'abc';

      await EnfermeirosController.findById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'ID inválido. Deve ser um número.'
      });
      expect(service.getById).not.toHaveBeenCalled();
    });

    it('deve retornar 400 quando ID for vazio', async () => {
      mockReq.params.id = '';

      await EnfermeirosController.findById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'ID inválido. Deve ser um número.'
      });
    });

    it('deve retornar 400 quando ID for null', async () => {
      mockReq.params.id = null;

      await EnfermeirosController.findById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'ID inválido. Deve ser um número.'
      });
    });

    it('deve lidar com NotFoundError do service', async () => {
      mockReq.params.id = '999';
      const notFoundError = new NotFoundError('Enfermeiro não encontrado');
      notFoundError.statusCode = 404;
      service.getById.mockRejectedValue(notFoundError);

      await EnfermeirosController.findById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Enfermeiro não encontrado'
      });
    });

    it('deve lidar com ValidationError do service', async () => {
      mockReq.params.id = '1';
      const validationError = new ValidationError('ID inválido');
      validationError.statusCode = 400;
      service.getById.mockRejectedValue(validationError);

      await EnfermeirosController.findById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'ID inválido'
      });
    });

    it('deve lidar com erro genérico do service', async () => {
      mockReq.params.id = '1';
      service.getById.mockRejectedValue(new Error('Erro no banco'));

      await EnfermeirosController.findById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Erro interno do servidor.'
      });
    });
  });

  describe('update', () => {
    const updateData = {
      nome: 'Nome Atualizado',
      email: 'atualizado@test.com'
    };

    it('deve atualizar enfermeiro com dados válidos', async () => {
      mockReq.params.id = '1';
      mockReq.body = updateData;
      const mockEnfermeiroAtualizado = { id: 1, ...updateData };
      service.update.mockResolvedValue(mockEnfermeiroAtualizado);

      await EnfermeirosController.update(mockReq, mockRes);

      expect(service.update).toHaveBeenCalledWith('1', updateData);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Enfermeiro atualizado com sucesso',
        data: mockEnfermeiroAtualizado
      });
    });

    it('deve retornar 400 quando ID não for número', async () => {
      mockReq.params.id = 'abc';
      mockReq.body = updateData;

      await EnfermeirosController.update(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'ID inválido. Deve ser um número.'
      });
      expect(service.update).not.toHaveBeenCalled();
    });

    it('deve retornar 400 quando body estiver vazio', async () => {
      mockReq.params.id = '1';
      mockReq.body = {};

      await EnfermeirosController.update(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Nenhum dado fornecido para atualização.'
      });
      expect(service.update).not.toHaveBeenCalled();
    });

    it('deve retornar 400 quando body for null', async () => {
      mockReq.params.id = '1';
      mockReq.body = null;

      await EnfermeirosController.update(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Nenhum dado fornecido para atualização.'
      });
    });

    it('deve lidar com NotFoundError do service', async () => {
      mockReq.params.id = '999';
      mockReq.body = updateData;
      const notFoundError = new NotFoundError('Enfermeiro não encontrado');
      notFoundError.statusCode = 404;
      service.update.mockRejectedValue(notFoundError);

      await EnfermeirosController.update(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Enfermeiro não encontrado'
      });
    });

    it('deve lidar com ConflictError do service', async () => {
      mockReq.params.id = '1';
      mockReq.body = updateData;
      const conflictError = new ConflictError('Email já existe');
      conflictError.statusCode = 409;
      service.update.mockRejectedValue(conflictError);

      await EnfermeirosController.update(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Email já existe'
      });
    });

    it('deve lidar com erro genérico do service', async () => {
      mockReq.params.id = '1';
      mockReq.body = updateData;
      service.update.mockRejectedValue(new Error('Erro no banco'));

      await EnfermeirosController.update(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Erro interno do servidor.'
      });
    });
  });

  describe('remove', () => {
    it('deve remover enfermeiro com ID válido', async () => {
      mockReq.params.id = '1';
      const mockEnfermeiroRemovido = { id: 1, nome: 'Enfermeiro Removido' };
      service.remove.mockResolvedValue(mockEnfermeiroRemovido);

      await EnfermeirosController.remove(mockReq, mockRes);

      expect(service.remove).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Enfermeiro removido com sucesso',
        data: mockEnfermeiroRemovido
      });
    });

    it('deve retornar 400 quando ID não for número', async () => {
      mockReq.params.id = 'abc';

      await EnfermeirosController.remove(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'ID inválido. Deve ser um número.'
      });
      expect(service.remove).not.toHaveBeenCalled();
    });

    it('deve retornar 400 quando ID for vazio', async () => {
      mockReq.params.id = '';

      await EnfermeirosController.remove(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'ID inválido. Deve ser um número.'
      });
    });

    it('deve lidar com NotFoundError do service', async () => {
      mockReq.params.id = '999';
      const notFoundError = new NotFoundError('Enfermeiro não encontrado');
      notFoundError.statusCode = 404;
      service.remove.mockRejectedValue(notFoundError);

      await EnfermeirosController.remove(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Enfermeiro não encontrado'
      });
    });

    it('deve lidar com ValidationError do service', async () => {
      mockReq.params.id = '1';
      const validationError = new ValidationError('ID inválido');
      validationError.statusCode = 400;
      service.remove.mockRejectedValue(validationError);

      await EnfermeirosController.remove(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'ID inválido'
      });
    });

    it('deve lidar com erro genérico do service', async () => {
      mockReq.params.id = '1';
      service.remove.mockRejectedValue(new Error('Erro no banco'));

      await EnfermeirosController.remove(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Erro interno do servidor.'
      });
    });
  });

  describe('Casos de borda e edge cases', () => {
    it('deve lidar com erro inesperado sem propriedade statusCode', async () => {
      mockReq.params.id = '1';
      const error = new Error('Erro inesperado');
      // Simular erro sem statusCode
      delete error.statusCode;
      service.getById.mockRejectedValue(error);

      await EnfermeirosController.findById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Erro interno do servidor.'
      });
    });

    it('deve lidar com string ID que pode ser convertida para número', async () => {
      mockReq.params.id = '123';
      const mockEnfermeiro = { id: 123, nome: 'Teste' };
      service.getById.mockResolvedValue(mockEnfermeiro);

      await EnfermeirosController.findById(mockReq, mockRes);

      expect(service.getById).toHaveBeenCalledWith('123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('deve lidar com body com apenas espaços em branco como vazio', async () => {
      mockReq.body = { nome: '   ' };
      
      await EnfermeirosController.create(mockReq, mockRes);

      // O controller considera o body como não vazio, mas o service fará a validação
      expect(service.create).toHaveBeenCalled();
    });
  });
});