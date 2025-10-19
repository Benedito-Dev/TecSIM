import React from 'react';
import { ArrowLeft, Users, AlertCircle, Zap } from 'lucide-react';

export default function ChatHeaderNovosUsuarios({ 
  onGoBack, 
  isLoading, 
  emTriagem, 
  protocoloAtivo 
}) {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onGoBack}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-semibold text-lg">
                TecSim - Primeiro Atendimento
              </h1>
              <p className="text-blue-100 text-sm">
                {emTriagem ? 'Realizando triagem...' : 'Assistente de saúde básica'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status do protocolo */}
          {protocoloAtivo && (
            <div className="bg-white/20 px-3 py-1 rounded-full flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">
                {protocoloAtivo.nome.replace('Protocolo - ', '')}
              </span>
            </div>
          )}

          {/* Status da triagem */}
          {emTriagem && (
            <div className="bg-yellow-500/20 px-3 py-1 rounded-full flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Triagem Ativa</span>
            </div>
          )}

          {/* Indicador de carregamento */}
          {isLoading && (
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Analisando...</span>
            </div>
          )}
        </div>
      </div>

      {/* Barra de progresso para novos usuários */}
      <div className="mt-3 bg-white/10 rounded-full h-1">
        <div 
          className="bg-white h-1 rounded-full transition-all duration-500"
          style={{ 
            width: emTriagem ? '75%' : protocoloAtivo ? '50%' : '25%' 
          }}
        ></div>
      </div>
    </div>
  );
}