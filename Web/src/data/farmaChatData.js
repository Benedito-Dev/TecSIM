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
      risco: "medio"
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
      risco: "baixo"
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
          statusAdesao: "regular"
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
      observacoes: "Paciente aderente ao tratamento. Controle pressórico adequado.",
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
          statusAdesao: "irregular"
        }
      ],
      observacoes: "Paciente relatou esquecimento ocasional. Orientar sobre importância da adesão.",
      proximaConsulta: "2025-01-20"
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
        observacoes: "Paciente aderente. PA controlada. Orientado sobre horários.",
        medicamentosDispensados: ["Losartana 50mg", "Metformina 850mg"],
        proximoRetorno: "2024-12-30"
      },
      {
        id: "ATD-002",
        data: "2024-12-05",
        loja: "Pague Menos Fortaleza Centro",
        farmaceutico: "Ana Silva",
        tipo: "Dispensação + Orientação",
        observacoes: "Primeira dispensação do protocolo. Orientações sobre posologia.",
        medicamentosDispensados: ["Losartana 50mg", "Metformina 850mg"],
        proximoRetorno: "2024-12-15"
      }
    ],
    2: [
      {
        id: "ATD-003",
        data: "2024-12-10",
        loja: "Pague Menos Sobral Norte",
        farmaceutico: "Carlos Mendes",
        tipo: "Alerta de Adesão",
        observacoes: "Paciente atrasou compra em 5 dias. Orientado sobre regularidade.",
        medicamentosDispensados: ["Enalapril 10mg"],
        proximoRetorno: "2024-12-25"
      }
    ]
  },

  // Alertas do sistema
  alertas: [
    {
      id: "ALT-001",
      pacienteId: 1,
      tipo: "proximaCompra",
      prioridade: "media",
      mensagem: "João Silva - Medicamentos acabam em 5 dias",
      dataAlerta: "2024-12-15",
      status: "ativo"
    },
    {
      id: "ALT-002",
      pacienteId: 2,
      tipo: "adesaoIrregular",
      prioridade: "alta",
      mensagem: "Maria Oliveira - Padrão irregular de compras detectado",
      dataAlerta: "2024-12-10",
      status: "ativo"
    }
  ],

  // Estatísticas da rede
  estatisticas: {
    totalPacientesProtocolo: 1247,
    pacientesAderentesRegulares: 1058,
    pacientesRiscoMedio: 142,
    pacientesRiscoAlto: 47,
    taxaAdesaoGeral: 84.8,
    economiaGeradaSUS: "R$ 2.4M",
    lojasMaisEficazes: [
      { nome: "Fortaleza Centro", score: 92.3 },
      { nome: "Sobral Norte", score: 89.7 },
      { nome: "Caucaia Shopping", score: 87.1 }
    ]
  },

  // Farmacêuticos da rede
  farmaceuticos: {
    1: {
      id: 1,
      nome: "Ana Silva",
      crf: "CE-12345",
      loja: "Pague Menos Fortaleza Centro",
      pacientesAtivos: 45,
      scoreAdesao: 92.3,
      especialidade: "Cuidado Farmacêutico"
    },
    2: {
      id: 2,
      nome: "Carlos Mendes",
      crf: "CE-67890",
      loja: "Pague Menos Sobral Norte",
      pacientesAtivos: 38,
      scoreAdesao: 89.7,
      especialidade: "Atenção Farmacêutica"
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
  const medicamentosIrregulares = protocolo.medicamentos.filter(med => med.statusAdesao === "irregular");
  
  return {
    paciente: {
      nome: paciente.nome,
      idade: paciente.idade,
      condicoes: paciente.condicoesCronicas,
      risco: paciente.risco
    },
    protocolo: {
      diagnostico: protocolo.diagnosticoMedico,
      medico: protocolo.medicoPrescricao,
      status: protocolo.status
    },
    alertas: {
      medicamentosVencendo,
      medicamentosIrregulares,
      ultimoAtendimento: historico[0]?.data,
      diasUltimoAtendimento: calcularDiasUltimoAtendimento(historico[0]?.data)
    },
    sugestaoIA: gerarSugestaoIA(paciente, protocolo, medicamentosVencendo, medicamentosIrregulares)
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
const gerarSugestaoIA = (paciente, protocolo, medicamentosVencendo, medicamentosIrregulares) => {
  let sugestao = `${paciente.nome} está no protocolo há ${calcularDiasProtocolo(protocolo.dataInicio)} dias. `;
  
  if (medicamentosVencendo.length > 0) {
    sugestao += `⚠️ ATENÇÃO: ${medicamentosVencendo.length} medicamento(s) acabam em breve. `;
    sugestao += `Verifique se o paciente já programou a compra. `;
  }
  
  if (medicamentosIrregulares.length > 0) {
    sugestao += `🔍 ADESÃO: Padrão irregular detectado em ${medicamentosIrregulares[0].nome}. `;
    sugestao += `Investigue possíveis barreiras (financeira, esquecimento, efeitos adversos). `;
  }
  
  if (paciente.risco === "medio") {
    sugestao += `📊 RISCO MÉDIO: Reforce orientações sobre horários e importância do tratamento contínuo.`;
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