const LembreteService = require('../../services/lembreteService');
const lembreteRepository = require('../../repository/lembreteRepository');

jest.mock('../../repository/lembreteRepository');

describe('LembreteService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockLembrete = { id_lembrete: 1, horario: '08:00' };
  const mockLembreteData = {
    id_paciente: 1,
    id_prescricao: 1,
    id_medicamento: 1,
    horario: '08:00',
    data_inicio: '2024-01-01',
    data_fim: '2024-12-31',
    canal_envio: 'email'
  };

  // Testes compactos para métodos básicos
  const basicMethods = [
    {
      method: 'getAll',
      repoMethod: 'findAll',
      repoResponse: [mockLembrete, { id_lembrete: 2, horario: '12:00' }],
      args: []
    },
    {
      method: 'getById',
      repoMethod: 'findById', 
      repoResponse: mockLembrete,
      args: [1],
      errorTest: { repoResponse: null, expectedError: 'Lembrete não encontrado' }
    }
  ];

  basicMethods.forEach(({ method, repoMethod, repoResponse, args, errorTest }) => {
    describe(method, () => {
      it(`deve retornar dados do repository`, async () => {
        lembreteRepository[repoMethod].mockResolvedValue(repoResponse);
        const result = await LembreteService[method](...args);
        expect(lembreteRepository[repoMethod]).toHaveBeenCalledWith(...args);
        expect(result).toEqual(repoResponse);
      });

      it('deve propagar erros do repository', async () => {
        const mockError = new Error('Erro de banco');
        lembreteRepository[repoMethod].mockRejectedValue(mockError);
        await expect(LembreteService[method](...args)).rejects.toThrow('Erro de banco');
      });

      if (errorTest) {
        it('deve lançar erro quando não encontra registro', async () => {
          lembreteRepository[repoMethod].mockResolvedValue(errorTest.repoResponse);
          await expect(LembreteService[method](...args)).rejects.toThrow(errorTest.expectedError);
        });
      }
    });
  });

  // Teste específico para create
  describe('create', () => {
    it('deve criar lembrete e retornar resultado', async () => {
      const mockCriado = { id_lembrete: 1, ...mockLembreteData };
      lembreteRepository.create.mockResolvedValue(mockCriado);

      const result = await LembreteService.create(mockLembreteData);

      expect(lembreteRepository.create).toHaveBeenCalledWith(mockLembreteData);
      expect(result).toEqual(mockCriado);
    });

    it('deve propagar erros do repository', async () => {
      const mockError = new Error('Erro de validação');
      lembreteRepository.create.mockRejectedValue(mockError);
      
      await expect(LembreteService.create(mockLembreteData)).rejects.toThrow('Erro de validação');
    });
  });

  // Testes para métodos que validam existência (update e delete)
  const validationMethods = [
    {
      method: 'update',
      repoMethod: 'update',
      args: [1, { horario: '09:00' }],
      repoResponse: { id_lembrete: 1, horario: '09:00' }
    },
    {
      method: 'delete', 
      repoMethod: 'delete',
      args: [1],
      repoResponse: mockLembrete
    }
  ];

  validationMethods.forEach(({ method, repoMethod, args, repoResponse }) => {
    describe(method, () => {
      it(`deve executar ${method} quando lembrete existe`, async () => {
        lembreteRepository.findById.mockResolvedValue(mockLembrete);
        lembreteRepository[repoMethod].mockResolvedValue(repoResponse);

        const result = await LembreteService[method](...args);

        expect(lembreteRepository.findById).toHaveBeenCalledWith(args[0]);
        expect(lembreteRepository[repoMethod]).toHaveBeenCalledWith(...args);
        expect(result).toEqual(repoResponse);
      });

      it('deve lançar erro quando lembrete não existe', async () => {
        lembreteRepository.findById.mockResolvedValue(null);

        await expect(LembreteService[method](...args)).rejects.toThrow('Lembrete não encontrado');
        expect(lembreteRepository[repoMethod]).not.toHaveBeenCalled();
      });

      it('deve propagar erro do findById', async () => {
        const mockError = new Error('Erro de banco');
        lembreteRepository.findById.mockRejectedValue(mockError);

        await expect(LembreteService[method](...args)).rejects.toThrow('Erro de banco');
        expect(lembreteRepository[repoMethod]).not.toHaveBeenCalled();
      });

      it('deve propagar erro do repository method', async () => {
        lembreteRepository.findById.mockResolvedValue(mockLembrete);
        const mockError = new Error(`Erro no ${repoMethod}`);
        lembreteRepository[repoMethod].mockRejectedValue(mockError);

        await expect(LembreteService[method](...args)).rejects.toThrow(`Erro no ${repoMethod}`);
      });
    });
  });

  // Teste adicional para delete com null response
  describe('delete', () => {
    it('deve retornar null quando repository retorna null', async () => {
      lembreteRepository.findById.mockResolvedValue(mockLembrete);
      lembreteRepository.delete.mockResolvedValue(null);

      const result = await LembreteService.delete(1);

      expect(result).toBeNull();
    });
  });

  // Teste de integração compacto
  describe('integração', () => {
    it('deve validar existência antes de update e delete', async () => {
      lembreteRepository.findById.mockResolvedValue(mockLembrete);
      lembreteRepository.update.mockResolvedValue(mockLembrete);
      lembreteRepository.delete.mockResolvedValue(mockLembrete);

      await LembreteService.update(1, {});
      await LembreteService.delete(1);

      expect(lembreteRepository.findById).toHaveBeenCalledTimes(2);
      expect(lembreteRepository.findById).toHaveBeenNthCalledWith(1, 1);
      expect(lembreteRepository.findById).toHaveBeenNthCalledWith(2, 1);
    });
  });

  // Teste singleton
  it('deve ser uma instância singleton', () => {
    const instance1 = require('../../services/lembreteService');
    const instance2 = require('../../services/lembreteService');
    expect(instance1).toBe(instance2);
  });
});