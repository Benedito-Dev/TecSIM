const Lembrete = require('../../models/lembretesModel');

describe('Lembrete Model', () => {
  // Teste de construção básica
  describe('Constructor', () => {
    it('deve criar instância com dados completos', () => {
      // Arrange
      const dados = {
        id_lembrete: 1,
        id_paciente: 1,
        id_prescricao: 1,
        id_medicamento: 1,
        horario: '08:00',
        data_inicio: '2024-01-01',
        data_fim: '2024-12-31',
        canal_envio: 'email',
        enviado: false,
        status: true
      };

      // Act
      const lembrete = new Lembrete(dados);

      // Assert
      expect(lembrete.id_lembrete).toBe(1);
      expect(lembrete.id_paciente).toBe(1);
      expect(lembrete.id_prescricao).toBe(1);
      expect(lembrete.id_medicamento).toBe(1);
      expect(lembrete.horario).toBe('08:00');
      expect(lembrete.data_inicio).toBe('2024-01-01');
      expect(lembrete.data_fim).toBe('2024-12-31');
      expect(lembrete.canal_envio).toBe('email');
      expect(lembrete.enviado).toBe(false);
      expect(lembrete.status).toBe(true);
    });

    it('deve usar valores padrão quando não fornecidos', () => {
      // Arrange
      const dados = {
        id_paciente: 1,
        id_prescricao: 1,
        id_medicamento: 1,
        horario: '08:00',
        data_inicio: '2024-01-01',
        data_fim: '2024-12-31',
        canal_envio: 'sms'
      };

      // Act
      const lembrete = new Lembrete(dados);

      // Assert
      expect(lembrete.enviado).toBe(false);
      expect(lembrete.status).toBe(true);
    });

    it('deve criar instância com dados mínimos', () => {
      // Arrange
      const dados = {
        id_paciente: 1,
        id_prescricao: 1,
        id_medicamento: 1,
        horario: '08:00',
        data_inicio: '2024-01-01',
        data_fim: '2024-12-31',
        canal_envio: 'whatsapp'
      };

      // Act
      const lembrete = new Lembrete(dados);

      // Assert
      expect(lembrete.id_paciente).toBe(1);
      expect(lembrete.enviado).toBe(false);
      expect(lembrete.status).toBe(true);
    });
  });

  // Teste do método toJSON
  describe('toJSON', () => {
    it('deve retornar objeto serializado corretamente', () => {
      // Arrange
      const dados = {
        id_lembrete: 1,
        id_paciente: 1,
        id_prescricao: 1,
        id_medicamento: 1,
        horario: '08:00',
        data_inicio: '2024-01-01',
        data_fim: '2024-12-31',
        canal_envio: 'email',
        enviado: false,
        status: true
      };
      const lembrete = new Lembrete(dados);

      // Act
      const resultado = lembrete.toJSON();

      // Assert
      expect(resultado).toEqual(dados);
    });

    it('deve incluir todos os campos obrigatórios', () => {
      // Arrange
      const dados = {
        id_paciente: 1,
        id_prescricao: 1,
        id_medicamento: 1,
        horario: '08:00',
        data_inicio: '2024-01-01',
        data_fim: '2024-12-31',
        canal_envio: 'push'
      };
      const lembrete = new Lembrete(dados);

      // Act
      const resultado = lembrete.toJSON();

      // Assert
      expect(resultado).toHaveProperty('id_paciente');
      expect(resultado).toHaveProperty('id_prescricao');
      expect(resultado).toHaveProperty('id_medicamento');
      expect(resultado).toHaveProperty('horario');
      expect(resultado).toHaveProperty('data_inicio');
      expect(resultado).toHaveProperty('data_fim');
      expect(resultado).toHaveProperty('canal_envio');
      expect(resultado).toHaveProperty('enviado');
      expect(resultado).toHaveProperty('status');
    });
  });

  // Teste do método isAtivo
  describe('isAtivo', () => {
    beforeEach(() => {
      // Mock do Date para ter controle sobre a data atual
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('deve retornar true quando lembrete está ativo e dentro do período', () => {
      // Arrange
      jest.setSystemTime(new Date('2024-06-01'));
      const lembrete = new Lembrete({
        id_paciente: 1,
        id_prescricao: 1,
        id_medicamento: 1,
        horario: '08:00',
        data_inicio: '2024-01-01',
        data_fim: '2024-12-31',
        canal_envio: 'email',
        status: true
      });

      // Act
      const resultado = lembrete.isAtivo();

      // Assert
      expect(resultado).toBe(true);
    });

    it('deve retornar false quando status é false', () => {
      // Arrange
      jest.setSystemTime(new Date('2024-06-01'));
      const lembrete = new Lembrete({
        id_paciente: 1,
        id_prescricao: 1,
        id_medicamento: 1,
        horario: '08:00',
        data_inicio: '2024-01-01',
        data_fim: '2024-12-31',
        canal_envio: 'email',
        status: false
      });

      // Act
      const resultado = lembrete.isAtivo();

      // Assert
      expect(resultado).toBe(false);
    });

    it('deve retornar false quando data atual é antes de data_inicio', () => {
      // Arrange
      jest.setSystemTime(new Date('2023-12-01'));
      const lembrete = new Lembrete({
        id_paciente: 1,
        id_prescricao: 1,
        id_medicamento: 1,
        horario: '08:00',
        data_inicio: '2024-01-01',
        data_fim: '2024-12-31',
        canal_envio: 'email',
        status: true
      });

      // Act
      const resultado = lembrete.isAtivo();

      // Assert
      expect(resultado).toBe(false);
    });

    it('deve retornar false quando data atual é depois de data_fim', () => {
      // Arrange
      jest.setSystemTime(new Date('2025-01-01'));
      const lembrete = new Lembrete({
        id_paciente: 1,
        id_prescricao: 1,
        id_medicamento: 1,
        horario: '08:00',
        data_inicio: '2024-01-01',
        data_fim: '2024-12-31',
        canal_envio: 'email',
        status: true
      });

      // Act
      const resultado = lembrete.isAtivo();

      // Assert
      expect(resultado).toBe(false);
    });

    it('deve retornar true quando data atual é igual a data_inicio', () => {
      // Arrange
      const dataInicio = '2024-01-01';
      jest.setSystemTime(new Date(dataInicio));
      const lembrete = new Lembrete({
        id_paciente: 1,
        id_prescricao: 1,
        id_medicamento: 1,
        horario: '08:00',
        data_inicio: dataInicio,
        data_fim: '2024-12-31',
        canal_envio: 'email',
        status: true
      });

      // Act
      const resultado = lembrete.isAtivo();

      // Assert
      expect(resultado).toBe(true);
    });

    it('deve retornar true quando data atual é igual a data_fim', () => {
      // Arrange
      const dataFim = '2024-12-31';
      jest.setSystemTime(new Date(dataFim));
      const lembrete = new Lembrete({
        id_paciente: 1,
        id_prescricao: 1,
        id_medicamento: 1,
        horario: '08:00',
        data_inicio: '2024-01-01',
        data_fim: dataFim,
        canal_envio: 'email',
        status: true
      });

      // Act
      const resultado = lembrete.isAtivo();

      // Assert
      expect(resultado).toBe(true);
    });
  });

  // Teste do método precisaEnviarAgora
  describe('precisaEnviarAgora', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('deve retornar true quando precisa enviar agora', () => {
      // Arrange
      const agora = new Date('2024-06-01 08:00:00');
      jest.setSystemTime(agora);
      
      const lembrete = new Lembrete({
        id_paciente: 1,
        id_prescricao: 1,
        id_medicamento: 1,
        horario: '08:00',
        data_inicio: '2024-01-01',
        data_fim: '2024-12-31',
        canal_envio: 'email',
        enviado: false,
        status: true
      });

      // Act
      const resultado = lembrete.precisaEnviarAgora();

      // Assert
      expect(resultado).toBe(true);
    });

    it('deve retornar false quando já foi enviado', () => {
      // Arrange
      const agora = new Date('2024-06-01 08:00:00');
      jest.setSystemTime(agora);
      
      const lembrete = new Lembrete({
        id_paciente: 1,
        id_prescricao: 1,
        id_medicamento: 1,
        horario: '08:00',
        data_inicio: '2024-01-01',
        data_fim: '2024-12-31',
        canal_envio: 'email',
        enviado: true,
        status: true
      });

      // Act
      const resultado = lembrete.precisaEnviarAgora();

      // Assert
      expect(resultado).toBe(false);
    });

    it('deve retornar false quando não está ativo', () => {
      // Arrange
      const agora = new Date('2024-06-01 08:00:00');
      jest.setSystemTime(agora);
      
      const lembrete = new Lembrete({
        id_paciente: 1,
        id_prescricao: 1,
        id_medicamento: 1,
        horario: '08:00',
        data_inicio: '2024-01-01',
        data_fim: '2024-12-31',
        canal_envio: 'email',
        enviado: false,
        status: false
      });

      // Act
      const resultado = lembrete.precisaEnviarAgora();

      // Assert
      expect(resultado).toBe(false);
    });

    it('deve retornar true dentro da margem de 5 minutos antes', () => {
      // Arrange
      const agora = new Date('2024-06-01 07:56:00'); // 4 minutos antes
      jest.setSystemTime(agora);
      
      const lembrete = new Lembrete({
        id_paciente: 1,
        id_prescricao: 1,
        id_medicamento: 1,
        horario: '08:00',
        data_inicio: '2024-01-01',
        data_fim: '2024-12-31',
        canal_envio: 'email',
        enviado: false,
        status: true
      });

      // Act
      const resultado = lembrete.precisaEnviarAgora();

      // Assert
      expect(resultado).toBe(true);
    });

    it('deve retornar true dentro da margem de 5 minutos depois', () => {
      // Arrange
      const agora = new Date('2024-06-01 08:04:00'); // 4 minutos depois
      jest.setSystemTime(agora);
      
      const lembrete = new Lembrete({
        id_paciente: 1,
        id_prescricao: 1,
        id_medicamento: 1,
        horario: '08:00',
        data_inicio: '2024-01-01',
        data_fim: '2024-12-31',
        canal_envio: 'email',
        enviado: false,
        status: true
      });

      // Act
      const resultado = lembrete.precisaEnviarAgora();

      // Assert
      expect(resultado).toBe(true);
    });

    it('deve retornar false fora da margem de 5 minutos', () => {
      // Arrange
      const agora = new Date('2024-06-01 08:06:00'); // 6 minutos depois
      jest.setSystemTime(agora);
      
      const lembrete = new Lembrete({
        id_paciente: 1,
        id_prescricao: 1,
        id_medicamento: 1,
        horario: '08:00',
        data_inicio: '2024-01-01',
        data_fim: '2024-12-31',
        canal_envio: 'email',
        enviado: false,
        status: true
      });

      // Act
      const resultado = lembrete.precisaEnviarAgora();

      // Assert
      expect(resultado).toBe(false);
    });

    it('deve lidar com horário com minutos zero', () => {
      // Arrange
      const agora = new Date('2024-06-01 14:00:00');
      jest.setSystemTime(agora);
      
      const lembrete = new Lembrete({
        id_paciente: 1,
        id_prescricao: 1,
        id_medicamento: 1,
        horario: '14:00',
        data_inicio: '2024-01-01',
        data_fim: '2024-12-31',
        canal_envio: 'email',
        enviado: false,
        status: true
      });

      // Act
      const resultado = lembrete.precisaEnviarAgora();

      // Assert
      expect(resultado).toBe(true);
    });

    it('deve lidar com horário com minutos diferentes de zero', () => {
      // Arrange
      const agora = new Date('2024-06-01 14:30:00');
      jest.setSystemTime(agora);
      
      const lembrete = new Lembrete({
        id_paciente: 1,
        id_prescricao: 1,
        id_medicamento: 1,
        horario: '14:30',
        data_inicio: '2024-01-01',
        data_fim: '2024-12-31',
        canal_envio: 'email',
        enviado: false,
        status: true
      });

      // Act
      const resultado = lembrete.precisaEnviarAgora();

      // Assert
      expect(resultado).toBe(true);
    });
  });

  // Teste do método marcarComoEnviado
  describe('marcarComoEnviado', () => {
    it('deve marcar como enviado e retornar a instância', () => {
      // Arrange
      const lembrete = new Lembrete({
        id_paciente: 1,
        id_prescricao: 1,
        id_medicamento: 1,
        horario: '08:00',
        data_inicio: '2024-01-01',
        data_fim: '2024-12-31',
        canal_envio: 'email',
        enviado: false
      });

      // Act
      const resultado = lembrete.marcarComoEnviado();

      // Assert
      expect(lembrete.enviado).toBe(true);
      expect(resultado).toBe(lembrete);
    });

    it('deve manter como enviado se já estiver enviado', () => {
      // Arrange
      const lembrete = new Lembrete({
        id_paciente: 1,
        id_prescricao: 1,
        id_medicamento: 1,
        horario: '08:00',
        data_inicio: '2024-01-01',
        data_fim: '2024-12-31',
        canal_envio: 'email',
        enviado: true
      });

      // Act
      const resultado = lembrete.marcarComoEnviado();

      // Assert
      expect(lembrete.enviado).toBe(true);
      expect(resultado).toBe(lembrete);
    });
  });

  // Teste do método setStatus
  describe('setStatus', () => {
    it('deve atualizar status e retornar a instância', () => {
      // Arrange
      const lembrete = new Lembrete({
        id_paciente: 1,
        id_prescricao: 1,
        id_medicamento: 1,
        horario: '08:00',
        data_inicio: '2024-01-01',
        data_fim: '2024-12-31',
        canal_envio: 'email',
        status: true
      });

      // Act
      const resultado = lembrete.setStatus(false);

      // Assert
      expect(lembrete.status).toBe(false);
      expect(resultado).toBe(lembrete);
    });

    it('deve permitir ativar lembrete', () => {
      // Arrange
      const lembrete = new Lembrete({
        id_paciente: 1,
        id_prescricao: 1,
        id_medicamento: 1,
        horario: '08:00',
        data_inicio: '2024-01-01',
        data_fim: '2024-12-31',
        canal_envio: 'email',
        status: false
      });

      // Act
      lembrete.setStatus(true);

      // Assert
      expect(lembrete.status).toBe(true);
    });
  });

  // Teste do método isValid
  describe('isValid', () => {
    it('deve retornar true para dados válidos', () => {
      // Arrange
      const lembrete = new Lembrete({
        id_paciente: 1,
        id_prescricao: 1,
        id_medicamento: 1,
        horario: '08:00',
        data_inicio: '2024-01-01',
        data_fim: '2024-12-31',
        canal_envio: 'email'
      });

      // Act
      const resultado = lembrete.isValid();

      // Assert
      expect(resultado).toBe(true);
    });

    it('deve retornar false quando id_paciente está faltando', () => {
      // Arrange
      const lembrete = new Lembrete({
        id_prescricao: 1,
        id_medicamento: 1,
        horario: '08:00',
        data_inicio: '2024-01-01',
        data_fim: '2024-12-31',
        canal_envio: 'email'
      });

      // Act
      const resultado = lembrete.isValid();

      // Assert
      expect(resultado).toBe(false);
    });

    it('deve retornar false quando id_prescricao está faltando', () => {
      // Arrange
      const lembrete = new Lembrete({
        id_paciente: 1,
        id_medicamento: 1,
        horario: '08:00',
        data_inicio: '2024-01-01',
        data_fim: '2024-12-31',
        canal_envio: 'email'
      });

      // Act
      const resultado = lembrete.isValid();

      // Assert
      expect(resultado).toBe(false);
    });

    it('deve retornar false quando id_medicamento está faltando', () => {
      // Arrange
      const lembrete = new Lembrete({
        id_paciente: 1,
        id_prescricao: 1,
        horario: '08:00',
        data_inicio: '2024-01-01',
        data_fim: '2024-12-31',
        canal_envio: 'email'
      });

      // Act
      const resultado = lembrete.isValid();

      // Assert
      expect(resultado).toBe(false);
    });

    it('deve retornar false quando horario está faltando', () => {
      // Arrange
      const lembrete = new Lembrete({
        id_paciente: 1,
        id_prescricao: 1,
        id_medicamento: 1,
        data_inicio: '2024-01-01',
        data_fim: '2024-12-31',
        canal_envio: 'email'
      });

      // Act
      const resultado = lembrete.isValid();

      // Assert
      expect(resultado).toBe(false);
    });

    it('deve retornar false quando data_inicio está faltando', () => {
      // Arrange
      const lembrete = new Lembrete({
        id_paciente: 1,
        id_prescricao: 1,
        id_medicamento: 1,
        horario: '08:00',
        data_fim: '2024-12-31',
        canal_envio: 'email'
      });

      // Act
      const resultado = lembrete.isValid();

      // Assert
      expect(resultado).toBe(false);
    });

    it('deve retornar false quando data_fim está faltando', () => {
      // Arrange
      const lembrete = new Lembrete({
        id_paciente: 1,
        id_prescricao: 1,
        id_medicamento: 1,
        horario: '08:00',
        data_inicio: '2024-01-01',
        canal_envio: 'email'
      });

      // Act
      const resultado = lembrete.isValid();

      // Assert
      expect(resultado).toBe(false);
    });

    it('deve retornar false quando canal_envio está faltando', () => {
      // Arrange
      const lembrete = new Lembrete({
        id_paciente: 1,
        id_prescricao: 1,
        id_medicamento: 1,
        horario: '08:00',
        data_inicio: '2024-01-01',
        data_fim: '2024-12-31'
      });

      // Act
      const resultado = lembrete.isValid();

      // Assert
      expect(resultado).toBe(false);
    });

    it('deve retornar false quando data_inicio é depois de data_fim', () => {
      // Arrange
      const lembrete = new Lembrete({
        id_paciente: 1,
        id_prescricao: 1,
        id_medicamento: 1,
        horario: '08:00',
        data_inicio: '2024-12-31',
        data_fim: '2024-01-01',
        canal_envio: 'email'
      });

      // Act
      const resultado = lembrete.isValid();

      // Assert
      expect(resultado).toBe(false);
    });

    it('deve retornar true quando data_inicio é igual a data_fim', () => {
      // Arrange
      const lembrete = new Lembrete({
        id_paciente: 1,
        id_prescricao: 1,
        id_medicamento: 1,
        horario: '08:00',
        data_inicio: '2024-01-01',
        data_fim: '2024-01-01',
        canal_envio: 'email'
      });

      // Act
      const resultado = lembrete.isValid();

      // Assert
      expect(resultado).toBe(true);
    });
  });

  // Teste do método isCanalEnvioValido
  describe('isCanalEnvioValido', () => {
    it('deve retornar true para email', () => {
      // Arrange
      const lembrete = new Lembrete({
        id_paciente: 1,
        id_prescricao: 1,
        id_medicamento: 1,
        horario: '08:00',
        data_inicio: '2024-01-01',
        data_fim: '2024-12-31',
        canal_envio: 'email'
      });

      // Act
      const resultado = lembrete.isCanalEnvioValido();

      // Assert
      expect(resultado).toBe(true);
    });

    it('deve retornar true para sms', () => {
      // Arrange
      const lembrete = new Lembrete({
        id_paciente: 1,
        id_prescricao: 1,
        id_medicamento: 1,
        horario: '08:00',
        data_inicio: '2024-01-01',
        data_fim: '2024-12-31',
        canal_envio: 'sms'
      });

      // Act
      const resultado = lembrete.isCanalEnvioValido();

      // Assert
      expect(resultado).toBe(true);
    });

    it('deve retornar true para push', () => {
      // Arrange
      const lembrete = new Lembrete({
        id_paciente: 1,
        id_prescricao: 1,
        id_medicamento: 1,
        horario: '08:00',
        data_inicio: '2024-01-01',
        data_fim: '2024-12-31',
        canal_envio: 'push'
      });

      // Act
      const resultado = lembrete.isCanalEnvioValido();

      // Assert
      expect(resultado).toBe(true);
    });

    it('deve retornar true para whatsapp', () => {
      // Arrange
      const lembrete = new Lembrete({
        id_paciente: 1,
        id_prescricao: 1,
        id_medicamento: 1,
        horario: '08:00',
        data_inicio: '2024-01-01',
        data_fim: '2024-12-31',
        canal_envio: 'whatsapp'
      });

      // Act
      const resultado = lembrete.isCanalEnvioValido();

      // Assert
      expect(resultado).toBe(true);
    });

    it('deve retornar true para canal em maiúsculas', () => {
      // Arrange
      const lembrete = new Lembrete({
        id_paciente: 1,
        id_prescricao: 1,
        id_medicamento: 1,
        horario: '08:00',
        data_inicio: '2024-01-01',
        data_fim: '2024-12-31',
        canal_envio: 'EMAIL'
      });

      // Act
      const resultado = lembrete.isCanalEnvioValido();

      // Assert
      expect(resultado).toBe(true);
    });

    it('deve retornar false para canal inválido', () => {
      // Arrange
      const lembrete = new Lembrete({
        id_paciente: 1,
        id_prescricao: 1,
        id_medicamento: 1,
        horario: '08:00',
        data_inicio: '2024-01-01',
        data_fim: '2024-12-31',
        canal_envio: 'telegram'
      });

      // Act
      const resultado = lembrete.isCanalEnvioValido();

      // Assert
      expect(resultado).toBe(false);
    });

    it('deve retornar false para string vazia', () => {
      // Arrange
      const lembrete = new Lembrete({
        id_paciente: 1,
        id_prescricao: 1,
        id_medicamento: 1,
        horario: '08:00',
        data_inicio: '2024-01-01',
        data_fim: '2024-12-31',
        canal_envio: ''
      });

      // Act
      const resultado = lembrete.isCanalEnvioValido();

      // Assert
      expect(resultado).toBe(false);
    });
  });
});