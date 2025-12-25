import React from 'react';
import { Users } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { ClientCard } from './ClientCard';

export const ClientsList = ({ 
  clientes, 
  searchTerm, 
  onIniciarAtendimento, 
  onVerDetalhes, 
  onEditar,
  onClearSearch 
}) => {
  const { theme } = useTheme();

  if (clientes.length === 0) {
    return (
      <div 
        className="text-center py-12 rounded-2xl border"
        style={{
          background: theme.backgroundCard,
          borderColor: theme.border
        }}
      >
        <Users className="text-6xl mx-auto mb-4" style={{ color: theme.textMuted }} />
        <p 
          className="text-lg mb-4"
          style={{ color: theme.textSecondary }}
        >
          {searchTerm ? "Nenhum cliente encontrado para sua busca." : "Nenhum cliente cadastrado."}
        </p>
        {searchTerm && (
          <button 
            onClick={onClearSearch}
            className="hover:opacity-80 underline"
            style={{ color: theme.primary }}
          >
            Limpar busca
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      <p 
        className="text-sm mb-4"
        style={{ color: theme.textSecondary }}
      >
        {clientes.length} cliente(s) encontrado(s)
        {searchTerm && ` para "${searchTerm}"`}
      </p>
      
      <div className="space-y-4">
        {clientes.map((cliente) => (
          <ClientCard 
            key={cliente.id} 
            cliente={cliente}
            onIniciarAtendimento={onIniciarAtendimento}
            onVerDetalhes={onVerDetalhes}
            onEditar={onEditar}
          />
        ))}
      </div>
    </>
  );
};