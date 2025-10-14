import React from "react";
import { useAuth } from "../../context/UserContext";
import { MessageSquare, Pill, Clock, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

import NotificationIcon from "../../components/Home/Bell";
import Sidebar from "../../components/SideBarr";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-sky-50 to-white">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 text-lg font-medium">
            Carregando seu painel...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex flex-col">
      <Sidebar />

      {/* Top Bar */}
      <header className="flex items-center justify-between px-8 py-5 bg-sky-600 shadow-md">
        <h1 className="text-3xl font-extrabold text-white tracking-wide">TecSIM</h1>
        <div className="relative">
          <NotificationIcon initialCount={5} />
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-10">
        {/* Saudação */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-800">
            Olá,{" "}
            <span className="text-sky-600 font-extrabold">
              {user?.nome || "Usuário"}
            </span>{" "}
            👋
          </h2>
          <p className="text-gray-600 text-lg mt-2">
            Como podemos ajudar na sua saúde hoje?
          </p>
        </div>

        {/* Card do Chat */}
        <div
          onClick={() => navigate("/chatbot")}
          className="bg-sky-600 rounded-2xl shadow-xl p-8 mb-12 text-white hover:scale-[1.02] transition-transform cursor-pointer"
        >
          <div className="flex items-center gap-4 mb-4">
            <MessageSquare className="w-10 h-10" />
            <h3 className="text-2xl font-bold">Iniciar Conversa com Assistente</h3>
          </div>
          <p className="text-sky-100 text-lg">
            Obtenha recomendações personalizadas para seus sintomas.
          </p>
        </div>

        {/* Seção de Ferramentas */}
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          Suas Ferramentas de Saúde
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card - Medicamentos */}
          <div
            onClick={() => navigate("/medicamentos")}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
          >
            <div className="flex items-center gap-4 mb-3">
              <Pill className="text-sky-600 w-8 h-8" />
              <h4 className="text-xl font-bold text-gray-800">Medicamentos</h4>
            </div>
            <p className="text-gray-600">
              Informações gerais sobre medicamentos
            </p>
          </div>

          {/* Card - Lembretes */}
          <div
            onClick={() => navigate("/lembretes")}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
          >
            <div className="flex items-center gap-4 mb-3">
              <Clock className="text-sky-600 w-8 h-8" />
              <h4 className="text-xl font-bold text-gray-800">Lembretes</h4>
            </div>
            <p className="text-gray-600">
              Nunca esqueça de tomar seus remédios
            </p>
          </div>

          {/* Card - Minhas Prescrições (sem navegação ainda) */}
          <div 
            onClick={() => navigate("/prescricoes")} 
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
          >
            <div className="flex items-center gap-4 mb-3">
              <FileText className="text-sky-600 w-8 h-8" />
              <h4 className="text-xl font-bold text-gray-800">Minhas Prescrições</h4>
            </div>
            <p className="text-gray-600">Acesse suas receitas médicas</p>
          </div>
        </div>
      </main>
    </div>
  );
}
