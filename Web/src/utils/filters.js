// filters.js

// Lista extensa de gatilhos de sintomas graves, persistentes ou situações críticas
const gatilhosCriticos = [
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
  "pensamentos ruim", "vontade de morrer", "suicídio", "depressão profunda",
  "tristeza intensa", "não quero viver", "ansiedade severa", "ataque de pânico",
  "síndrome do pânico", "uso de substância", "alcoolismo", "overdose"
];

// Lista extensa de temas fora da área médica (evitar respostas)
const palavrasProibidas = [
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

// Lista de medicamentos controlados e termos relacionados
const medicamentosControlados = [
  // Antibióticos e controlados
  "antibiótico", "amoxicilina", "azitromicina", "cefalexina", "ciprofloxacino",
  "claritromicina", "doxiciclina", "eritromicina", "metronidazol", "penicilina",
  
  // Psicotrópicos e tarja preta
  "ansiolítico", "alprazolam", "diazepam", "clonazepam", "lorazepam", "rivotril",
  "frontal", "lexotan", "antidepressivo", "fluoxetina", "sertralina", "paroxetina",
  "citalopram", "escitalopram", "venlafaxina", "duloxetina", "amitriptilina",
  "estabilizador de humor", "lítio", "carbamazepina", "ácido valproico", "lamotrigina",
  
  // Estimulantes e controlados
  "metilfenidato", "ritalina", "venvanse", "concerta", "anfetamina", "modafinila",
  
  // Opioides e analgésicos controlados
  "morfina", "codeína", "tramadol", "oxicodona", "hidrocodona", "fentanil", "metadona",
  
  // Outros controlados
  "corticosteroide", "prednisona", "cortisona", "dexametasona", "hidrocortisona",
  "anticoncepcional hormonal", "pílula do dia seguinte", "hormônio", "testosterona",
  "esteroide anabolizante", "finasterida", "isotretinoína", "roacutan",
  
  // Termos gerais de controle
  "tarja preta", "tarja vermelha", "controlado", "receita médica", "prescrição médica",
  "remédio controlado", "medicamento controlado", "substância controlada"
];

// Função para verificar se contém algum gatilho crítico
const verificarGatilhoCritico = (mensagem) => {
  const texto = mensagem.toLowerCase();
  return gatilhosCriticos.some(trigger => texto.includes(trigger));
};

// Função para verificar se contém tema proibido (fora da área médica)
const detectarTemaForaDaSaude = (mensagem) => {
  const texto = mensagem.toLowerCase();
  return palavrasProibidas.some(palavra => texto.includes(palavra));
};

// Função para validar menção a medicamentos controlados
const validarMencaoMedicamentos = (mensagem) => {
  const texto = mensagem.toLowerCase();
  
  // Ignora saudações e mensagens básicas
  const saudacoes = ['ola', 'olá', 'oi', 'bom dia', 'boa tarde', 'boa noite', 'como vai', 'tudo bem'];
  if (saudacoes.some(saudacao => texto.includes(saudacao) && texto.length < 20)) {
    return false;
  }
  
  // Verifica apenas contextos EXPLICITAMENTE perigosos
  const contextoPerigoso = (
    (texto.includes("dose") && texto.includes("aumentar")) ||
    texto.includes("quantos comprimidos tomar") ||
    texto.includes("posso misturar") ||
    texto.includes("automedicação") ||
    texto.includes("sem receita médica") ||
    texto.includes("tarja preta") ||
    texto.includes("controlado")
  );
  
  // Verifica medicamentos controlados específicos apenas em contexto de dosagem
  const medicamentosEspecificos = ['rivotril', 'ritalina', 'morfina', 'codeína', 'tramadol'];
  const contemControlado = medicamentosEspecificos.some(med => 
    texto.includes(med) && (texto.includes('dose') || texto.includes('tomar') || texto.includes('usar'))
  );
  
  return contextoPerigoso || contemControlado;
};

// Exportações nomeadas (CORRIGIDO)
export {
  verificarGatilhoCritico,
  detectarTemaForaDaSaude,
  validarMencaoMedicamentos
};

// Exportação padrão para compatibilidade com React Native
export default {
  verificarGatilhoCritico,
  detectarTemaForaDaSaude,
  validarMencaoMedicamentos
};