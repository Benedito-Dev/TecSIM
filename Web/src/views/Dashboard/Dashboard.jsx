import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/UserContext";
import { useTheme } from "../../context/ThemeContext";
import { MessageSquare, Pill, Clock, FileText, Sun, Moon, House, TrendingUp, Users, ShoppingCart, AlertCircle, Package, DollarSign, BarChart3, Activity, Shield, Bell, Calendar, Filter, Download, RefreshCw, Eye, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/layout/Sidebar";
import { PageContainer } from "../../components/layout/PageContainer";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { theme, toggleTheme, mode } = useTheme();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
        {/* Header Executivo */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold" style={{ color: theme.textPrimary }}>
                  TecSim Pharma
                </h1>
                <span className="px-3 py-1 text-xs font-semibold rounded-full" style={{
                  background: theme.primary + '20',
                  color: theme.primary
                }}>ENTERPRISE</span>
              </div>
              <p className="text-lg font-medium mb-1" style={{ color: theme.textPrimary }}>
                Olá, {user?.nome || "Administrador"}
              </p>
              <div className="flex items-center gap-4 text-sm" style={{ color: theme.textSecondary }}>
                <span>{currentTime.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                <span>•</span>
                <span>{currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                <span>•</span>
                <span>Farmácia Central</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Notificações */}
              <div className="relative">
                <button className="p-2 rounded-lg hover:bg-opacity-10 hover:bg-white transition-colors" style={{ background: theme.primary + '10' }}>
                  <Bell className="w-5 h-5" style={{ color: theme.primary }} />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </button>
              </div>
              
              {/* Status Operacional */}
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-semibold text-green-600">Operacional</span>
                </div>
                <p className="text-xs" style={{ color: theme.textSecondary }}>Uptime: 99.9%</p>
              </div>
            </div>
          </div>
        </div>

        {/* KPIs Executivos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Faturamento */}
          <div className="rounded-xl shadow-lg p-6 border-l-4 border-l-green-500" style={{ background: theme.backgroundCard, borderColor: theme.border }}>
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-green-100">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                <ArrowUpRight className="w-4 h-4" />
                +18.2%
              </div>
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>Faturamento Mensal</p>
              <p className="text-3xl font-bold mt-1" style={{ color: theme.textPrimary }}>R$ 127.4K</p>
              <p className="text-xs mt-2" style={{ color: theme.textSecondary }}>Meta: R$ 150K (85%)</p>
            </div>
          </div>

          {/* Margem de Lucro */}
          <div className="rounded-xl shadow-lg p-6 border-l-4 border-l-blue-500" style={{ background: theme.backgroundCard, borderColor: theme.border }}>
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-blue-100">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex items-center gap-1 text-blue-600 text-sm font-medium">
                <ArrowUpRight className="w-4 h-4" />
                +2.1%
              </div>
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>Margem Bruta</p>
              <p className="text-3xl font-bold mt-1" style={{ color: theme.textPrimary }}>34.7%</p>
              <p className="text-xs mt-2" style={{ color: theme.textSecondary }}>Setor: 32.1% (+2.6%)</p>
            </div>
          </div>

          {/* Compliance */}
          <div className="rounded-xl shadow-lg p-6 border-l-4 border-l-purple-500" style={{ background: theme.backgroundCard, borderColor: theme.border }}>
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-purple-100">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                <Eye className="w-4 h-4" />
                100%
              </div>
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>Compliance ANVISA</p>
              <p className="text-3xl font-bold mt-1" style={{ color: theme.textPrimary }}>98.9%</p>
              <p className="text-xs mt-2" style={{ color: theme.textSecondary }}>Última auditoria: 15/11</p>
            </div>
          </div>

          {/* Rotatividade */}
          <div className="rounded-xl shadow-lg p-6 border-l-4 border-l-orange-500" style={{ background: theme.backgroundCard, borderColor: theme.border }}>
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-orange-100">
                <RefreshCw className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex items-center gap-1 text-red-600 text-sm font-medium">
                <ArrowDownRight className="w-4 h-4" />
                -5.3%
              </div>
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>Giro de Estoque</p>
              <p className="text-3xl font-bold mt-1" style={{ color: theme.textPrimary }}>6.2x</p>
              <p className="text-xs mt-2" style={{ color: theme.textSecondary }}>Ideal: 8-12x/ano</p>
            </div>
          </div>
        </div>

        {/* Painel de Controle Operacional */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Alertas Críticos */}
          <div className="rounded-xl shadow-lg p-6" style={{ background: theme.backgroundCard, borderColor: theme.border }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: theme.textPrimary }}>Alertas Críticos</h3>
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">Dipirona 500mg</p>
                  <p className="text-xs text-red-600">Estoque: 12 unidades</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-50">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-orange-800">Amoxicilina 875mg</p>
                  <p className="text-xs text-orange-600">Vence em 15 dias</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-800">Receita #1247</p>
                  <p className="text-xs text-yellow-600">Aguarda validação</p>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Vendas */}
          <div className="rounded-xl shadow-lg p-6" style={{ background: theme.backgroundCard, borderColor: theme.border }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: theme.textPrimary }}>Performance Hoje</h3>
              <TrendingUp className="w-5 h-5" style={{ color: theme.primary }} />
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ color: theme.textSecondary }}>Vendas</span>
                  <span style={{ color: theme.textPrimary }}>R$ 8.4K / R$ 12K</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ color: theme.textSecondary }}>Clientes</span>
                  <span style={{ color: theme.textPrimary }}>47 / 60</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ color: theme.textSecondary }}>Margem</span>
                  <span style={{ color: theme.textPrimary }}>34.7% / 40%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Agenda do Dia */}
          <div className="rounded-xl shadow-lg p-6" style={{ background: theme.backgroundCard, borderColor: theme.border }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: theme.textPrimary }}>Agenda</h3>
              <Calendar className="w-5 h-5" style={{ color: theme.primary }} />
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-1 h-12 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium" style={{ color: theme.textPrimary }}>Promoção Black Friday</p>
                  <p className="text-xs" style={{ color: theme.textSecondary }}>Inicia em 3 dias</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1 h-12 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium" style={{ color: theme.textPrimary }}>Reposição Estoque</p>
                  <p className="text-xs" style={{ color: theme.textSecondary }}>Fornecedor: 16:00</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1 h-12 bg-purple-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium" style={{ color: theme.textPrimary }}>Relatório Mensal</p>
                  <p className="text-xs" style={{ color: theme.textSecondary }}>Deadline: 18:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Centro de Inteligência Farmacêutica */}
        <div className="rounded-xl shadow-lg p-8 mb-8 border" style={{ 
          background: `linear-gradient(135deg, ${theme.primary}08, ${theme.primary}03)`,
          borderColor: theme.primary + '20'
        }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-xl" style={{ background: theme.primary + '15' }}>
                <MessageSquare className="w-8 h-8" style={{ color: theme.primary }} />
              </div>
              <div>
                <h3 className="text-2xl font-bold" style={{ color: theme.textPrimary }}>
                  TecSim AI Assistant
                </h3>
                <p className="text-sm" style={{ color: theme.textSecondary }}>
                  Inteligência Artificial Especializada em Farmacologia Clínica
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium" style={{ color: theme.textPrimary }}>Status: Ativo</p>
                <p className="text-xs" style={{ color: theme.textSecondary }}>Última atualização: Hoje</p>
              </div>
              <button
                onClick={() => navigate("/chatbot")}
                className="px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                style={{ 
                  background: theme.primary,
                  color: theme.textOnPrimary
                }}
              >
                Iniciar Consulta
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg" style={{ background: theme.backgroundCard + '80' }}>
              <h4 className="font-semibold mb-2" style={{ color: theme.textPrimary }}>Análise de Interações</h4>
              <p className="text-sm" style={{ color: theme.textSecondary }}>Verificação automática de incompatibilidades medicamentosas</p>
            </div>
            <div className="p-4 rounded-lg" style={{ background: theme.backgroundCard + '80' }}>
              <h4 className="font-semibold mb-2" style={{ color: theme.textPrimary }}>Dosagem Personalizada</h4>
              <p className="text-sm" style={{ color: theme.textSecondary }}>Cálculos precisos baseados em peso, idade e condições</p>
            </div>
            <div className="p-4 rounded-lg" style={{ background: theme.backgroundCard + '80' }}>
              <h4 className="font-semibold mb-2" style={{ color: theme.textPrimary }}>Compliance Regulatório</h4>
              <p className="text-sm" style={{ color: theme.textSecondary }}>Orientações atualizadas conforme ANVISA e CFF</p>
            </div>
          </div>
        </div>

        {/* Módulos Empresariais */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold" style={{ color: theme.textPrimary }}>Módulos Empresariais</h3>
            <p className="text-sm" style={{ color: theme.textSecondary }}>Gestão integrada de operações farmacêuticas</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg hover:bg-opacity-10 hover:bg-gray-500 transition-colors">
              <Filter className="w-5 h-5" style={{ color: theme.textSecondary }} />
            </button>
            <button className="p-2 rounded-lg hover:bg-opacity-10 hover:bg-gray-500 transition-colors">
              <Download className="w-5 h-5" style={{ color: theme.textSecondary }} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Módulo - Farmacologia Clínica */}
          <div
            onClick={() => navigate("/medicamentos")}
            className="group rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4 border-l-blue-500 hover:-translate-y-1"
            style={{ background: theme.backgroundCard, borderColor: theme.border }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-100 group-hover:scale-110 transition-transform">
                <Pill className="w-7 h-7 text-blue-600" />
              </div>
              <div className="text-right">
                <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">CORE</span>
                <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>1.247 registros</p>
              </div>
            </div>
            <h4 className="text-xl font-bold mb-2" style={{ color: theme.textPrimary }}>Farmacologia Clínica</h4>
            <p className="text-sm mb-4" style={{ color: theme.textSecondary }}>Base de dados completa com monografias, interações medicamentosas e protocolos terapêuticos</p>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium" style={{ color: theme.primary }}>Acessar Módulo</span>
              <ArrowUpRight className="w-4 h-4" style={{ color: theme.primary }} />
            </div>
          </div>

          {/* Módulo - Vendas & Faturamento */}
          <div
            onClick={() => navigate("/vendas")}
            className="group rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4 border-l-green-500 hover:-translate-y-1"
            style={{ background: theme.backgroundCard, borderColor: theme.border }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-green-100 group-hover:scale-110 transition-transform">
                <DollarSign className="w-7 h-7 text-green-600" />
              </div>
              <div className="text-right">
                <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold">PDV</span>
                <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>+18.2% mês</p>
              </div>
            </div>
            <h4 className="text-xl font-bold mb-2" style={{ color: theme.textPrimary }}>Vendas & Faturamento</h4>
            <p className="text-sm mb-4" style={{ color: theme.textSecondary }}>Ponto de venda integrado, relatórios financeiros, análise de margem e controle fiscal</p>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium" style={{ color: theme.primary }}>Acessar Módulo</span>
              <ArrowUpRight className="w-4 h-4" style={{ color: theme.primary }} />
            </div>
          </div>

          {/* Módulo - Clientes & CRM */}
          <div
            onClick={() => navigate("/clientes")}
            className="group rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4 border-l-orange-500 hover:-translate-y-1"
            style={{ background: theme.backgroundCard, borderColor: theme.border }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-orange-100 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-orange-600" />
              </div>
              <div className="text-right">
                <span className="text-xs px-3 py-1 rounded-full bg-orange-100 text-orange-700 font-semibold">CRM</span>
                <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>2.847 ativos</p>
              </div>
            </div>
            <h4 className="text-xl font-bold mb-2" style={{ color: theme.textPrimary }}>Clientes & CRM</h4>
            <p className="text-sm mb-4" style={{ color: theme.textSecondary }}>Gestão de relacionamento, programa de fidelidade, histórico de compras e marketing direcionado</p>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium" style={{ color: theme.primary }}>Acessar Módulo</span>
              <ArrowUpRight className="w-4 h-4" style={{ color: theme.primary }} />
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}