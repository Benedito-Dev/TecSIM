import { GoogleGenerativeAI } from "@google/generative-ai";

// Configuração do Gemini
const genAI = new GoogleGenerativeAI('AIzaSyCVVUtnrSh_AU6oNvosFHTxorXiGBERwTc'); // Substitua pela sua chave do Gemini

export const getAIResponse = async (message, history = []) => {
  try {
    // Inicializa o modelo Gemini Pro
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Formata o histórico de conversa
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: "Você é o TecSim, assistente virtual de saúde. Siga estas regras:\n" +
                 "1. Nunca dê diagnósticos definitivos\n" +
                 "2. Recomende sempre consultar um profissional\n" +
                 "3. Seja claro e objetivo\n" +
                 "4. Use markdown para formatação quando útil"
        },
        {
          role: "model",
          parts: "Entendido! Sou o TecSim, seu assistente de saúde. Como posso ajudar?"
        },
        ...history
      ],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    // Envia a mensagem e obtém a resposta
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return {
      success: true,
      response: text
    };
  } catch (error) {
    console.error("Erro no Gemini:", error);
    return {
      success: false,
      error: "Desculpe, estou com dificuldades. Tente novamente mais tarde."
    };
  }
};