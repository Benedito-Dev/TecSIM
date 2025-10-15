// 📁 services/triageService.js

export const realizarTriagemInteligente = async (sintomaPrincipal, historico = []) => {
  // Identifica protocolo baseado no sintoma
  const protocolo = identificarProtocolo(sintomaPrincipal);
  
  if (!protocolo) {
    return {
      success: false,
      error: "Sintoma não reconhecido para triagem automatizada"
    };
  }

  // Prepara contexto para o Gemini
  const contextoTriagem = `
Protocolo: ${protocolo.nome}
Sintoma principal: ${sintomaPrincipal}

INSTRUÇÕES:
- Faça apenas 1 pergunta de cada vez
- Foque em identificar sinais de alerta
- Classifique risco após cada resposta
- Não pule etapas do protocolo

Pergunta atual: ${protocolo.perguntas[0].pergunta}
  `;

  const resultado = await getAIResponse(contextoTriagem, historico, {
    temperature: 0.3, // Menos criatividade, mais precisão
    maxOutputTokens: 500
  });

  return {
    ...resultado,
    protocolo: protocolo.nome,
    etapaAtual: 1,
    totalEtapas: protocolo.perguntas.length
  };
};