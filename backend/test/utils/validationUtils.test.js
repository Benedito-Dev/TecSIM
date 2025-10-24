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

  // Adicione este teste
  test('deve retornar false para dia 31 em meses com 30 dias', () => {
    // Meses com 30 dias: Abril (04), Junho (06), Setembro (09), Novembro (11)
    expect(isValidDate('2023-04-31')).toBe(false); // Abril tem 30 dias
    expect(isValidDate('2023-06-31')).toBe(false); // Junho tem 30 dias
    expect(isValidDate('2023-09-31')).toBe(false); // Setembro tem 30 dias
    expect(isValidDate('2023-11-31')).toBe(false); // Novembro tem 30 dias
  });
  });

  // =============================================
  // TESTES PARA isValidAge
  // =============================================
  describe('isValidAge', () => {
    test('deve retornar true para idade válida', () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 25); // 25 anos atrás
      expect(isValidAge(birthDate.toISOString().split('T')[0], 18)).toBe(true);
    });

    test('deve retornar false para idade inválida', () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 15); // 15 anos atrás
      expect(isValidAge(birthDate.toISOString().split('T')[0], 18)).toBe(false);
    });

    test('deve validar idade mínima personalizada', () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 20); // 20 anos atrás
      expect(isValidAge(birthDate.toISOString().split('T')[0], 21)).toBe(false);
      expect(isValidAge(birthDate.toISOString().split('T')[0], 18)).toBe(true);
    });
  });
});