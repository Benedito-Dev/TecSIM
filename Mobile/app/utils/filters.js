// filters.js

// Lista extensa de gatilhos de sintomas graves, persistentes ou situações críticas
export const gatilhosCriticos = [
  "urgente", "emergência", "emergencial", "não aguento mais", "grave", "gravíssimo",
  "sangramento", "vomitando sangue", "dor muito forte", "crise", "agonia", "desesperado",
  "inconsciente", "desmaiei", "perdi os sentidos", "pressão alta", "pressão baixa",
  "dor no peito", "palpitação", "taquicardia", "falta de ar", "respiração difícil",
  "febre alta", "calafrios constantes", "infecção grave", "vomitando sem parar",
  "diarreia persistente", "há vários dias", "há semanas", "há meses", "desidratação",
  "confusão mental", "delírio", "convulsão", "fraqueza extrema", "dormência",
  "perda de movimento", "visão turva", "gravidez de risco", "aborto espontâneo",
  "doença crônica", "diabetes descontrolada", "asma grave", "câncer", "HIV",
  "uso de remédio controlado", "remédio tarja preta", "efeito colateral grave",
  "pensamentos ruins", "vontade de morrer", "suicídio", "depressão profunda",
  "tristeza intensa", "não quero viver", "ansiedade severa", "ataque de pânico",
  "síndrome do pânico", "uso de substância", "alcoolismo", "overdose"
];

// Lista extensa de temas fora da área médica (evitar respostas)
export const palavrasProibidas = [
  // Política e figuras públicas
  "bolsonaro", "lula", "presidente", "eleição", "política", "governo", "partido",
  "ministro", "congresso", "senado", "câmara", "ditadura", "democracia",

  // Religião e crenças
  "deus", "jesus", "igreja", "pastor", "padre", "reencarnação", "budismo", "islamismo",
  "cristianismo", "ateísmo", "espírito", "fé", "oração", "milagre",

  // Esportes e entretenimento
  "futebol", "time", "flamengo", "corinthians", "messi", "neymar", "cr7",
  "campeonato", "jogo", "gol", "seleção brasileira",
  "filme", "série", "ator", "atriz", "oscar", "novela", "personagem",
  "música", "cantor", "banda", "álbum", "show", "celebridade",

  // Cultura pop, internet e redes
  "tiktok", "instagram", "facebook", "youtube", "youtuber", "influencer",
  "bbb", "reality show", "fofoca", "gossip",

  // Piadas, humor e conteúdos gerais
  "piada", "conte uma piada", "me faça rir", "stand up", "meme",
  "signo", "horóscopo", "astrologia", "mapa astral"
];

// Função para verificar se contém algum gatilho crítico
export const verificarGatilhoCritico = (mensagem) => {
  const texto = mensagem.toLowerCase();
  return gatilhosCriticos.some(trigger => texto.includes(trigger));
};

// Função para verificar se contém tema proibido (fora da área médica)
export const detectarTemaForaDaSaude = (mensagem) => {
  const texto = mensagem.toLowerCase();
  return palavrasProibidas.some(palavra => texto.includes(palavra));
};
    