import React from 'react';
import { Search, Download } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export const ClientsFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  filtroAtivo, 
  setFiltroAtivo 
}) => {
  const { theme } = useTheme();

  return (
    <div 
      className="rounded-2xl p-6 border mb-6"
      style={{
        background: theme.backgroundCard,
        borderColor: theme.border
      }}
    >
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Busca */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={20} />
          </div>
          <input
            type="text"
            placeholder="Buscar por nome, CPF, telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              background: theme.background,
              border: `1px solid ${theme.border}`,
              color: theme.textPrimary
            }}
            className="w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent"
          />
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-4">
          <div 
            className="flex items-center gap-2 rounded-lg p-1"
            style={{ background: theme.backgroundSecondary }}
          >
            <button
              onClick={() => setFiltroAtivo("todos")}
              className="px-3 py-1 rounded-md text-sm font-medium transition-colors"
              style={{
                background: filtroAtivo === "todos" ? theme.backgroundCard : 'transparent',
                color: filtroAtivo === "todos" ? theme.primary : theme.textSecondary
              }}
            >
              Todos
            </button>
            <button
              onClick={() => setFiltroAtivo("ativo")}
              className="px-3 py-1 rounded-md text-sm font-medium transition-colors"
              style={{
                background: filtroAtivo === "ativo" ? theme.backgroundCard : 'transparent',
                color: filtroAtivo === "ativo" ? theme.success : theme.textSecondary
              }}
            >
              Ativos
            </button>
            <button
              onClick={() => setFiltroAtivo("inativo")}
              className="px-3 py-1 rounded-md text-sm font-medium transition-colors"
              style={{
                background: filtroAtivo === "inativo" ? theme.backgroundCard : 'transparent',
                color: filtroAtivo === "inativo" ? theme.textMuted : theme.textSecondary
              }}
            >
              Inativos
            </button>
          </div>

          <button 
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:opacity-80 transition-colors"
            style={{
              background: theme.backgroundSecondary,
              color: theme.textPrimary
            }}
          >
            <Download size={16} />
            Exportar
          </button>
        </div>
      </div>
    </div>
  );
};