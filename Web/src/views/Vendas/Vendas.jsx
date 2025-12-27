import React, { useState } from "react";
import { useAuth } from "../../context/UserContext";
import { useTheme } from "../../context/ThemeContext";
import { DollarSign, TrendingUp, TrendingDown, BarChart3, PieChart, Calendar, Filter, Download, ArrowUpRight, ArrowDownRight, ShoppingCart, Users, Package, Clock } from "lucide-react";

import Sidebar from "../../components/layout/Sidebar";
import { PageContainer } from "../../components/layout/PageContainer";

export default function VendasPage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [periodo, setPeriodo] = useState("hoje");

  const vendas = {
    hoje: { valor: 8420, meta: 12000, transacoes: 47, clientes: 34 },
    semana: { valor: 52340, meta: 60000, transacoes: 287, clientes: 198 },
    mes: { valor: 127400, meta: 150000, transacoes: 1247, clientes: 847 }
  };

  const produtosMaisVendidos = [
    { nome: "Dipirona 500mg", vendas: 89, receita: "R$ 1.247", margem: "32%" },
    { nome: "Paracetamol 750mg", vendas: 76, receita: "R$ 1.140", margem: "28%" },
    { nome: "Amoxicilina 875mg", vendas: 54, receita: "R$ 2.160", margem: "45%" },
    { nome: "Omeprazol 20mg", vendas: 43, receita: "R$ 860", margem: "38%" },
    { nome: "Losartana 50mg", vendas: 38, receita: "R$ 760", margem: "35%" }
  ];

  const vendasPorHora = [
    { hora: "08h", vendas: 12 }, { hora: "09h", vendas: 18 }, { hora: "10h", vendas: 25 },
    { hora: "11h", vendas: 32 }, { hora: "12h", vendas: 28 }, { hora: "13h", vendas: 22 },
    { hora: "14h", vendas: 35 }, { hora: "15h", vendas: 41 }, { hora: "16h", vendas: 38 },
    { hora: "17h", vendas: 45 }, { hora: "18h", vendas: 52 }, { hora: "19h", vendas: 34 }
  ];

  const maxVendas = Math.max(...vendasPorHora.map(v => v.vendas));

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <PageContainer title="Vendas & Faturamento" icon={DollarSign}>
        {/* Header com Filtros */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <select 
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="px-4 py-2 rounded-lg border font-medium"
              style={{ 
                background: theme.backgroundCard,
                borderColor: theme.border,
                color: theme.textPrimary
              }}
            >
              <option value="hoje">Hoje</option>
              <option value="semana">Esta Semana</option>
              <option value="mes">Este Mês</option>
            </select>
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

        {/* KPIs de Vendas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="rounded-xl shadow-lg p-6 border-l-4 border-l-green-500" style={{ background: theme.backgroundCard }}>
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-green-100">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                <TrendingUp className="w-4 h-4" />
                +12.5%
              </div>
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>Faturamento</p>
              <p className="text-3xl font-bold mt-1" style={{ color: theme.textPrimary }}>
                R$ {vendas[periodo].valor.toLocaleString()}
              </p>
              <p className="text-xs mt-2" style={{ color: theme.textSecondary }}>
                Meta: R$ {vendas[periodo].meta.toLocaleString()} ({Math.round((vendas[periodo].valor / vendas[periodo].meta) * 100)}%)
              </p>
            </div>
          </div>

          <div className="rounded-xl shadow-lg p-6 border-l-4 border-l-blue-500" style={{ background: theme.backgroundCard }}>
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-blue-100">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex items-center gap-1 text-blue-600 text-sm font-medium">
                <TrendingUp className="w-4 h-4" />
                +8.3%
              </div>
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>Transações</p>
              <p className="text-3xl font-bold mt-1" style={{ color: theme.textPrimary }}>
                {vendas[periodo].transacoes}
              </p>
              <p className="text-xs mt-2" style={{ color: theme.textSecondary }}>
                Ticket médio: R$ {Math.round(vendas[periodo].valor / vendas[periodo].transacoes)}
              </p>
            </div>
          </div>

          <div className="rounded-xl shadow-lg p-6 border-l-4 border-l-purple-500" style={{ background: theme.backgroundCard }}>
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-purple-100">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex items-center gap-1 text-purple-600 text-sm font-medium">
                <TrendingUp className="w-4 h-4" />
                +15.2%
              </div>
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>Clientes Únicos</p>
              <p className="text-3xl font-bold mt-1" style={{ color: theme.textPrimary }}>
                {vendas[periodo].clientes}
              </p>
              <p className="text-xs mt-2" style={{ color: theme.textSecondary }}>
                Recorrência: {Math.round((vendas[periodo].transacoes / vendas[periodo].clientes) * 100) / 100}x
              </p>
            </div>
          </div>

          <div className="rounded-xl shadow-lg p-6 border-l-4 border-l-orange-500" style={{ background: theme.backgroundCard }}>
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-orange-100">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                <TrendingUp className="w-4 h-4" />
                +2.1%
              </div>
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>Margem Bruta</p>
              <p className="text-3xl font-bold mt-1" style={{ color: theme.textPrimary }}>34.7%</p>
              <p className="text-xs mt-2" style={{ color: theme.textSecondary }}>
                Lucro: R$ {Math.round(vendas[periodo].valor * 0.347).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Gráficos e Análises */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Vendas por Hora */}
          <div className="rounded-xl shadow-lg p-6" style={{ background: theme.backgroundCard }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold" style={{ color: theme.textPrimary }}>Vendas por Hora</h3>
              <Clock className="w-5 h-5" style={{ color: theme.primary }} />
            </div>
            <div className="space-y-3">
              {vendasPorHora.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="text-sm font-medium w-8" style={{ color: theme.textSecondary }}>
                    {item.hora}
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(item.vendas / maxVendas) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold w-8" style={{ color: theme.textPrimary }}>
                    {item.vendas}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Produtos Mais Vendidos */}
          <div className="rounded-xl shadow-lg p-6" style={{ background: theme.backgroundCard }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold" style={{ color: theme.textPrimary }}>Top Produtos</h3>
              <Package className="w-5 h-5" style={{ color: theme.primary }} />
            </div>
            <div className="space-y-4">
              {produtosMaisVendidos.map((produto, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-opacity-5 hover:bg-gray-500 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ 
                      background: theme.primary + '20',
                      color: theme.primary 
                    }}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: theme.textPrimary }}>{produto.nome}</p>
                      <p className="text-xs" style={{ color: theme.textSecondary }}>{produto.vendas} unidades</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold" style={{ color: theme.textPrimary }}>{produto.receita}</p>
                    <p className="text-xs text-green-600">{produto.margem} margem</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resumo Executivo */}
        <div className="rounded-xl shadow-lg p-6" style={{ background: theme.backgroundCard }}>
          <h3 className="text-xl font-semibold mb-4" style={{ color: theme.textPrimary }}>Resumo Executivo</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg" style={{ background: theme.primary + '10' }}>
              <TrendingUp className="w-8 h-8 mx-auto mb-2" style={{ color: theme.primary }} />
              <h4 className="font-semibold" style={{ color: theme.textPrimary }}>Performance</h4>
              <p className="text-sm mt-1" style={{ color: theme.textSecondary }}>
                Vendas 12.5% acima da média mensal
              </p>
            </div>
            <div className="text-center p-4 rounded-lg" style={{ background: theme.primary + '10' }}>
              <Users className="w-8 h-8 mx-auto mb-2" style={{ color: theme.primary }} />
              <h4 className="font-semibold" style={{ color: theme.textPrimary }}>Fidelização</h4>
              <p className="text-sm mt-1" style={{ color: theme.textSecondary }}>
                Taxa de retorno de clientes: 68%
              </p>
            </div>
            <div className="text-center p-4 rounded-lg" style={{ background: theme.primary + '10' }}>
              <BarChart3 className="w-8 h-8 mx-auto mb-2" style={{ color: theme.primary }} />
              <h4 className="font-semibold" style={{ color: theme.textPrimary }}>Oportunidade</h4>
              <p className="text-sm mt-1" style={{ color: theme.textSecondary }}>
                Potencial de crescimento: R$ 22.6K
              </p>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}