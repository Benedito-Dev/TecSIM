// Dados mockados para sistema de adesão ao tratamento
export const mockAdesaoData = {
  // Histórico de compras por paciente
  historicoCompras: {
    1: [
      {
        id: 1,
        loja: "Fortaleza Centro",
        medicamentos: [
          { nome: "Losartana 50mg", quantidade: 30, diasTratamento: 30 },
          { nome: "Hidroclorotiazida 25mg", quantidade: 30, diasTratamento: 30 }
        ],
        dataCompra: "2024-12-05",
        valorTotal: 45.80,
        farmaceutico: "Ana Silva"
      }
    ],
    2: [
      {
        id: 3,
        loja: "Sobral Norte",
        medicamentos: [
          { nome: "Metformina 850mg", quantidade: 60, diasTratamento: 30 }
        ],
        dataCompra: "2024-12-10",
        valorTotal: 52.40,
        farmaceutico: "Maria Oliveira"
      }
    ]
  },

  // Status de adesão por paciente
  statusAdesao: {
    1: {
      medicamentos: [
        {
          nome: "Losartana 50mg",
          frequencia: "1x ao dia",
          ultimaCompra: "2024-12-05",
          diasRestantes: 8,
          statusAdesao: "regular",
          alertas: 0
        }
      ],
      scoreAdesao: 92,
      risco: "baixo"
    },
    2: {
      medicamentos: [
        {
          nome: "Metformina 850mg",
          frequencia: "2x ao dia",
          ultimaCompra: "2024-12-10",
          diasRestantes: 13,
          statusAdesao: "irregular",
          alertas: 1
        }
      ],
      scoreAdesao: 78,
      risco: "medio"
    }
  },

  // Estatísticas gerais
  estatisticas: {
    totalPacientes: 150,
    pacientesComAdesaoRegular: 118,
    pacientesRiscoMedio: 24,
    pacientesRiscoAlto: 8,
    taxaSucessoIntervencao: 84.2
  }
};

// Função para calcular dias desde última compra
export const calcularDiasUltimaCompra = (dataCompra) => {
  const hoje = new Date();
  const compra = new Date(dataCompra);
  const diffTime = Math.abs(hoje - compra);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Função para gerar contexto para farmacêutico
export const gerarContextoFarmaceutico = (pacienteId) => {
  const historico = mockAdesaoData.historicoCompras[pacienteId] || [];
  const adesao = mockAdesaoData.statusAdesao[pacienteId];
  
  if (!adesao) return null;
  
  const ultimaCompra = historico[0];
  const diasUltimaCompra = ultimaCompra ? calcularDiasUltimaCompra(ultimaCompra.dataCompra) : 0;
  
  return {
    ultimaCompra,
    diasUltimaCompra,
    scoreAdesao: adesao.scoreAdesao,
    risco: adesao.risco,
    medicamentosAtivos: adesao.medicamentos
  };
};