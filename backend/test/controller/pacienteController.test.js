const PacienteController = require('../../controllers/pacientesController');
const PacienteService = require('../../services/pacientesService');
const { ValidationError, NotFoundError, ConflictError } = require('../../utils/errors');
const Paciente = require('../../models/pacienteModel');
const fs = require('fs');
const path = require('path');

// Mock ROBUSTO do bcrypt para evitar problemas nativos
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn().mockResolvedValue(true),
  genSalt: jest.fn().mockResolvedValue('salt')
}));

// Mock das dependências
jest.mock('../../services/pacientesService');
jest.mock('fs');
jest.mock('path');

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

describe('PacienteController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {},
      file: null
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    // Mock do environment
    process.env.SHOW_PASS_SECRET = 'test-secret';
  });

  // =============================================
  // TESTES DO GETALL
  // =============================================
  describe('getAll', () => {
    it('deve retornar todos os pacientes com sucesso', async () => {
      const pacientes = [
        new Paciente({ id: 1, nome: 'Paciente 1' }),
        new Paciente({ id: 2, nome: 'Paciente 2' })
      ];
      PacienteService.getAll.mockResolvedValue(pacientes);

      await PacienteController.getAll(req, res);

      expect(PacienteService.getAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(pacientes);
    });

    it('deve tratar erro customizado do service', async () => {
      const notFoundError = new NotFoundError('Nenhum paciente encontrado');
      PacienteService.getAll.mockRejectedValue(notFoundError);

      await PacienteController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Nenhum paciente encontrado' });
    });

    it('deve tratar erro de conexão com banco', async () => {
      const dbError = new Error('Connection refused');
      dbError.code = 'ECONNREFUSED';
      PacienteService.getAll.mockRejectedValue(dbError);

      await PacienteController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(503);
      expect(res.json).toHaveBeenCalledWith({ 
        error: 'Serviço de banco de dados indisponível.' 
      });
    });

    it('deve tratar erro genérico do service', async () => {
      PacienteService.getAll.mockRejectedValue(new Error('Generic error'));

      await PacienteController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        error: 'Erro interno ao buscar pacientes.' 
      });
    });
  });

  // =============================================
  // TESTES DO GET BY ID
  // =============================================
  describe('getById', () => {
    it('deve retornar paciente por ID com senha criptografada', async () => {
      const mockPaciente = {
        id: 1,
        nome: 'Paciente Teste',
        senha: 'senha_original',
        toJSONWithEncryptedSenha: jest.fn().mockReturnValue({
          id: 1,
          nome: 'Paciente Teste',
          senha: 'senha_criptografada'
        })
      };
      PacienteService.getById.mockResolvedValue(mockPaciente);

      await PacienteController.getById(req, res);

      expect(PacienteService.getById).toHaveBeenCalledWith(undefined);
      expect(mockPaciente.toJSONWithEncryptedSenha).toHaveBeenCalledWith('test-secret');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        nome: 'Paciente Teste',
        senha: 'senha_criptografada'
      });
    });

    it('deve usar fallback secret quando environment não estiver definido', async () => {
      delete process.env.SHOW_PASS_SECRET;
      const mockPaciente = {
        toJSONWithEncryptedSenha: jest.fn().mockReturnValue({})
      };
      PacienteService.getById.mockResolvedValue(mockPaciente);

      await PacienteController.getById(req, res);

      expect(mockPaciente.toJSONWithEncryptedSenha).toHaveBeenCalledWith('fallback-secret');
    });

    it('deve retornar 404 quando paciente não for encontrado', async () => {
      PacienteService.getById.mockResolvedValue(null);

      await PacienteController.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Paciente não encontrado.' });
    });

    it('deve tratar erro customizado do service', async () => {
      const validationError = new ValidationError('ID inválido');
      PacienteService.getById.mockRejectedValue(validationError);

      await PacienteController.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'ID inválido' });
    });

    it('deve tratar erro genérico do service', async () => {
      PacienteService.getById.mockRejectedValue(new Error('Service error'));

      await PacienteController.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro interno ao buscar paciente.' });
    });
  });

  // =============================================
  // TESTES DO GET BY EMAIL
  // =============================================
  describe('getByEmail', () => {
    it('deve retornar paciente por email válido', async () => {
      req.params.email = 'paciente@test.com';
      const paciente = new Paciente({ id: 1, email: 'paciente@test.com' });
      PacienteService.getByEmail.mockResolvedValue(paciente);

      await PacienteController.getByEmail(req, res);

      expect(PacienteService.getByEmail).toHaveBeenCalledWith('paciente@test.com');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(paciente);
    });

    it('deve retornar 400 quando email for inválido (sem @)', async () => {
      req.params.email = 'emailinvalido';

      await PacienteController.getByEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Email inválido.' });
      expect(PacienteService.getByEmail).not.toHaveBeenCalled();
    });

    it('deve retornar 400 quando email for vazio', async () => {
      req.params.email = '';

      await PacienteController.getByEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Email inválido.' });
    });

    it('deve retornar 404 quando paciente não for encontrado', async () => {
      req.params.email = 'inexistente@test.com';
      PacienteService.getByEmail.mockResolvedValue(null);

      await PacienteController.getByEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Paciente não encontrado.' });
    });

    it('deve tratar ValidationError do service', async () => {
        req.params.email = 'teste@test.com';
        const validationError = new ValidationError('Email inválido');
        validationError.name = 'ValidationError';
        PacienteService.getByEmail.mockRejectedValue(validationError);

        await PacienteController.getByEmail(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        // CORRIJA para o formato real que o controller retorna:
        expect(res.json).toHaveBeenCalledWith({ 
            error: 'Email inválido'  // ← Apenas error.message
        });
    });

    it('deve tratar erro customizado do service', async () => {
      req.params.email = 'teste@test.com';
      const notFoundError = new NotFoundError('Paciente não encontrado');
      PacienteService.getByEmail.mockRejectedValue(notFoundError);

      await PacienteController.getByEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Paciente não encontrado' });
    });

    it('deve tratar erro genérico do service', async () => {
      req.params.email = 'teste@test.com';
      PacienteService.getByEmail.mockRejectedValue(new Error('Service error'));

      await PacienteController.getByEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro interno ao buscar paciente.' });
    });
  });

  // =============================================
  // TESTES DO CREATE
  // =============================================
  describe('create', () => {
    const mockPacienteData = {
      id: 1,
      nome: 'Novo Paciente',
      email: 'novo@test.com',
      cpf: '12345678900'
    };

    beforeEach(() => {
      req.body = {
        nome: 'Novo Paciente',
        email: 'novo@test.com',
        cpf: '12345678900',
        senha: '123456'
      };
    });

    it('deve criar paciente com dados válidos', async () => {
      PacienteService.create.mockResolvedValue(new Paciente(mockPacienteData));

      await PacienteController.create(req, res);

      expect(PacienteService.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Paciente criado com sucesso',
        data: expect.any(Paciente)
      });
    });

    it('deve tratar ValidationError do service', async () => {
      const validationError = new ValidationError('Dados inválidos');
      PacienteService.create.mockRejectedValue(validationError);

      await PacienteController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Dados inválidos' });
    });

    it('deve tratar ConflictError do service', async () => {
      const conflictError = new ConflictError('Email já existe');
      PacienteService.create.mockRejectedValue(conflictError);

      await PacienteController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ error: 'Email já existe' });
    });

    it('deve tratar erro de constraint unique do banco', async () => {
      const dbError = new Error('Unique constraint');
      dbError.code = '23505';
      PacienteService.create.mockRejectedValue(dbError);

      await PacienteController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ error: 'Email ou CPF já cadastrado.' });
    });

    it('deve tratar ValidationError por nome', async () => {
      const validationError = new Error('Validation error');
      validationError.name = 'ValidationError';
      PacienteService.create.mockRejectedValue(validationError);

      await PacienteController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Dados inválidos.',
        details: 'Validation error'
      });
    });

    it('deve tratar erro genérico do service', async () => {
      PacienteService.create.mockRejectedValue(new Error('Create error'));

      await PacienteController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro interno ao criar paciente.' });
    });
  });

  // =============================================
  // TESTES DO UPLOAD FOTO
  // =============================================
  describe('uploadFoto', () => {
    beforeEach(() => {
      req.params.id = '1';
      req.file = {
        filename: 'foto.jpg'
      };
    });

    it('deve fazer upload de foto com sucesso', async () => {
      const mockPaciente = {
        id: 1,
        foto_perfil: null
      };
      PacienteService.getById.mockResolvedValue(mockPaciente);
      fs.existsSync.mockReturnValue(false);
      PacienteService.atualizarFoto.mockResolvedValue();

      await PacienteController.uploadFoto(req, res);

      expect(PacienteService.getById).toHaveBeenCalledWith('1');
      expect(PacienteService.atualizarFoto).toHaveBeenCalledWith('1', '/uploads/foto.jpg');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Foto atualizada com sucesso',
        foto: '/uploads/foto.jpg'
      });
    });

    it('deve apagar foto anterior quando arquivo existe no sistema', async () => {
        const mockPaciente = {
            id: 1,
            foto_perfil: '/uploads/foto_antiga.jpg'
        };
        
        PacienteService.getById.mockResolvedValue(mockPaciente);
        fs.existsSync.mockReturnValue(true); // ← ARQUIVO EXISTE
        path.join.mockReturnValue('/full/path/to/foto_antiga.jpg');
        PacienteService.atualizarFoto.mockResolvedValue();

        await PacienteController.uploadFoto(req, res);

        expect(fs.existsSync).toHaveBeenCalledWith('/full/path/to/foto_antiga.jpg');
        expect(fs.unlinkSync).toHaveBeenCalledWith('/full/path/to/foto_antiga.jpg'); // ← Esta linha deve executar
        });

    it('não deve apagar foto anterior quando arquivo NÃO existe no sistema', async () => {
        const mockPaciente = {
            id: 1,
            foto_perfil: '/uploads/foto_antiga.jpg' // Tem foto no banco
        };
        
        PacienteService.getById.mockResolvedValue(mockPaciente);
        fs.existsSync.mockReturnValue(false); // ← ARQUIVO NÃO EXISTE no filesystem
        path.join.mockReturnValue('/full/path/to/foto_antiga.jpg');
        PacienteService.atualizarFoto.mockResolvedValue();

        await PacienteController.uploadFoto(req, res);

        expect(fs.existsSync).toHaveBeenCalledWith('/full/path/to/foto_antiga.jpg');
        expect(fs.unlinkSync).not.toHaveBeenCalled(); // ← Esta linha NÃO deve executar
    });

    it('deve retornar 400 quando ID for inválido', async () => {
      req.params.id = 'abc';

      await PacienteController.uploadFoto(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'ID inválido.' });
      expect(PacienteService.getById).not.toHaveBeenCalled();
    });

    it('deve retornar 400 quando nenhum arquivo for enviado', async () => {
      req.file = null;

      await PacienteController.uploadFoto(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Nenhum arquivo enviado.' });
    });

    it('deve retornar 404 quando paciente não for encontrado', async () => {
      PacienteService.getById.mockResolvedValue(null);

      await PacienteController.uploadFoto(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Paciente não encontrado.' });
    });

    it('deve tratar erro customizado do service', async () => {
      const validationError = new ValidationError('ID inválido');
      PacienteService.getById.mockRejectedValue(validationError);

      await PacienteController.uploadFoto(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'ID inválido' });
    });

    it('deve tratar erro genérico do service', async () => {
      PacienteService.getById.mockResolvedValue({ id: 1, foto_perfil: null });
      PacienteService.atualizarFoto.mockRejectedValue(new Error('Upload error'));

      await PacienteController.uploadFoto(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao fazer upload da imagem.' });
    });
  });

  // =============================================
  // TESTES DO UPDATE
  // =============================================
  describe('update', () => {
    const mockPacienteAtualizado = {
      id: 1,
      nome: 'Paciente Atualizado',
      email: 'atualizado@test.com'
    };

    beforeEach(() => {
      req.params.id = '1';
      req.body = {
        nome: 'Paciente Atualizado',
        email: 'atualizado@test.com',
        senha: 'should-be-removed',
        id_paciente: 'should-be-removed',
        data_cadastro: 'should-be-removed'
      };
    });

    it('deve atualizar paciente com dados válidos', async () => {
      PacienteService.update.mockResolvedValue(new Paciente(mockPacienteAtualizado));

      await PacienteController.update(req, res);

      const dadosEsperados = {
        nome: 'Paciente Atualizado',
        email: 'atualizado@test.com'
      };

      expect(PacienteService.update).toHaveBeenCalledWith('1', dadosEsperados);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Paciente atualizado com sucesso',
        data: expect.any(Paciente)
      });
    });

    it('deve retornar 400 quando ID for inválido', async () => {
      req.params.id = 'abc';

      await PacienteController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'ID inválido.' });
      expect(PacienteService.update).not.toHaveBeenCalled();
    });

    it('deve remover campos sensíveis antes do update', async () => {
      PacienteService.update.mockResolvedValue(new Paciente(mockPacienteAtualizado));

      await PacienteController.update(req, res);

      const dadosEsperados = {
        nome: 'Paciente Atualizado',
        email: 'atualizado@test.com'
      };

      expect(PacienteService.update).toHaveBeenCalledWith('1', dadosEsperados);
    });

    it('deve retornar 404 quando paciente não for encontrado', async () => {
      PacienteService.update.mockResolvedValue(null);

      await PacienteController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Paciente não encontrado para atualizar.' });
    });

    it('deve tratar erro de constraint unique do banco', async () => {
      const dbError = new Error('Unique constraint');
      dbError.code = '23505';
      PacienteService.update.mockRejectedValue(dbError);

      await PacienteController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ error: 'Email já cadastrado.' });
    });

    it('deve tratar ValidationError por nome', async () => {
      const validationError = new Error('Validation error');
      validationError.name = 'ValidationError';
      PacienteService.update.mockRejectedValue(validationError);

      await PacienteController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Dados inválidos.',
        details: 'Validation error'
      });
    });

    it('deve tratar erro customizado do service', async () => {
      const conflictError = new ConflictError('Email em uso');
      PacienteService.update.mockRejectedValue(conflictError);

      await PacienteController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ error: 'Email em uso' });
    });

    it('deve tratar erro genérico do service', async () => {
      PacienteService.update.mockRejectedValue(new Error('Update error'));

      await PacienteController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro interno ao atualizar paciente.' });
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
      PacienteService.updatePassword.mockResolvedValue({ id: 1 });

      await PacienteController.updatePassword(req, res);

      expect(PacienteService.updatePassword).toHaveBeenCalledWith('1', 'senha_antiga', 'nova_senha_123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Senha atualizada com sucesso.' });
    });

    it('deve retornar 400 quando ID for inválido', async () => {
      req.params.id = 'abc';

      await PacienteController.updatePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'ID inválido.' });
      expect(PacienteService.updatePassword).not.toHaveBeenCalled();
    });

    it('deve retornar 400 quando senha atual estiver incorreta', async () => {
      PacienteService.updatePassword.mockResolvedValue(null);

      await PacienteController.updatePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        error: 'Senha atual incorreta ou paciente não encontrado.' 
      });
    });

    it('deve tratar ValidationError do service', async () => {
      const validationError = new ValidationError('Senha inválida');
      PacienteService.updatePassword.mockRejectedValue(validationError);

      await PacienteController.updatePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Senha inválida' });
    });

    it('deve tratar ValidationError por nome', async () => {
      const validationError = new Error('Validation error');
      validationError.name = 'ValidationError';
      PacienteService.updatePassword.mockRejectedValue(validationError);

      await PacienteController.updatePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Dados inválidos.',
        details: 'Validation error'
      });
    });

    it('deve tratar erro genérico do service', async () => {
      PacienteService.updatePassword.mockRejectedValue(new Error('Password error'));

      await PacienteController.updatePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro interno ao atualizar senha.' });
    });
  });

  // =============================================
  // TESTES DO DESATIVAR
  // =============================================
  describe('desativar', () => {
    beforeEach(() => {
      req.params.id = '1';
    });

    it('deve desativar paciente com ID válido', async () => {
      const pacienteDesativado = new Paciente({ id: 1, ativo: false });
      PacienteService.desativar.mockResolvedValue(pacienteDesativado);

      await PacienteController.desativar(req, res);

      expect(PacienteService.desativar).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Paciente desativado com sucesso',
        data: pacienteDesativado
      });
    });

    it('deve retornar 400 quando ID for inválido', async () => {
      req.params.id = 'abc';

      await PacienteController.desativar(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'ID inválido.' });
      expect(PacienteService.desativar).not.toHaveBeenCalled();
    });

    it('deve retornar 404 quando paciente não for encontrado', async () => {
      PacienteService.desativar.mockResolvedValue(null);

      await PacienteController.desativar(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Paciente não encontrado.' });
    });

    it('deve tratar ValidationError do service', async () => {
      const validationError = new ValidationError('ID inválido');
      PacienteService.desativar.mockRejectedValue(validationError);

      await PacienteController.desativar(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'ID inválido' });
    });

    it('deve tratar ValidationError por nome', async () => {
      const validationError = new Error('Validation error');
      validationError.name = 'ValidationError';
      PacienteService.desativar.mockRejectedValue(validationError);

      await PacienteController.desativar(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Dados inválidos.',
        details: 'Validation error'
      });
    });

    it('deve tratar erro genérico do service', async () => {
      PacienteService.desativar.mockRejectedValue(new Error('Desativar error'));

      await PacienteController.desativar(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro interno ao desativar paciente.' });
    });
  });

  // =============================================
  // TESTES DO REMOVE
  // =============================================
  describe('remove', () => {
    beforeEach(() => {
      req.params.id = '1';
    });

    it('deve remover paciente com ID válido', async () => {
      PacienteService.remove.mockResolvedValue({ id: 1 });

      await PacienteController.remove(req, res);

      expect(PacienteService.remove).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Paciente removido com sucesso.' });
    });

    it('deve retornar 400 quando ID for inválido', async () => {
      req.params.id = 'abc';

      await PacienteController.remove(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'ID inválido.' });
      expect(PacienteService.remove).not.toHaveBeenCalled();
    });

    it('deve retornar 404 quando paciente não for encontrado', async () => {
      PacienteService.remove.mockResolvedValue(null);

      await PacienteController.remove(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Paciente não encontrado para remover.' });
    });

    it('deve tratar ValidationError do service', async () => {
      const validationError = new ValidationError('ID inválido');
      PacienteService.remove.mockRejectedValue(validationError);

      await PacienteController.remove(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'ID inválido' });
    });

    it('deve tratar ValidationError por nome', async () => {
      const validationError = new Error('Validation error');
      validationError.name = 'ValidationError';
      PacienteService.remove.mockRejectedValue(validationError);

      await PacienteController.remove(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Dados inválidos.',
        details: 'Validation error'
      });
    });

    it('deve tratar erro genérico do service', async () => {
      PacienteService.remove.mockRejectedValue(new Error('Remove error'));

      await PacienteController.remove(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro interno ao remover paciente.' });
    });
  });
});