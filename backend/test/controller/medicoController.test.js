const MedicoController = require('../../controllers/medicoController');
const MedicoService = require('../../services/medicoService');
const { ValidationError, NotFoundError, ConflictError } = require('../../utils/errors');

// Mock do service
jest.mock('../../services/medicoService');

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

describe('MedicoController', () => {
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
  // TESTES DO GETALL
  // =============================================
  describe('getAll', () => {
    it('deve retornar todos os médicos com sucesso', async () => {
      const medicos = [
        { id: 1, nome: 'Dr. João' },
        { id: 2, nome: 'Dr. Maria' }
      ];
      MedicoService.getAll.mockResolvedValue(medicos);

      await MedicoController.getAll(req, res);

      expect(MedicoService.getAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(medicos);
    });

    it('deve tratar erro interno do service', async () => {
      MedicoService.getAll.mockRejectedValue(new Error('DB error'));

      await MedicoController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Erro interno ao buscar médicos.' 
      });
    });
  });

  // =============================================
  // TESTES DO GET BY ID
  // =============================================
  describe('getById', () => {
    it('deve retornar médico por ID válido', async () => {
      req.params.id = '1';
      const medico = { id: 1, nome: 'Dr. João' };
      MedicoService.getById.mockResolvedValue(medico);

      await MedicoController.getById(req, res);

      expect(MedicoService.getById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(medico);
    });

    it('deve retornar 400 quando ID for inválido (string)', async () => {
      req.params.id = 'abc';

      await MedicoController.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'ID inválido.' 
      });
      expect(MedicoService.getById).not.toHaveBeenCalled();
    });

    it('deve retornar 400 quando ID for null', async () => {
      req.params.id = null;

      await MedicoController.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'ID inválido.' 
      });
    });

    it('deve retornar 400 quando ID for undefined', async () => {
      req.params.id = undefined;

      await MedicoController.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'ID inválido.' 
      });
    });

    it('deve retornar 404 quando médico não for encontrado', async () => {
      req.params.id = '999';
      MedicoService.getById.mockResolvedValue(null);

      await MedicoController.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Médico não encontrado.' 
      });
    });

    it('deve tratar erro interno do service', async () => {
      req.params.id = '1';
      MedicoService.getById.mockRejectedValue(new Error('Service error'));

      await MedicoController.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Erro interno ao buscar médico.' 
      });
    });
  });

  // =============================================
  // TESTES DO GET BY EMAIL
  // =============================================
  describe('getByEmail', () => {
    it('deve retornar médico por email válido', async () => {
      req.params.email = 'joao@medico.com';
      const medico = { id: 1, nome: 'Dr. João', email: 'joao@medico.com' };
      MedicoService.getByEmail.mockResolvedValue(medico);

      await MedicoController.getByEmail(req, res);

      expect(MedicoService.getByEmail).toHaveBeenCalledWith('joao@medico.com');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(medico);
    });

    it('deve retornar 400 quando email for inválido (sem @)', async () => {
      req.params.email = 'emailinvalido';

      await MedicoController.getByEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'E-mail inválido.' 
      });
      expect(MedicoService.getByEmail).not.toHaveBeenCalled();
    });

    it('deve retornar 400 quando email for vazio', async () => {
      req.params.email = '';

      await MedicoController.getByEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'E-mail inválido.' 
      });
    });

    it('deve retornar 400 quando email for null', async () => {
      req.params.email = null;

      await MedicoController.getByEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'E-mail inválido.' 
      });
    });

    it('deve retornar 404 quando médico não for encontrado', async () => {
      req.params.email = 'inexistente@medico.com';
      MedicoService.getByEmail.mockResolvedValue(null);

      await MedicoController.getByEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Médico não encontrado.' 
      });
    });

    it('deve tratar erro interno do service', async () => {
      req.params.email = 'teste@medico.com';
      MedicoService.getByEmail.mockRejectedValue(new Error('Service error'));

      await MedicoController.getByEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Erro interno ao buscar médico.' 
      });
    });
  });

  // =============================================
  // TESTES DO GET BY CRM
  // =============================================
  describe('getByCrm', () => {
    it('deve retornar médico por CRM válido', async () => {
      req.params.crm = 'CRM/SP 123456';
      const medico = { id: 1, nome: 'Dr. João', crm: 'CRM/SP 123456' };
      MedicoService.getByCrm.mockResolvedValue(medico);

      await MedicoController.getByCrm(req, res);

      expect(MedicoService.getByCrm).toHaveBeenCalledWith('CRM/SP 123456');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(medico);
    });

    it('deve retornar 400 quando CRM for vazio', async () => {
      req.params.crm = '';

      await MedicoController.getByCrm(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'CRM é obrigatório.' 
      });
      expect(MedicoService.getByCrm).not.toHaveBeenCalled();
    });

    it('deve retornar 400 quando CRM for null', async () => {
      req.params.crm = null;

      await MedicoController.getByCrm(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'CRM é obrigatório.' 
      });
    });

    it('deve retornar 404 quando médico não for encontrado', async () => {
      req.params.crm = 'CRM/INVALIDO';
      MedicoService.getByCrm.mockResolvedValue(null);

      await MedicoController.getByCrm(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Médico não encontrado.' 
      });
    });

    it('deve tratar erro interno do service', async () => {
      req.params.crm = 'CRM/SP 123456';
      MedicoService.getByCrm.mockRejectedValue(new Error('Service error'));

      await MedicoController.getByCrm(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Erro interno ao buscar médico.' 
      });
    });
  });

  // =============================================
  // TESTES DO CREATE
  // =============================================
  describe('create', () => {
    const mockMedicoData = {
      id: 1,
      nome: 'Dr. João Silva',
      email: 'joao.silva@medico.com',
      crm: 'CRM/SP 123456',
      especialidade: 'Cardiologia',
      senha: 'hashed_password'
    };

    beforeEach(() => {
      req.body = {
        nome: 'Dr. João Silva',
        email: 'joao.silva@medico.com',
        crm: 'CRM/SP 123456',
        especialidade: 'Cardiologia',
        senha: '123456'
      };
    });

    it('deve criar médico com dados válidos', async () => {
      MedicoService.create.mockResolvedValue(mockMedicoData);

      await MedicoController.create(req, res);

      expect(MedicoService.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Médico criado com sucesso.',
        data: mockMedicoData
      });
    });

    it('deve retornar 400 quando campos obrigatórios estiverem faltando', async () => {
      req.body = { nome: 'Dr. Teste' }; // Campos faltando

      await MedicoController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Todos os campos são obrigatórios.' 
      });
      expect(MedicoService.create).not.toHaveBeenCalled();
    });

    it('deve tratar ValidationError do service', async () => {
      const validationError = new ValidationError('Dados inválidos');
      validationError.statusCode = 400;
      MedicoService.create.mockRejectedValue(validationError);

      await MedicoController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        error: 'Dados inválidos' 
      });
    });

    it('deve tratar ConflictError do service', async () => {
      const conflictError = new ConflictError('CRM já existe');
      conflictError.statusCode = 409;
      MedicoService.create.mockRejectedValue(conflictError);

      await MedicoController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ 
        error: 'CRM já existe' 
      });
    });

    it('deve tratar erro de CRM duplicado por mensagem', async () => {
      const error = new Error('CRM já cadastrado');
      MedicoService.create.mockRejectedValue(error);

      await MedicoController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'CRM já cadastrado.' 
      });
    });

    it('deve tratar erro de email duplicado por mensagem', async () => {
      const error = new Error('Email já cadastrado');
      MedicoService.create.mockRejectedValue(error);

      await MedicoController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'E-mail já cadastrado.' 
      });
    });

    it('deve tratar erro genérico do service', async () => {
      const error = new Error('Erro inesperado');
      MedicoService.create.mockRejectedValue(error);

      await MedicoController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Erro interno ao criar médico.' 
      });
    });

    it('deve tratar erro sem statusCode', async () => {
      const error = new Error('Erro sem status');
      delete error.statusCode;
      MedicoService.create.mockRejectedValue(error);

      await MedicoController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Erro interno ao criar médico.' 
      });
    });
  });

  // =============================================
  // TESTES DO UPDATE
  // =============================================
  describe('update', () => {
    const mockMedicoAtualizado = {
      id: 1,
      nome: 'Dr. João Atualizado',
      email: 'joao.atualizado@medico.com',
      crm: 'CRM/SP 123456',
      especialidade: 'Cardiologia'
    };

    beforeEach(() => {
      req.params.id = '1';
      req.body = {
        nome: 'Dr. João Atualizado',
        email: 'joao.atualizado@medico.com',
        especialidade: 'Cardiologia'
      };
    });

    it('deve atualizar médico com dados válidos', async () => {
      MedicoService.update.mockResolvedValue(mockMedicoAtualizado);

      await MedicoController.update(req, res);

      const dadosEsperados = { ...req.body };
      delete dadosEsperados.senha;
      delete dadosEsperados.id_medico;
      delete dadosEsperados.data_cadastro;

      expect(MedicoService.update).toHaveBeenCalledWith('1', dadosEsperados);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Médico atualizado com sucesso.',
        data: mockMedicoAtualizado
      });
    });

    it('deve retornar 400 quando ID for inválido', async () => {
      req.params.id = 'abc';

      await MedicoController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'ID inválido.' 
      });
      expect(MedicoService.update).not.toHaveBeenCalled();
    });

    it('deve remover campos sensíveis antes do update', async () => {
      req.body.senha = 'should-be-removed';
      req.body.id_medico = 'should-be-removed';
      req.body.data_cadastro = 'should-be-removed';
      
      MedicoService.update.mockResolvedValue(mockMedicoAtualizado);

      await MedicoController.update(req, res);

      const dadosEsperados = {
        nome: 'Dr. João Atualizado',
        email: 'joao.atualizado@medico.com',
        especialidade: 'Cardiologia'
      };

      expect(MedicoService.update).toHaveBeenCalledWith('1', dadosEsperados);
    });

    it('deve retornar 404 quando médico não for encontrado', async () => {
      MedicoService.update.mockResolvedValue(null);

      await MedicoController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Médico não encontrado para atualização.' 
      });
    });

    it('deve tratar ValidationError do service', async () => {
      const validationError = new ValidationError('Dados inválidos');
      validationError.statusCode = 400;
      MedicoService.update.mockRejectedValue(validationError);

      await MedicoController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        error: 'Dados inválidos' 
      });
    });

    it('deve tratar erro genérico do service', async () => {
      MedicoService.update.mockRejectedValue(new Error('Update error'));

      await MedicoController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Erro interno ao atualizar médico.' 
      });
    });
  });

  // =============================================
  // TESTES DO UPDATE PASSWORD
  // =============================================
  describe('updatePassword', () => {
    beforeEach(() => {
      req.params.id = '1';
      req.body = {
        senhaAtual: 'senha_antiga',
        novaSenha: 'nova_senha_123'
      };
    });

    it('deve atualizar senha com dados válidos', async () => {
      MedicoService.updatePassword.mockResolvedValue({ id: 1 });

      await MedicoController.updatePassword(req, res);

      expect(MedicoService.updatePassword).toHaveBeenCalledWith('1', 'senha_antiga', 'nova_senha_123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Senha atualizada com sucesso.' 
      });
    });

    it('deve retornar 400 quando ID for inválido', async () => {
      req.params.id = 'abc';

      await MedicoController.updatePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'ID inválido.' 
      });
      expect(MedicoService.updatePassword).not.toHaveBeenCalled();
    });

    it('deve retornar 400 quando senhas estiverem faltando', async () => {
      req.body = {};

      await MedicoController.updatePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Senha atual e nova senha são obrigatórias.' 
      });
    });

    it('deve retornar 400 quando senha atual estiver faltando', async () => {
      req.body = { novaSenha: 'nova_senha' };

      await MedicoController.updatePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Senha atual e nova senha são obrigatórias.' 
      });
    });

    it('deve retornar 400 quando nova senha estiver faltando', async () => {
      req.body = { senhaAtual: 'senha_antiga' };

      await MedicoController.updatePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Senha atual e nova senha são obrigatórias.' 
      });
    });

    it('deve retornar 400 quando senha atual estiver incorreta', async () => {
      MedicoService.updatePassword.mockResolvedValue(null);

      await MedicoController.updatePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Senha atual incorreta ou médico não encontrado.' 
      });
    });

    it('deve tratar ValidationError do service', async () => {
      const validationError = new ValidationError('Senha inválida');
      validationError.statusCode = 400;
      MedicoService.updatePassword.mockRejectedValue(validationError);

      await MedicoController.updatePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        error: 'Senha inválida' 
      });
    });

    it('deve tratar erro genérico do service', async () => {
      MedicoService.updatePassword.mockRejectedValue(new Error('Password error'));

      await MedicoController.updatePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Erro interno ao atualizar senha.' 
      });
    });
  });

  // =============================================
  // TESTES DO REMOVE
  // =============================================
  describe('remove', () => {
    beforeEach(() => {
      req.params.id = '1';
    });

    it('deve remover médico com ID válido', async () => {
      MedicoService.remove.mockResolvedValue({ id: 1 });

      await MedicoController.remove(req, res);

      expect(MedicoService.remove).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Médico removido com sucesso.' 
      });
    });

    it('deve retornar 400 quando ID for inválido', async () => {
      req.params.id = 'abc';

      await MedicoController.remove(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'ID inválido.' 
      });
      expect(MedicoService.remove).not.toHaveBeenCalled();
    });

    it('deve retornar 404 quando médico não for encontrado', async () => {
      MedicoService.remove.mockResolvedValue(null);

      await MedicoController.remove(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Médico não encontrado para remoção.' 
      });
    });

    it('deve tratar ValidationError do service', async () => {
      const validationError = new ValidationError('ID inválido');
      validationError.statusCode = 400;
      MedicoService.remove.mockRejectedValue(validationError);

      await MedicoController.remove(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        error: 'ID inválido' 
      });
    });

    it('deve tratar erro genérico do service', async () => {
      MedicoService.remove.mockRejectedValue(new Error('Remove error'));

      await MedicoController.remove(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Erro interno ao remover médico.' 
      });
    });
  });

  // =============================================
  // TESTES DE CASOS ESPECIAIS
  // =============================================
  describe('Casos Especiais', () => {
    it('deve aceitar ID zero como válido (isNaN retorna false)', async () => {
      req.params.id = '0';
      MedicoService.getById.mockResolvedValue(null);

      await MedicoController.getById(req, res);

      // ID '0' passa na validação isNaN(Number('0')) → false
      expect(MedicoService.getById).toHaveBeenCalledWith('0');
    });

    it('deve aceitar ID negativo como válido (isNaN retorna false)', async () => {
      req.params.id = '-1';
      MedicoService.getById.mockResolvedValue(null);

      await MedicoController.getById(req, res);

      // ID '-1' passa na validação isNaN(Number('-1')) → false
      expect(MedicoService.getById).toHaveBeenCalledWith('-1');
    });

    it('deve aceitar ID decimal como válido (isNaN retorna false)', async () => {
      req.params.id = '1.5';
      MedicoService.getById.mockResolvedValue(null);

      await MedicoController.getById(req, res);

      // ID '1.5' passa na validação isNaN(Number('1.5')) → false
      expect(MedicoService.getById).toHaveBeenCalledWith('1.5');
    });
  });
});