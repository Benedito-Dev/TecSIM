// Estado inicial da triagem
export const iniciarTriagem = () => {
  return {
    etapa: 'inicial',
    sintomaPrincipal: '',
    sintomas: [],
    historicoRespostas: [],
    risco: 'baixo',
    protocoloAtivo: null,
    encaminhamentoRecomendado: null,
    perguntasRealizadas: 0
  };
};

// Processar resposta do usuário
export const processarRespostaTriagem = (estadoTriagem, respostaUsuario, perguntaAtual) => {
  const novoEstado = { ...estadoTriagem };
  
  // Adiciona resposta ao histórico
  novoEstado.historicoRespostas.push({
    pergunta: perguntaAtual.pergunta,
    resposta: respostaUsuario,
    timestamp: new Date().toISOString()
  });

  novoEstado.perguntasRealizadas += 1;

  // Avalia risco baseado na resposta
  const riscoResposta = avaliarRiscoResposta(respostaUsuario, perguntaAtual);
  if (riscoResposta > novoEstado.risco) {
    novoEstado.risco = riscoResposta;
  }

  return novoEstado;
};

// Avaliar risco da resposta
const avaliarRiscoResposta = (resposta, pergunta) => {
  const respostaLower = resposta.toLowerCase();
  
  // Respostas críticas
  if (pergunta.tipo === 'critico' && (respostaLower.includes('sim') || respostaLower.includes('sinto'))) {
    return 'alto';
  }
  
  // Intensidade alta
  if (pergunta.tipo === 'intensidade' && (respostaLower.includes('forte') || respostaLower.includes('9') || respostaLower.includes('10'))) {
    return 'medio';
  }
  
  return 'baixo';
};

// Determinar próxima etapa
export const determinarProximaEtapa = (estadoTriagem, respostaUsuario) => {
  const { protocoloAtivo, perguntasRealizadas, historicoRespostas } = estadoTriagem;
  
  if (!protocoloAtivo) return 'finalizada';
  
  // Se todas as perguntas foram respondidas
  if (perguntasRealizadas >= protocoloAtivo.perguntas.length) {
    return 'finalizada';
  }
  
  // Verificar se há critério para parada antecipada
  if (devePararAntecipadamente(historicoRespostas)) {
    return 'emergencia';
  }
  
  return 'continuar';
};

// Critérios para parada antecipada (emergência)
const devePararAntecipadamente = (historicoRespostas) => {
  const respostasCriticas = historicoRespostas.filter(resp => 
    resp.resposta.toLowerCase().includes('sim') && 
    resp.pergunta.toLowerCase().includes('repente') ||
    resp.pergunta.toLowerCase().includes('pior') ||
    resp.pergunta.toLowerCase().includes('intensa')
  );
  
  return respostasCriticas.length >= 2;
};

// Classificação final baseada nas respostas
export const classificarTriagemFinal = (estadoTriagem) => {
  const { risco, historicoRespostas, protocoloAtivo } = estadoTriagem;
  
  if (risco === 'alto' || estadoTriagem.etapa === 'emergencia') {
    return {
      nivel: 'EMERGÊNCIA',
      cor: 'red',
      recomendacao: 'Encaminhamento IMEDIATO para serviço de emergência',
      tempo: 'Imediato',
      icone: '🚨'
    };
  }
  
  if (risco === 'medio' || historicoRespostas.length >= 3) {
    return {
      nivel: 'URGENTE',
      cor: 'orange',
      recomendacao: 'Consulta médica em 24-48 horas',
      tempo: '24-48 horas',
      icone: '⚠️'
    };
  }
  
  return {
    nivel: 'ROTINA',
    cor: 'green',
    recomendacao: 'Orientação farmacêutica e acompanhamento',
    tempo: '5-7 dias',
    icone: '✅'
  };
};