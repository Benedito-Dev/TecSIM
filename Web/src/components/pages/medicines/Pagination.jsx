import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useTheme } from '../../../context/ThemeContext';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  itemsPerPage, 
  totalItems,
  search,
  onPageChange, 
  onItemsPerPageChange 
}) => {
  const { theme } = useTheme();

  if (totalPages <= 1) return null;

  return (
    <div className="space-y-6">
      {/* Controles superiores */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <p 
            className="text-sm"
            style={{ color: theme.textSecondary }}
          >
            {totalItems} medicamento(s) encontrado(s)
            {search && ` para "${search}"`}
          </p>
          
          <div className="flex items-center gap-2">
            <span 
              className="text-sm font-medium"
              style={{ color: theme.textPrimary }}
            >
              Itens por página:
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              style={{
                background: theme.backgroundCard,
                border: `1px solid ${theme.border}`,
                color: theme.textPrimary
              }}
              className="px-3 py-1 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Indicador de página */}
        <div className="flex items-center gap-4">
          <span 
            className="text-sm"
            style={{ color: theme.textSecondary }}
          >
            Página {currentPage} de {totalPages}
          </span>
          
          {/* Botões de navegação */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                background: currentPage === 1 ? theme.backgroundSecondary : theme.primary,
                color: currentPage === 1 ? theme.textMuted : theme.textOnPrimary,
                opacity: currentPage === 1 ? 0.5 : 1
              }}
              className="p-2 rounded-lg transition-all duration-200 hover:opacity-80 disabled:cursor-not-allowed"
            >
              <FaChevronLeft size={14} />
            </button>
            
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                background: currentPage === totalPages ? theme.backgroundSecondary : theme.primary,
                color: currentPage === totalPages ? theme.textMuted : theme.textOnPrimary,
                opacity: currentPage === totalPages ? 0.5 : 1
              }}
              className="p-2 rounded-lg transition-all duration-200 hover:opacity-80 disabled:cursor-not-allowed"
            >
              <FaChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Controles inferiores */}
      <div className="flex justify-center items-center gap-4 pt-6">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            background: currentPage === 1 ? theme.backgroundSecondary : theme.primary,
            color: currentPage === 1 ? theme.textMuted : theme.textOnPrimary,
            opacity: currentPage === 1 ? 0.5 : 1
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-80 disabled:cursor-not-allowed"
        >
          <FaChevronLeft size={14} />
          Anterior
        </button>
        
        <div className="flex items-center gap-2">
          <span 
            className="text-sm font-medium"
            style={{ color: theme.textPrimary }}
          >
            Página
          </span>
          <span 
            className="px-3 py-1 rounded-lg font-bold"
            style={{
              background: theme.primary,
              color: theme.textOnPrimary
            }}
          >
            {currentPage}
          </span>
          <span 
            className="text-sm"
            style={{ color: theme.textSecondary }}
          >
            de {totalPages}
          </span>
        </div>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            background: currentPage === totalPages ? theme.backgroundSecondary : theme.primary,
            color: currentPage === totalPages ? theme.textMuted : theme.textOnPrimary,
            opacity: currentPage === totalPages ? 0.5 : 1
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-80 disabled:cursor-not-allowed"
        >
          Próxima
          <FaChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;