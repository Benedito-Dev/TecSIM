import React, { useContext } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useElderMode } from '../../context/ElderModeContext';
import { ThemeContext } from '../../context/ThemeContext';
import APIStatus from './APIStatus';

const ChatHeader = ({ onGoBack, isLoading, emTriagem }) => {
  const { fontSize } = useElderMode();
  const { theme } = useContext(ThemeContext);

  return (
    <div 
      className="shadow-lg z-10 w-full h-20 flex-shrink-0"
      style={{ 
        background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})` 
      }}
    >
      <div className="py-4 px-4 text-white">
        <div className="flex w-full justify-between items-center">

          {/* BOTÃO VOLTAR */}
          <button 
            onClick={onGoBack}
            className="flex items-center space-x-1 p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <ChevronLeft size={fontSize * 1.5 * 0.9} />
            <span 
              className="font-semibold hidden sm:inline"
              style={{ fontSize: `${fontSize * 1.1}px` }}
            >
              Dashboard
            </span>
          </button>

          {/* TÍTULO E STATUS */}
          <div className="flex flex-col items-center">
            <h1 
              className="font-bold text-center"
              style={{ fontSize: `${fontSize * 1.3}px` }} 
            >
              Chat - TecSim {emTriagem && '🔍'}
            </h1>
            <div className="flex items-center space-x-2" style={{ fontSize: `${fontSize * 0.85}px` }}>
              <div className="flex items-center space-x-1">
                <div 
                  className={`w-2 h-2 rounded-full ${isLoading ? 'animate-pulse' : ''}`}
                  style={{
                    backgroundColor: isLoading ? theme.warning : theme.success
                  }}
                />
                <span className="font-medium">
                  {isLoading ? 'Processando...' : emTriagem ? 'Em Triagem' : 'Online'}
                </span>
              </div>
              <APIStatus />
            </div>
          </div>

          {/* ESPAÇO PARA ALINHAMENTO */}
          <div className="w-[44px]" /> 
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;