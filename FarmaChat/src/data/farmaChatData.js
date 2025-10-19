// Dados mockados para FarmaChat - Pague Menos
export const farmaChatData = {
  // Pacientes com histórico completo
  pacientes: {
    1: {
      id: 1,
      nome: "João Silva Santos",
      cpf: "123.456.789-00",
      idade: 67,
      telefone: "(85) 99999-1234",
      endereco: "Fortaleza, CE",
      condicoesCronicas: ["Hipertensão", "Diabetes Tipo 2"],
      alergias: ["Penicilina"],
      ultimoAtendimento: "2024-12-15",
      farmaceuticoResponsavel: "Ana Silva",
      lojaVinculada: "Pague Menos Fortaleza Centro",
      statusProtocolo: "ativo",
      risco: "medio",
      scoreAdesao: 78
    },
    2: {
      id: 2,
      nome: "Maria Oliveira Costa",
      cpf: "987.654.321-00",
      idade: 45,
      telefone: "(85) 98888-5678",
      endereco: "Sobral, CE",
      condicoesCronicas: ["Hipertensão"],
      alergias: [],
      ultimoAtendimento: "2024-12-10",
      farmaceuticoResponsavel: "Carlos Mendes",
      lojaVinculada: "Pague Menos Sobral Norte",
      statusProtocolo: "ativo",
      risco: "baixo",
      scoreAdesao: 92
    },
    3: {
      id: 3,
      nome: "Pedro Almeida",
      cpf: "456.789.123-00",
      idade: 58,
      telefone: "(85) 97777-9999",
      endereco: "Caucaia, CE",
      condicoesCronicas: ["Diabetes Tipo 2", "Colesterol Alto"],
      alergias: ["Sulfa"],
      ultimoAtendimento: "2024-12-12",
      farmaceuticoResponsavel: "Lucia Santos",
      lojaVinculada: "Pague Menos Caucaia Shopping",
      statusProtocolo: "ativo",
      risco: "alto",
      scoreAdesao: 65
    }
  },

  // Protocolos ativos por paciente
  protocolos: {
    1: {
      id: "PROT-001",
      pacienteId: 1,
      diagnosticoMedico: "Hipertensão Arterial + Diabetes Mellitus Tipo 2",
      medicoPrescricao: "Dr. Roberto Cardoso - CRM 12345",
      dataInicio: "2024-11-01",
      status: "ativo",
      medicamentos: [
        {
          nome: "Losartana Potássica 50mg",
          posologia: "1 comprimido pela manhã",
          duracaoTratamento: "Uso contínuo",
          ultimaCompra: "2024-12-05",
          proximaCompra: "2024-12-20",
          diasRestantes: 5,
          statusAdesao: "irregular"
        },
        {
          nome: "Metformina 850mg",
          posologia: "1 comprimido 2x ao dia",
          duracaoTratamento: "Uso contínuo",
          ultimaCompra: "2024-12-05",
          proximaCompra: "2024-12-20",
          diasRestantes: 5,
          statusAdesao: "regular"
        }
      ],
      observacoes: "Paciente com adesão irregular à Losartana. Necessita reforço de orientações.",
      proximaConsulta: "2025-01-15"
    },
    2: {
      id: "PROT-002",
      pacienteId: 2,
      diagnosticoMedico: "Hipertensão Arterial Sistêmica",
      medicoPrescricao: "Dra. Fernanda Lima - CRM 67890",
      dataInicio: "2024-10-15",
      status: "ativo",
      medicamentos: [
        {
          nome: "Enalapril 10mg",
          posologia: "1 comprimido 2x ao dia",
          duracaoTratamento: "Uso contínuo",
          ultimaCompra: "2024-12-10",
          proximaCompra: "2024-12-25",
          diasRestantes: 10,
          statusAdesao: "regular"
        }
      ],
      observacoes: "Paciente aderente ao tratamento. Controle pressórico adequado.",
      proximaConsulta: "2025-01-20"
    },
    3: {
      id: "PROT-003",
      pacienteId: 3,
      diagnosticoMedico: "Diabetes Mellitus Tipo 2 + Dislipidemia",
      medicoPrescricao: "Dr. Carlos Pereira - CRM 54321",
      dataInicio: "2024-09-20",
      status: "ativo",
      medicamentos: [
        {
          nome: "Metformina 850mg",
          posologia: "1 comprimido 2x ao dia",
          duracaoTratamento: "Uso contínuo",
          ultimaCompra: "2024-11-28",
          proximaCompra: "2024-12-18",
          diasRestantes: 3,
          statusAdesao: "irregular"
        },
        {
          nome: "Sinvastatina 20mg",
          posologia: "1 comprimido à noite",
          duracaoTratamento: "Uso contínuo",
          ultimaCompra: "2024-11-25",
          proximaCompra: "2024-12-15",
          diasRestantes: 0,
          statusAdesao: "crítico"
        }
      ],
      observacoes: "URGENTE: Paciente sem medicamentos há 2 dias. Necessita intervenção imediata.",
      proximaConsulta: "2025-01-10"
    }
  },

  // Histórico de atendimentos
  historicoAtendimentos: {
    1: [
      {
        id: "ATD-001",
        data: "2024-12-15",
        loja: "Pague Menos Fortaleza Centro",
        farmaceutico: "Ana Silva",
        tipo: "Acompanhamento Protocolo",
        observacoes: "Orientado sobre importância da adesão à Losartana. Paciente relatou esquecimentos.",
        medicamentosDispensados: ["Losartana 50mg", "Metformina 850mg"],
        proximoRetorno: "2024-12-30"
      }
    ],
    2: [
      {
        id: "ATD-002",
        data: "2024-12-10",
        loja: "Pague Menos Sobral Norte",
        farmaceutico: "Carlos Mendes",
        tipo: "Dispensação Regular",
        observacoes: "Paciente aderente. PA controlada em 130x80mmHg.",
        medicamentosDispensados: ["Enalapril 10mg"],
        proximoRetorno: "2024-12-25"
      }
    ],
    3: [
      {
        id: "ATD-003",
        data: "2024-12-12",
        loja: "Pague Menos Caucaia Shopping",
        farmaceutico: "Lucia Santos",
        tipo: "Alerta Crítico",
        observacoes: "Paciente sem medicamentos. Orientado sobre riscos. Agendado retorno urgente.",
        medicamentosDispensados: [],
        proximoRetorno: "2024-12-16"
      }
    ]
  },

  // Alertas do sistema
  alertas: [
    {
      id: "ALT-001",
      pacienteId: 3,
      tipo: "critico",
      prioridade: "alta",
      mensagem: "Pedro Almeida - SEM MEDICAMENTOS há 2 dias! Intervenção urgente necessária",
      dataAlerta: "2024-12-15",
      status: "ativo"
    },
    {
      id: "ALT-002",
      pacienteId: 1,
      tipo: "adesaoIrregular",
      prioridade: "media",
      mensagem: "João Silva - Padrão irregular na Losartana. Score de adesão: 78%",
      dataAlerta: "2024-12-15",
      status: "ativo"
    },
    {
      id: "ALT-003",
      pacienteId: 1,
      tipo: "proximaCompra",
      prioridade: "media",
      mensagem: "João Silva - Medicamentos acabam em 5 dias",
      dataAlerta: "2024-12-15",
      status: "ativo"
    }
  ],

  // Estatísticas da rede
  estatisticas: {
    totalPacientesProtocolo: 2847,
    pacientesAderentesRegulares: 2398,
    pacientesRiscoMedio: 312,
    pacientesRiscoAlto: 137,
    taxaAdesaoGeral: 84.2,
    economiaGeradaSUS: "R$ 4.7M",
    intervencoesMes: 1247,
    sucessoIntervencoes: 89.3,
    lojasMaisEficazes: [
      { nome: "Fortaleza Centro", score: 94.2, pacientes: 156 },
      { nome: "Sobral Norte", score: 91.8, pacientes: 134 },
      { nome: "Caucaia Shopping", score: 89.5, pacientes: 142 },
      { nome: "Maracanaú Sul", score: 87.3, pacientes: 128 }
    ]
  },

  // Farmacêuticos da rede
  farmaceuticos: {
    1: {
      id: 1,
      nome: "Ana Silva",
      crf: "CE-12345",
      loja: "Pague Menos Fortaleza Centro",
      pacientesAtivos: 67,
      scoreAdesao: 94.2,
      especialidade: "Cuidado Farmacêutico",
      intervencoesMes: 89
    },
    2: {
      id: 2,
      nome: "Carlos Mendes",
      crf: "CE-67890",
      loja: "Pague Menos Sobral Norte",
      pacientesAtivos: 54,
      scoreAdesao: 91.8,
      especialidade: "Atenção Farmacêutica",
      intervencoesMes: 76
    },
    3: {
      id: 3,
      nome: "Lucia Santos",
      crf: "CE-54321",
      loja: "Pague Menos Caucaia Shopping",
      pacientesAtivos: 61,
      scoreAdesao: 89.5,
      especialidade: "Farmácia Clínica",
      intervencoesMes: 82
    }
  }
};

