import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useTheme } from '../../../context/ThemeContext';

const PaginationInfo = ({ 
  currentPage, 
  totalPages, 
  itemsPerPage, 
  totalItems,
  search,
  onPageChange,
  onItemsPerPageChange 
}) => {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
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

      <div className="flex items-center gap-3">
        <span 
          className="text-sm"
          style={{ color: theme.textSecondary }}
        >
          Página {currentPage} de {totalPages}
        </span>
        
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                background: currentPage === 1 ? theme.backgroundSecondary : theme.primary,
                color: currentPage === 1 ? theme.textMuted : theme.textOnPrimary,
                opacity: currentPage === 1 ? 0.5 : 1
              }}
              className="p-1.5 rounded transition-all duration-200 hover:opacity-80 disabled:cursor-not-allowed"
            >
              <FaChevronLeft size={12} />
            </button>
            
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                background: currentPage === totalPages ? theme.backgroundSecondary : theme.primary,
                color: currentPage === totalPages ? theme.textMuted : theme.textOnPrimary,
                opacity: currentPage === totalPages ? 0.5 : 1
              }}
              className="p-1.5 rounded transition-all duration-200 hover:opacity-80 disabled:cursor-not-allowed"
            >
              <FaChevronRight size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaginationInfo;