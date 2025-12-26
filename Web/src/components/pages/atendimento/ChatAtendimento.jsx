import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export const ChatAtendimento = ({ paciente, emTriagem }) => {
  const { theme } = useTheme();

  return (
    <div 
      className="rounded-xl shadow-lg border overflow-hidden"
      style={{
        background: theme.backgroundCard,
        borderColor: theme.border
      }}
    >
      <div 
        className="px-6 py-4"
        style={{ background: theme.primary }}
      >
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Chat - {paciente.nome}
          {emTriagem && (
            <span className="bg-white/20 px-2 py-1 rounded-full text-xs ml-2">
              Triagem Ativa
            </span>
          )}
        </h2>
      </div>
      <div className="p-6 text-center" style={{ color: theme.textSecondary }}>
        Chat de atendimento em desenvolvimento
      </div>
    </div>
  );
};