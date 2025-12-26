import React from 'react';
import { FaPills } from 'react-icons/fa';
import { useTheme } from '../../../context/ThemeContext';

const EmptyState = ({ search, setSearch }) => {
  const { theme } = useTheme();

  return (
    <div className="text-center py-12">
      <FaPills 
        className="text-6xl mx-auto mb-4"
        style={{ color: theme.textMuted }}
      />
      <p style={{ color: theme.textSecondary }}>
        {search ? "Nenhum medicamento encontrado para sua busca." : "Nenhum medicamento cadastrado."}
      </p>
      {search && (
        <button 
          onClick={() => setSearch("")}
          style={{ color: theme.primary }}
          className="mt-2 hover:opacity-80 underline transition-colors"
        >
          Limpar busca
        </button>
      )}
    </div>
  );
};

export default EmptyState;