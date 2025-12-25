import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Pill, Plus, Clock, ArrowLeft, User, Edit, Trash2, Play, Pause, Calendar, Timer } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import { useElderMode } from "../../context/ElderModeContext";
import Sidebar from '../../components/layout/Sidebar';
import { PageContainer } from '../../components/layout/PageContainer';

const LembretesPaciente = () => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const { fontSize } = useElderMode();
  const location = useLocation();
  const { pacienteId } = useParams();
  
  const [lembretes, setLembretes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paciente, setPaciente] = useState(null);

  // Pega os dados do paciente do state da navegação ou busca por ID
  useEffect(() => {
    if (location.state?.paciente) {
      setPaciente(location.state.paciente);
    } else {
      // Aqui você buscaria o paciente pela API usando o pacienteId
      // Por enquanto, vou usar dados mockados
      const pacienteMock = {
        id: pacienteId,
        nome: "Maria Silva Santos",
        cpf: "123.456.789-00"
      };
      setPaciente(pacienteMock);
    }
  }, [location.state, pacienteId]);

  // Dados mockados de lembretes específicos do paciente
  const lembretesMock = [
    { 
      id_lembrete: 1, 
      paciente_id: pacienteId,
      titulo: 'Losartana 50mg', 
      horario: '07:00', 
      descricao: 'Ao acordar, em jejum',
      dosagem: '1 comprimido',
      frequencia: 'Diário',
      status: 'ativo'
    },
    { 
      id_lembrete: 2, 
      paciente_id: pacienteId,
      titulo: 'Metformina 850mg', 
      horario: '18:00', 
      descricao: 'Antes do jantar',
      dosagem: '1 comprimido',
      frequencia: 'Diário',
      status: 'ativo'
    },
    { 
      id_lembrete: 3, 
      paciente_id: pacienteId,
      titulo: 'Omeprazol 20mg', 
      horario: '07:30', 
      descricao: '30 min antes do café',
      dosagem: '1 comprimido',
      frequencia: 'Diário',
      status: 'ativo'
    }
  ];

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    // Simula busca de lembretes do paciente específico
    setTimeout(() => {
      setLembretes(lembretesMock);
      setIsLoading(false);
    }, 1000);
  }, [pacienteId]);

  const handleToggleStatus = (id) => {
    setLembretes(prev => prev.map(lembrete => 
      lembrete.id_lembrete === id 
        ? { ...lembrete, status: lembrete.status === 'ativo' ? 'inativo' : 'ativo' }
        : lembrete
    ));
  };

  const handleDeleteLembrete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este lembrete?')) {
      try {
        setLembretes(prev => prev.filter(lembrete => lembrete.id_lembrete !== id));
        alert('Lembrete excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir lembrete:', error);
        alert('Erro ao excluir lembrete. Tente novamente.');
      }
    }
  };

  const handleNovoLembrete = () => {
    navigate(`/lembretes/paciente/${pacienteId}/novo`, { 
      state: { paciente } 
    });
  };

  const handleVoltarClientes = () => {
    navigate('/clientes');
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <PageContainer 
        title={
          <div className="flex items-center gap-4">
            <button
              onClick={handleVoltarClientes}
              className="p-2 rounded-lg hover:opacity-80 transition-colors"
              style={{ background: theme.backgroundSecondary }}
            >
              <ArrowLeft size={20} style={{ color: theme.textPrimary }} />
            </button>
            <div className="flex items-center gap-3">
              <Clock size={24} style={{ color: theme.primary }} />
              <div>
                <h1 className="text-xl font-bold" style={{ color: theme.textPrimary }}>
                  Lembretes
                </h1>
                {paciente && (
                  <div className="flex items-center gap-2 mt-1">
                    <User size={16} style={{ color: theme.textSecondary }} />
                    <span 
                      className="text-sm font-medium"
                      style={{ color: theme.textSecondary }}
                    >
                      {paciente.nome}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        }
        buttonText="Novo Lembrete"
        onButtonClick={handleNovoLembrete}
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
              Carregando lembretes do paciente...
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
                background: theme.backgroundCard,
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
              Nenhum lembrete para este paciente
            </h3>
            <p 
              className="mb-8 max-w-md mx-auto"
              style={{ 
                fontSize: `${fontSize}px`,
                color: theme.textSecondary 
              }}
            >
              Crie o primeiro lembrete de medicamento para {paciente?.nome}.
            </p>
            <button
              onClick={handleNovoLembrete}
              className="px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              style={{ 
                fontSize: `${fontSize}px`,
                background: theme.primary,
                color: theme.textOnPrimary
              }}
            >
              ✨ Criar Primeiro Lembrete
            </button>
          </div>
        )}

        {/* Lista de Lembretes */}
        {!isLoading && lembretes.length > 0 && (
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header com informações do paciente */}
            <div 
              className="bg-gradient-to-r p-6 rounded-2xl border shadow-sm"
              style={{
                background: `linear-gradient(135deg, ${theme.primary}15, ${theme.info}10)`,
                borderColor: theme.border
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl shadow-lg"
                    style={{
                      background: theme.primary,
                      color: theme.textOnPrimary
                    }}
                  >
                    {paciente?.nome?.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </div>
                  <div>
                    <h2 
                      className="text-2xl font-bold mb-1"
                      style={{ color: theme.textPrimary }}
                    >
                      {paciente?.nome}
                    </h2>
                    <div className="flex items-center gap-4 text-sm">
                      <span style={{ color: theme.textSecondary }}>
                        📋 {lembretes.length} medicamento{lembretes.length !== 1 ? 's' : ''}
                      </span>
                      <span style={{ color: theme.textSecondary }}>
                        ✅ {lembretes.filter(l => l.status === 'ativo').length} ativo{lembretes.filter(l => l.status === 'ativo').length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm" style={{ color: theme.textSecondary }}>Próximo lembrete</p>
                  <p className="text-lg font-bold" style={{ color: theme.primary }}>07:00</p>
                </div>
              </div>
            </div>

            {/* Grid de lembretes */}
            <div className="grid gap-4">
              {lembretes.map((lembrete) => (
                <div
                  key={lembrete.id_lembrete}
                  className="group rounded-2xl border transition-all duration-300 hover:shadow-lg overflow-hidden"
                  style={{
                    background: theme.backgroundCard,
                    borderColor: lembrete.status === 'ativo' ? theme.success + '30' : theme.border
                  }}
                >
                  {/* Status bar */}
                  <div 
                    className="h-1 w-full"
                    style={{
                      background: lembrete.status === 'ativo' 
                        ? `linear-gradient(90deg, ${theme.success}, ${theme.primary})`
                        : theme.textMuted + '30'
                    }}
                  />
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      {/* Conteúdo principal */}
                      <div className="flex items-start gap-4 flex-1">
                        {/* Ícone do medicamento */}
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
                          style={{ 
                            background: lembrete.status === 'ativo' 
                              ? theme.primary + '15' 
                              : theme.textMuted + '15'
                          }}
                        >
                          <Pill 
                            size={20} 
                            style={{ 
                              color: lembrete.status === 'ativo' ? theme.primary : theme.textMuted 
                            }}
                          />
                        </div>
                        
                        {/* Informações do medicamento */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 
                              className="text-lg font-bold truncate"
                              style={{ color: theme.textPrimary }}
                            >
                              {lembrete.titulo}
                            </h3>
                            <span 
                              className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                              style={{ 
                                background: lembrete.status === 'ativo' ? theme.success + '20' : theme.textMuted + '20',
                                color: lembrete.status === 'ativo' ? theme.success : theme.textMuted
                              }}
                            >
                              {lembrete.status === 'ativo' ? (
                                <><Play size={10} /> Ativo</>
                              ) : (
                                <><Pause size={10} /> Pausado</>
                              )}
                            </span>
                          </div>
                          
                          {/* Grid de informações */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div 
                              className="flex items-center gap-2 p-3 rounded-lg"
                              style={{ background: theme.backgroundSecondary }}
                            >
                              <Timer size={16} style={{ color: theme.primary }} />
                              <div>
                                <p className="text-xs" style={{ color: theme.textSecondary }}>Horário</p>
                                <p className="font-semibold" style={{ color: theme.textPrimary }}>
                                  {lembrete.horario}
                                </p>
                              </div>
                            </div>
                            
                            <div 
                              className="flex items-center gap-2 p-3 rounded-lg"
                              style={{ background: theme.backgroundSecondary }}
                            >
                              <Pill size={16} style={{ color: theme.info }} />
                              <div>
                                <p className="text-xs" style={{ color: theme.textSecondary }}>Dosagem</p>
                                <p className="font-semibold" style={{ color: theme.textPrimary }}>
                                  {lembrete.dosagem}
                                </p>
                              </div>
                            </div>
                            
                            <div 
                              className="flex items-center gap-2 p-3 rounded-lg"
                              style={{ background: theme.backgroundSecondary }}
                            >
                              <Calendar size={16} style={{ color: theme.success }} />
                              <div>
                                <p className="text-xs" style={{ color: theme.textSecondary }}>Frequência</p>
                                <p className="font-semibold" style={{ color: theme.textPrimary }}>
                                  {lembrete.frequencia}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Descrição */}
                          <div 
                            className="p-3 rounded-lg"
                            style={{ background: theme.primary + '08' }}
                          >
                            <p 
                              className="text-sm"
                              style={{ color: theme.textSecondary }}
                            >
                              💡 {lembrete.descricao}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleToggleStatus(lembrete.id_lembrete)}
                          className="p-2 rounded-lg transition-all duration-200 hover:scale-105"
                          style={{
                            background: lembrete.status === 'ativo' ? theme.warning + '20' : theme.success + '20',
                            color: lembrete.status === 'ativo' ? theme.warning : theme.success
                          }}
                          title={lembrete.status === 'ativo' ? 'Pausar lembrete' : 'Ativar lembrete'}
                        >
                          {lembrete.status === 'ativo' ? <Pause size={16} /> : <Play size={16} />}
                        </button>
                        
                        <button 
                          className="p-2 rounded-lg transition-all duration-200 hover:scale-105"
                          style={{
                            background: theme.info + '20',
                            color: theme.info
                          }}
                          title="Editar lembrete"
                        >
                          <Edit size={16} />
                        </button>
                        
                        <button 
                          onClick={() => handleDeleteLembrete(lembrete.id_lembrete)}
                          className="p-2 rounded-lg transition-all duration-200 hover:scale-105"
                          style={{
                            background: theme.error + '20',
                            color: theme.error
                          }}
                          title="Excluir lembrete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </PageContainer>
    </div>
  );
};

export default LembretesPaciente;