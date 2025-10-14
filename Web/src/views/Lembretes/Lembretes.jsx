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
          // Fallback para dados mockados se a API não retornar array
          console.warn("API não retornou array, usando dados mockados");
          setLembretes(lembretesMock);
        }
      } catch (error) {
        console.error("Erro ao buscar lembretes:", error);
        setError("Erro ao carregar lembretes. Usando dados de exemplo.");
        // Fallback para dados mockados em caso de erro
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
    return status === true ? 'bg-green-500' : 'bg-gray-400';
  };

  const getStatusText = (status) => {
    return status === true ? 'Ativo' : 'Inativo';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col transition-all duration-300">
        
        {/* Header */}
        <div className="h-20 w-full bg-sky-600 shadow flex items-center justify-between px-6 sticky top-0 z-10">

            <h1 className="text-3xl font-bold text-white" style={{ fontSize: `${fontSize * 1.3}px` }} >
              Lembretes
            </h1>

          <button
            onClick={handleAddLembrete}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            style={{ fontSize: `${fontSize}px` }}
          >
            <Plus size={fontSize} />
            Novo Lembrete
          </button>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto p-6 ml-20 lg:ml-60">
          
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p 
                className="text-gray-600"
                style={{ fontSize: `${fontSize}px` }}
              >
                Carregando lembretes...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center mb-6">
              <p 
                className="text-yellow-700 font-medium"
                style={{ fontSize: `${fontSize}px` }}
              >
                {error}
              </p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && lembretes.length === 0 && (
            <div className="text-center py-12">
              <Pill className="text-gray-300 text-6xl mx-auto mb-4" />
              <p 
                className="text-gray-500 mb-4"
                style={{ fontSize: `${fontSize}px` }}
              >
                Nenhum lembrete cadastrado.
              </p>
              <button
                onClick={handleAddLembrete}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                style={{ fontSize: `${fontSize}px` }}
              >
                Criar Primeiro Lembrete
              </button>
            </div>
          )}

          {/* Lista de Lembretes */}
          {!isLoading && lembretes.length > 0 && (
            <div className="grid gap-4 max-w-4xl mx-auto">
              <p 
                className="text-gray-600 mb-4"
                style={{ fontSize: `${fontSize * 0.9}px` }}
              >
                {lembretes.length} lembrete(s) encontrado(s)
              </p>

              {lembretes.map((lembrete) => (
                <div
                  key={lembrete.id_lembrete}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
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
                            className="font-bold text-gray-900"
                            style={{ fontSize: `${fontSize * 1.1}px` }}
                          >
                            {lembrete.titulo}
                          </h3>
                          <span 
                            className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(lembrete.status)}`}
                          >
                            {getStatusText(lembrete.status)}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <span 
                                className="font-medium text-gray-700"
                                style={{ fontSize: `${fontSize}px` }}
                              >
                                ⏰ {lembrete.horario}
                              </span>
                            </div>
                            {lembrete.dosagem && (
                              <span 
                                className="text-gray-600"
                                style={{ fontSize: `${fontSize}px` }}
                              >
                                💊 {lembrete.dosagem}
                              </span>
                            )}
                          </div>

                          <p 
                            className="text-gray-600"
                            style={{ fontSize: `${fontSize}px` }}
                          >
                            {lembrete.descricao}
                          </p>

                          {lembrete.frequencia && (
                            <div className="flex items-center gap-2">
                              <span 
                                className="text-sm text-gray-500"
                                style={{ fontSize: `${fontSize * 0.9}px` }}
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
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          lembrete.status === 'ativo' 
                            ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        } transition-colors`}
                      >
                        {lembrete.status === 'ativo' ? 'Desativar' : 'Ativar'}
                      </button>
                      <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium hover:bg-blue-200 transition-colors">
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