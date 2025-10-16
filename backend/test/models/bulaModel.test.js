const Bula = require('../../models/bulaModel');

describe('Bula Model', () => {
  // =============================================
  // TESTES DO CONSTRUCTOR
  // =============================================
  describe('Constructor', () => {
    test('deve criar instância com todos os campos', () => {
      const bulaData = {
        id: 1,
        id_medicamento: 100,
        dosagem_e_administracao: 'Tomar 1 comprimido a cada 8 horas',
        indicacoes: 'Tratamento de dor e febre',
        contraindicacoes: 'Hipersensibilidade ao princípio ativo',
        advertencias: 'Não exceder a dose recomendada',
        interacoes_medicamentosas: 'Pode interagir com anticoagulantes',
        armazenamento_e_validade: 'Manter em temperatura ambiente'
      };

      const bula = new Bula(bulaData);

      expect(bula.id).toBe(1);
      expect(bula.id_medicamento).toBe(100);
      expect(bula.dosagem_e_administracao).toBe('Tomar 1 comprimido a cada 8 horas');
      expect(bula.indicacoes).toBe('Tratamento de dor e febre');
      expect(bula.contraindicacoes).toBe('Hipersensibilidade ao princípio ativo');
      expect(bula.advertencias).toBe('Não exceder a dose recomendada');
      expect(bula.interacoes_medicamentosas).toBe('Pode interagir com anticoagulantes');
      expect(bula.armazenamento_e_validade).toBe('Manter em temperatura ambiente');
    });

    test('deve criar instância com campos undefined quando não fornecidos', () => {
      const bulaData = {
        id: 1,
        id_medicamento: 100
        // outros campos não fornecidos
      };

      const bula = new Bula(bulaData);

      expect(bula.id).toBe(1);
      expect(bula.id_medicamento).toBe(100);
      expect(bula.dosagem_e_administracao).toBeUndefined();
      expect(bula.indicacoes).toBeUndefined();
      expect(bula.contraindicacoes).toBeUndefined();
      expect(bula.advertencias).toBeUndefined();
      expect(bula.interacoes_medicamentosas).toBeUndefined();
      expect(bula.armazenamento_e_validade).toBeUndefined();
    });

    test('deve criar instância com campos null quando fornecidos como null', () => {
      const bulaData = {
        id: 1,
        id_medicamento: 100,
        dosagem_e_administracao: null,
        indicacoes: null,
        contraindicacoes: null,
        advertencias: null,
        interacoes_medicamentosas: null,
        armazenamento_e_validade: null
      };

      const bula = new Bula(bulaData);

      expect(bula.id).toBe(1);
      expect(bula.id_medicamento).toBe(100);
      expect(bula.dosagem_e_administracao).toBeNull();
      expect(bula.indicacoes).toBeNull();
      expect(bula.contraindicacoes).toBeNull();
      expect(bula.advertencias).toBeNull();
      expect(bula.interacoes_medicamentosas).toBeNull();
      expect(bula.armazenamento_e_validade).toBeNull();
    });

    test('deve criar instância com campos vazios quando fornecidos como string vazia', () => {
      const bulaData = {
        id: 1,
        id_medicamento: 100,
        dosagem_e_administracao: '',
        indicacoes: '',
        contraindicacoes: '',
        advertencias: '',
        interacoes_medicamentosas: '',
        armazenamento_e_validade: ''
      };

      const bula = new Bula(bulaData);

      expect(bula.id).toBe(1);
      expect(bula.id_medicamento).toBe(100);
      expect(bula.dosagem_e_administracao).toBe('');
      expect(bula.indicacoes).toBe('');
      expect(bula.contraindicacoes).toBe('');
      expect(bula.advertencias).toBe('');
      expect(bula.interacoes_medicamentosas).toBe('');
      expect(bula.armazenamento_e_validade).toBe('');
    });
  });

  // =============================================
  // TESTES DO MÉTODO toJSON
  // =============================================
  describe('toJSON', () => {
    test('deve retornar objeto com todos os campos', () => {
      const bulaData = {
        id: 1,
        id_medicamento: 100,
        dosagem_e_administracao: 'Tomar 1 comprimido a cada 8 horas',
        indicacoes: 'Tratamento de dor e febre',
        contraindicacoes: 'Hipersensibilidade ao princípio ativo',
        advertencias: 'Não exceder a dose recomendada',
        interacoes_medicamentosas: 'Pode interagir com anticoagulantes',
        armazenamento_e_validade: 'Manter em temperatura ambiente'
      };

      const bula = new Bula(bulaData);
      const json = bula.toJSON();

      expect(json).toEqual({
        id: 1,
        id_medicamento: 100,
        dosagem_e_administracao: 'Tomar 1 comprimido a cada 8 horas',
        indicacoes: 'Tratamento de dor e febre',
        contraindicacoes: 'Hipersensibilidade ao princípio ativo',
        advertencias: 'Não exceder a dose recomendada',
        interacoes_medicamentosas: 'Pode interagir com anticoagulantes',
        armazenamento_e_validade: 'Manter em temperatura ambiente'
      });
    });

    test('deve retornar objeto com campos undefined quando não definidos', () => {
      const bulaData = {
        id: 1,
        id_medicamento: 100
        // outros campos não fornecidos
      };

      const bula = new Bula(bulaData);
      const json = bula.toJSON();

      expect(json.id).toBe(1);
      expect(json.id_medicamento).toBe(100);
      expect(json.dosagem_e_administracao).toBeUndefined();
      expect(json.indicacoes).toBeUndefined();
      expect(json.contraindicacoes).toBeUndefined();
      expect(json.advertencias).toBeUndefined();
      expect(json.interacoes_medicamentosas).toBeUndefined();
      expect(json.armazenamento_e_validade).toBeUndefined();
    });

    test('deve retornar objeto com campos null quando definidos como null', () => {
      const bulaData = {
        id: 1,
        id_medicamento: 100,
        dosagem_e_administracao: null,
        indicacoes: null,
        contraindicacoes: null,
        advertencias: null,
        interacoes_medicamentosas: null,
        armazenamento_e_validade: null
      };

      const bula = new Bula(bulaData);
      const json = bula.toJSON();

      expect(json.dosagem_e_administracao).toBeNull();
      expect(json.indicacoes).toBeNull();
      expect(json.contraindicacoes).toBeNull();
      expect(json.advertencias).toBeNull();
      expect(json.interacoes_medicamentosas).toBeNull();
      expect(json.armazenamento_e_validade).toBeNull();
    });
  });

  // =============================================
  // TESTES DO MÉTODO toAuthJSON
  // =============================================
  describe('toAuthJSON', () => {
    test('deve retornar apenas id e id_medicamento', () => {
      const bulaData = {
        id: 1,
        id_medicamento: 100,
        dosagem_e_administracao: 'Tomar 1 comprimido a cada 8 horas',
        indicacoes: 'Tratamento de dor e febre',
        contraindicacoes: 'Hipersensibilidade ao princípio ativo',
        advertencias: 'Não exceder a dose recomendada',
        interacoes_medicamentosas: 'Pode interagir com anticoagulantes',
        armazenamento_e_validade: 'Manter em temperatura ambiente'
      };

      const bula = new Bula(bulaData);
      const authJson = bula.toAuthJSON();

      expect(authJson).toEqual({
        id: 1,
        id_medicamento: 100
      });

      // Verifica que apenas os campos básicos estão presentes
      expect(Object.keys(authJson)).toHaveLength(2);
      expect(authJson.dosagem_e_administracao).toBeUndefined();
      expect(authJson.indicacoes).toBeUndefined();
      expect(authJson.contraindicacoes).toBeUndefined();
      expect(authJson.advertencias).toBeUndefined();
      expect(authJson.interacoes_medicamentosas).toBeUndefined();
      expect(authJson.armazenamento_e_validade).toBeUndefined();
    });

    test('deve funcionar com instância mínima', () => {
      const bulaData = {
        id: 1,
        id_medicamento: 100
      };

      const bula = new Bula(bulaData);
      const authJson = bula.toAuthJSON();

      expect(authJson).toEqual({
        id: 1,
        id_medicamento: 100
      });
    });
  });

  // =============================================
  // TESTES DE INTEGRAÇÃO ENTRE MÉTODOS
  // =============================================
  describe('Integração entre métodos', () => {
    test('toJSON deve retornar mais campos que toAuthJSON', () => {
      const bulaData = {
        id: 1,
        id_medicamento: 100,
        dosagem_e_administracao: 'Tomar 1 comprimido a cada 8 horas',
        indicacoes: 'Tratamento de dor e febre',
        contraindicacoes: 'Hipersensibilidade ao princípio ativo',
        advertencias: 'Não exceder a dose recomendada',
        interacoes_medicamentosas: 'Pode interagir com anticoagulantes',
        armazenamento_e_validade: 'Manter em temperatura ambiente'
      };

      const bula = new Bula(bulaData);

      const json = bula.toJSON();
      const authJson = bula.toAuthJSON();

      // toJSON tem todos os campos
      expect(Object.keys(json)).toHaveLength(8);
      
      // toAuthJSON tem apenas campos básicos
      expect(Object.keys(authJson)).toHaveLength(2);

      // Ambos devem ter id e id_medicamento
      expect(json.id).toBe(authJson.id);
      expect(json.id_medicamento).toBe(authJson.id_medicamento);
    });

    test('métodos não devem modificar a instância original', () => {
      const bulaData = {
        id: 1,
        id_medicamento: 100,
        dosagem_e_administracao: 'Tomar 1 comprimido a cada 8 horas'
      };

      const bula = new Bula(bulaData);

      // Chama os métodos múltiplas vezes
      const json1 = bula.toJSON();
      const authJson1 = bula.toAuthJSON();
      const json2 = bula.toJSON();
      const authJson2 = bula.toAuthJSON();

      // As instâncias devem permanecer inalteradas
      expect(bula.id).toBe(1);
      expect(bula.id_medicamento).toBe(100);
      expect(bula.dosagem_e_administracao).toBe('Tomar 1 comprimido a cada 8 horas');

      // Os resultados devem ser consistentes
      expect(json1).toEqual(json2);
      expect(authJson1).toEqual(authJson2);
    });
  });

  // =============================================
  // TESTES DE VALORES LIMITE
  // =============================================
  describe('Valores Limite', () => {
    test('deve lidar com id zero', () => {
      const bulaData = {
        id: 0,
        id_medicamento: 100
      };

      const bula = new Bula(bulaData);

      expect(bula.id).toBe(0);
      expect(bula.toJSON().id).toBe(0);
      expect(bula.toAuthJSON().id).toBe(0);
    });

    test('deve lidar com id_medicamento zero', () => {
      const bulaData = {
        id: 1,
        id_medicamento: 0
      };

      const bula = new Bula(bulaData);

      expect(bula.id_medicamento).toBe(0);
      expect(bula.toJSON().id_medicamento).toBe(0);
      expect(bula.toAuthJSON().id_medicamento).toBe(0);
    });

    test('deve lidar com textos muito longos', () => {
      const longText = 'A'.repeat(1000); // Texto de 1000 caracteres
      
      const bulaData = {
        id: 1,
        id_medicamento: 100,
        dosagem_e_administracao: longText,
        indicacoes: longText,
        contraindicacoes: longText,
        advertencias: longText,
        interacoes_medicamentosas: longText,
        armazenamento_e_validade: longText
      };

      const bula = new Bula(bulaData);

      expect(bula.dosagem_e_administracao).toBe(longText);
      expect(bula.indicacoes).toBe(longText);
      expect(bula.contraindicacoes).toBe(longText);
      expect(bula.advertencias).toBe(longText);
      expect(bula.interacoes_medicamentosas).toBe(longText);
      expect(bula.armazenamento_e_validade).toBe(longText);

      const json = bula.toJSON();
      expect(json.dosagem_e_administracao).toBe(longText);
      expect(json.indicacoes).toBe(longText);
    });
  });
});