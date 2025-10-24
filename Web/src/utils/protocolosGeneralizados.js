// Protocolos generalizados para novos usuários
export const protocolosGeneralizados = {
  protocolos: [
    {
      id: 'dor_cabeca',
      nome: 'Protocolo - Dor de Cabeça',
      palavrasChave: ['dor de cabeça', 'cefaleia', 'enxaqueca', 'cabeça doendo', 'dor na cabeça'],
      mensagemInicial: 'Vou te ajudar com orientações sobre dor de cabeça. É importante entender melhor seus sintomas.',
      perguntasIniciais: [
        'Em uma escala de 1 a 10, qual a intensidade da sua dor?',
        'Há quanto tempo você está com essa dor?',
        'A dor é constante ou vem em crises?'
      ],
      especialistasRelacionados: ['neurologista', 'clinico_geral']
    },
    {
      id: 'febre',
      nome: 'Protocolo - Febre',
      palavrasChave: ['febre', 'temperatura alta', 'febril', 'quente', 'calor'],
      mensagemInicial: 'Febre pode indicar várias condições. Vamos avaliar seus sintomas.',
      perguntasIniciais: [
        'Qual sua temperatura atual (se mediu)?',
        'Há quantos dias está com febre?',
        'Tem outros sintomas junto com a febre?'
      ],
      especialistasRelacionados: ['clinico_geral', 'infectologista']
    },
    {
      id: 'dor_garganta',
      nome: 'Protocolo - Dor de Garganta',
      palavrasChave: ['dor de garganta', 'garganta inflamada', 'garganta doendo', 'engolir dói'],
      mensagemInicial: 'Dor de garganta é comum e pode ter várias causas. Vamos investigar.',
      perguntasIniciais: [
        'A dor piora ao engolir?',
        'Há quanto tempo sua garganta está doendo?',
        'Você tem febre junto com a dor?'
      ],
      especialistasRelacionados: ['otorrinolaringologista', 'clinico_geral']
    },
    {
      id: 'dor_estomago',
      nome: 'Protocolo - Dor no Estômago',
      palavrasChave: ['dor no estômago', 'dor abdominal', 'barriga doendo', 'estômago doendo', 'gastrite'],
      mensagemInicial: 'Dores abdominais podem ter várias origens. Vou te ajudar a entender melhor.',
      perguntasIniciais: [
        'Onde exatamente é a dor? (parte superior, inferior, lateral)',
        'A dor tem relação com alimentação?',
        'Você tem náuseas ou vômitos?'
      ],
      especialistasRelacionados: ['gastroenterologista', 'clinico_geral']
    },
    {
      id: 'tosse',
      nome: 'Protocolo - Tosse',
      palavrasChave: ['tosse', 'tossindo', 'pigarro', 'catarro'],
      mensagemInicial: 'A tosse pode ser sintoma de várias condições. Vamos avaliar seu caso.',
      perguntasIniciais: [
        'A tosse é seca ou com catarro?',
        'Há quanto tempo você está tossindo?',
        'A tosse piora em algum período do dia?'
      ],
      especialistasRelacionados: ['pneumologista', 'clinico_geral']
    },
    {
      id: 'ansiedade',
      nome: 'Protocolo - Ansiedade/Estresse',
      palavrasChave: ['ansiedade', 'ansioso', 'estresse', 'nervoso', 'preocupado', 'pânico'],
      mensagemInicial: 'Questões emocionais são importantes para a saúde. Vou te orientar.',
      perguntasIniciais: [
        'Você tem sintomas físicos como palpitações ou falta de ar?',
        'Há situações específicas que aumentam sua ansiedade?',
        'Isso tem afetado seu sono ou apetite?'
      ],
      especialistasRelacionados: ['psiquiatra', 'psicologo', 'clinico_geral']
    }
  ],

  especialistas: {
    neurologista: { 
      nome: 'Neurologista', 
      icone: '🧠', 
      motivo: 'Para dores de cabeça recorrentes ou intensas' 
    },
    clinico_geral: { 
      nome: 'Clínico Geral', 
      icone: '👨‍⚕️', 
      motivo: 'Avaliação inicial e orientação geral' 
    },
    infectologista: { 
      nome: 'Infectologista', 
      icone: '🦠', 
      motivo: 'Para febres persistentes ou infecções' 
    },
    otorrinolaringologista: { 
      nome: 'Otorrinolaringologista', 
      icone: '👂', 
      motivo: 'Especialista em garganta, nariz e ouvido' 
    },
    gastroenterologista: { 
      nome: 'Gastroenterologista', 
      icone: '🫃', 
      motivo: 'Para problemas digestivos e abdominais' 
    },
    pneumologista: { 
      nome: 'Pneumologista', 
      icone: '🫁', 
      motivo: 'Especialista em problemas respiratórios' 
    },
    psiquiatra: { 
      nome: 'Psiquiatra', 
      icone: '🧘‍♂️', 
      motivo: 'Para questões de saúde mental' 
    },
    psicologo: { 
      nome: 'Psicólogo', 
      icone: '💭', 
      motivo: 'Apoio psicológico e terapia' 
    },
    cardiologista: { 
      nome: 'Cardiologista', 
      icone: '❤️', 
      motivo: 'Para problemas cardíacos' 
    },
    dermatologista: { 
      nome: 'Dermatologista', 
      icone: '🧴', 
      motivo: 'Para problemas de pele' 
    },
    nutricionista: { 
      nome: 'Nutricionista', 
      icone: '🥗', 
      motivo: 'Para orientação alimentar' 
    }
  },

  detectarProtocolo(mensagem) {
    const mensagemLower = mensagem.toLowerCase();
    
    for (const protocolo of this.protocolos) {
      for (const palavra of protocolo.palavrasChave) {
        if (mensagemLower.includes(palavra.toLowerCase())) {
          return protocolo;
        }
      }
    }
    
    return null;
  },

  sugerirEspecialistas(mensagem) {
    const mensagemLower = mensagem.toLowerCase();
    const especialistasSugeridos = [];
    
    // Mapeamento de sintomas para especialistas
    const mapeamento = {
      'coração|peito|palpitação|pressão alta|hipertensão': ['cardiologista'],
      'pele|mancha|coceira|acne|dermatite': ['dermatologista'],
      'peso|dieta|alimentação|obesidade|diabetes': ['nutricionista'],
      'dor nas costas|coluna|articulação|osso': ['ortopedista'],
      'olho|visão|vista|enxergar': ['oftalmologista'],
      'dente|gengiva|boca': ['dentista']
    };
    
    for (const [sintomas, especialidades] of Object.entries(mapeamento)) {
      const regex = new RegExp(sintomas, 'i');
      if (regex.test(mensagemLower)) {
        especialidades.forEach(esp => {
          if (this.especialistas[esp] && !especialistasSugeridos.find(s => s.nome === this.especialistas[esp].nome)) {
            especialistasSugeridos.push(this.especialistas[esp]);
          }
        });
      }
    }
    
    // Sempre sugere clínico geral se não houver outros
    if (especialistasSugeridos.length === 0) {
      especialistasSugeridos.push(this.especialistas.clinico_geral);
    }
    
    return especialistasSugeridos.slice(0, 3); // Máximo 3 sugestões
  },

  avaliarUrgencia(sintomas) {
    const sintomasUrgentes = [
      'dor no peito forte',
      'falta de ar severa',
      'desmaio',
      'convulsão',
      'sangramento intenso',
      'febre muito alta',
      'dor abdominal intensa'
    ];
    
    const sintomasLower = sintomas.toLowerCase();
    
    for (const sintoma of sintomasUrgentes) {
      if (sintomasLower.includes(sintoma)) {
        return {
          urgente: true,
          recomendacao: 'Procure atendimento médico imediatamente ou vá ao pronto socorro.'
        };
      }
    }
    
    return {
      urgente: false,
      recomendacao: 'Agende uma consulta médica para avaliação adequada.'
    };
  }
};