import { GoogleGenerativeAI } from "@google/generative-ai";
import { API_KEY } from '@env'

// Configuração segura da chave de API (usando variáveis de ambiente)

if (!API_KEY) {
  throw new Error("Chave de API não configurada. Configure a variável de ambiente REACT_APP_GOOGLE_API_KEY ou GOOGLE_API_KEY.");
}

// Configuração do Gemini com a chave de API
const genAI = new GoogleGenerativeAI(API_KEY);

// Cache para modelos disponíveis
let cachedModels = null;
const CACHE_EXPIRATION_MS = 3600000; // 1 hora

/**
 * Função para listar os modelos de IA generativa disponíveis com cache.
 */
export const listAvailableModels = async () => {
  try {
    // Verifica se há cache válido
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
    
    // Atualiza cache
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
    
    // Se houver cache, retorna ele mesmo com erro
    if (cachedModels) {
      console.warn("Retornando modelos do cache devido ao erro");
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

/**
 * Função para obter uma resposta da IA para o chatbot.
 */
export const getAIResponse = async (message, history = [], options = {}) => {
  // Validações iniciais
  if (typeof message !== 'string' || message.trim() === '') {
    return {
      success: false,
      error: "A mensagem não pode estar vazia"
    };
  }

  try {
    // Configurações padrão atualizadas
    const defaultOptions = {
      modelName: "gemini-1.5-flash", // Modelo mais estável e amplamente disponível
      apiVersion: "v1beta", // Usando a versão correta da API
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

    // Mescla opções padrão com as fornecidas
    const finalOptions = { ...defaultOptions, ...options };

    console.log(`Usando modelo: ${finalOptions.modelName} com configurações:`, finalOptions);

    // Configuração do cliente com a versão correta da API
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

    // Restante do código permanece igual...
    const systemRules = "Você é o TecSim, assistente virtual de saúde. Regras:\n1. Nunca dê diagnósticos\n2. Recomende profissionais\n3. Seja claro e objetivo\n\n";

    let chatHistory = [];
    if (Array.isArray(history) && history.length > 0) {
      chatHistory = history.map(msg => ({
        role: msg.isBot ? "model" : "user",
        parts: [{ text: msg.text }]
      }));
    }

    const chat = model.startChat({
      history: chatHistory,
    });

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

/**
 * Função auxiliar para verificar a saúde da API
 */
export const checkAPIHealth = async () => {
  try {
    // Tenta listar modelos como teste de saúde
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