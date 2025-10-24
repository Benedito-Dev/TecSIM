const Prescricao = require('../../models/prescricaoModel');

describe('Prescricao Model', () => {
  // =============================================
  // TESTES DO CONSTRUCTOR
  // =============================================
  describe('Constructor', () => {
    test('deve criar instância com todos os campos', () => {
      const prescricaoData = {
        id: 1,
        id_paciente: 100,
        crm: 'CRM/SP 123456',
        diagnostico: 'Hipertensão arterial',
        data_prescricao: '2023-12-01',
        validade: '2024-12-01',
        data_cadastro: '2023-12-01T10:00:00Z'
      };

      const prescricao = new Prescricao(prescricaoData);

      expect(prescricao.id).toBe(1);
      expect(prescricao.id_paciente).toBe(100);
      expect(prescricao.crm).toBe('CRM/SP 123456');
      expect(prescricao.diagnostico).toBe('Hipertensão arterial');
      expect(prescricao.data_prescricao).toBe('2023-12-01');
      expect(prescricao.validade).toBe('2024-12-01');
      expect(prescricao.data_cadastro).toBe('2023-12-01T10:00:00Z');
    });

    test('deve criar instância com campos undefined quando não fornecidos', () => {
      const prescricaoData = {
        id: 1,
        id_paciente: 100,
        crm: 'CRM/SP 123456'
        // outros campos não fornecidos
      };

      const prescricao = new Prescricao(prescricaoData);

      expect(prescricao.id).toBe(1);
      expect(prescricao.id_paciente).toBe(100);
      expect(prescricao.crm).toBe('CRM/SP 123456');
      expect(prescricao.diagnostico).toBeUndefined();
      expect(prescricao.data_prescricao).toBeUndefined();
      expect(prescricao.validade).toBeUndefined();
      expect(prescricao.data_cadastro).toBeUndefined();
    });

    test('deve criar instância com campos null quando fornecidos como null', () => {
      const prescricaoData = {
        id: 1,
        id_paciente: 100,
        crm: 'CRM/SP 123456',
        diagnostico: null,
        data_prescricao: null,
        validade: null,
        data_cadastro: null
      };

      const prescricao = new Prescricao(prescricaoData);

      expect(prescricao.diagnostico).toBeNull();
      expect(prescricao.data_prescricao).toBeNull();
      expect(prescricao.validade).toBeNull();
      expect(prescricao.data_cadastro).toBeNull();
    });

    test('deve criar instância com campos vazios quando fornecidos como string vazia', () => {
      const prescricaoData = {
        id: 1,
        id_paciente: 100,
        crm: '',
        diagnostico: '',
        data_prescricao: '',
        validade: '',
        data_cadastro: ''
      };

      const prescricao = new Prescricao(prescricaoData);

      expect(prescricao.crm).toBe('');
      expect(prescricao.diagnostico).toBe('');
      expect(prescricao.data_prescricao).toBe('');
      expect(prescricao.validade).toBe('');
      expect(prescricao.data_cadastro).toBe('');
    });

    test('deve criar instância com valores numéricos zero', () => {
      const prescricaoData = {
        id: 0,
        id_paciente: 0,
        crm: 'CRM/SP 123456',
        diagnostico: 'Teste',
        data_prescricao: '2023-12-01',
        validade: '2024-12-01',
        data_cadastro: '2023-12-01T10:00:00Z'
      };

      const prescricao = new Prescricao(prescricaoData);

      expect(prescricao.id).toBe(0);
      expect(prescricao.id_paciente).toBe(0);
      expect(prescricao.crm).toBe('CRM/SP 123456');
    });
  });

  // =============================================
  // TESTES DO MÉTODO toJSON
  // =============================================
  describe('toJSON', () => {
    test('deve retornar objeto com todos os campos', () => {
      const prescricaoData = {
        id: 1,
        id_paciente: 100,
        crm: 'CRM/SP 123456',
        diagnostico: 'Hipertensão arterial',
        data_prescricao: '2023-12-01',
        validade: '2024-12-01',
        data_cadastro: '2023-12-01T10:00:00Z'
      };

      const prescricao = new Prescricao(prescricaoData);
      const json = prescricao.toJSON();

      expect(json).toEqual({
        id: 1,
        id_paciente: 100,
        crm: 'CRM/SP 123456',
        diagnostico: 'Hipertensão arterial',
        data_prescricao: '2023-12-01',
        validade: '2024-12-01',
        data_cadastro: '2023-12-01T10:00:00Z'
      });
    });

    test('deve retornar objeto com campos undefined quando não definidos', () => {
      const prescricaoData = {
        id: 1,
        id_paciente: 100,
        crm: 'CRM/SP 123456'
        // outros campos não fornecidos
      };

      const prescricao = new Prescricao(prescricaoData);
      const json = prescricao.toJSON();

      expect(json.id).toBe(1);
      expect(json.id_paciente).toBe(100);
      expect(json.crm).toBe('CRM/SP 123456');
      expect(json.diagnostico).toBeUndefined();
      expect(json.data_prescricao).toBeUndefined();
      expect(json.validade).toBeUndefined();
      expect(json.data_cadastro).toBeUndefined();
    });

    test('deve retornar objeto com campos null quando definidos como null', () => {
      const prescricaoData = {
        id: 1,
        id_paciente: 100,
        crm: 'CRM/SP 123456',
        diagnostico: null,
        data_prescricao: null,
        validade: null,
        data_cadastro: null
      };

      const prescricao = new Prescricao(prescricaoData);
      const json = prescricao.toJSON();

      expect(json.diagnostico).toBeNull();
      expect(json.data_prescricao).toBeNull();
      expect(json.validade).toBeNull();
      expect(json.data_cadastro).toBeNull();
    });

    test('deve retornar objeto com campos vazios quando definidos como string vazia', () => {
      const prescricaoData = {
        id: 1,
        id_paciente: 100,
        crm: '',
        diagnostico: '',
        data_prescricao: '',
        validade: '',
        data_cadastro: ''
      };

      const prescricao = new Prescricao(prescricaoData);
      const json = prescricao.toJSON();

      expect(json.crm).toBe('');
      expect(json.diagnostico).toBe('');
      expect(json.data_prescricao).toBe('');
      expect(json.validade).toBe('');
      expect(json.data_cadastro).toBe('');
    });
  });

  // =============================================
  // TESTES DE IMUTABILIDADE
  // =============================================
  describe('Imutabilidade', () => {
    test('método toJSON não deve modificar a instância original', () => {
      const prescricaoData = {
        id: 1,
        id_paciente: 100,
        crm: 'CRM/SP 123456',
        diagnostico: 'Hipertensão arterial',
        data_prescricao: '2023-12-01'
      };

      const prescricao = new Prescricao(prescricaoData);

      // Chama o método múltiplas vezes
      const json1 = prescricao.toJSON();
      const json2 = prescricao.toJSON();
      const json3 = prescricao.toJSON();

      // A instância deve permanecer inalterada
      expect(prescricao.id).toBe(1);
      expect(prescricao.id_paciente).toBe(100);
      expect(prescricao.crm).toBe('CRM/SP 123456');
      expect(prescricao.diagnostico).toBe('Hipertensão arterial');
      expect(prescricao.data_prescricao).toBe('2023-12-01');

      // Os resultados devem ser consistentes
      expect(json1).toEqual(json2);
      expect(json2).toEqual(json3);
    });

    test('alterações no objeto JSON não devem afetar a instância', () => {
      const prescricaoData = {
        id: 1,
        id_paciente: 100,
        crm: 'CRM/SP 123456',
        diagnostico: 'Hipertensão arterial'
      };

      const prescricao = new Prescricao(prescricaoData);
      const json = prescricao.toJSON();

      // Modifica o objeto JSON
      json.id = 999;
      json.diagnostico = 'Diagnóstico modificado';

      // A instância original não deve ser afetada
      expect(prescricao.id).toBe(1);
      expect(prescricao.diagnostico).toBe('Hipertensão arterial');
    });
  });

  // =============================================
  // TESTES DE VALORES LIMITE E BORDAS
  // =============================================
  describe('Valores Limite e Bordas', () => {
    test('deve lidar com textos muito longos', () => {
      const longText = 'A'.repeat(5000); // Texto de 5000 caracteres
      const longDiagnostico = 'B'.repeat(2000); // Diagnóstico longo
      
      const prescricaoData = {
        id: 1,
        id_paciente: 100,
        crm: longText,
        diagnostico: longDiagnostico,
        data_prescricao: '2023-12-01',
        validade: '2024-12-01',
        data_cadastro: '2023-12-01T10:00:00Z'
      };

      const prescricao = new Prescricao(prescricaoData);

      expect(prescricao.crm).toBe(longText);
      expect(prescricao.diagnostico).toBe(longDiagnostico);

      const json = prescricao.toJSON();
      expect(json.crm).toBe(longText);
      expect(json.diagnostico).toBe(longDiagnostico);
    });

    test('deve lidar com datas em formatos diferentes', () => {
      const prescricaoData = {
        id: 1,
        id_paciente: 100,
        crm: 'CRM/SP 123456',
        diagnostico: 'Teste',
        data_prescricao: '01/12/2023', // Formato diferente
        validade: '2024-12-01T00:00:00Z', // ISO com tempo
        data_cadastro: '2023-12-01' // Apenas data
      };

      const prescricao = new Prescricao(prescricaoData);

      expect(prescricao.data_prescricao).toBe('01/12/2023');
      expect(prescricao.validade).toBe('2024-12-01T00:00:00Z');
      expect(prescricao.data_cadastro).toBe('2023-12-01');

      const json = prescricao.toJSON();
      expect(json.data_prescricao).toBe('01/12/2023');
      expect(json.validade).toBe('2024-12-01T00:00:00Z');
      expect(json.data_cadastro).toBe('2023-12-01');
    });

    test('deve lidar com valores numéricos negativos', () => {
      const prescricaoData = {
        id: -1,
        id_paciente: -100,
        crm: 'CRM/SP 123456',
        diagnostico: 'Teste negativo'
      };

      const prescricao = new Prescricao(prescricaoData);

      expect(prescricao.id).toBe(-1);
      expect(prescricao.id_paciente).toBe(-100);

      const json = prescricao.toJSON();
      expect(json.id).toBe(-1);
      expect(json.id_paciente).toBe(-100);
    });
  });

  // =============================================
  // TESTES DE TIPOS DE DADOS
  // =============================================
  describe('Tipos de Dados', () => {
    test('deve manter tipos originais dos valores', () => {
      const prescricaoData = {
        id: 1, // number
        id_paciente: '100', // string em vez de number
        crm: 'CRM/SP 123456', // string
        diagnostico: 'Hipertensão arterial', // string
        data_prescricao: new Date('2023-12-01'), // Date object
        validade: 1701388800000, // timestamp
        data_cadastro: null // null
      };

      const prescricao = new Prescricao(prescricaoData);

      expect(typeof prescricao.id).toBe('number');
      expect(typeof prescricao.id_paciente).toBe('string');
      expect(typeof prescricao.crm).toBe('string');
      expect(typeof prescricao.diagnostico).toBe('string');
      expect(prescricao.data_prescricao instanceof Date).toBe(true);
      expect(typeof prescricao.validade).toBe('number');
      expect(prescricao.data_cadastro).toBeNull();
    });
  });

  // =============================================
  // TESTES DE PERFORMANCE E CONSISTÊNCIA
  // =============================================
  describe('Performance e Consistência', () => {
    test('deve criar múltiplas instâncias consistentemente', () => {
      const baseData = {
        id: 1,
        id_paciente: 100,
        crm: 'CRM/SP 123456',
        diagnostico: 'Hipertensão arterial'
      };

      // Cria múltiplas instâncias
      const prescricoes = [];
      for (let i = 0; i < 10; i++) {
        prescricoes.push(new Prescricao({
          ...baseData,
          id: i + 1
        }));
      }

      // Verifica consistência
      prescricoes.forEach((prescricao, index) => {
        expect(prescricao.id).toBe(index + 1);
        expect(prescricao.id_paciente).toBe(100);
        expect(prescricao.crm).toBe('CRM/SP 123456');
        expect(prescricao.diagnostico).toBe('Hipertensão arterial');

        const json = prescricao.toJSON();
        expect(json.id).toBe(index + 1);
        expect(json.id_paciente).toBe(100);
        expect(json.crm).toBe('CRM/SP 123456');
        expect(json.diagnostico).toBe('Hipertensão arterial');
      });
    });
  });
});