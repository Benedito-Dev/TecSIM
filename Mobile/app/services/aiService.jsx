import { GoogleGenerativeAI } from "@google/generative-ai";
import { API_URL } from '@env';
import { verificarGatilhoCritico, detectarTemaForaDaSaude, validarMencaoMedicamentos } from '../utils/filters';

// Configuração segura da chave de API
if (!API_URL) {
  throw new Error("Chave de API não configurada. Configure a variável de ambiente REACT_APP_GOOGLE_API_URL ou GOOGLE_API_URL.");
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

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_URL}`);

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

  // 🔒 Filtro de segurança — Medicamentos controlados
  if (validarMencaoMedicamentos(message)) {
    console.warn('[AUDIT] Menção a medicamento controlado detectada');
    return {
      success: true,
      response: "⚠️ Não posso discutir medicamentos controlados ou que exigem prescrição médica. Consulte um profissional de saúde para orientações sobre medicamentos."
    };
  }

  try {
    const defaultOptions = {
      modelName: "gemini-1.5-flash",
      apiVersion: "v1beta",
      maxOutputTokens: 2000,
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

    // ✅ CORREÇÃO: Usar a instância única do GoogleGenerativeAI
    const genAI = new GoogleGenerativeAI(API_URL);
    const model = genAI.getGenerativeModel({
      model: finalOptions.modelName,
      generationConfig: {
        maxOutputTokens: 1000, // Reduzido para respostas mais objetivas
        temperature: 0.3, // Reduzido para menos criatividade
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