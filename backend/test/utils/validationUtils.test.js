const {
  isValidCPF,
  isValidEmail,
  isValidPhone,
  isValidCEP,
  isValidCRM,
  isValidPassword,
  removeSpecialChars,
  formatCPF,
  formatPhone,
  isValidDate,
  isValidAge
} = require('../../utils/validationUtils');

describe('ValidationUtils', () => {
  // =============================================
  // TESTES PARA isValidCPF
  // =============================================
  describe('isValidCPF', () => {
    test('deve retornar true para CPF válido', () => {
      expect(isValidCPF('529.982.247-25')).toBe(true);
      expect(isValidCPF('52998224725')).toBe(true);
    });

    test('deve retornar false para CPF inválido', () => {
      expect(isValidCPF('111.111.111-11')).toBe(false);
      expect(isValidCPF('123.456.789-00')).toBe(false);
      expect(isValidCPF('123')).toBe(false);
    });

    test('deve retornar false para CPF com todos dígitos iguais', () => {
      expect(isValidCPF('000.000.000-00')).toBe(false);
      expect(isValidCPF('111.111.111-11')).toBe(false);
      expect(isValidCPF('999.999.999-99')).toBe(false);
    });

    test('deve retornar false para CPF vazio ou undefined', () => {
      expect(isValidCPF('')).toBe(false);
      expect(isValidCPF(null)).toBe(false);
      expect(isValidCPF(undefined)).toBe(false);
    });
  });

  // =============================================
  // TESTES PARA isValidEmail
  // =============================================
  describe('isValidEmail', () => {
    test('deve retornar true para email válido', () => {
      expect(isValidEmail('teste@example.com')).toBe(true);
      expect(isValidEmail('usuario.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('a@b.c')).toBe(true);
    });

    test('deve retornar false para email inválido', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('user@domain.')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  // =============================================
  // TESTES PARA isValidPhone
  // =============================================
  describe('isValidPhone', () => {
    test('deve retornar true para telefone válido', () => {
      expect(isValidPhone('(11) 99999-9999')).toBe(true);
      expect(isValidPhone('(11) 9999-9999')).toBe(true);
      expect(isValidPhone('11999999999')).toBe(true);
      expect(isValidPhone('11 99999 9999')).toBe(true);
    });

    test('deve retornar false para telefone inválido', () => {
      expect(isValidPhone('123')).toBe(false);
      expect(isValidPhone('(11) 999-999')).toBe(false);
      expect(isValidPhone('')).toBe(false);
    });
  });

  // =============================================
  // TESTES PARA isValidCEP
  // =============================================
  describe('isValidCEP', () => {
    test('deve retornar true para CEP válido', () => {
      expect(isValidCEP('12345-678')).toBe(true);
      expect(isValidCEP('12345678')).toBe(true);
    });

    test('deve retornar false para CEP inválido', () => {
      expect(isValidCEP('1234')).toBe(false);
      expect(isValidCEP('12345-67')).toBe(false);
      expect(isValidCEP('')).toBe(false);
    });
  });

  // =============================================
  // TESTES PARA isValidCRM
  // =============================================
  describe('isValidCRM', () => {
    test('deve retornar true para CRM válido', () => {
      expect(isValidCRM('CRM/SP 123456')).toBe(true);
      expect(isValidCRM('12345')).toBe(true);
      expect(isValidCRM('CRM-MG 1234')).toBe(true);
    });

    test('deve retornar false para CRM inválido', () => {
      expect(isValidCRM('123')).toBe(false); // muito curto
      expect(isValidCRM('')).toBe(false);
      expect(isValidCRM(null)).toBe(false);
    });
  });

  // =============================================
  // TESTES PARA isValidPassword
  // =============================================
  describe('isValidPassword', () => {
    test('deve retornar true para senha válida', () => {
      expect(isValidPassword('123456')).toBe(true);
      expect(isValidPassword('senhasegura')).toBe(true);
      expect(isValidPassword('abc123def')).toBe(true);
    });

    test('deve retornar false para senha inválida', () => {
      expect(isValidPassword('12345')).toBe(false); // menos de 6 caracteres
      expect(isValidPassword('')).toBe(false);
      expect(isValidPassword(null)).toBe(false);
    });
  });

  // =============================================
  // TESTES PARA removeSpecialChars
  // =============================================
  describe('removeSpecialChars', () => {
    test('deve remover caracteres especiais', () => {
      expect(removeSpecialChars('Hello@World!')).toBe('HelloWorld');
      expect(removeSpecialChars('Teste#123$%')).toBe('Teste123');
      expect(removeSpecialChars('Áéîõú')).toBe('Áéîõú'); // mantém acentos
      expect(removeSpecialChars('')).toBe('');
    });
  });

  // =============================================
  // TESTES PARA formatCPF
  // =============================================
  describe('formatCPF', () => {
    test('deve formatar CPF corretamente', () => {
      expect(formatCPF('52998224725')).toBe('529.982.247-25');
      expect(formatCPF('12345678909')).toBe('123.456.789-09');
    });

    test('deve lidar com CPF já formatado', () => {
      expect(formatCPF('529.982.247-25')).toBe('529.982.247-25');
    });
  });

  // =============================================
  // TESTES PARA formatPhone
  // =============================================
  describe('formatPhone', () => {
    test('deve formatar telefone 11 dígitos', () => {
      expect(formatPhone('11999999999')).toBe('(11) 99999-9999');
    });

    test('deve formatar telefone 10 dígitos', () => {
      expect(formatPhone('1133334444')).toBe('(11) 3333-4444');
    });

    test('deve lidar com telefone já formatado', () => {
      expect(formatPhone('(11) 99999-9999')).toBe('(11) 99999-9999');
    });
  });

  // =============================================
  // TESTES PARA isValidDate
  // =============================================
  describe('isValidDate', () => {
    test('deve retornar true para data válida', () => {
      expect(isValidDate('2023-12-25')).toBe(true);
      expect(isValidDate('2023-01-01')).toBe(true);
    });

    test('deve retornar false para data inválida', () => {
      expect(isValidDate('2023-13-01')).toBe(false);
      expect(isValidDate('invalid-date')).toBe(false);
      expect(isValidDate('2023-02-30')).toBe(false);
    });

    test('deve retornar false para dia 31 em meses com 30 dias', () => {
      // Meses com 30 dias: Abril (04), Junho (06), Setembro (09), Novembro (11)
      expect(isValidDate('2023-04-31')).toBe(false); // Abril tem 30 dias
      expect(isValidDate('2023-06-31')).toBe(false); // Junho tem 30 dias
      expect(isValidDate('2023-09-31')).toBe(false); // Setembro tem 30 dias
      expect(isValidDate('2023-11-31')).toBe(false); // Novembro tem 30 dias
    });

    test('deve retornar false para dia 30/31 em fevereiro de ano bissexto', () => {
      // Ano bissexto (2024 é bissexto) mas fevereiro nunca tem 30 ou 31 dias
      expect(isValidDate('2024-02-30')).toBe(false); // ← Cobre linha 116
      expect(isValidDate('2024-02-31')).toBe(false); // ← Cobre linha 116
    });
  });

  // =============================================
  // TESTES PARA isValidAge
  // =============================================
  describe('isValidAge', () => {
    let originalDate;

    beforeAll(() => {
      // Guarda o Date original
      originalDate = global.Date;
    });

    afterAll(() => {
      // Restaura o Date original
      global.Date = originalDate;
    });

    function mockDate(dateString) {
      const fixedDate = new Date(dateString);
      
      // Mock mais robusto do Date
      global.Date = class extends originalDate {
        constructor(...args) {
          if (args.length === 0) {
            return new originalDate(fixedDate);
          }
          return new originalDate(...args);
        }
        
        static now() {
          return fixedDate.getTime();
        }
      };
      
      // Preserva métodos estáticos
      Object.assign(global.Date, {
        parse: originalDate.parse,
        UTC: originalDate.UTC
      });
      
      global.Date.prototype = originalDate.prototype;
    }

    test('deve retornar true para idade válida', () => {
      mockDate('2024-06-15');
      // Nasceu em 1999-06-14, hoje é 2024-06-15 → já fez 25 anos
      expect(isValidAge('1999-06-14', 18)).toBe(true);
    });

    test('deve retornar false para idade inválida', () => {
      mockDate('2024-06-15');
      // Nasceu em 2010-01-01, hoje é 2024-06-15 → 14 anos (ainda não fez 15)
      expect(isValidAge('2010-01-01', 18)).toBe(false);
    });

    test('deve validar idade mínima personalizada', () => {
      mockDate('2024-06-15');
      // Nasceu em 2003-06-14, hoje é 2024-06-15 → 21 anos (já fez)
      expect(isValidAge('2003-06-14', 21)).toBe(true);
      // Nasceu em 2004-06-14, hoje é 2024-06-15 → 20 anos (já fez)
      expect(isValidAge('2004-06-14', 21)).toBe(false);
    });

    test('deve cobrir linha age-1 quando aniversário é NO MESMO MÊS mas DIA MAIOR que hoje', () => {
      // Hoje é 15 de Junho 2024, nasceu em 20 de Junho 2005
      // Ainda não fez 19 anos (vai fazer dia 20) → 18 anos
      mockDate('2024-06-15');
      expect(isValidAge('2005-06-20', 18)).toBe(true);  // 18 >= 18 → true
      expect(isValidAge('2005-06-20', 19)).toBe(false); // 18 >= 19 → false
    });

    test('deve cobrir linha age-1 quando aniversário é em MÊS MAIOR que hoje', () => {
      // Hoje é 15 de Junho 2024, nasceu em 15 de Dezembro 2005
      // Ainda não fez 19 anos (vai fazer em Dezembro) → 18 anos
      mockDate('2024-06-15');
      expect(isValidAge('2005-12-15', 18)).toBe(true);  // 18 >= 18 → true
      expect(isValidAge('2005-12-15', 19)).toBe(false); // 18 >= 19 → false
    });

    test('deve cobrir linha age-1 quando aniversário é em MÊS MENOR mas ainda não fez', () => {
      // Hoje é 15 de Junho 2024, nasceu em 15 de Agosto 2005  
      // Ainda não fez 19 anos (vai fazer em Agosto) → 18 anos
      mockDate('2024-06-15');
      expect(isValidAge('2005-08-15', 18)).toBe(true);  // 18 >= 18 → true
      expect(isValidAge('2005-08-15', 19)).toBe(false); // 18 >= 19 → false
    });

    // Testes adicionais para melhor cobertura
    test('deve retornar false para data de nascimento inválida', () => {
      mockDate('2024-06-15');
      expect(isValidAge('data-invalida', 18)).toBe(false);
    });

    test('deve retornar true quando faz aniversário exatamente hoje', () => {
      mockDate('2024-06-15');
      // Nasceu em 2000-06-15, hoje é 2024-06-15 → 24 anos (faz hoje)
      expect(isValidAge('2000-06-15', 24)).toBe(true);
    });

    test('deve retornar true quando idade é exatamente a mínima', () => {
      mockDate('2024-06-15');
      // Nasceu em 2006-06-14, hoje é 2024-06-15 → 18 anos (fez ontem)
      expect(isValidAge('2006-06-14', 18)).toBe(true);
    });
  });
});