// 📁 utils/riskAssessment.js

export const avaliarEncaminhamento = (sintomas, respostas) => {
  const criteriosEmergencia = [
    "dor torácica intensa",
    "dificuldade respiratória",
    "sangramento incontrolável", 
    "perda de consciência",
    "convulsões"
  ];

  const criteriosUrgentes = [
    "febre >39°C",
    "dor intensa",
    "vômitos persistentes",
    "tontura ao levantar"
  ];

  const sinaisPresentes = criteriosEmergencia.filter(criterio => 
    respostas.some(resposta => resposta.toLowerCase().includes(criterio))
  );

  if (sinaisPresentes.length > 0) {
    return {
      nivel: "EMERGÊNCIA",
      recomendacao: "Encaminhamento IMEDIATO para serviço de emergência",
      tempo: "Imediato"
    };
  }

  // Continua avaliação para outros níveis...
};