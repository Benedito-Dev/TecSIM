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
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header moderno */}
        <div 
          className="h-24 w-full shadow-lg flex items-center justify-between px-8 sticky top-0 z-10 border-b"
          style={{ 
            background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`,
            color: theme.textOnPrimary,
            borderColor: theme.border
          }}
        >
          <div className="flex items-center gap-4">
            <div 
              className="p-3 rounded-xl shadow-lg"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            >
              <Pill size={fontSize * 1.2} color="white" />
            </div>
            <div>
              <h1 
                className="text-3xl font-bold mb-1"
                style={{ fontSize: `${fontSize * 1.4}px` }}
              >
                Lembretes
              </h1>
              <p 
                className="opacity-90"
                style={{ fontSize: `${fontSize * 0.85}px` }}
              >
                Gerencie seus medicamentos
              </p>
            </div>
          </div>

          <button
            onClick={handleAddLembrete}
            className="flex items-center gap-3 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            style={{ 
              fontSize: `${fontSize}px`,
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            <Plus size={fontSize * 1.1} />
            Novo Lembrete
          </button>
        </div>

        {/* Conteúdo */}
        <div 
          className="flex-1 overflow-y-auto p-8 ml-20 lg:ml-60"
          style={{ 
            color: theme.textPrimary,
            background: `linear-gradient(to bottom, ${theme.background}, ${theme.backgroundSecondary})`
          }}
        >
          
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <div 
                  className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent mb-6"
                  style={{ borderColor: theme.primary }}
                ></div>
                <Pill 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  size={24}
                  style={{ color: theme.primary }}
                />
              </div>
              <p 
                className="font-medium"
                style={{ 
                  fontSize: `${fontSize * 1.1}px`,
                  color: theme.textSecondary 
                }}
              >
                Carregando seus lembretes...
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
            <div className="text-center py-20">
              <div 
                className="mx-auto mb-8 p-8 rounded-full shadow-lg"
                style={{ 
                  background: `linear-gradient(135deg, ${theme.backgroundCard}, ${theme.backgroundSecondary})`,
                  width: 'fit-content'
                }}
              >
                <Pill 
                  size={64}
                  style={{ color: theme.textMuted }}
                />
              </div>
              <h3 
                className="font-bold mb-3"
                style={{ 
                  fontSize: `${fontSize * 1.3}px`,
                  color: theme.textPrimary 
                }}
              >
                Nenhum lembrete ainda
              </h3>
              <p 
                className="mb-8 max-w-md mx-auto"
                style={{ 
                  fontSize: `${fontSize}px`,
                  color: theme.textSecondary 
                }}
              >
                Comece criando seu primeiro lembrete de medicamento para nunca mais esquecer de tomar.
              </p>
              <button
                onClick={handleAddLembrete}
                className="px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                style={{ 
                  fontSize: `${fontSize}px`,
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`,
                  color: theme.textOnPrimary
                }}
              >
                ✨ Criar Primeiro Lembrete
              </button>
            </div>
          )}

          {/* Lista de Lembretes */}
          {!isLoading && lembretes.length > 0 && (
            <div className="max-w-5xl mx-auto">
              <div 
                className="flex items-center justify-between mb-8 p-4 rounded-xl"
                style={{ background: theme.backgroundCard }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="p-2 rounded-lg"
                    style={{ background: theme.primary + '20' }}
                  >
                    <Pill size={20} style={{ color: theme.primary }} />
                  </div>
                  <div>
                    <h2 
                      className="font-bold"
                      style={{ fontSize: `${fontSize * 1.2}px` }}
                    >
                      Seus Lembretes
                    </h2>
                    <p 
                      style={{ 
                        fontSize: `${fontSize * 0.9}px`,
                        color: theme.textSecondary 
                      }}
                    >
                      {lembretes.length} medicamento{lembretes.length !== 1 ? 's' : ''} cadastrado{lembretes.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-6">
                {lembretes.map((lembrete) => (
                  <div
                    key={lembrete.id_lembrete}
                    className="group rounded-3xl p-8 shadow-md hover:shadow-2xl transition-all duration-500 border-2 hover:border-opacity-50 transform hover:-translate-y-1"
                    style={{
                      background: `linear-gradient(135deg, ${theme.backgroundCard}, ${theme.backgroundSecondary})`,
                      borderColor: theme.border,
                      color: theme.textPrimary
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-6 flex-1">
                        <div 
                          className="p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300"
                          style={{ background: theme.primary + '15' }}
                        >
                          <Pill 
                            size={fontSize * 1.8} 
                            style={{ color: theme.primary }}
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                            <h3 
                              className="font-bold"
                              style={{ fontSize: `${fontSize * 1.3}px` }}
                            >
                              {lembrete.titulo}
                            </h3>
                            <span 
                              className="px-4 py-2 rounded-full text-sm font-semibold shadow-sm"
                              style={{ 
                                background: lembrete.status === 'ativo' ? theme.success + '20' : theme.textMuted + '20',
                                color: lembrete.status === 'ativo' ? theme.success : theme.textMuted,
                                border: `2px solid ${lembrete.status === 'ativo' ? theme.success : theme.textMuted}30`
                              }}
                            >
                              {lembrete.status === 'ativo' ? '✅ Ativo' : '⏸️ Inativo'}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div 
                              className="flex items-center gap-3 p-3 rounded-xl"
                              style={{ background: theme.primary + '10' }}
                            >
                              <span className="text-2xl">⏰</span>
                              <div>
                                <p className="text-sm opacity-75">Horário</p>
                                <p 
                                  className="font-bold"
                                  style={{ fontSize: `${fontSize * 1.1}px` }}
                                >
                                  {lembrete.horario}
                                </p>
                              </div>
                            </div>
                            
                            {lembrete.dosagem && (
                              <div 
                                className="flex items-center gap-3 p-3 rounded-xl"
                                style={{ background: theme.info + '10' }}
                              >
                                <span className="text-2xl">💊</span>
                                <div>
                                  <p className="text-sm opacity-75">Dosagem</p>
                                  <p 
                                    className="font-bold"
                                    style={{ fontSize: `${fontSize * 1.1}px` }}
                                  >
                                    {lembrete.dosagem}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>

                          <div 
                            className="p-4 rounded-xl mb-4"
                            style={{ background: theme.backgroundSecondary }}
                          >
                            <p 
                              className="font-medium mb-2"
                              style={{ fontSize: `${fontSize}px` }}
                            >
                              📝 {lembrete.descricao}
                            </p>
                            
                            {lembrete.frequencia && (
                              <p 
                                className="flex items-center gap-2"
                                style={{ 
                                  fontSize: `${fontSize * 0.9}px`,
                                  color: theme.textSecondary 
                                }}
                              >
                                <span>📅</span>
                                <span>Frequência: <strong>{lembrete.frequencia}</strong></span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 ml-6">
                        <button
                          onClick={() => handleToggleStatus(lembrete.id_lembrete)}
                          className="px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
                          style={{
                            background: lembrete.status === 'ativo' 
                              ? `linear-gradient(135deg, ${theme.error}, ${theme.error}dd)` 
                              : `linear-gradient(135deg, ${theme.success}, ${theme.success}dd)`,
                            color: theme.textOnPrimary
                          }}
                        >
                          {lembrete.status === 'ativo' ? '⏸️ Pausar' : '▶️ Ativar'}
                        </button>
                        <button 
                          className="px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
                          style={{
                            background: `linear-gradient(135deg, ${theme.info}, ${theme.info}dd)`,
                            color: theme.textOnPrimary
                          }}
                        >
                          ✏️ Editar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lembretes;