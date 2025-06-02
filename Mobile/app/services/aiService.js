import { GoogleGenerativeAI } from "@google/generative-ai";

// Configuração do Gemini com a chave da API
const genAI = new GoogleGenerativeAI('AIzaSyCVVUtnrSh_AU6oNvosFHTxorXiGBERwTc');

export const getAIResponse = async (message, history = []) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      generationConfig: {
        maxOutputTokens: 2000,
        temperature: 0.7,
        topP: 0.9,
        topK: 40
      }
    });

    // Instrução do sistema
    const systemInstruction = {
      role: "user",
      parts: [{ text: "Você é o TecSim, assistente virtual de saúde. Regras:\n1. Nunca dê diagnósticos\n2. Recomende profissionais\n3. Seja claro e objetivo" }]
    };

    // Formatação do histórico, garantindo alternância correta de papéis
    const formattedHistory = [
      systemInstruction,
      ...history.map(msg => ({
        role: msg.isBot ? "model" : "user",
        parts: [{ text: msg.text }]
      }))
    ];

    // Verificação para evitar duas mensagens consecutivas com o mesmo papel
    for (let i = 1; i < formattedHistory.length; i++) {
      if (formattedHistory[i].role === formattedHistory[i - 1].role) {
        throw new Error(`Mensagens consecutivas com o mesmo papel detectadas: '${formattedHistory[i].role}' nas posições ${i - 1} e ${i}.`);
      }
    }

    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 1000
      }
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return {
      success: true,
      response: text
    };

  } catch (error) {
    console.error("Erro completo:", JSON.stringify(error, null, 2));
    return {
      success: false,
      error: error.message || "Erro ao processar sua solicitação"
    };
  }
};
