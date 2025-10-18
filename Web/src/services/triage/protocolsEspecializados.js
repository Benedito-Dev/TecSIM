// Protocolos especializados por condição médica
export const protocolosEspecializados = {
  // Dor de cabeça para hipertensos
  "cefaleia (dor de cabeça)_hipertensao": {
    nome: "Cefaleia - Paciente Hipertenso",
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
        pergunta: "Verificou sua pressão arterial recentemente?",
        tipo: "critico",
        opcoes: ["Sim, estava normal", "Sim, estava alta", "Não verifiquei"]
      },
      {
        id: 4,
        pergunta: "Está tomando regularmente os medicamentos para pressão?",
        tipo: "medicamento",
        opcoes: ["Sim, todos os dias", "Às vezes esqueço", "Não estou tomando"]
      },
      {
        id: 5,
        pergunta: "Sente palpitações, tontura ou visão turva junto com a dor?",
        tipo: "critico",
        opcoes: ["Sim", "Não"]
      }
    ]
  },

  // Dor de cabeça para diabéticos
  "cefaleia (dor de cabeça)_diabetes": {
    nome: "Cefaleia - Paciente Diabético",
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
        pergunta: "Verificou sua glicemia (açúcar no sangue) hoje?",
        tipo: "critico",
        opcoes: ["Sim, estava normal", "Sim, estava alta", "Sim, estava baixa", "Não verifiquei"]
      },
      {
        id: 4,
        pergunta: "Está se alimentando normalmente?",
        tipo: "medicamento",
        opcoes: ["Sim, normalmente", "Pouco apetite", "Não consegui comer"]
      },
      {
        id: 5,
        pergunta: "Sente fraqueza, tremores ou suor excessivo?",
        tipo: "critico",
        opcoes: ["Sim", "Não"]
      }
    ]
  },

  // Problemas respiratórios para asmáticos
  "problemas respiratórios_asma": {
    nome: "Problemas Respiratórios - Paciente Asmático",
    perguntas: [
      {
        id: 1,
        pergunta: "Está com falta de ar em repouso?",
        tipo: "critico",
        opcoes: ["Sim", "Não"]
      },
      {
        id: 2,
        pergunta: "Usou a bombinha (broncodilatador) hoje?",
        tipo: "medicamento",
        opcoes: ["Sim, melhorou", "Sim, não melhorou", "Não usei", "Não tenho"]
      },
      {
        id: 3,
        pergunta: "Quantas vezes precisou usar a bombinha nas últimas 24h?",
        tipo: "intensidade",
        opcoes: ["Nenhuma", "1-2 vezes", "3-4 vezes", "Mais de 4 vezes"]
      },
      {
        id: 4,
        pergunta: "Está com chiado no peito ou tosse seca?",
        tipo: "critico",
        opcoes: ["Sim", "Não"]
      },
      {
        id: 5,
        pergunta: "Teve contato com algum gatilho conhecido (poeira, perfume, etc.)?",
        tipo: "tempo",
        opcoes: ["Sim", "Não", "Não sei"]
      }
    ]
  },

  // Febre para cardíacos
  "febre_cardiaco": {
    nome: "Febre - Paciente Cardíaco",
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
      },
      {
        id: 3,
        pergunta: "Sente palpitações ou batimentos irregulares?",
        tipo: "critico",
        opcoes: ["Sim", "Não"]
      },
      {
        id: 4,
        pergunta: "Está tomando os medicamentos para o coração normalmente?",
        tipo: "medicamento",
        opcoes: ["Sim, todos", "Esqueci alguns", "Parei de tomar"]
      },
      {
        id: 5,
        pergunta: "Sente dor no peito ou falta de ar junto com a febre?",
        tipo: "critico",
        opcoes: ["Sim", "Não"]
      }
    ]
  }
};