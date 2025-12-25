import React from 'react';
import { Stethoscope, User, ArrowLeft, Save } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export const AtendimentoHeader = ({ paciente, emTriagem, onVoltar, onSalvar }) => {
  const { theme } = useTheme();

  return (
    <div 
      className="h-20 shadow flex items-center px-6 sticky top-0 z-10"
      style={{ 
        background: theme.primary,
        color: theme.textOnPrimary
      }}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <Stethoscope className="w-8 h-8" />
          <div>
            <h1 className="text-3xl font-bold">Atendimento Médico</h1>
            <p className="text-sm opacity-90 flex items-center gap-2">
              <User className="w-4 h-4" />
              {paciente.nome} • CPF: {paciente.cpf}
              {emTriagem && (
                <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-medium ml-2">
                  Em Triagem
                </span>
              )}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm opacity-75">Data/Hora</p>
            <p className="text-sm font-medium">
              {new Date().toLocaleString('pt-BR')}
            </p>
          </div>
          <button 
            onClick={onVoltar}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
          <button
            onClick={onSalvar} 
            className="flex items-center gap-2 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all shadow-lg"
          >
            <Save className="w-4 h-4" />
            Salvar Atendimento
          </button>
        </div>
      </div>
    </div>
  );
};