// Função para gerar contexto inteligente para o farmacêutico
export const gerarContextoIA = (pacienteId) => {
  const paciente = farmaChatData.pacientes[pacienteId];
  const protocolo = farmaChatData.protocolos[pacienteId];
  const historico = farmaChatData.historicoAtendimentos[pacienteId] || [];
  
  if (!paciente || !protocolo) return null;

  const medicamentosVencendo = protocolo.medicamentos.filter(med => med.diasRestantes <= 7);
  const medicamentosCriticos = protocolo.medicamentos.filter(med => med.statusAdesao === "crítico");
  const medicamentosIrregulares = protocolo.medicamentos.filter(med => med.statusAdesao === "irregular");
  
  return {
    paciente: {
      nome: paciente.nome,
      idade: paciente.idade,
      condicoes: paciente.condicoesCronicas,
      risco: paciente.risco,
      scoreAdesao: paciente.scoreAdesao
    },
    protocolo: {
      diagnostico: protocolo.diagnosticoMedico,
      medico: protocolo.medicoPrescricao,
      status: protocolo.status,
      medicamentos: protocolo.medicamentos
    },
    alertas: {
      medicamentosVencendo,
      medicamentosCriticos,
      medicamentosIrregulares,
      ultimoAtendimento: historico[0]?.data,
      diasUltimoAtendimento: calcularDiasUltimoAtendimento(historico[0]?.data)
    },
    sugestaoIA: gerarSugestaoIA(paciente, protocolo, medicamentosVencendo, medicamentosIrregulares, medicamentosCriticos)
  };
};

