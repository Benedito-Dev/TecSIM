// Protocolos de triagem
export const protocolosTriagem = {
  dor_cabeca: {
    nome: "Cefaleia (Dor de Cabeça)",
    sintoma: "dor de cabeça",
    perguntas: [
      {
        id: 1,
        pergunta: "Há quanto tempo você está com essa dor?",
        tipo: "tempo",
        opcoes: ["Menos de 1 hora", "1-24 horas", "1-3 dias", "Mais de 3 dias"]
      },
      {
        id: 2,
        pergunta: "Em uma escala de 0 a 10, quão forte é sua dor?",
        tipo: "intensidade",
        opcoes: ["0-3 (Leve)", "4-6 (Moderada)", "7-8 (Forte)", "9-10 (Muito Forte)"]
      },
      {
        id: 3,
        pergunta: "A dor começou de repente e é a pior da sua vida?",
        tipo: "critico",
        opcoes: ["Sim", "Não"]
      },
      {
        id: 4,
        pergunta: "Está com febre, visão turva ou dificuldade para falar?",
        tipo: "critico",
        opcoes: ["Sim", "Não"]
      }
    ]
  },
  problemas_respiratorios: {
    nome: "Problemas Respiratórios",
    sintoma: "dificuldade para respirar",
    perguntas: [
      {
        id: 1,
        pergunta: "Você está com falta de ar em repouso?",
        tipo: "critico",
        opcoes: ["Sim", "Não"]
      },
      {
        id: 2,
        pergunta: "Seus lábios ou unhas estão azulados?",
        tipo: "critico", 
        opcoes: ["Sim", "Não"]
      },
      {
        id: 3,
        pergunta: "Há quanto tempo está com essa dificuldade?",
        tipo: "tempo",
        opcoes: ["Minutos", "Horas", "Dias"]
      }
    ]
  },
  dor_abdominal: {
    nome: "Dor Abdominal",
    sintoma: "dor na barriga",
    perguntas: [
      {
        id: 1,
        pergunta: "A dor é muito forte e constante?",
        tipo: "critico",
        opcoes: ["Sim", "Não"]
      },
      {
        id: 2,
        pergunta: "Está com vômitos ou febre?",
        tipo: "critico",
        opcoes: ["Sim", "Não"]
      }
    ]
  },
  febre: {
    nome: "Febre",
    sintoma: "febre",
    perguntas: [
      {
        id: 1,
        pergunta: "Qual é sua temperatura?",
        tipo: "intensidade",
        opcoes: ["Até 38°C", "38-39°C", "Acima de 39°C"]
      },
      {
        id: 2,
        pergunta: "Há quanto tempo está com febre?",
        tipo: "tempo",
        opcoes: ["Menos de 24h", "1-3 dias", "Mais de 3 dias"]
      }
    ]
  }
};