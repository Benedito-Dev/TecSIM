const Enfermeiro = require('../../models/enfermeiroModel');
const crypto = require('crypto');

// Mock do crypto
jest.mock('crypto');

describe('Enfermeiro Model', () => {
  let enfermeiroData;
  
  beforeEach(() => {
    enfermeiroData = {
      id: 1,
      nome: 'João Silva',
      email: 'joao.silva@hospital.com',
      senha: 'senha123',
      telefone: '(11) 99999-9999',
      registro_coren: 'COREN-SP 123.456',
      cargo: 'Enfermeiro Chefe',
      unidade: 'UTI',
      turno: 'Noturno',
      data_admissao: '2020-01-15',
      especialidade: 'UTI Adulto',
      anos_experiencia: 8,
      status: 'Ativo',
      foto_perfil: '/fotos/joao.jpg',
      data_atualizacao: '2023-10-01',
      data_cadastro: '2020-01-15',
      ativo: true
    };

    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    it('deve criar uma instância de Enfermeiro com todos os dados', () => {
      const enfermeiro = new Enfermeiro(enfermeiroData);

      expect(enfermeiro.id).toBe(1);
      expect(enfermeiro.nome).toBe('João Silva');
      expect(enfermeiro.email).toBe('joao.silva@hospital.com');
      expect(enfermeiro.senha).toBe('senha123');
      expect(enfermeiro.telefone).toBe('(11) 99999-9999');
      expect(enfermeiro.registro_coren).toBe('COREN-SP 123.456');
      expect(enfermeiro.cargo).toBe('Enfermeiro Chefe');
      expect(enfermeiro.unidade).toBe('UTI');
      expect(enfermeiro.turno).toBe('Noturno');
      expect(enfermeiro.data_admissao).toBe('2020-01-15');
      expect(enfermeiro.especialidade).toBe('UTI Adulto');
      expect(enfermeiro.anos_experiencia).toBe(8);
      expect(enfermeiro.status).toBe('Ativo');
      expect(enfermeiro.foto_perfil).toBe('/fotos/joao.jpg');
      expect(enfermeiro.data_atualizacao).toBe('2023-10-01');
      expect(enfermeiro.data_cadastro).toBe('2020-01-15');
      expect(enfermeiro.ativo).toBe(true);
    });

    it('deve criar uma instância de Enfermeiro com dados mínimos', () => {
      const dadosMinimos = {
        id: 2,
        nome: 'Maria Santos',
        email: 'maria@hospital.com'
      };

      const enfermeiro = new Enfermeiro(dadosMinimos);

      expect(enfermeiro.id).toBe(2);
      expect(enfermeiro.nome).toBe('Maria Santos');
      expect(enfermeiro.email).toBe('maria@hospital.com');
      expect(enfermeiro.senha).toBeUndefined();
      expect(enfermeiro.telefone).toBeUndefined();
      expect(enfermeiro.registro_coren).toBeUndefined();
      expect(enfermeiro.cargo).toBeUndefined();
      expect(enfermeiro.unidade).toBeUndefined();
      expect(enfermeiro.turno).toBeUndefined();
      expect(enfermeiro.data_admissao).toBeUndefined();
      expect(enfermeiro.especialidade).toBeUndefined();
      expect(enfermeiro.anos_experiencia).toBeUndefined();
      expect(enfermeiro.status).toBeUndefined();
      expect(enfermeiro.foto_perfil).toBeUndefined();
      expect(enfermeiro.data_atualizacao).toBeUndefined();
      expect(enfermeiro.data_cadastro).toBeUndefined();
      expect(enfermeiro.ativo).toBeUndefined();
    });

    it('deve criar uma instância de Enfermeiro com dados parciais', () => {
      const dadosParciais = {
        id: 3,
        nome: 'Carlos Oliveira',
        email: 'carlos@hospital.com',
        cargo: 'Enfermeiro',
        unidade: 'Emergência',
        ativo: false
      };

      const enfermeiro = new Enfermeiro(dadosParciais);

      expect(enfermeiro.id).toBe(3);
      expect(enfermeiro.nome).toBe('Carlos Oliveira');
      expect(enfermeiro.email).toBe('carlos@hospital.com');
      expect(enfermeiro.cargo).toBe('Enfermeiro');
      expect(enfermeiro.unidade).toBe('Emergência');
      expect(enfermeiro.ativo).toBe(false);
      // Campos não fornecidos devem ser undefined
      expect(enfermeiro.senha).toBeUndefined();
      expect(enfermeiro.telefone).toBeUndefined();
      expect(enfermeiro.registro_coren).toBeUndefined();
    });
  });

  describe('toJSON', () => {
    it('deve retornar objeto JSON sem a senha', () => {
      const enfermeiro = new Enfermeiro(enfermeiroData);
      
      const result = enfermeiro.toJSON();

      expect(result).toEqual({
        id: 1,
        nome: 'João Silva',
        email: 'joao.silva@hospital.com',
        telefone: '(11) 99999-9999',
        registro_coren: 'COREN-SP 123.456',
        cargo: 'Enfermeiro Chefe',
        unidade: 'UTI',
        turno: 'Noturno',
        data_admissao: '2020-01-15',
        especialidade: 'UTI Adulto',
        anos_experiencia: 8,
        status: 'Ativo',
        foto_perfil: '/fotos/joao.jpg',
        data_atualizacao: '2023-10-01',
        data_cadastro: '2020-01-15',
        ativo: true
      });

      // Verificar que a senha não está presente
      expect(result.senha).toBeUndefined();
    });

    it('deve retornar objeto JSON com campos undefined quando não existirem', () => {
      const dadosMinimos = {
        id: 4,
        nome: 'Ana Costa',
        email: 'ana@hospital.com'
      };
      
      const enfermeiro = new Enfermeiro(dadosMinimos);
      const result = enfermeiro.toJSON();

      expect(result.id).toBe(4);
      expect(result.nome).toBe('Ana Costa');
      expect(result.email).toBe('ana@hospital.com');
      expect(result.telefone).toBeUndefined();
      expect(result.registro_coren).toBeUndefined();
      expect(result.cargo).toBeUndefined();
      expect(result.unidade).toBeUndefined();
      expect(result.turno).toBeUndefined();
      expect(result.data_admissao).toBeUndefined();
      expect(result.especialidade).toBeUndefined();
      expect(result.anos_experiencia).toBeUndefined();
      expect(result.status).toBeUndefined();
      expect(result.foto_perfil).toBeUndefined();
      expect(result.data_atualizacao).toBeUndefined();
      expect(result.data_cadastro).toBeUndefined();
      expect(result.ativo).toBeUndefined();
    });
  });

  describe('toAuthJSON', () => {
    it('deve retornar objeto JSON para autenticação com campos específicos', () => {
      const enfermeiro = new Enfermeiro(enfermeiroData);
      
      const result = enfermeiro.toAuthJSON();

      expect(result).toEqual({
        id: 1,
        nome: 'João Silva',
        email: 'joao.silva@hospital.com',
        foto_perfil: '/fotos/joao.jpg',
        cargo: 'Enfermeiro Chefe',
        unidade: 'UTI'
      });

      // Verificar que apenas os campos específicos estão presentes
      expect(Object.keys(result)).toEqual(['id', 'nome', 'email', 'foto_perfil', 'cargo', 'unidade']);
      expect(result.senha).toBeUndefined();
      expect(result.telefone).toBeUndefined();
      expect(result.registro_coren).toBeUndefined();
    });

    it('deve retornar campos como undefined quando não existirem', () => {
      const dadosSemFotoCargoUnidade = {
        id: 5,
        nome: 'Pedro Alves',
        email: 'pedro@hospital.com'
      };
      
      const enfermeiro = new Enfermeiro(dadosSemFotoCargoUnidade);
      const result = enfermeiro.toAuthJSON();

      expect(result).toEqual({
        id: 5,
        nome: 'Pedro Alves',
        email: 'pedro@hospital.com',
        foto_perfil: undefined,
        cargo: undefined,
        unidade: undefined
      });
    });
  });

  describe('toJSONWithEncryptedSenha', () => {
    let mockCreateHmac, mockUpdate, mockDigest;

    beforeEach(() => {
      mockDigest = jest.fn();
      mockUpdate = jest.fn().mockReturnValue({ digest: mockDigest });
      mockCreateHmac = jest.fn().mockReturnValue({ update: mockUpdate });
      
      crypto.createHmac = mockCreateHmac;
    });

    it('deve retornar objeto JSON com senha criptografada usando secret fornecido', () => {
      const enfermeiro = new Enfermeiro(enfermeiroData);
      mockDigest.mockReturnValue('senha_criptografada_123');
      
      const result = enfermeiro.toJSONWithEncryptedSenha('meu-secret');

      expect(crypto.createHmac).toHaveBeenCalledWith('sha256', 'meu-secret');
      expect(mockUpdate).toHaveBeenCalledWith('senha123');
      expect(mockDigest).toHaveBeenCalledWith('hex');

      expect(result).toEqual({
        id: 1,
        nome: 'João Silva',
        email: 'joao.silva@hospital.com',
        telefone: '(11) 99999-9999',
        registro_coren: 'COREN-SP 123.456',
        cargo: 'Enfermeiro Chefe',
        unidade: 'UTI',
        turno: 'Noturno',
        data_admissao: '2020-01-15',
        especialidade: 'UTI Adulto',
        anos_experiencia: 8,
        status: 'Ativo',
        foto_perfil: '/fotos/joao.jpg',
        data_atualizacao: '2023-10-01',
        data_cadastro: '2020-01-15',
        ativo: true,
        senha: 'senha_criptografada_123'
      });
    });

    it('deve retornar objeto JSON com senha criptografada usando secret do environment', () => {
      // Salvar o environment original
      const originalEnv = process.env.SHOW_PASS_SECRET;
      process.env.SHOW_PASS_SECRET = 'env-secret';
      
      const enfermeiro = new Enfermeiro(enfermeiroData);
      mockDigest.mockReturnValue('senha_env_criptografada');
      
      const result = enfermeiro.toJSONWithEncryptedSenha();

      expect(crypto.createHmac).toHaveBeenCalledWith('sha256', 'env-secret');
      expect(mockUpdate).toHaveBeenCalledWith('senha123');
      expect(result.senha).toBe('senha_env_criptografada');

      // Restaurar o environment
      process.env.SHOW_PASS_SECRET = originalEnv;
    });

    it('deve retornar objeto JSON com senha criptografada usando fallback secret', () => {
      // Garantir que não há secret no environment
      const originalEnv = process.env.SHOW_PASS_SECRET;
      delete process.env.SHOW_PASS_SECRET;
      
      const enfermeiro = new Enfermeiro(enfermeiroData);
      mockDigest.mockReturnValue('senha_fallback_criptografada');
      
      const result = enfermeiro.toJSONWithEncryptedSenha();

      expect(crypto.createHmac).toHaveBeenCalledWith('sha256', 'fallback-secret');
      expect(mockUpdate).toHaveBeenCalledWith('senha123');
      expect(result.senha).toBe('senha_fallback_criptografada');

      // Restaurar o environment
      if (originalEnv) {
        process.env.SHOW_PASS_SECRET = originalEnv;
      }
    });

    it('deve converter senha para string antes de criptografar', () => {
      const enfermeiroComSenhaNumber = new Enfermeiro({
        ...enfermeiroData,
        senha: 123456 // Senha como número
      });
      
      mockDigest.mockReturnValue('senha_number_criptografada');
      
      enfermeiroComSenhaNumber.toJSONWithEncryptedSenha('test-secret');

      expect(mockUpdate).toHaveBeenCalledWith('123456'); // Deve ser convertido para string
    });

    it('deve retornar senha como null quando não houver senha', () => {
      const enfermeiroSemSenha = new Enfermeiro({
        id: 6,
        nome: 'Sem Senha',
        email: 'sem@senha.com'
      });
      
      const result = enfermeiroSemSenha.toJSONWithEncryptedSenha('test-secret');

      expect(crypto.createHmac).not.toHaveBeenCalled();
      expect(result.senha).toBeNull();
    });

    it('deve retornar senha como null quando senha for string vazia', () => {
      const enfermeiroComSenhaVazia = new Enfermeiro({
        ...enfermeiroData,
        senha: ''
      });
      
      const result = enfermeiroComSenhaVazia.toJSONWithEncryptedSenha('test-secret');

      expect(crypto.createHmac).not.toHaveBeenCalled();
      expect(result.senha).toBeNull();
    });

    it('deve incluir todos os campos do toJSON mais a senha criptografada', () => {
      const enfermeiro = new Enfermeiro(enfermeiroData);
      mockDigest.mockReturnValue('hash_senha');
      
      const result = enfermeiro.toJSONWithEncryptedSenha('secret');

      // Verificar se tem todos os campos do toJSON
      expect(result.id).toBe(1);
      expect(result.nome).toBe('João Silva');
      expect(result.email).toBe('joao.silva@hospital.com');
      expect(result.telefone).toBe('(11) 99999-9999');
      // ... outros campos

      // E mais a senha criptografada
      expect(result.senha).toBe('hash_senha');
    });
  });

  describe('Integração entre métodos', () => {
    it('toJSONWithEncryptedSenha deve incluir todos os campos de toJSON', () => {
      const enfermeiro = new Enfermeiro(enfermeiroData);
      crypto.createHmac.mockReturnValue({
        update: jest.fn().mockReturnValue({
          digest: jest.fn().mockReturnValue('hash_senha')
        })
      });

      const jsonResult = enfermeiro.toJSON();
      const encryptedResult = enfermeiro.toJSONWithEncryptedSenha('secret');

      // Remover a senha do resultado encrypted para comparar com jsonResult
      const { senha, ...encryptedWithoutSenha } = encryptedResult;

      expect(encryptedWithoutSenha).toEqual(jsonResult);
      expect(senha).toBe('hash_senha');
    });

    it('toAuthJSON deve retornar um subconjunto de campos', () => {
      const enfermeiro = new Enfermeiro(enfermeiroData);
      
      const authJson = enfermeiro.toAuthJSON();
      const fullJson = enfermeiro.toJSON();

      // Verificar que toAuthJSON retorna apenas campos específicos
      expect(authJson.id).toBe(fullJson.id);
      expect(authJson.nome).toBe(fullJson.nome);
      expect(authJson.email).toBe(fullJson.email);
      expect(authJson.foto_perfil).toBe(fullJson.foto_perfil);
      expect(authJson.cargo).toBe(fullJson.cargo);
      expect(authJson.unidade).toBe(fullJson.unidade);

      // Verificar que não tem campos extras
      expect(Object.keys(authJson)).toHaveLength(6);
    });
  });
});