import { GoogleGenerativeAI } from "@google/generative-ai";
import { API_KEY } from '@env';
import { verificarGatilhoCritico, detectarTemaForaDaSaude } from '../utils/filters';

// Configuração segura da chave de API
if (!API_KEY) {
  throw new Error("Chave de API não configurada. Configure a variável de ambiente REACT_APP_GOOGLE_API_KEY ou GOOGLE_API_KEY.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

// Cache para modelos disponíveis
let cachedModels = null;
const CACHE_EXPIRATION_MS = 3600000; // 1 hora

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
  if (typeof message !== 'string' || message.trim() === '') {
    return {
      success: false,
      error: "A mensagem não pode estar vazia"
    };
  }

  // 🔒 Filtro de segurança — Gatilhos críticos
  if (verificarGatilhoCritico(message)) {
    return {
      success: true,
      response: "⚠️ Com base no que você relatou, é muito importante que procure imediatamente um médico ou profissional de saúde qualificado."
    };
  }

  // 🔒 Filtro de segurança — Temas fora da saúde
  if (detectarTemaForaDaSaude(message)) {
    return {
      success: true,
      response: "⚠️ Sou um assistente virtual de saúde e só posso responder perguntas relacionadas a cuidados médicos. Para outros temas, recomendo buscar fontes apropriadas."
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

    console.log(`Usando modelo: ${finalOptions.modelName} com configurações:`, finalOptions);

    const genAI = new GoogleGenerativeAI(API_KEY, {
      apiVersion: finalOptions.apiVersion
    });

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

    const systemRules = `Você é o TecSim, assistente virtual de saúde. Seu único objetivo é ajudar com informações médicas básicas de forma clara, segura e responsável. Siga rigorosamente estas diretrizes:

1. Nunca ofereça diagnósticos ou tratamentos.
2. Sempre recomende que o usuário procure um médico ou profissional de saúde qualificado.
3. Responda apenas dúvidas simples, comuns e leves, como por exemplo: dor de cabeça ocasional, gases, cólica leve, dor nas costas moderada ou uso básico de medicamentos populares (ex: paracetamol, dipirona, sal de frutas) — sempre com cautela.
4. Caso perceba que:
  - o sintoma é frequente, persistente ou intenso;
  - existe uma combinação de sintomas;
  - o usuário relata algo grave ou usa termos como "urgente", "desesperado", "não aguento", "muito forte";
  - ou menciona situações específicas como gravidez, saúde mental, uso de substâncias legais, doenças crônicas ou qualquer condição de risco,

  então oriente de forma clara e direta: “Procure imediatamente um médico ou profissional de saúde qualificado.” Não continue a conversa além disso.

5. É permitido mencionar medicamentos comuns e naturais, apenas como exemplo, e apenas se houver uso seguro e reconhecido para o sintoma relatado. Nunca mencione antibióticos, controlados ou qualquer substância que exija receita médica.
6. Evite termos técnicos. Use linguagem intermediária, acessível ao público geral.
7. Nunca incentive automedicação.
8. Não forneça conselhos para uso prolongado ou repetido de medicamentos.
9. Se o tema da conversa fugir da área médica (ex: política, esportes, religião, entretenimento, etc.), responda com respeito dizendo:

“Sou um assistente virtual de saúde e só posso responder perguntas relacionadas a cuidados médicos. Para outros temas, recomendo buscar fontes apropriadas.”

10. Seja sempre educado, direto, objetivo e responsável. Nunca use linguagem ambígua ou que possa ser interpretada como recomendação médica.

Seu papel é informativo, nunca substitutivo à orientação profissional.`;

    let chatHistory = [];
    if (Array.isArray(history) && history.length > 0) {
      chatHistory = history.map(msg => ({
        role: msg.isBot ? "model" : "user",
        parts: [{ text: msg.text }]
      }));
    }

    const chat = model.startChat({ history: chatHistory });

    let userMessageContent = message.trim();
    if (history.length === 0 && systemRules && !userMessageContent.startsWith(systemRules.trim())) {
      userMessageContent = systemRules + userMessageContent;
    }

    const result = await chat.sendMessage(userMessageContent);
    const responseText = await result.response.text();

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
