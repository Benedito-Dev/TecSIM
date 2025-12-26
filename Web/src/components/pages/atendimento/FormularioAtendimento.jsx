import React from 'react';
import { FileText, Activity, Clock } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export const FormularioAtendimento = ({ 
  queixaPrincipal, 
  setQueixaPrincipal, 
  observacoes, 
  setObservacoes, 
  resultadoTriagem 
}) => {
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
        style={{ background: theme.success }}
      >
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Registro do Atendimento
        </h2>
      </div>
      <div className="p-6">
        <form className="space-y-6">
          <div>
            <label 
              className="block text-sm font-semibold mb-3"
              style={{ color: theme.textPrimary }}
            >
              Queixa Principal
            </label>
            <textarea 
              value={queixaPrincipal}
              onChange={(e) => setQueixaPrincipal(e.target.value)}
              style={{
                background: theme.background,
                border: `1px solid ${theme.border}`,
                color: theme.textPrimary
              }}
              className="w-full h-24 p-4 rounded-xl focus:ring-2 focus:border-transparent transition-all resize-none"
              placeholder="Descreva a queixa principal do paciente..."
            />
          </div>
          
          <div>
            <label 
              className="block text-sm font-semibold mb-3"
              style={{ color: theme.textPrimary }}
            >
              Observações do Atendimento
            </label>
            <textarea 
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              style={{
                background: theme.background,
                border: `1px solid ${theme.border}`,
                color: theme.textPrimary
              }}
              className="w-full h-32 p-4 rounded-xl focus:ring-2 focus:border-transparent transition-all resize-none"
              placeholder="Anotações detalhadas sobre o atendimento, diagnóstico, orientações..."
            />
          </div>

          {/* Resultado da Triagem */}
          {resultadoTriagem && (
            <div 
              className="border rounded-xl p-6"
              style={{
                background: theme.primary + '20',
                borderColor: theme.primary
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-800">Resultado da Triagem</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-blue-700">Classificação:</span>
                  <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm font-medium">
                    {resultadoTriagem.classificacao}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-blue-700">Recomendação:</span>
                  <p className="text-sm text-blue-600 mt-1">{resultadoTriagem.recomendacao}</p>
                </div>
                {resultadoTriagem.resumo && (
                  <div>
                    <span className="text-sm font-medium text-blue-700">Resumo:</span>
                    <p className="text-sm text-blue-600 mt-1">{resultadoTriagem.resumo}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timestamp */}
          <div className="flex items-center gap-2 text-xs text-gray-500 pt-4 border-t border-gray-100">
            <Clock className="w-4 h-4" />
            Atendimento iniciado em {new Date().toLocaleString('pt-BR')}
          </div>
        </form>
      </div>
    </div>
  );
};