import { GoogleGenerativeAI } from "@google/generative-ai";
import { verificarGatilhoCritico, detectarTemaForaDaSaude, validarMencaoMedicamentos } from '../utils/filters';

// ✅ Configuração correta para React puro
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

if (!API_KEY) {
  throw new Error("Chave de API não configurada. Configure a variável VITE_GOOGLE_API_KEY no arquivo .env");
}

// Cache para modelos disponíveis
let cachedModels = null;
const CACHE_EXPIRATION_MS = 3600000; // 1 hora

// Função para sanitizar o histórico de conversa
const sanitizarHistorico = (historico) => {
  if (!Array.isArray(historico)) return [];
  
  return historico.filter(msg => {
    if (msg.isBot) {
      // Remove mensagens do bot que contenham temas proibidos
      return !detectarTemaForaDaSaude(msg.text);
    }
    return true; // Mantém todas as mensagens do usuário
  });
};

export const listAvailableModels = async () => {
  try {
    if (cachedModels && (Date.now() - cachedModels.timestamp) < CACHE_EXPIRATION_MS) {
      return {
        success: true,
        models: cachedModels.data,
        fromCache: true
      };
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro ao listar modelos:", errorData);
      throw new Error(`Falha ao buscar modelos: ${response.status} - ${errorData.error?.message || 'Erro desconhecido'}`);
    }

    const data = await response.json();

    cachedModels = {
      data: data.models,
      timestamp: Date.now()
    };

    return {
      success: true,
      models: data.models
    };

  } catch (error) {
    console.error("Erro ao listar modelos:", error);

    if (cachedModels) {
      return {
        success: true,
        models: cachedModels.data,
        fromCache: true,
        warning: "Dados podem estar desatualizados devido a erro na requisição"
      };
    }

    return {
      success: false,
      error: error.message || "Erro ao listar modelos disponíveis"
    };
  }
};

export const getAIResponse = async (message, history = [], options = {}) => {
  // Log de auditoria para monitorar tentativas
  console.log(`[AUDIT] Tentativa de mensagem: ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}`);

  if (typeof message !== 'string' || message.trim() === '') {
    return {
      success: false,
      error: "A mensagem não pode estar vazia"
    };
  }

  // 🔒 Filtro de segurança — Gatilhos críticos
  if (verificarGatilhoCritico(message)) {
    console.warn('[AUDIT] Gatilho crítico detectado');
    return {
      success: true,
      response: "⚠️ Com base no que você relatou, é muito importante que procure imediatamente um médico ou profissional de saúde qualificado."
    };
  }

  // 🔒 Filtro de segurança — Temas fora da saúde
  if (detectarTemaForaDaSaude(message)) {
    console.warn('[AUDIT] Tema proibido detectado:', message);
    return {
      success: true,
      response: "⚠️ Sou um assistente virtual de saúde e só posso responder perguntas relacionadas a cuidados médicos. Para outros temas, recomendo buscar fontes apropriadas."
    };
  }

  // 🔒 Filtro de segurança — Medicamentos controlados (apenas contextos perigosos)
  if (validarMencaoMedicamentos(message)) {
    console.warn('[AUDIT] Contexto perigoso com medicamento detectado');
    return {
      success: true,
      response: "⚠️ Para questões sobre medicamentos controlados ou dosagens específicas, é importante consultar um farmacêutico ou médico. Posso ajudar com informações gerais sobre saúde."
    };
  }

  try {
    const defaultOptions = {
      modelName: "gemini-2.0-flash-exp",
      maxOutputTokens: 1000,
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    const finalOptions = { ...defaultOptions, ...options };

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: finalOptions.modelName,
      generationConfig: {
        maxOutputTokens: finalOptions.maxOutputTokens,
        temperature: finalOptions.temperature,
        topP: finalOptions.topP,
        topK: finalOptions.topK,
      },
      safetySettings: finalOptions.safetySettings
    });

    const systemRules = `Você é o TecSim, assistente virtual amigável especializado em saúde e bem-estar. 
    DIRETRIZES:

    ✅ Seja acolhedor e responda saudações normalmente
    ✅ Ajude com questões gerais de saúde, sintomas leves e orientações básicas
    ✅ Ofereça informações educativas sobre saúde
    ✅ Sempre recomende consulta profissional para questões sérias
    ⛔ Não dê diagnósticos definitivos ou prescrições
    ⛔ Evite temas fora da saúde (política, religião, esportes)

    ESTILO DE CONVERSA:
    - Seja natural e acessível
    - Use emojis quando apropriado
    - Responda saudações de forma amigável
    - Mantenha o foco na saúde mas seja conversacional
    - Encoraje cuidados preventivos e hábitos saudáveis`;

    // Sanitizar o histórico antes de usar
    const historicoSanitizado = sanitizarHistorico(history);
    
    let chatHistory = [];
    if (Array.isArray(historicoSanitizado) && historicoSanitizado.length > 0) {
      chatHistory = historicoSanitizado.map(msg => ({
        role: msg.isBot ? "model" : "user",
        parts: [{ text: msg.text }]
      }));
    }

    const chat = model.startChat({ 
      history: chatHistory
    });

    const userMessageContent = systemRules + "\n\nMensagem do usuário: " + message.trim();

    const result = await chat.sendMessage(userMessageContent);
    const responseText = await result.response.text();

    // 🔒 Verificação final da resposta do modelo
    if (detectarTemaForaDaSaude(responseText) || validarMencaoMedicamentos(responseText)) {
      console.warn('[AUDIT] Resposta do modelo contém conteúdo proibido');
      return {
        success: true,
        response: "Sou um assistente virtual especializado em saúde e só posso responder perguntas relacionadas a cuidados médicos."
      };
    }

    return {
      success: true,
      response: responseText
    };

  } catch (error) {
    console.error("Erro detalhado:", error);

    let errorMessage = "Erro ao processar sua solicitação";
    if (error.message?.includes('not found for API version')) {
      errorMessage = "Modelo não disponível. Tente usar 'gemini-pro'";
    } else if (error.message?.includes('API key not valid')) {
      errorMessage = "Chave de API inválida. Verifique sua configuração.";
    } else if (error.message?.includes('Quota exceeded')) {
      errorMessage = "Limite de requisições excedido. Tente novamente mais tarde.";
    }

    return {
      success: false,
      error: errorMessage,
      details: error.message
    };
  }
};

