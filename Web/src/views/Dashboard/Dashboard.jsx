import React from "react";
import { useAuth } from "../../context/UserContext";
import { useTheme } from "../../context/ThemeContext";
import { MessageSquare, Pill, Clock, FileText, Sun, Moon, House } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/layout/Sidebar";
import { PageContainer } from "../../components/layout/PageContainer";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { theme, toggleTheme, mode } = useTheme();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ 
          background: theme.background,
          color: theme.textPrimary
        }}
      >
        <div className="flex flex-col items-center">
          <div 
            className="w-16 h-16 border-4 rounded-full animate-spin"
            style={{ 
              borderColor: theme.primary,
              borderTopColor: 'transparent'
            }}
          ></div>
          <p 
            className="mt-4 text-lg font-medium"
            style={{ color: theme.textSecondary }}
          >
            Carregando seu painel...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <PageContainer 
        title="Dashboard" 
        icon={House}
      >
        {/* Botão Toggle Theme - Posicionado no canto superior direito */}
        <div className="absolute top-6 right-6">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
            style={{ 
              background: 'rgba(255,255,255,0.1)',
              color: theme.textOnPrimary
            }}
            title={`Mudar para tema ${mode === 'light' ? 'escuro' : 'claro'}`}
          >
            {mode === 'light' ? (
              <Moon className="w-6 h-6" />
            ) : (
              <Sun className="w-6 h-6" />
            )}
          </button>
        </div>
        {/* Saudação */}
        <div className="mb-10">
          <h2 
            className="text-3xl font-bold"
            style={{ color: theme.textPrimary }}
          >
            Olá,{" "}
            <span style={{ color: theme.primary }}>
              {user?.nome || "Usuário"}
            </span>{" "}
            👋
          </h2>
          <p 
            className="text-lg mt-2"
            style={{ color: theme.textSecondary }}
          >
            Como podemos ajudar na sua saúde hoje?
          </p>
        </div>

        {/* Card do Chat */}
        <div
          onClick={() => navigate("/chatbot")}
          className="rounded-2xl shadow-xl p-8 mb-12 hover:scale-[1.02] transition-transform cursor-pointer"
          style={{ 
            background: theme.primary,
            color: theme.textOnPrimary
          }}
        >
          <div className="flex items-center gap-4 mb-4">
            <MessageSquare className="w-10 h-10" />
            <h3 className="text-2xl font-bold">Iniciar Conversa com Assistente</h3>
          </div>
          <p style={{ color: theme.textOnPrimary, opacity: 0.9 }}>
            Obtenha recomendações personalizadas para seus sintomas.
          </p>
        </div>

        {/* Seção de Ferramentas */}
        <h3 
          className="text-2xl font-bold mb-6"
          style={{ color: theme.textPrimary }}
        >
          Suas Ferramentas de Saúde
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card - Medicamentos */}
          <div
            onClick={() => navigate("/medicamentos")}
            className="rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
            style={{ 
              background: theme.backgroundCard,
              border: `1px solid ${theme.border}`
            }}
          >
            <div className="flex items-center gap-4 mb-3">
              <Pill 
                className="w-8 h-8" 
                style={{ color: theme.primary }}
              />
              <h4 
                className="text-xl font-bold"
                style={{ color: theme.textPrimary }}
              >
                Medicamentos
              </h4>
            </div>
            <p style={{ color: theme.textSecondary }}>
              Informações gerais sobre medicamentos
            </p>
          </div>

          {/* Card - Lembretes */}
          <div
            onClick={() => navigate("/lembretes")}
            className="rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
            style={{ 
              background: theme.backgroundCard,
              border: `1px solid ${theme.border}`
            }}
          >
            <div className="flex items-center gap-4 mb-3">
              <Clock 
                className="w-8 h-8" 
                style={{ color: theme.primary }}
              />
              <h4 
                className="text-xl font-bold"
                style={{ color: theme.textPrimary }}
              >
                Lembretes
              </h4>
            </div>
            <p style={{ color: theme.textSecondary }}>
              Nunca esqueça de tomar seus remédios
            </p>
          </div>

          {/* Card - Minhas Prescrições */}
          <div 
            onClick={() => navigate("/prescricoes")} 
            className="rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
            style={{ 
              background: theme.backgroundCard,
              border: `1px solid ${theme.border}`
            }}
          >
            <div className="flex items-center gap-4 mb-3">
              <FileText 
                className="w-8 h-8" 
                style={{ color: theme.primary }}
              />
              <h4 
                className="text-xl font-bold"
                style={{ color: theme.textPrimary }}
              >
                Minhas Prescrições
              </h4>
            </div>
            <p style={{ color: theme.textSecondary }}>
              Acesse suas receitas médicas
            </p>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}