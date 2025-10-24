// tests/pdf/prescriptionPDF.test.js
const generatePrescriptionPDF = require('../../utils/Prescription-Pdf');
const { jsPDF } = require('jspdf');

// Mock do jsPDF
jest.mock('jspdf', () => {
  const mockDoc = {
    setFontSize: jest.fn().mockReturnThis(),
    setFont: jest.fn().mockReturnThis(),
    setLineWidth: jest.fn().mockReturnThis(),
    text: jest.fn().mockReturnThis(),
    line: jest.fn().mockReturnThis(),
    splitTextToSize: jest.fn((text, width) => {
      // Mock que retorna o texto real para podermos verificar as datas
      if (!text) return ['Não informado'];
      if (text.includes('/2023') || text.includes('/2024')) return [text]; // Preserva datas formatadas
      return [text];
    }),
    addPage: jest.fn().mockReturnThis(),
    output: jest.fn().mockReturnValue(new ArrayBuffer(100)),
    internal: {
      pageSize: {
        getWidth: jest.fn().mockReturnValue(210),
        getHeight: jest.fn().mockReturnValue(297)
      }
    }
  };
  return { jsPDF: jest.fn(() => mockDoc) };
});

describe('generatePrescriptionPDF', () => {
  let mockDoc;

  beforeEach(() => {
    mockDoc = new jsPDF();
    jest.clearAllMocks();
  });

    describe('formatarData - DEBUG', () => {
    it('DEBUG: ver todas as chamadas de texto', () => {
        const prescricao = {
        diagnostico: 'Teste',
        data_prescricao: '2023-12-25',
        validade: '2024-01-25',
        crm: '12345',
        medicamentos: []
        };

        // Captura todas as chamadas
        const allCalls = [];
        mockDoc.text.mockImplementation((...args) => {
        allCalls.push(args);
        return mockDoc; // Mantém o chain
        });

        generatePrescriptionPDF(prescricao);

        // Verifica o que realmente está sendo passado
        const allTexts = allCalls.map(call => call[0]);
        
        // Teste mais genérico - verifica se há textos de data
        const hasDateTexts = allTexts.some(text => {
        if (typeof text === 'string') {
            return text.includes('/2023') || text.includes('/2024');
        }
        if (Array.isArray(text)) {
            return text.some(t => t.includes('/2023') || t.includes('/2024'));
        }
        return false;
        });
        
        expect(hasDateTexts).toBe(true);
    });
    });

  describe('Geração do PDF', () => {
    it('deve gerar PDF com dados completos', () => {
      const prescricao = {
        diagnostico: 'Gripe comum',
        data_prescricao: '2023-12-25',
        validade: '2024-01-25',
        crm: 'CRM/SP 123456',
        medicamentos: [
          {
            nome: 'Paracetamol',
            dosagem: '500mg',
            frequencia: 3,
            duracao_dias: 7,
            via: 'Oral'
          }
        ]
      };

      const result = generatePrescriptionPDF(prescricao);

      expect(jsPDF).toHaveBeenCalled();
      
      // Verificações mais flexíveis
      expect(mockDoc.text).toHaveBeenCalledWith('Prescrição Médica', 105, 25, { align: 'center' });
      expect(mockDoc.text).toHaveBeenCalledWith('Diagnóstico:', 20, expect.any(Number));
      expect(mockDoc.text).toHaveBeenCalledWith(['Gripe comum'], 50, expect.any(Number));
      expect(mockDoc.text).toHaveBeenCalledWith('CRM:', 20, expect.any(Number));
      expect(mockDoc.text).toHaveBeenCalledWith('CRM/SP 123456', 35, expect.any(Number));
      expect(mockDoc.text).toHaveBeenCalledWith('Medicamentos Prescritos', 105, expect.any(Number), { align: 'center' });
      expect(mockDoc.text).toHaveBeenCalledWith('1. Paracetamol', 20, expect.any(Number));
      expect(result).toBeInstanceOf(Buffer);
    });

    it('deve gerar PDF sem medicamentos', () => {
      const prescricao = {
        diagnostico: 'Consulta de rotina',
        data_prescricao: '2023-12-25',
        validade: '2024-01-25',
        crm: 'CRM/SP 123456',
        medicamentos: []
      };

      generatePrescriptionPDF(prescricao);

      expect(mockDoc.text).toHaveBeenCalledWith('Nenhum medicamento prescrito.', 20, expect.any(Number));
    });

    it('deve gerar PDF com medicamentos nulos', () => {
      const prescricao = {
        diagnostico: 'Consulta de rotina',
        data_prescricao: '2023-12-25',
        validade: '2024-01-25',
        crm: 'CRM/SP 123456',
        medicamentos: null
      };

      generatePrescriptionPDF(prescricao);

      expect(mockDoc.text).toHaveBeenCalledWith('Nenhum medicamento prescrito.', 20, expect.any(Number));
    });

    it('deve lidar com diagnóstico longo que quebra linha', () => {
      const longText = 'Este é um diagnóstico muito longo que deve quebrar em várias linhas no PDF gerado';
      
      // Mock específico para este teste
      mockDoc.splitTextToSize.mockImplementation((text) => {
        if (text === longText) return ['Linha 1 do diagnóstico', 'Linha 2 do diagnóstico'];
        return [text];
      });

      const prescricao = {
        diagnostico: longText,
        data_prescricao: '2023-12-25',
        validade: '2024-01-25',
        crm: '12345',
        medicamentos: []
      };

      generatePrescriptionPDF(prescricao);

      // contentWidth = pageWidth(210) - margin(20)*2 = 170
      // O texto do diagnóstico usa contentWidth - 30 = 140
      expect(mockDoc.splitTextToSize).toHaveBeenCalledWith(longText, 140);
      expect(mockDoc.text).toHaveBeenCalledWith(['Linha 1 do diagnóstico', 'Linha 2 do diagnóstico'], 50, expect.any(Number));
    });

    it('deve lidar com valores padrão para medicamentos', () => {
      const prescricao = {
        diagnostico: 'Teste',
        data_prescricao: '2023-12-25',
        validade: '2024-01-25',
        crm: '12345',
        medicamentos: [
          {
            nome: 'Medicamento Teste',
            dosagem: null,
            frequencia: null,
            duracao_dias: null,
            via: null
          }
        ]
      };

      generatePrescriptionPDF(prescricao);

      // Verifica os textos com valores padrão
      const calls = mockDoc.text.mock.calls.map(call => call[0]);
      expect(calls).toContain('   • Dosagem: Não informada');
      expect(calls).toContain('   • Frequência: ?x ao dia');
      expect(calls).toContain('   • Duração: ? dias');
      expect(calls).toContain('   • Via: Não informada');
    });

    it('deve adicionar nova página quando muitos medicamentos', () => {
      const muitosMedicamentos = Array.from({ length: 30 }, (_, i) => ({
        nome: `Medicamento ${i + 1}`,
        dosagem: '500mg',
        frequencia: 3,
        duracao_dias: 7,
        via: 'Oral'
      }));

      const prescricao = {
        diagnostico: 'Muitos medicamentos',
        data_prescricao: '2023-12-25',
        validade: '2024-01-25',
        crm: '12345',
        medicamentos: muitosMedicamentos
      };

      generatePrescriptionPDF(prescricao);

      expect(mockDoc.addPage).toHaveBeenCalled();
    });
  });

  describe('Cenários de borda', () => {
    it('deve lidar com diagnóstico vazio', () => {
      // Mock específico para diagnóstico vazio
      mockDoc.splitTextToSize.mockImplementation((text) => [text || 'Não informado']);

      const prescricao = {
        diagnostico: '',
        data_prescricao: '2023-12-25',
        validade: '2024-01-25',
        crm: '12345',
        medicamentos: []
      };

      generatePrescriptionPDF(prescricao);

      // Verifica que "Não informado" foi passado para splitTextToSize
      expect(mockDoc.splitTextToSize).toHaveBeenCalledWith('Não informado', 140);
    });

    it('deve lidar com CRM vazio', () => {
      const prescricao = {
        diagnostico: 'Teste',
        data_prescricao: '2023-12-25',
        validade: '2024-01-25',
        crm: '',
        medicamentos: []
      };

      generatePrescriptionPDF(prescricao);

      // Verifica se "Não informado" foi chamado em algum texto
      const calls = mockDoc.text.mock.calls.map(call => call[0]);
      expect(calls).toContain('Não informado');
    });

    it('deve lidar com datas nulas ou undefined', () => {
      const prescricao = {
        diagnostico: 'Teste',
        data_prescricao: undefined,
        validade: null,
        crm: '12345',
        medicamentos: []
      };

      generatePrescriptionPDF(prescricao);

      // Verifica que "Não informado" foi chamado múltiplas vezes (para ambas as datas)
      const naoInformadoCalls = mockDoc.text.mock.calls.filter(call => call[0] === 'Não informado');
      expect(naoInformadoCalls.length).toBeGreaterThanOrEqual(2);
    });
  });
});