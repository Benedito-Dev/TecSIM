import { protocolosTriagem } from './protocolsConfig';
import { getAIResponse } from '@/services/aiService';

// Estado inicial da triagem
export const iniciarTriagem = () => ({
  etapa: 'inicial',
  sintomaPrincipal: '',
  sintomas: [],
  historicoRespostas: [],
  risco: 'baixo',
  protocoloAtivo: null,
  encaminhamentoRecomendado: null,
  perguntasRealizadas: 0
});

// Identificar protocolo baseado no sintoma
export const identificarProtocolo = (mensagemUsuario) => {
  const mensagemLower = mensagemUsuario.toLowerCase();
  
  for (const [key, protocolo] of Object.entries(protocolosTriagem)) {
    if (mensagemLower.includes(protocolo.sintoma)) {
      return protocolo;
    }
  }
  
  // Busca por palavras-chave
  if (mensagemLower.includes('cabeça') || mensagemLower.includes('cefaleia') || mensagemLower.includes('enxaqueca')) {
    return protocolosTriagem.dor_cabeca;
  }
  
  if (mensagemLower.includes('respirar') || mensagemLower.includes('falta de ar') || mensagemLower.includes('asfixia')) {
    return protocolosTriagem.problemas_respiratorios;
  }
  
  if (mensagemLower.includes('barriga') || mensagemLower.includes('abdominal') || mensagemLower.includes('estômago')) {
    return protocolosTriagem.dor_abdominal;
  }

  if (mensagemLower.includes('febre') || mensagemLower.includes('temperatura') || mensagemLower.includes('calor')) {
    return protocolosTriagem.febre;
  }
  
  return null;
};

// Identificar protocolo especializado baseado nas condições do paciente
export const identificarProtocoloEspecializado = (mensagemUsuario, condicoesPaciente = []) => {
  // Identifica protocolo base
  const protocoloBase = identificarProtocolo(mensagemUsuario);
  
  if (!protocoloBase || !condicoesPaciente.length) {
    return protocoloBase;
  }
  
  // Por enquanto retorna o protocolo base até implementar protocolos especializados
  return protocoloBase;
};

// Processar resposta do usuário
export const processarRespostaTriagem = (estadoTriagem, respostaUsuario, perguntaAtual) => {
  const novoEstado = { ...estadoTriagem };
  
  novoEstado.historicoRespostas.push({
    pergunta: perguntaAtual.pergunta,
    resposta: respostaUsuario,
    timestamp: new Date().toISOString()
  });

  novoEstado.perguntasRealizadas += 1;

  const riscoResposta = avaliarRiscoResposta(respostaUsuario, perguntaAtual);
  if (riscoResposta > novoEstado.risco) {
    novoEstado.risco = riscoResposta;
  }

  return novoEstado;
};

// Avaliar risco da resposta considerando condições do paciente
const avaliarRiscoResposta = (resposta, pergunta, condicoesPaciente = []) => {
  const respostaLower = resposta.toLowerCase();
  
  let risco = 'baixo';
  
  if (pergunta.tipo === 'critico' && (respostaLower.includes('sim') || respostaLower.includes('sinto'))) {
    risco = 'alto';
  }
  
  if (pergunta.tipo === 'intensidade' && (respostaLower.includes('forte') || respostaLower.includes('9') || respostaLower.includes('10') || respostaLower.includes('acima'))) {
    risco = 'medio';
  }
  
  // Aumenta risco baseado nas condições do paciente
  const condicoesAltoRisco = ['hipertensao', 'diabetes', 'cardiaco', 'asma'];
  const temCondicaoRisco = condicoesPaciente.some(c => 
    condicoesAltoRisco.includes(c.condicao) && c.severidade !== 'leve'
  );
  
  if (temCondicaoRisco && risco === 'baixo') {
    risco = 'medio';
  } else if (temCondicaoRisco && risco === 'medio') {
    risco = 'alto';
  }
  
  return risco;
};

// Determinar próxima etapa
export const determinarProximaEtapa = (estadoTriagem, respostaUsuario) => {
  const { protocoloAtivo, perguntasRealizadas, historicoRespostas } = estadoTriagem;
  
  if (!protocoloAtivo) return 'finalizada';
  
  if (perguntasRealizadas >= protocoloAtivo.perguntas.length) {
    return 'finalizada';
  }
  
  if (devePararAntecipadamente(historicoRespostas)) {
    return 'emergencia';
  }
  
  return 'continuar';
};

// Critérios para parada antecipada (emergência)
const devePararAntecipadamente = (historicoRespostas) => {
  const respostasCriticas = historicoRespostas.filter(resp => 
    resp.resposta.toLowerCase().includes('sim') && 
    (resp.pergunta.toLowerCase().includes('repente') ||
    resp.pergunta.toLowerCase().includes('pior') ||
    resp.pergunta.toLowerCase().includes('intensa') ||
    resp.pergunta.toLowerCase().includes('azulados'))
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

// Função para análise final da triagem
export const getTriageAnalysis = async (triagemState) => {
  const classificacao = classificarTriagemFinal(triagemState);
  
  const analysisPrompt = `
Com base na triagem realizada, forneça um resumo profissional:

PROTOCOLO: ${triagemState.protocoloAtivo.nome}
RESPOSTAS COLETADAS: ${JSON.stringify(triagemState.historicoRespostas)}
CLASSIFICAÇÃO: ${classificacao.nivel}

Forneça um resumo conciso para o farmacêutico com:
1. Principais achados
2. Sinais de alerta identificados
3. Recomendação de encaminhamento

Mantenha o texto objetivo e profissional.
  `;

  const result = await getAIResponse(analysisPrompt, [], {
    temperature: 0.3,
    maxOutputTokens: 500
  });

  return {
    ...result,
    classificacao
  };
};