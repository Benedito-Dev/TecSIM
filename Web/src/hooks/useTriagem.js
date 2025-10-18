import { useState } from 'react';
import { 
  iniciarTriagem, 
  identificarProtocolo, 
  processarRespostaTriagem, 
  determinarProximaEtapa,
  getTriageAnalysis 
} from '../services/triage/triageService';

export const useTriagem = () => {
  const [triagemState, setTriagemState] = useState(null);
  const [emTriagem, setEmTriagem] = useState(false);

  const iniciarProcessoTriagem = (mensagemUsuario) => {
    const protocolo = identificarProtocolo(mensagemUsuario);
    
    if (protocolo) {
      const novaTriagem = iniciarTriagem();
      novaTriagem.protocoloAtivo = protocolo;
      novaTriagem.sintomaPrincipal = mensagemUsuario;
      novaTriagem.etapa = 'triagem_ativa';
      
      setTriagemState(novaTriagem);
      setEmTriagem(true);
      
      return {
        sucesso: true,
        primeiraPergunta: protocolo.perguntas[0],
        protocolo
      };
    }
    
    return { sucesso: false };
  };

  const processarResposta = async (respostaUsuario) => {
    if (!triagemState || !emTriagem) return { sucesso: false };

    const perguntaAtual = triagemState.protocoloAtivo.perguntas[triagemState.perguntasRealizadas];
    const novaTriagem = processarRespostaTriagem(triagemState, respostaUsuario, perguntaAtual);

    const proximaEtapa = determinarProximaEtapa(novaTriagem, respostaUsuario);
    
    if (proximaEtapa === 'finalizada' || proximaEtapa === 'emergencia') {
      const analise = await getTriageAnalysis(novaTriagem);
      resetarTriagem();
      
      return {
        sucesso: true,
        finalizada: true,
        analise
      };
    } else {
      setTriagemState(novaTriagem);
      const proximaPergunta = novaTriagem.protocoloAtivo.perguntas[novaTriagem.perguntasRealizadas];
      
      return {
        sucesso: true,
        finalizada: false,
        proximaPergunta
      };
    }
  };

  const resetarTriagem = () => {
    setTriagemState(null);
    setEmTriagem(false);
  };

  return {
    triagemState,
    emTriagem,
    iniciarProcessoTriagem,
    processarResposta,
    resetarTriagem
  };
};