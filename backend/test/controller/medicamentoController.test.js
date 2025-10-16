const MedicamentoController = require('../../controllers/medicamentoController');
const medicamentosService = require('../../services/medicamentosService');
const { ValidationError, NotFoundError, ConflictError } = require('../../utils/errors');

// Mock do service
jest.mock('../../services/medicamentosService');

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

describe('MedicamentoController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  // =============================================
  // TESTES DO CREATE
  // =============================================
  describe('create', () => {
    const mockMedicamentoData = {
      id: 1,
      nome: 'Paracetamol',
      tipo: 'Analgésico',
      dosagem: '500mg',
      laboratorio: 'Lab Test'
    };

    beforeEach(() => {
      req.body = {
        nome: 'Paracetamol',
        tipo: 'Analgésico',
        dosagem: '500mg',
        laboratorio: 'Lab Test'
      };
    });

    it('deve criar medicamento com sucesso', async () => {
      medicamentosService.create.mockResolvedValue(mockMedicamentoData);

      await MedicamentoController.create(req, res);

      expect(medicamentosService.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Medicamento criado com sucesso',
        data: mockMedicamentoData
      });
    });

    it('deve retornar 400 quando body estiver vazio', async () => {
      req.body = {};

      await MedicamentoController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Dados do medicamento não fornecidos.'
      });
      expect(medicamentosService.create).not.toHaveBeenCalled();
    });

    it('deve retornar 400 quando body for null', async () => {
      req.body = null;

      await MedicamentoController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Dados do medicamento não fornecidos.'
      });
    });

    it('deve tratar ValidationError do service', async () => {
      const validationError = new ValidationError('Dados inválidos');
      medicamentosService.create.mockRejectedValue(validationError);

      await MedicamentoController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Dados inválidos'
      });
    });

    it('deve tratar ConflictError do service', async () => {
      const conflictError = new ConflictError('Medicamento já existe');
      medicamentosService.create.mockRejectedValue(conflictError);

      await MedicamentoController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Medicamento já existe'
      });
    });

    it('deve tratar erro genérico do service', async () => {
      const genericError = new Error('Erro inesperado');
      medicamentosService.create.mockRejectedValue(genericError);

      await MedicamentoController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Erro interno do servidor.'
      });
    });

    it('deve tratar erro sem statusCode', async () => {
      const errorWithoutStatusCode = new Error('Erro sem status');
      delete errorWithoutStatusCode.statusCode;
      medicamentosService.create.mockRejectedValue(errorWithoutStatusCode);

      await MedicamentoController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Erro interno do servidor.'
      });
    });
  });

  // =============================================
  // TESTES DO FINDALL
  // =============================================
  describe('findAll', () => {
    it('deve retornar todos os medicamentos com sucesso', async () => {
      const medicamentos = [
        { id: 1, nome: 'Paracetamol' },
        { id: 2, nome: 'Ibuprofeno' }
      ];
      medicamentosService.findAll.mockResolvedValue(medicamentos);

      await MedicamentoController.findAll(req, res);

      expect(medicamentosService.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(medicamentos);
    });

    it('deve tratar erro customizado do service', async () => {
      const notFoundError = new NotFoundError('Nenhum medicamento encontrado');
      medicamentosService.findAll.mockRejectedValue(notFoundError);

      await MedicamentoController.findAll(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Nenhum medicamento encontrado'
      });
    });

    it('deve tratar erro genérico do service', async () => {
      medicamentosService.findAll.mockRejectedValue(new Error('DB error'));

      await MedicamentoController.findAll(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Erro ao buscar medicamentos.'
      });
    });
  });

  // =============================================
  // TESTES DO SEARCH
  // =============================================
  describe('search', () => {
    it('deve buscar medicamentos com query válida', async () => {
      req.query.q = 'paracetamol';
      const medicamentos = [
        { id: 1, nome: 'Paracetamol' }
      ];
      medicamentosService.search.mockResolvedValue(medicamentos);

      await MedicamentoController.search(req, res);

      expect(medicamentosService.search).toHaveBeenCalledWith('paracetamol');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(medicamentos);
    });

    it('deve retornar 400 quando query estiver vazia', async () => {
      req.query.q = '';

      await MedicamentoController.search(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Parâmetro de busca (q) é obrigatório e deve ter pelo menos 2 caracteres.'
      });
      expect(medicamentosService.search).not.toHaveBeenCalled();
    });

    it('deve retornar 400 quando query for null', async () => {
      req.query.q = null;

      await MedicamentoController.search(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Parâmetro de busca (q) é obrigatório e deve ter pelo menos 2 caracteres.'
      });
    });

    it('deve retornar 400 quando query tiver menos de 2 caracteres', async () => {
      req.query.q = 'a';

      await MedicamentoController.search(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Parâmetro de busca (q) é obrigatório e deve ter pelo menos 2 caracteres.'
      });
    });

    it('deve trimar espaços na query', async () => {
      req.query.q = '  paracetamol  ';
      medicamentosService.search.mockResolvedValue([]);

      await MedicamentoController.search(req, res);

      expect(medicamentosService.search).toHaveBeenCalledWith('paracetamol');
    });

    it('deve tratar erro do service', async () => {
      req.query.q = 'paracetamol';
      medicamentosService.search.mockRejectedValue(new Error('Search error'));

      await MedicamentoController.search(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Erro interno do servidor.'
      });
    });

    it('deve tratar erro customizado do service', async () => {
      req.query.q = 'paracetamol';
      const validationError = new ValidationError('Query inválida');
      medicamentosService.search.mockRejectedValue(validationError);

      await MedicamentoController.search(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Query inválida'
      });
    });
  });

  // =============================================
  // TESTES DO FIND BY ID
  // =============================================
  describe('findById', () => {
    it('deve buscar medicamento por ID válido', async () => {
      req.params.id = '1';
      const medicamento = { id: 1, nome: 'Paracetamol' };
      medicamentosService.findById.mockResolvedValue(medicamento);

      await MedicamentoController.findById(req, res);

      expect(medicamentosService.findById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(medicamento);
    });

    it('deve retornar 400 quando ID for inválido (string)', async () => {
      req.params.id = 'abc';

      await MedicamentoController.findById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'ID inválido. Deve ser um número.'
      });
      expect(medicamentosService.findById).not.toHaveBeenCalled();
    });

    it('deve retornar 400 quando ID for null', async () => {
      req.params.id = null;

      await MedicamentoController.findById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'ID inválido. Deve ser um número.'
      });
    });

    it('deve retornar 400 quando ID for undefined', async () => {
      req.params.id = undefined;

      await MedicamentoController.findById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'ID inválido. Deve ser um número.'
      });
    });

    it('deve retornar 400 quando ID for vazio', async () => {
      req.params.id = '';

      await MedicamentoController.findById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'ID inválido. Deve ser um número.'
      });
    });

    it('deve tratar NotFoundError do service', async () => {
      req.params.id = '999';
      const notFoundError = new NotFoundError('Medicamento não encontrado');
      medicamentosService.findById.mockRejectedValue(notFoundError);

      await MedicamentoController.findById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Medicamento não encontrado'
      });
    });

    it('deve tratar erro genérico do service', async () => {
      req.params.id = '1';
      medicamentosService.findById.mockRejectedValue(new Error('DB error'));

      await MedicamentoController.findById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Erro interno do servidor.'
      });
    });
  });

  // =============================================
  // TESTES DO UPDATE
  // =============================================
  describe('update', () => {
    const mockMedicamentoAtualizado = {
      id: 1,
      nome: 'Paracetamol Atualizado',
      tipo: 'Analgésico'
    };

    beforeEach(() => {
      req.params.id = '1';
      req.body = {
        nome: 'Paracetamol Atualizado',
        tipo: 'Analgésico'
      };
    });

    it('deve atualizar medicamento com dados válidos', async () => {
      medicamentosService.update.mockResolvedValue(mockMedicamentoAtualizado);

      await MedicamentoController.update(req, res);

      expect(medicamentosService.update).toHaveBeenCalledWith('1', req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Medicamento atualizado com sucesso',
        data: mockMedicamentoAtualizado
      });
    });

    it('deve retornar 400 quando ID for inválido', async () => {
      req.params.id = 'abc';

      await MedicamentoController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'ID inválido. Deve ser um número.'
      });
      expect(medicamentosService.update).not.toHaveBeenCalled();
    });

    it('deve retornar 400 quando body estiver vazio', async () => {
      req.body = {};

      await MedicamentoController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Nenhum dado fornecido para atualização.'
      });
      expect(medicamentosService.update).not.toHaveBeenCalled();
    });

    it('deve retornar 400 quando body for null', async () => {
      req.body = null;

      await MedicamentoController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Nenhum dado fornecido para atualização.'
      });
    });

    it('deve tratar NotFoundError do service', async () => {
      const notFoundError = new NotFoundError('Medicamento não encontrado');
      medicamentosService.update.mockRejectedValue(notFoundError);

      await MedicamentoController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Medicamento não encontrado'
      });
    });

    it('deve tratar ValidationError do service', async () => {
      const validationError = new ValidationError('Dados inválidos');
      medicamentosService.update.mockRejectedValue(validationError);

      await MedicamentoController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Dados inválidos'
      });
    });

    it('deve tratar erro genérico do service', async () => {
      medicamentosService.update.mockRejectedValue(new Error('Update error'));

      await MedicamentoController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Erro interno do servidor.'
      });
    });
  });

  // =============================================
  // TESTES DO REMOVE
  // =============================================
  describe('remove', () => {
    const mockMedicamentoRemovido = {
      id: 1,
      nome: 'Paracetamol'
    };

    beforeEach(() => {
      req.params.id = '1';
    });

    it('deve remover medicamento com ID válido', async () => {
      medicamentosService.remove.mockResolvedValue(mockMedicamentoRemovido);

      await MedicamentoController.remove(req, res);

      expect(medicamentosService.remove).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Medicamento removido com sucesso',
        data: mockMedicamentoRemovido
      });
    });

    it('deve retornar 400 quando ID for inválido', async () => {
      req.params.id = 'abc';

      await MedicamentoController.remove(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'ID inválido. Deve ser um número.'
      });
      expect(medicamentosService.remove).not.toHaveBeenCalled();
    });

    it('deve tratar NotFoundError do service', async () => {
      const notFoundError = new NotFoundError('Medicamento não encontrado');
      medicamentosService.remove.mockRejectedValue(notFoundError);

      await MedicamentoController.remove(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Medicamento não encontrado'
      });
    });

    it('deve tratar erro genérico do service', async () => {
      medicamentosService.remove.mockRejectedValue(new Error('Remove error'));

      await MedicamentoController.remove(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Erro interno do servidor.'
      });
    });
  });

  // =============================================
  // TESTES DE CASOS ESPECIAIS
  // =============================================
  describe('Casos Especiais', () => {
    it('deve converter ID string numérica para número no service', async () => {
      req.params.id = '123';
      medicamentosService.findById.mockResolvedValue({ id: 123 });

      await MedicamentoController.findById(req, res);

      // O service recebe a string '123', mas a validação garante que é numérica
      expect(medicamentosService.findById).toHaveBeenCalledWith('123');
    });

    it('deve aceitar ID zero como válido', async () => {
      req.params.id = '0';
      medicamentosService.findById.mockResolvedValue(null);

      await MedicamentoController.findById(req, res);

      expect(medicamentosService.findById).toHaveBeenCalledWith('0');
      // Não deve lançar erro de validação para ID 0
    });

    it('deve aceitar ID negativo como inválido', async () => {
      req.params.id = '-1';

      await MedicamentoController.findById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'ID inválido. Deve ser um número.'
      });
    });

    it('deve aceitar ID decimal como inválido', async () => {
      req.params.id = '1.5';

      await MedicamentoController.findById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'ID inválido. Deve ser um número.'
      });
    });
  });
});