class Lembrete {
  constructor({
    id_lembrete,
    id_paciente,
    id_prescricao,
    id_medicamento,
    horario,
    data_inicio,
    data_fim,
    canal_envio,
    enviado = false,
    status = true
  }) {
    this.id_lembrete = id_lembrete;
    this.id_paciente = id_paciente;
    this.id_prescricao = id_prescricao;
    this.id_medicamento = id_medicamento;
    this.horario = horario;
    this.data_inicio = data_inicio;
    this.data_fim = data_fim;
    this.canal_envio = canal_envio;
    this.enviado = enviado;
    this.status = status;
  }

  // Método para serialização básica
  toJSON() {
    return {
      id_lembrete: this.id_lembrete,
      id_paciente: this.id_paciente,
      id_prescricao: this.id_prescricao,
      id_medicamento: this.id_medicamento,
      horario: this.horario,
      data_inicio: this.data_inicio,
      data_fim: this.data_fim,
      canal_envio: this.canal_envio,
      enviado: this.enviado,
      status: this.status
    };
  }

  // Método para verificar se o lembrete está ativo
  isAtivo() {
    const now = new Date();
    const inicio = new Date(this.data_inicio);
    const fim = new Date(this.data_fim);
    
    return now >= inicio && now <= fim && this.status === true;
  }

  // Método para verificar se precisa ser enviado agora
  precisaEnviarAgora() {
    if (this.enviado || !this.isAtivo()) {
      return false;
    }

    const now = new Date();
    const horarioLembrete = new Date();
    const [horas, minutos] = this.horario.split(':');
    
    horarioLembrete.setHours(parseInt(horas), parseInt(minutos), 0, 0);

    // Considera uma margem de 5 minutos para envio
    const diff = Math.abs(now - horarioLembrete);
    return diff <= 5 * 60 * 1000; // 5 minutos em milissegundos
  }

  // Método para marcar como enviado
  marcarComoEnviado() {
    this.enviado = true;
    return this;
  }

  // Método para ativar/desativar lembrete
  setStatus(novoStatus) {
    this.status = novoStatus;
    return this;
  }

  // Método para validar dados do lembrete
  isValid() {
    // Verificar campos obrigatórios
    const camposObrigatorios = [
      'id_paciente',
      'id_prescricao', 
      'id_medicamento',
      'horario',
      'data_inicio',
      'data_fim',
      'canal_envio'
    ];

    for (const campo of camposObrigatorios) {
      if (this[campo] === undefined || this[campo] === null || this[campo] === '') {
        return false;
      }
    }

    // Verificar se data_inicio não é depois de data_fim
    if (new Date(this.data_inicio) > new Date(this.data_fim)) {
      return false;
    }

    // Verificar se o canal de envio é válido
    if (!this.isCanalEnvioValido()) {
      return false;
    }

    return true;
  }

  // Método para verificar canal de envio válido
  isCanalEnvioValido() {
    const canaisValidos = ['email', 'sms', 'push', 'whatsapp'];
    return canaisValidos.includes(this.canal_envio.toLowerCase());
  }
}

module.exports = Lembrete;