// Função para calcular dias desde último atendimento
const calcularDiasUltimoAtendimento = (dataAtendimento) => {
  if (!dataAtendimento) return null;
  const hoje = new Date();
  const atendimento = new Date(dataAtendimento);
  const diffTime = Math.abs(hoje - atendimento);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// IA que gera sugestões contextuais
const gerarSugestaoIA = (paciente, protocolo, medicamentosVencendo, medicamentosIrregulares, medicamentosCriticos) => {
  let sugestao = `${paciente.nome} está no protocolo há ${calcularDiasProtocolo(protocolo.dataInicio)} dias. `;
  
  if (medicamentosCriticos.length > 0) {
    sugestao += `🚨 CRÍTICO: Paciente sem ${medicamentosCriticos[0].nome} há ${Math.abs(medicamentosCriticos[0].diasRestantes)} dias! `;
    sugestao += `Contate imediatamente e oriente sobre riscos de interrupção. `;
  }
  
  if (medicamentosVencendo.length > 0) {
    sugestao += `⚠️ ATENÇÃO: ${medicamentosVencendo.length} medicamento(s) acabam em breve. `;
    sugestao += `Verifique se o paciente já programou a compra. `;
  }
  
  if (medicamentosIrregulares.length > 0) {
    sugestao += `🔍 ADESÃO: Padrão irregular detectado em ${medicamentosIrregulares[0].nome}. `;
    sugestao += `Investigue possíveis barreiras (financeira, esquecimento, efeitos adversos). `;
  }
  
  if (paciente.risco === "alto") {
    sugestao += `🔴 RISCO ALTO: Paciente necessita acompanhamento intensivo. Considere contato telefônico.`;
  } else if (paciente.risco === "medio") {
    sugestao += `🟡 RISCO MÉDIO: Reforce orientações sobre horários e importância do tratamento contínuo.`;
  }
  
  return sugestao;
};

// Função auxiliar para calcular dias de protocolo
const calcularDiasProtocolo = (dataInicio) => {
  const hoje = new Date();
  const inicio = new Date(dataInicio);
  const diffTime = Math.abs(hoje - inicio);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};