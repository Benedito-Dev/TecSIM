import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useTheme } from '../../../context/ThemeContext';

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
  const { theme } = useTheme();

  if (totalPages <= 1) return null;

  return (
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
  );
};

export default PaginationControls;