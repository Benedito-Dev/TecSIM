const Paciente = require('../../models/pacienteModel');
const crypto = require('crypto');

// Mock do crypto
jest.mock('crypto', () => ({
  createHmac: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  digest: jest.fn(() => 'senha_criptografada_mock')
}));

describe('Paciente Model', () => {
  // =============================================
  // TESTES DO CONSTRUCTOR
  // =============================================
  describe('Constructor', () => {
    test('deve criar instância com todos os campos', () => {
      const pacienteData = {
        id: 1,
        nome: 'João Silva',
        email: 'joao.silva@email.com',
        senha: 'senha123',
        data_nascimento: '1990-05-15',
        peso_kg: 70.5,
        genero: 'M',
        aceite_termos: true,
        data_cadastro: '2023-01-01T10:00:00Z',
        ativo: true,
        foto_perfil: 'foto.jpg',
        cpf: '123.456.789-00',
        alergias: ['Penicilina', 'Amendoim'],
        medicacoes: ['Aspirina', 'Omeprazol'],
        condicoes: ['Hipertensão', 'Diabetes']
      };

      const paciente = new Paciente(pacienteData);

      expect(paciente.id).toBe(1);
      expect(paciente.nome).toBe('João Silva');
      expect(paciente.email).toBe('joao.silva@email.com');
      expect(paciente.senha).toBe('senha123');
      expect(paciente.data_nascimento).toBe('1990-05-15');
      expect(paciente.peso_kg).toBe(70.5);
      expect(paciente.genero).toBe('M');
      expect(paciente.aceite_termos).toBe(true);
      expect(paciente.data_cadastro).toBe('2023-01-01T10:00:00Z');
      expect(paciente.ativo).toBe(true);
      expect(paciente.foto_perfil).toBe('foto.jpg');
      expect(paciente.cpf).toBe('123.456.789-00');
      expect(paciente.alergias).toEqual(['Penicilina', 'Amendoim']);
      expect(paciente.medicacoes).toEqual(['Aspirina', 'Omeprazol']);
      expect(paciente.condicoes).toEqual(['Hipertensão', 'Diabetes']);
    });

    test('deve usar valores padrão para arrays quando não fornecidos', () => {
      const pacienteData = {
        id: 1,
        nome: 'Maria Santos',
        email: 'maria@email.com',
        senha: 'senha123'
        // sem alergias, medicacoes, condicoes
      };

      const paciente = new Paciente(pacienteData);

      expect(paciente.alergias).toEqual([]);
      expect(paciente.medicacoes).toEqual([]);
      expect(paciente.condicoes).toEqual([]);
    });

    test('deve criar instância com campos undefined quando não fornecidos', () => {
      const pacienteData = {
        id: 1,
        nome: 'Paciente Minimal',
        email: 'minimal@email.com',
        senha: 'senha123'
      };

      const paciente = new Paciente(pacienteData);

      expect(paciente.data_nascimento).toBeUndefined();
      expect(paciente.peso_kg).toBeUndefined();
      expect(paciente.genero).toBeUndefined();
      expect(paciente.aceite_termos).toBeUndefined();
      expect(paciente.data_cadastro).toBeUndefined();
      expect(paciente.ativo).toBeUndefined();
      expect(paciente.foto_perfil).toBeUndefined();
      expect(paciente.cpf).toBeUndefined();
    });

    test('deve lidar com valores null e false', () => {
      const pacienteData = {
        id: 1,
        nome: 'Paciente Teste',
        email: 'teste@email.com',
        senha: 'senha123',
        aceite_termos: false,
        ativo: false,
        foto_perfil: null,
        cpf: null,
        alergias: null,
        medicacoes: null,
        condicoes: null
      };

      const paciente = new Paciente(pacienteData);

      expect(paciente.aceite_termos).toBe(false);
      expect(paciente.ativo).toBe(false);
      expect(paciente.foto_perfil).toBeNull();
      expect(paciente.cpf).toBeNull();
      expect(paciente.alergias).toBeNull();
      expect(paciente.medicacoes).toBeNull();
      expect(paciente.condicoes).toBeNull();
    });
  });

  // =============================================
  // TESTES DO MÉTODO toJSON
  // =============================================
  describe('toJSON', () => {
    test('deve retornar objeto sem senha', () => {
      const pacienteData = {
        id: 1,
        nome: 'João Silva',
        email: 'joao.silva@email.com',
        senha: 'senha123',
        data_nascimento: '1990-05-15',
        peso_kg: 70.5,
        genero: 'M',
        aceite_termos: true,
        data_cadastro: '2023-01-01T10:00:00Z',
        ativo: true,
        foto_perfil: 'foto.jpg',
        cpf: '123.456.789-00',
        alergias: ['Penicilina'],
        medicacoes: ['Aspirina'],
        condicoes: ['Hipertensão']
      };

      const paciente = new Paciente(pacienteData);
      const json = paciente.toJSON();

      expect(json.id).toBe(1);
      expect(json.nome).toBe('João Silva');
      expect(json.email).toBe('joao.silva@email.com');
      expect(json.data_nascimento).toBe('1990-05-15');
      expect(json.peso_kg).toBe(70.5);
      expect(json.genero).toBe('M');
      expect(json.aceite_termos).toBe(true);
      expect(json.data_cadastro).toBe('2023-01-01T10:00:00Z');
      expect(json.ativo).toBe(true);
      expect(json.foto_perfil).toBe('foto.jpg');
      expect(json.cpf).toBe('123.456.789-00');
      expect(json.alergias).toEqual(['Penicilina']);
      expect(json.medicacoes).toEqual(['Aspirina']);
      expect(json.condicoes).toEqual(['Hipertensão']);
      
      // Senha não deve estar presente
      expect(json.senha).toBeUndefined();
    });

    test('deve funcionar com instância mínima', () => {
      const pacienteData = {
        id: 1,
        nome: 'Paciente Minimal',
        email: 'minimal@email.com',
        senha: 'senha123'
      };

      const paciente = new Paciente(pacienteData);
      const json = paciente.toJSON();

      expect(json.nome).toBe('Paciente Minimal');
      expect(json.email).toBe('minimal@email.com');
      expect(json.senha).toBeUndefined();
      expect(json.alergias).toEqual([]);
      expect(json.medicacoes).toEqual([]);
      expect(json.condicoes).toEqual([]);
    });
  });

  // =============================================
  // TESTES DO MÉTODO toAuthJSON
  // =============================================
  describe('toAuthJSON', () => {
    test('deve retornar apenas dados básicos para autenticação', () => {
      const pacienteData = {
        id: 1,
        nome: 'João Silva',
        email: 'joao.silva@email.com',
        senha: 'senha123',
        data_nascimento: '1990-05-15',
        peso_kg: 70.5,
        genero: 'M',
        aceite_termos: true,
        data_cadastro: '2023-01-01T10:00:00Z',
        ativo: true,
        foto_perfil: 'foto.jpg',
        cpf: '123.456.789-00',
        alergias: ['Penicilina'],
        medicacoes: ['Aspirina'],
        condicoes: ['Hipertensão']
      };

      const paciente = new Paciente(pacienteData);
      const authJson = paciente.toAuthJSON();

      expect(authJson).toEqual({
        id: 1,
        nome: 'João Silva',
        email: 'joao.silva@email.com',
        foto_perfil: 'foto.jpg'
      });

      // Verifica que apenas os campos básicos estão presentes
      expect(Object.keys(authJson)).toHaveLength(4);
      expect(authJson.senha).toBeUndefined();
      expect(authJson.data_nascimento).toBeUndefined();
      expect(authJson.peso_kg).toBeUndefined();
      expect(authJson.cpf).toBeUndefined();
    });

    test('deve funcionar sem foto_perfil', () => {
      const pacienteData = {
        id: 1,
        nome: 'Paciente Sem Foto',
        email: 'semfoto@email.com',
        senha: 'senha123'
        // sem foto_perfil
      };

      const paciente = new Paciente(pacienteData);
      const authJson = paciente.toAuthJSON();

      expect(authJson).toEqual({
        id: 1,
        nome: 'Paciente Sem Foto',
        email: 'semfoto@email.com',
        foto_perfil: undefined
      });
    });
  });

  // =============================================
  // TESTES DO MÉTODO toJSONWithEncryptedSenha
  // =============================================
  describe('toJSONWithEncryptedSenha', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('deve retornar objeto com senha criptografada usando secret fornecido', () => {
      const pacienteData = {
        id: 1,
        nome: 'João Silva',
        email: 'joao.silva@email.com',
        senha: 'senha123',
        data_nascimento: '1990-05-15'
      };

      const paciente = new Paciente(pacienteData);
      const secret = 'meu-secret-teste';
      const result = paciente.toJSONWithEncryptedSenha(secret);

      expect(result.id).toBe(1);
      expect(result.nome).toBe('João Silva');
      expect(result.email).toBe('joao.silva@email.com');
      expect(result.data_nascimento).toBe('1990-05-15');
      
      // Verifica se a senha foi criptografada
      expect(result.senha).toBe('senha_criptografada_mock');
      
      // Verifica se o crypto foi chamado corretamente
      expect(crypto.createHmac).toHaveBeenCalledWith('sha256', secret);
      expect(crypto.update).toHaveBeenCalledWith('senha123');
      expect(crypto.digest).toHaveBeenCalledWith('hex');
    });

    test('deve usar secret do environment quando não fornecido', () => {
      // Salva o environment original
      const originalEnv = process.env.SHOW_PASS_SECRET;
      process.env.SHOW_PASS_SECRET = 'secret-do-environment';

      const pacienteData = {
        id: 1,
        nome: 'João Silva',
        email: 'joao.silva@email.com',
        senha: 'senha123'
      };

      const paciente = new Paciente(pacienteData);
      paciente.toJSONWithEncryptedSenha();

      expect(crypto.createHmac).toHaveBeenCalledWith('sha256', 'secret-do-environment');

      // Restaura o environment
      process.env.SHOW_PASS_SECRET = originalEnv;
    });

    test('deve usar fallback quando secret não fornecido e não há environment', () => {
      // Remove o environment
      const originalEnv = process.env.SHOW_PASS_SECRET;
      delete process.env.SHOW_PASS_SECRET;

      const pacienteData = {
        id: 1,
        nome: 'João Silva',
        email: 'joao.silva@email.com',
        senha: 'senha123'
      };

      const paciente = new Paciente(pacienteData);
      paciente.toJSONWithEncryptedSenha();

      expect(crypto.createHmac).toHaveBeenCalledWith('sha256', 'fallback-secret');

      // Restaura o environment
      if (originalEnv) {
        process.env.SHOW_PASS_SECRET = originalEnv;
      }
    });

    test('deve retornar senha como null quando não há senha', () => {
      const pacienteData = {
        id: 1,
        nome: 'João Silva',
        email: 'joao.silva@email.com'
        // sem senha
      };

      const paciente = new Paciente(pacienteData);
      const result = paciente.toJSONWithEncryptedSenha('secret');

      expect(result.senha).toBeNull();
      expect(crypto.createHmac).not.toHaveBeenCalled();
    });

    test('deve converter senha não-string para string antes de criptografar', () => {
      const pacienteData = {
        id: 1,
        nome: 'João Silva',
        email: 'joao.silva@email.com',
        senha: 123456 // número em vez de string
      };

      const paciente = new Paciente(pacienteData);
      paciente.toJSONWithEncryptedSenha('secret');

      expect(crypto.update).toHaveBeenCalledWith('123456'); // Deve ser string
    });
  });

  // =============================================
  // TESTES DE INTEGRAÇÃO ENTRE MÉTODOS
  // =============================================
  describe('Integração entre métodos', () => {
    test('toJSONWithEncryptedSenha deve incluir todos os campos de toJSON mais senha criptografada', () => {
      const pacienteData = {
        id: 1,
        nome: 'João Silva',
        email: 'joao.silva@email.com',
        senha: 'senha123',
        data_nascimento: '1990-05-15',
        peso_kg: 70.5,
        alergias: ['Penicilina']
      };

      const paciente = new Paciente(pacienteData);
      
      const json = paciente.toJSON();
      const jsonWithEncryptedSenha = paciente.toJSONWithEncryptedSenha('secret');

      // Deve ter todos os campos do toJSON
      expect(jsonWithEncryptedSenha.id).toBe(json.id);
      expect(jsonWithEncryptedSenha.nome).toBe(json.nome);
      expect(jsonWithEncryptedSenha.email).toBe(json.email);
      expect(jsonWithEncryptedSenha.data_nascimento).toBe(json.data_nascimento);
      expect(jsonWithEncryptedSenha.peso_kg).toBe(json.peso_kg);
      expect(jsonWithEncryptedSenha.alergias).toEqual(json.alergias);

      // Mais a senha criptografada
      expect(jsonWithEncryptedSenha.senha).toBe('senha_criptografada_mock');
      expect(json.senha).toBeUndefined(); // toJSON não tem senha
    });

    test('toAuthJSON deve retornar menos campos que toJSON', () => {
      const pacienteData = {
        id: 1,
        nome: 'João Silva',
        email: 'joao.silva@email.com',
        senha: 'senha123',
        data_nascimento: '1990-05-15',
        peso_kg: 70.5,
        foto_perfil: 'foto.jpg'
      };

      const paciente = new Paciente(pacienteData);

      const json = paciente.toJSON();
      const authJson = paciente.toAuthJSON();

      expect(Object.keys(authJson).length).toBeLessThan(Object.keys(json).length);
      expect(authJson.id).toBe(json.id);
      expect(authJson.nome).toBe(json.nome);
      expect(authJson.email).toBe(json.email);
    });
  });

  // =============================================
  // TESTES DE VALORES LIMITE
  // =============================================
  describe('Valores Limite', () => {
    test('deve lidar com peso zero', () => {
      const pacienteData = {
        id: 1,
        nome: 'Paciente Teste',
        email: 'teste@email.com',
        senha: 'senha123',
        peso_kg: 0
      };

      const paciente = new Paciente(pacienteData);
      expect(paciente.peso_kg).toBe(0);
      expect(paciente.toJSON().peso_kg).toBe(0);
    });

    test('deve lidar com arrays vazios', () => {
      const pacienteData = {
        id: 1,
        nome: 'Paciente Teste',
        email: 'teste@email.com',
        senha: 'senha123',
        alergias: [],
        medicacoes: [],
        condicoes: []
      };

      const paciente = new Paciente(pacienteData);
      
      expect(paciente.alergias).toEqual([]);
      expect(paciente.medicacoes).toEqual([]);
      expect(paciente.condicoes).toEqual([]);
      
      const json = paciente.toJSON();
      expect(json.alergias).toEqual([]);
      expect(json.medicacoes).toEqual([]);
      expect(json.condicoes).toEqual([]);
    });

    test('deve lidar com strings muito longas', () => {
      const longText = 'A'.repeat(1000);
      
      const pacienteData = {
        id: 1,
        nome: longText,
        email: 'teste@email.com',
        senha: 'senha123',
        foto_perfil: longText
      };

      const paciente = new Paciente(pacienteData);
      
      expect(paciente.nome).toBe(longText);
      expect(paciente.foto_perfil).toBe(longText);
      
      const json = paciente.toJSON();
      expect(json.nome).toBe(longText);
      expect(json.foto_perfil).toBe(longText);
    });
  });
});