// Configurações centralizadas da aplicação
export const APP_CONFIG = {
  // API Configuration
  API: {
    GOOGLE_API_KEY: import.meta.env.VITE_GOOGLE_API_KEY,
    BASE_URL: `http://${import.meta.env.VITE_IP_HOST || 'localhost'}:3000`,
    TIMEOUT: 10000,
    HEALTH_CHECK_INTERVAL: 300000, // 5 minutos
  },

  // AI Configuration
  AI: {
    DEFAULT_MODEL: "gemini-2.0-flash",
    MAX_OUTPUT_TOKENS: 1000,
    TEMPERATURE: 0.3,
    TOP_P: 0.9,
    TOP_K: 40,
    CACHE_EXPIRATION: 3600000, // 1 hora
  },

  // Chat Configuration
  CHAT: {
    MAX_HISTORY_LENGTH: 50,
    TYPING_DELAY: 150,
    AUTO_SCROLL: true,
  },

  // Security Configuration
  SECURITY: {
    ENABLE_CONTENT_FILTERS: true,
    ENABLE_AUDIT_LOGS: true,
    BLOCKED_TOPICS_RESPONSE: "⚠️ Sou um assistente virtual de saúde e só posso responder perguntas relacionadas a cuidados médicos. Para outros temas, recomendo buscar fontes apropriadas.",
    CRITICAL_TRIGGER_RESPONSE: "⚠️ Com base no que você relatou, é muito importante que procure imediatamente um médico ou profissional de saúde qualificado.",
    CONTROLLED_MEDICATION_RESPONSE: "⚠️ Não posso discutir medicamentos controlados ou que exigem prescrição médica. Consulte um profissional de saúde para orientações sobre medicamentos."
  },

  // Environment
  ENV: {
    IS_DEVELOPMENT: import.meta.env.DEV,
    IS_PRODUCTION: import.meta.env.PROD,
  }
};

export default APP_CONFIG;