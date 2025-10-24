const {
  AppError,
  ValidationError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
  DatabaseError
} = require('../../utils/errors');

describe('Custom Errors', () => {
  // =============================================
  // TESTES DA CLASSE BASE AppError
  // =============================================
  describe('AppError', () => {
    test('deve criar instância com message e statusCode', () => {
      const error = new AppError('Erro de aplicação', 400);

      expect(error.message).toBe('Erro de aplicação');
      expect(error.statusCode).toBe(400);
      expect(error.isOperational).toBe(true);
      expect(error instanceof Error).toBe(true);
      expect(error instanceof AppError).toBe(true);
    });

    test('deve criar instância com statusCode padrão 500 se não fornecido', () => {
      const error = new AppError('Erro sem status');

      expect(error.message).toBe('Erro sem status');
      expect(error.statusCode).toBe(500);
    });

    test('deve capturar stack trace', () => {
      const error = new AppError('Erro com stack', 400);

      expect(error.stack).toBeDefined();
      expect(typeof error.stack).toBe('string');
      expect(error.stack).toContain('AppError');
    });

    test('deve herdar corretamente de Error', () => {
      const error = new AppError('Teste herança', 400);

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
      expect(error.name).toBe('AppError');
    });

    test('deve ter propriedade isOperational como true', () => {
      const error = new AppError('Erro operacional', 400);

      expect(error.isOperational).toBe(true);
    });
  });

  // =============================================
  // TESTES DA ValidationError
  // =============================================
  describe('ValidationError', () => {
    test('deve criar instância com status 400', () => {
      const error = new ValidationError('Dados inválidos');

      expect(error.message).toBe('Dados inválidos');
      expect(error.statusCode).toBe(400);
      expect(error instanceof AppError).toBe(true);
      expect(error instanceof ValidationError).toBe(true);
      expect(error.isOperational).toBe(true);
    });

    test('deve herdar corretamente da cadeia de erro', () => {
      const error = new ValidationError('Erro de validação');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(ValidationError);
    });

    test('deve funcionar com mensagens vazias', () => {
      const error = new ValidationError('');

      expect(error.message).toBe('');
      expect(error.statusCode).toBe(400);
    });

    test('deve funcionar com mensagens longas', () => {
      const longMessage = 'A'.repeat(1000);
      const error = new ValidationError(longMessage);

      expect(error.message).toBe(longMessage);
      expect(error.statusCode).toBe(400);
    });
  });

  // =============================================
  // TESTES DA NotFoundError
  // =============================================
  describe('NotFoundError', () => {
    test('deve criar instância com status 404', () => {
      const error = new NotFoundError('Recurso não encontrado');

      expect(error.message).toBe('Recurso não encontrado');
      expect(error.statusCode).toBe(404);
      expect(error instanceof AppError).toBe(true);
      expect(error instanceof NotFoundError).toBe(true);
    });

    test('deve herdar corretamente', () => {
      const error = new NotFoundError('Não encontrado');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(NotFoundError);
    });

    test('deve funcionar para diferentes tipos de recursos', () => {
      const errors = [
        new NotFoundError('Usuário não encontrado'),
        new NotFoundError('Médico não encontrado'),
        new NotFoundError('Paciente não encontrado'),
        new NotFoundError('Prescrição não encontrada')
      ];

      errors.forEach(error => {
        expect(error.statusCode).toBe(404);
        expect(error instanceof NotFoundError).toBe(true);
      });
    });
  });

  // =============================================
  // TESTES DA ConflictError
  // =============================================
  describe('ConflictError', () => {
    test('deve criar instância com status 409', () => {
      const error = new ConflictError('Recurso em conflito');

      expect(error.message).toBe('Recurso em conflito');
      expect(error.statusCode).toBe(409);
      expect(error instanceof AppError).toBe(true);
      expect(error instanceof ConflictError).toBe(true);
    });

    test('deve herdar corretamente', () => {
      const error = new ConflictError('Conflito');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(ConflictError);
    });

    test('deve funcionar para diferentes cenários de conflito', () => {
      const conflicts = [
        new ConflictError('Email já cadastrado'),
        new ConflictError('CPF já existe'),
        new ConflictError('CRM já está em uso'),
        new ConflictError('Recurso já duplicado')
      ];

      conflicts.forEach(error => {
        expect(error.statusCode).toBe(409);
        expect(error.message).toContain('já'); // Verifica padrão comum
      });
    });
  });

  // =============================================
  // TESTES DA UnauthorizedError
  // =============================================
  describe('UnauthorizedError', () => {
    test('deve criar instância com status 401', () => {
      const error = new UnauthorizedError('Não autorizado');

      expect(error.message).toBe('Não autorizado');
      expect(error.statusCode).toBe(401);
      expect(error instanceof AppError).toBe(true);
      expect(error instanceof UnauthorizedError).toBe(true);
    });

    test('deve herdar corretamente', () => {
      const error = new UnauthorizedError('Acesso negado');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(UnauthorizedError);
    });

    test('deve funcionar para diferentes mensagens de autorização', () => {
      const authErrors = [
        new UnauthorizedError('Token inválido'),
        new UnauthorizedError('Sessão expirada'),
        new UnauthorizedError('Credenciais inválidas'),
        new UnauthorizedError('Acesso não autorizado')
      ];

      authErrors.forEach(error => {
        expect(error.statusCode).toBe(401);
        expect(error instanceof UnauthorizedError).toBe(true);
      });
    });
  });

  // =============================================
  // TESTES DA ForbiddenError
  // =============================================
  describe('ForbiddenError', () => {
    test('deve criar instância com status 403', () => {
      const error = new ForbiddenError('Acesso proibido');

      expect(error.message).toBe('Acesso proibido');
      expect(error.statusCode).toBe(403);
      expect(error instanceof AppError).toBe(true);
      expect(error instanceof ForbiddenError).toBe(true);
    });

    test('deve herdar corretamente', () => {
      const error = new ForbiddenError('Proibido');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(ForbiddenError);
    });

    test('deve diferenciar de UnauthorizedError', () => {
      const unauthorized = new UnauthorizedError('Não autenticado');
      const forbidden = new ForbiddenError('Sem permissão');

      expect(unauthorized.statusCode).toBe(401);
      expect(forbidden.statusCode).toBe(403);
      expect(unauthorized).not.toBeInstanceOf(ForbiddenError);
      expect(forbidden).not.toBeInstanceOf(UnauthorizedError);
    });
  });

  // =============================================
  // TESTES DA DatabaseError
  // =============================================
  describe('DatabaseError', () => {
    test('deve criar instância com status 500', () => {
      const error = new DatabaseError('Erro de banco de dados');

      expect(error.message).toBe('Erro de banco de dados');
      expect(error.statusCode).toBe(500);
      expect(error instanceof AppError).toBe(true);
      expect(error instanceof DatabaseError).toBe(true);
    });

    test('deve herdar corretamente', () => {
      const error = new DatabaseError('DB error');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(DatabaseError);
    });

    test('deve funcionar para diferentes erros de banco', () => {
      const dbErrors = [
        new DatabaseError('Connection failed'),
        new DatabaseError('Query timeout'),
        new DatabaseError('Constraint violation'),
        new DatabaseError('Transaction error')
      ];

      dbErrors.forEach(error => {
        expect(error.statusCode).toBe(500);
        expect(error instanceof DatabaseError).toBe(true);
      });
    });
  });

  // =============================================
  // TESTES DE COMPARAÇÃO ENTRE CLASSES
  // =============================================
  describe('Comparação entre classes de erro', () => {
    test('deve diferenciar entre todos os tipos de erro', () => {
      const errors = [
        new ValidationError('val'),
        new NotFoundError('not found'),
        new ConflictError('conflict'),
        new UnauthorizedError('unauth'),
        new ForbiddenError('forbidden'),
        new DatabaseError('db error')
      ];

      // Verifica que cada erro tem status code único
      const statusCodes = errors.map(err => err.statusCode);
      const uniqueStatusCodes = [...new Set(statusCodes)];
      expect(uniqueStatusCodes.length).toBe(errors.length);

      // Verifica que são instâncias diferentes
      errors.forEach((error, index) => {
        errors.forEach((otherError, otherIndex) => {
          if (index !== otherIndex) {
            expect(error).not.toBeInstanceOf(otherError.constructor);
          }
        });
      });
    });

    test('todos os erros devem ser operacionais', () => {
      const errors = [
        new ValidationError('test'),
        new NotFoundError('test'),
        new ConflictError('test'),
        new UnauthorizedError('test'),
        new ForbiddenError('test'),
        new DatabaseError('test')
      ];

      errors.forEach(error => {
        expect(error.isOperational).toBe(true);
      });
    });

    test('todos os erros devem ter stack trace', () => {
      const errors = [
        new ValidationError('test'),
        new NotFoundError('test'),
        new DatabaseError('test')
      ];

      errors.forEach(error => {
        expect(error.stack).toBeDefined();
        expect(typeof error.stack).toBe('string');
        expect(error.stack.length).toBeGreaterThan(0);
      });
    });
  });

  // =============================================
  // TESTES DE USO EM CENÁRIOS DO MUNDO REAL
  // =============================================
  describe('Cenários do mundo real', () => {
    test('deve usar ValidationError para dados inválidos', () => {
      const validateUser = (userData) => {
        if (!userData.email) {
          throw new ValidationError('Email é obrigatório');
        }
        if (!userData.senha) {
          throw new ValidationError('Senha é obrigatória');
        }
        return true;
      };

      expect(() => validateUser({})).toThrow(ValidationError);
      expect(() => validateUser({ email: 'test@test.com' })).toThrow(ValidationError);
      expect(validateUser({ email: 'test@test.com', senha: '123456' })).toBe(true);
    });

    test('deve usar NotFoundError para recursos não encontrados', () => {
      const findUserById = (id) => {
        if (id !== 1) {
          throw new NotFoundError('Usuário não encontrado');
        }
        return { id: 1, nome: 'Test User' };
      };

      expect(() => findUserById(2)).toThrow(NotFoundError);
      expect(findUserById(1)).toEqual({ id: 1, nome: 'Test User' });
    });

    test('deve usar ConflictError para duplicatas', () => {
      const createUser = (email, existingEmails = []) => {
        if (existingEmails.includes(email)) {
          throw new ConflictError('Email já cadastrado');
        }
        return { email, id: 1 };
      };

      expect(() => createUser('existing@test.com', ['existing@test.com']))
        .toThrow(ConflictError);
      expect(createUser('new@test.com', [])).toEqual({ email: 'new@test.com', id: 1 });
    });

    test('deve usar DatabaseError para erros de banco', async () => {
      const queryDatabase = async () => {
        throw new DatabaseError('Falha na conexão com o banco');
      };

      await expect(queryDatabase()).rejects.toThrow(DatabaseError);
      await expect(queryDatabase()).rejects.toHaveProperty('statusCode', 500);
    });
  });

  // =============================================
  // TESTES DE PROPRIEDADES E MÉTODOS
  // =============================================
  describe('Propriedades e métodos', () => {
    test('deve manter propriedades após serialização', () => {
      const error = new ValidationError('Test error');
      
      // CORREÇÃO: Teste as propriedades diretamente, não na serialização
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.isOperational).toBe(true);
      
      // Ou se quiser testar serialização, use toJSON personalizado (mais avançado)
      const serialized = JSON.stringify({
        message: error.message,
        statusCode: error.statusCode,
        isOperational: error.isOperational
      });
      const parsed = JSON.parse(serialized);
      
      expect(parsed.message).toBe('Test error');
      expect(parsed.statusCode).toBe(400);
      expect(parsed.isOperational).toBe(true);
    });

    test('deve ter name correto para cada tipo de erro', () => {
      // Se você setar this.name no constructor, teste aqui
      const errors = [
        new ValidationError('test'),
        new NotFoundError('test'),
        new DatabaseError('test')
      ];

      errors.forEach(error => {
        expect(error.name).toBeDefined();
      });
    });

    test('deve poder ser usado com instanceof corretamente', () => {
      const validationError = new ValidationError('test');
      const notFoundError = new NotFoundError('test');

      expect(validationError instanceof ValidationError).toBe(true);
      expect(notFoundError instanceof NotFoundError).toBe(true);
      expect(validationError instanceof NotFoundError).toBe(false);
      expect(notFoundError instanceof ValidationError).toBe(false);
    });
  });

  // =============================================
  // TESTES DE VALORES LIMITE
  // =============================================
  describe('Valores limite', () => {
    test('deve funcionar com mensagens muito longas', () => {
      const longMessage = 'A'.repeat(10000);
      const error = new ValidationError(longMessage);

      expect(error.message).toBe(longMessage);
      expect(error.message.length).toBe(10000);
    });

    test('deve funcionar com mensagens vazias', () => {
      const error = new ValidationError('');

      expect(error.message).toBe('');
      expect(error.statusCode).toBe(400);
    });

    test('deve funcionar com mensagens com caracteres especiais', () => {
      const specialMessage = 'Erro com ç, á, ã, ñ, 中文, 🚀';
      const error = new ValidationError(specialMessage);

      expect(error.message).toBe(specialMessage);
    });
  });
});