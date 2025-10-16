const Medico = require('../../models/medicoModel');

describe('Medico Model', () => {
  // =============================================
  // TESTES DO CONSTRUCTOR
  // =============================================
  describe('Constructor', () => {
    test('deve criar instância com todos os campos', () => {
      const medicoData = {
        id: 1,
        nome: 'Dr. João Silva',
        crm: 'CRM/SP 123456',
        especialidade: 'Cardiologia',
        email: 'joao.silva@email.com',
        senha: 'senha123',
        data_cadastro: '2023-01-01',
        ativo: true
      };

      const medico = new Medico(medicoData);

      expect(medico.id).toBe(1);
      expect(medico.nome).toBe('Dr. João Silva');
      expect(medico.crm).toBe('CRM/SP 123456');
      expect(medico.especialidade).toBe('Cardiologia');
      expect(medico.email).toBe('joao.silva@email.com');
      expect(medico.senha).toBe('senha123');
      expect(medico.data_cadastro).toBe('2023-01-01');
      expect(medico.ativo).toBe(true);
    });

    test('deve criar data_cadastro automática quando não fornecida', () => {
      const medicoData = {
        nome: 'Dr. Maria Santos',
        crm: 'CRM/MG 654321',
        especialidade: 'Pediatria',
        email: 'maria.santos@email.com',
        senha: 'senha456',
        ativo: true
      };

      const medico = new Medico(medicoData);

      expect(medico.data_cadastro).toBeDefined();
      expect(typeof medico.data_cadastro).toBe('string');
      expect(new Date(medico.data_cadastro).toString()).not.toBe('Invalid Date');
    });

    test('deve lidar com ativo como boolean ou string', () => {
      // Teste com ativo como boolean true
      const medico1 = new Medico({
        nome: 'Dr. Teste 1',
        crm: 'CRM/SP 111111',
        especialidade: 'Teste',
        email: 'teste1@email.com',
        senha: 'senha',
        ativo: true
      });
      expect(medico1.ativo).toBe(true);

      // Teste com ativo como boolean false
      const medico2 = new Medico({
        nome: 'Dr. Teste 2',
        crm: 'CRM/SP 222222',
        especialidade: 'Teste',
        email: 'teste2@email.com',
        senha: 'senha',
        ativo: false
      });
      expect(medico2.ativo).toBe(false);

      // Teste com ativo como string 'true'
      const medico3 = new Medico({
        nome: 'Dr. Teste 3',
        crm: 'CRM/SP 333333',
        especialidade: 'Teste',
        email: 'teste3@email.com',
        senha: 'senha',
        ativo: 'true'
      });
      expect(medico3.ativo).toBe('true');

      // Teste com ativo como string 'false'
      const medico4 = new Medico({
        nome: 'Dr. Teste 4',
        crm: 'CRM/SP 444444',
        especialidade: 'Teste',
        email: 'teste4@email.com',
        senha: 'senha',
        ativo: 'false'
      });
      expect(medico4.ativo).toBe('false');
    });

    test('deve criar instância com campos mínimos', () => {
      const medicoData = {
        nome: 'Dr. Minimal',
        crm: 'CRM/SP 999999',
        email: 'minimal@email.com',
        senha: 'senha'
        // sem data_cadastro, sem ativo
      };

      const medico = new Medico(medicoData);

      expect(medico.nome).toBe('Dr. Minimal');
      expect(medico.crm).toBe('CRM/SP 999999');
      expect(medico.email).toBe('minimal@email.com');
      expect(medico.senha).toBe('senha');
      expect(medico.data_cadastro).toBeDefined();
      expect(medico.ativo).toBeUndefined();
    });
  });

  // =============================================
  // TESTES DO MÉTODO toJSON
  // =============================================
  describe('toJSON', () => {
    test('deve retornar objeto sem senha', () => {
      const medicoData = {
        id: 1,
        nome: 'Dr. João Silva',
        crm: 'CRM/SP 123456',
        especialidade: 'Cardiologia',
        email: 'joao.silva@email.com',
        senha: 'senha123',
        data_cadastro: '2023-01-01',
        ativo: true
      };

      const medico = new Medico(medicoData);
      const json = medico.toJSON();

      expect(json.id).toBe(1);
      expect(json.nome).toBe('Dr. João Silva');
      expect(json.crm).toBe('CRM/SP 123456');
      expect(json.especialidade).toBe('Cardiologia');
      expect(json.email).toBe('joao.silva@email.com');
      expect(json.data_cadastro).toBe('2023-01-01');
      expect(json.senha).toBeUndefined(); // Senha não deve estar presente
      expect(json.ativo).toBeUndefined(); // Ativo não deve estar presente
    });

    test('deve funcionar com instância mínima', () => {
      const medicoData = {
        nome: 'Dr. Minimal',
        crm: 'CRM/SP 999999',
        email: 'minimal@email.com',
        senha: 'senha'
      };

      const medico = new Medico(medicoData);
      const json = medico.toJSON();

      expect(json.nome).toBe('Dr. Minimal');
      expect(json.crm).toBe('CRM/SP 999999');
      expect(json.email).toBe('minimal@email.com');
      expect(json.senha).toBeUndefined();
      expect(json.data_cadastro).toBeDefined();
    });
  });

  // =============================================
  // TESTES DO MÉTODO toAuthJSON
  // =============================================
  describe('toAuthJSON', () => {
    test('deve retornar dados básicos para autenticação', () => {
      const medicoData = {
        id: 1,
        nome: 'Dr. João Silva',
        crm: 'CRM/SP 123456',
        especialidade: 'Cardiologia',
        email: 'joao.silva@email.com',
        senha: 'senha123',
        data_cadastro: '2023-01-01',
        ativo: true
      };

      const medico = new Medico(medicoData);
      const authJson = medico.toAuthJSON();

      expect(authJson).toEqual({
        id: 1,
        nome: 'Dr. João Silva',
        email: 'joao.silva@email.com',
        especialidade: 'Cardiologia',
        crm: 'CRM/SP 123456'
      });

      // Verifica que campos sensíveis não estão presentes
      expect(authJson.senha).toBeUndefined();
      expect(authJson.data_cadastro).toBeUndefined();
      expect(authJson.ativo).toBeUndefined();
    });
  });

  // =============================================
  // TESTES DO MÉTODO getEspecialidade
  // =============================================
  describe('getEspecialidade', () => {
    test('deve retornar a especialidade do médico', () => {
      const medicoData = {
        nome: 'Dr. Especialista',
        crm: 'CRM/SP 555555',
        especialidade: 'Ortopedia',
        email: 'ortopedia@email.com',
        senha: 'senha'
      };

      const medico = new Medico(medicoData);
      expect(medico.getEspecialidade()).toBe('Ortopedia');
    });

    test('deve retornar undefined quando especialidade não definida', () => {
      const medicoData = {
        nome: 'Dr. Sem Especialidade',
        crm: 'CRM/SP 666666',
        email: 'sem@email.com',
        senha: 'senha'
        // sem especialidade
      };

      const medico = new Medico(medicoData);
      expect(medico.getEspecialidade()).toBeUndefined();
    });
  });

  // =============================================
  // TESTES DO MÉTODO validarCRM
  // =============================================
  describe('validarCRM', () => {
    test('deve retornar true para CRM válido', () => {
      const medicoData = {
        nome: 'Dr. CRM Válido',
        crm: 'CRM/SP 123456',
        email: 'crm@email.com',
        senha: 'senha'
      };

      const medico = new Medico(medicoData);
      expect(medico.validarCRM()).toBe(true);
    });

    test('deve retornar false para CRM muito curto', () => {
      const medicoData = {
        nome: 'Dr. CRM Curto',
        crm: '123', // Muito curto
        email: 'curto@email.com',
        senha: 'senha'
      };

      const medico = new Medico(medicoData);
      expect(medico.validarCRM()).toBe(false);
    });

    test('deve retornar false para CRM vazio', () => {
      const medicoData = {
        nome: 'Dr. CRM Vazio',
        crm: '', // Vazio
        email: 'vazio@email.com',
        senha: 'senha'
      };

      const medico = new Medico(medicoData);
      expect(medico.validarCRM()).toBe(false);
    });

    test('deve retornar false para CRM undefined', () => {
      const medicoData = {
        nome: 'Dr. CRM Undefined',
        email: 'undefined@email.com',
        senha: 'senha'
        // sem CRM
      };

      const medico = new Medico(medicoData);
      expect(medico.validarCRM()).toBe(false);
    });

    test('deve retornar true para CRM no limite mínimo (4 caracteres)', () => {
      const medicoData = {
        nome: 'Dr. CRM Limite',
        crm: '1234', // 4 caracteres - limite mínimo
        email: 'limite@email.com',
        senha: 'senha'
      };

      const medico = new Medico(medicoData);
      expect(medico.validarCRM()).toBe(true);
    });
  });

  // =============================================
  // TESTES DE INTEGRAÇÃO ENTRE MÉTODOS
  // =============================================
  describe('Integração entre métodos', () => {
    test('toJSON e toAuthJSON devem excluir campos sensíveis consistentemente', () => {
      const medicoData = {
        id: 1,
        nome: 'Dr. Integração',
        crm: 'CRM/SP 777777',
        especialidade: 'Dermatologia',
        email: 'integracao@email.com',
        senha: 'senha_secreta',
        data_cadastro: '2023-01-01',
        ativo: true
      };

      const medico = new Medico(medicoData);

      const json = medico.toJSON();
      const authJson = medico.toAuthJSON();

      // Ambos não devem ter senha
      expect(json.senha).toBeUndefined();
      expect(authJson.senha).toBeUndefined();

      // toJSON tem data_cadastro, toAuthJSON não
      expect(json.data_cadastro).toBeDefined();
      expect(authJson.data_cadastro).toBeUndefined();

      // toAuthJSON tem menos campos
      expect(Object.keys(authJson).length).toBeLessThan(Object.keys(json).length);
    });
  });
});