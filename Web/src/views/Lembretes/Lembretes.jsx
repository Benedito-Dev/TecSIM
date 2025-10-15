import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Pill, Plus } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import { useElderMode } from "../../context/ElderModeContext";
import Sidebar from '../../components/SideBarr';
import { getLembretes } from '../../services/lembretesService';

const Lembretes = () => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const { fontSize } = useElderMode();
  const [lembretes, setLembretes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dados mockados baseados na estrutura esperada da API
  const lembretesMock = [
    { 
      id_lembrete: 1, 
      titulo: 'Paracetamol 500mg', 
      horario: '08:00', 
      descricao: 'Após o café da manhã',
      dosagem: '1 comprimido',
      frequencia: 'Diário',
      status: 'ativo'
    },
    { 
      id_lembrete: 2, 
      titulo: 'Vitamina D', 
      horario: '12:00', 
      descricao: 'Junto ao almoço',
      dosagem: '1 cápsula',
      frequencia: 'Diário',
      status: 'ativo'
    },
    { 
      id_lembrete: 3, 
      titulo: 'Omeprazol 20mg', 
      horario: '07:30', 
      descricao: '30 min antes do café',
      dosagem: '1 comprimido',
      frequencia: 'Diário',
      status: 'ativo'
    },
    { 
      id_lembrete: 4, 
      titulo: 'Losartana 50mg', 
      horario: '07:00', 
      descricao: 'Ao acordar',
      dosagem: '1 comprimido',
      frequencia: 'Diário',
      status: 'ativo'
    },
    { 
      id_lembrete: 5, 
      titulo: 'Metformina 850mg', 
      horario: '18:00', 
      descricao: 'Antes do jantar',
      dosagem: '1 comprimido',
      frequencia: 'Diário',
      status: 'ativo'
    },
    { 
      id_lembrete: 6, 
      titulo: 'Cetirizina 10mg', 
      horario: '21:00', 
      descricao: 'Antes de dormir',
      dosagem: '1 comprimido',
      frequencia: 'Quando necessário',
      status: 'ativo'
    }
  ];

  useEffect(() => {
    async function fetchLembretes() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getLembretes();
        if (Array.isArray(response)) {
          setLembretes(response);
        } else {
          console.warn("API não retornou array, usando dados mockados");
          setLembretes(lembretesMock);
        }
      } catch (error) {
        console.error("Erro ao buscar lembretes:", error);
        setError("Erro ao carregar lembretes. Usando dados de exemplo.");
        setLembretes(lembretesMock);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLembretes();
  }, []);

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  const handleAddLembrete = () => {
    navigate('/lembretes/novo');
  };

  const handleToggleStatus = (id) => {
    setLembretes(prev => prev.map(lembrete => 
      lembrete.id_lembrete === id 
        ? { ...lembrete, status: lembrete.status === true ? false : true }
        : lembrete
    ));
  };

  const getStatusColor = (status) => {
    return status === true ? theme.success : theme.textMuted;
  };

  const getStatusText = (status) => {
    return status === true ? 'Ativo' : 'Inativo';
  };

  return (
    <div 
      className="flex h-screen"
      style={{ background: theme.background }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col transition-all duration-300">
        
        {/* Header */}
        <div 
          className="h-20 w-full shadow flex items-center justify-between px-6 sticky top-0 z-10"
          style={{ 
            background: theme.primary,
            color: theme.textOnPrimary
          }}
        >
          <h1 
            className="text-3xl font-bold"
            style={{ fontSize: `${fontSize * 1.3}px` }}
          >
            Lembretes
          </h1>

          <button
            onClick={handleAddLembrete}
            className="flex items-center gap-2 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors"
            style={{ 
              fontSize: `${fontSize}px`,
              background: theme.primaryDark 
            }}
          >
            <Plus size={fontSize} />
            Novo Lembrete
          </button>
        </div>

        {/* Conteúdo */}
        <div 
          className="flex-1 overflow-y-auto p-6 ml-20 lg:ml-60"
          style={{ color: theme.textPrimary }}
        >
          
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div 
                className="animate-spin rounded-full h-12 w-12 border-b-2 mb-4"
                style={{ borderColor: theme.primary }}
              ></div>
              <p 
                style={{ 
                  fontSize: `${fontSize}px`,
                  color: theme.textSecondary 
                }}
              >
                Carregando lembretes...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div 
              className="border rounded-xl p-6 text-center mb-6"
              style={{
                background: theme.backgroundSecondary,
                borderColor: theme.warning,
                color: theme.textPrimary
              }}
            >
              <p 
                className="font-medium"
                style={{ 
                  fontSize: `${fontSize}px`,
                  color: theme.warning 
                }}
              >
                {error}
              </p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && lembretes.length === 0 && (
            <div className="text-center py-12">
              <Pill 
                className="text-6xl mx-auto mb-4"
                style={{ color: theme.textMuted }}
              />
              <p 
                className="mb-4"
                style={{ 
                  fontSize: `${fontSize}px`,
                  color: theme.textSecondary 
                }}
              >
                Nenhum lembrete cadastrado.
              </p>
              <button
                onClick={handleAddLembrete}
                className="text-white px-6 py-3 rounded-lg hover:opacity-90 transition-colors"
                style={{ 
                  fontSize: `${fontSize}px`,
                  background: theme.primary 
                }}
              >
                Criar Primeiro Lembrete
              </button>
            </div>
          )}

          {/* Lista de Lembretes */}
          {!isLoading && lembretes.length > 0 && (
            <div className="grid gap-4 max-w-4xl mx-auto">
              <p 
                className="mb-4"
                style={{ 
                  fontSize: `${fontSize * 0.9}px`,
                  color: theme.textSecondary 
                }}
              >
                {lembretes.length} lembrete(s) encontrado(s)
              </p>

              {lembretes.map((lembrete) => (
                <div
                  key={lembrete.id_lembrete}
                  className="rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border"
                  style={{
                    background: theme.backgroundCard,
                    borderColor: theme.border,
                    color: theme.textPrimary
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <Pill 
                        size={fontSize * 1.5} 
                        className="mt-1"
                        style={{ color: theme.primary }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 
                            className="font-bold"
                            style={{ fontSize: `${fontSize * 1.1}px` }}
                          >
                            {lembrete.titulo}
                          </h3>
                          <span 
                            className="px-2 py-1 rounded-full text-xs font-medium text-white"
                            style={{ background: getStatusColor(lembrete.status) }}
                          >
                            {getStatusText(lembrete.status)}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <span 
                                className="font-medium"
                                style={{ 
                                  fontSize: `${fontSize}px`,
                                  color: theme.textPrimary 
                                }}
                              >
                                ⏰ {lembrete.horario}
                              </span>
                            </div>
                            {lembrete.dosagem && (
                              <span 
                                style={{ 
                                  fontSize: `${fontSize}px`,
                                  color: theme.textSecondary 
                                }}
                              >
                                💊 {lembrete.dosagem}
                              </span>
                            )}
                          </div>

                          <p 
                            style={{ 
                              fontSize: `${fontSize}px`,
                              color: theme.textSecondary 
                            }}
                          >
                            {lembrete.descricao}
                          </p>

                          {lembrete.frequencia && (
                            <div className="flex items-center gap-2">
                              <span 
                                className="text-sm"
                                style={{ 
                                  fontSize: `${fontSize * 0.9}px`,
                                  color: theme.textMuted 
                                }}
                              >
                                📅 Frequência: {lembrete.frequencia}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <button
                        onClick={() => handleToggleStatus(lembrete.id_lembrete)}
                        className="px-3 py-1 rounded text-sm font-medium transition-colors"
                        style={{
                          background: lembrete.status === 'ativo' ? theme.error : theme.success,
                          color: theme.textOnPrimary
                        }}
                      >
                        {lembrete.status === 'ativo' ? 'Desativar' : 'Ativar'}
                      </button>
                      <button 
                        className="px-3 py-1 rounded text-sm font-medium transition-colors"
                        style={{
                          background: theme.info,
                          color: theme.textOnPrimary
                        }}
                      >
                        Editar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lembretes;