export const checkAPIHealth = async () => {
  try {
    const modelsResponse = await listAvailableModels();

    if (!modelsResponse.success) {
      return {
        healthy: false,
        message: "Falha ao conectar com a API",
        error: modelsResponse.error
      };
    }

    return {
      healthy: true,
      message: "API operacional",
      models: modelsResponse.models.length
    };
  } catch (error) {
    return {
      healthy: false,
      message: "Erro ao verificar saúde da API",
      error: error.message
    };
  }
};

// Função específica para triagem
export const getTriageResponse = async (message, triagemState, history = []) => {
  const protocolo = triagemState.protocoloAtivo;
  
  if (!protocolo) {
    return {
      success: false,
      error: "Protocolo de triagem não identificado"
    };
  }

  // Prepara contexto especializado para triagem
  const systemRulesTriagem = `
Você é um assistente de TRIAGEM médica para farmacêuticos.

CONTEXTO ATUAL:
- Protocolo: ${protocolo.nome}
- Etapa: ${triagemState.etapa}
- Perguntas realizadas: ${triagemState.perguntasRealizadas}
- Risco atual: ${triagemState.risco}

DIRETRIZES:
- Faça APENAS 1 pergunta por vez
- Foque em identificar sinais de alerta
- Use linguagem clara e acessível
- Mantenha o foco no protocolo atual

PRÓXIMA PERGUNTA DO PROTOCOLO: "${protocolo.perguntas[triagemState.perguntasRealizadas]?.pergunta}"

RESPONDA APENAS COM:
1. A próxima pergunta do protocolo OU
2. A classificação final se todas as perguntas foram respondidas

NUNCA dê diagnósticos ou tratamentos.
  `;

  try {
    const result = await getAIResponse(systemRulesTriagem + "\n\nHistórico: " + message, history, {
      temperature: 0.2, // Baixa criatividade para maior precisão
      maxOutputTokens: 300
    });

    return result;
  } catch (error) {
    console.error('Erro na triagem:', error);
    return {
      success: false,
      error: "Falha na triagem automática"
    };
  }
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