import { GoogleGenerativeAI } from "@google/generative-ai";
import { verificarGatilhoCritico, detectarTemaForaDaSaude, validarMencaoMedicamentos } from '../utils/filters';
import { APP_CONFIG, validateConfig } from '../config/appConfig';

// Validação de configuração
const configValidation = validateConfig();
if (!configValidation.isValid) {
  throw new Error(`Configuração inválida: ${configValidation.errors.join(', ')}`);
}

const FINAL_API_KEY = APP_CONFIG.API.GOOGLE_API_KEY;

// Cache para modelos disponíveis
let cachedModels = null;
const CACHE_EXPIRATION_MS = APP_CONFIG.AI.CACHE_EXPIRATION;

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

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${FINAL_API_KEY}`);

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
      response: APP_CONFIG.SECURITY.CRITICAL_TRIGGER_RESPONSE
    };
  }

  // 🔒 Filtro de segurança — Temas fora da saúde
  if (detectarTemaForaDaSaude(message)) {
    console.warn('[AUDIT] Tema proibido detectado:', message);
    return {
      success: true,
      response: APP_CONFIG.SECURITY.BLOCKED_TOPICS_RESPONSE
    };
  }

  // 🔒 Filtro de segurança — Medicamentos controlados
  if (validarMencaoMedicamentos(message)) {
    console.warn('[AUDIT] Menção a medicamento controlado detectada');
    return {
      success: true,
      response: APP_CONFIG.SECURITY.CONTROLLED_MEDICATION_RESPONSE
    };
  }

  try {
    const defaultOptions = {
      modelName: APP_CONFIG.AI.DEFAULT_MODEL,
      apiVersion: "v1",
      maxOutputTokens: APP_CONFIG.AI.MAX_OUTPUT_TOKENS,
      temperature: APP_CONFIG.AI.TEMPERATURE,
      topP: APP_CONFIG.AI.TOP_P,
      topK: APP_CONFIG.AI.TOP_K,
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

    // ✅ CORREÇÃO: Usar a instância única do GoogleGenerativeAI
    const genAI = new GoogleGenerativeAI(FINAL_API_KEY);
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

    const systemRules = `Você é o TecSim, assistente virtual EXCLUSIVO para questões de saúde. 
DIRETRIZES ABSOLUTAS:

⛔ NUNCA discuta: política, religião, esportes, entretenimento, economia ou qualquer tema fora da saúde
⛔ NUNCA dê diagnósticos ou tratamentos específicos
⛔ NUNCA mencione medicamentos controlados ou que exigem receita
✅ SEMPRE recomende procurar um médico para questões sérias
✅ Mantenha respostas objetivas e focadas apenas em saúde

RESPOSTAS PADRÃO PARA TEMA NÃO MÉDICO:
Se o usuário mencionar qualquer tema fuera da saúde, responda APENAS e EXCLUSIVAMENTE:
"Sou um assistente virtual especializado em saúde e só posso responder perguntas relacionadas a cuidados médicos. Para outros temas, recomendo buscar fontes apropriadas."

Para questões de saúde:
- Seja breve e objetivo
- Sempre encerre recomendando consulta médica quando apropriado
- Use linguagem acessível ao público geral
- Nunca substitua orientação profissional`;

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

    // 🔥 MUDANÇA CRÍTICA: System rules SEMPRE incluído
    const userMessageContent = systemRules + "\n\nMensagem do usuário: " + message.trim();

    const result = await chat.sendMessage(userMessageContent);
    const responseText = await result.response.text();

    // 🔒 Verificação final da resposta do modelo
    if (detectarTemaForaDaSaude(responseText) || validarMencaoMedicamentos(responseText)) {
      console.warn('[AUDIT] Resposta do modelo contém conteúdo proibido');
      return {
        success: true,
        response: APP_CONFIG.SECURITY.BLOCKED_TOPICS_RESPONSE
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