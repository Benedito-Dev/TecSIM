// src/pages/AtendimentoPaciente.jsx
import { 
  MessageSquare, 
  FileText, 
  Pill,
  Phone,
  Mail,
  MapPin,
  Stethoscope,
  AlertTriangle,
  Clock,
  User,
  Save,
  ArrowLeft,
  Activity,
  TrendingUp,
  BarChart3,
  Heart,
  Calendar,
  Target,
  Droplets,
  Zap
} from "lucide-react";
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Sidebar from '../../components/SideBarr';
import AtendimentoChat from '../../components/Chat/AtendimentoChat';
import ProtocoloContinuidade from '../../components/ProtocoloContinuidade';
import IntegracaoSUS from '../../components/IntegracaoSUS';
import { usePacienteCondicoes } from '../../hooks/usePacienteCondicoes';

export default function AtendimentoPaciente() {
  const location = useLocation();
  const navigate = useNavigate();
  const { paciente } = location.state || {};
  const { theme } = useTheme();
  
  const [queixaPrincipal, setQueixaPrincipal] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [resultadoTriagem, setResultadoTriagem] = useState(null);
  const [emTriagem, setEmTriagem] = useState(false);

  const { condicoes, adicionarCondicao, removerCondicao } = usePacienteCondicoes(paciente?.id);

  // Função para determinar o tipo de gráfico baseado nas condições do paciente
  const getGraficoEspecifico = () => {
    const condicoesPaciente = paciente?.condicoesCronicas || condicoes || [];
    
    // Verifica se é diabético
    const isDiabetico = condicoesPaciente.some(condicao => 
      condicao.toLowerCase().includes('diabetes') || 
      condicao.toLowerCase().includes('diabético')
    );
    
    // Verifica se é hipertenso
    const isHipertenso = condicoesPaciente.some(condicao => 
      condicao.toLowerCase().includes('hipertensão') || 
      condicao.toLowerCase().includes('hipertenso')
    );
    
    if (isDiabetico && isHipertenso) {
      return 'ambos';
    } else if (isDiabetico) {
      return 'diabetes';
    } else if (isHipertenso) {
      return 'hipertensao';
    } else {
      return 'geral';
    }
  };

  const tipoGrafico = getGraficoEspecifico();

  // Função para gerar resumo contextual dinâmico
  const getResumoContextual = () => {
    const idade = paciente.idade || Math.floor(Math.random() * 40) + 25;
    const temAlergias = paciente.alergias?.length > 0;
    const temMedicamentos = paciente.medicamentosContinuos?.length > 0;
    const numCondicoes = condicoes.length;
    
    const perfis = {
      diabetes: {
        perfil: `Paciente de ${idade} anos com diabetes tipo 2 há ${Math.floor(Math.random() * 8) + 2} anos. ${temMedicamentos ? 'Uso regular de medicação hipoglicemiante.' : 'Controle através de dieta e exercícios.'} HbA1c atual: ${(Math.random() * 2 + 6.5).toFixed(1)}%.`,
        padrao: `Consultas ${idade > 60 ? 'mensais' : 'bimestrais'} com monitoramento glicêmico. ${temAlergias ? 'Requer cuidado especial com medicações devido às alergias.' : 'Boa tolerância medicamentosa.'} Histórico de ${Math.floor(Math.random() * 15) + 8} consultas no último ano.`,
        indicadores: { adesao: Math.floor(Math.random() * 20) + 75, condicao: numCondicoes > 1 ? 'Complexa' : 'Controlada' }
      },
      hipertensao: {
        perfil: `Paciente de ${idade} anos com hipertensão arterial ${idade > 50 ? 'essencial' : 'secundária'}. PA média: ${120 + Math.floor(Math.random() * 30)}/${80 + Math.floor(Math.random() * 20)} mmHg. ${temMedicamentos ? 'Uso de anti-hipertensivos.' : 'Controle não medicamentoso.'}`,
        padrao: `Acompanhamento ${temMedicamentos ? 'trimestral' : 'semestral'} com MAPA quando necessário. ${temAlergias ? 'Limitações medicamentosas por alergias.' : 'Ampla gama terapêutica disponível.'} ${Math.floor(Math.random() * 12) + 6} consultas nos últimos 18 meses.`,
        indicadores: { adesao: Math.floor(Math.random() * 25) + 70, condicao: idade > 60 ? 'Estável' : 'Controlada' }
      },
      ambos: {
        perfil: `Paciente de ${idade} anos com síndrome metabólica (DM2 + HAS). Manejo integrado de ambas condições. ${temMedicamentos ? 'Polifarmácia controlada.' : 'Abordagem não medicamentosa prioritária.'} Risco cardiovascular ${idade > 55 ? 'alto' : 'moderado'}.`,
        padrao: `Protocolo intensivo com consultas mensais. ${temAlergias ? 'Plano terapêutico adaptado às restrições alérgicas.' : 'Flexibilidade terapêutica completa.'} Equipe multidisciplinar envolvida. ${Math.floor(Math.random() * 20) + 15} atendimentos no último ano.`,
        indicadores: { adesao: Math.floor(Math.random() * 15) + 80, condicao: 'Multimorbidade' }
      },
      geral: {
        perfil: `Paciente de ${idade} anos em acompanhamento ${idade < 30 ? 'preventivo jovem' : idade > 60 ? 'geriátrico' : 'de rotina'}. ${temAlergias ? 'Histórico alérgico documentado.' : 'Sem restrições alérgicas conhecidas.'} ${temMedicamentos ? 'Uso ocasional de medicações.' : 'Raramente necessita medicação.'}`,
        padrao: `Check-ups ${idade > 50 ? 'semestrais' : 'anuais'} com foco preventivo. ${numCondicoes > 0 ? 'Monitoramento de fatores de risco.' : 'Manutenção do estado de saúde.'} Excelente adesão às orientações preventivas.`,
        indicadores: { adesao: Math.floor(Math.random() * 10) + 90, condicao: 'Preventivo' }
      }
    };
    
    return perfis[tipoGrafico] || perfis.geral;
  };

  // Função para gerar dados de acompanhamento clínico dinâmicos
  const getAcompanhamentoClinico = () => {
    const baseData = {
      trimestre: Math.floor(Math.random() * 3) + 3,
      ano: Math.floor(Math.random() * 8) + 8,
      comparecimento: Math.floor(Math.random() * 10) + 90
    };
    
    const especializado = {
      diabetes: {
        valores: [180, 165, 140, 120, 105, 95],
        cores: ['bg-red-500', 'bg-red-400', 'bg-yellow-400', 'bg-green-400', 'bg-green-400', 'bg-green-500'],
        atual: '95 mg/dL',
        meta: '<100 mg/dL'
      },
      hipertensao: {
        valores: [160, 145, 135, 132, 128, 125],
        cores: ['bg-red-400', 'bg-yellow-400', 'bg-green-400', 'bg-green-400', 'bg-green-400', 'bg-green-500'],
        atual: '125/80 mmHg',
        meta: '<140/90 mmHg'
      }
    };
    
    return { baseData, especializado };
  };

  const resumoContextual = getResumoContextual();
  const acompanhamentoData = getAcompanhamentoClinico();

  const handleTriagemComplete = (resultado) => {
    setResultadoTriagem(resultado);
    if (!queixaPrincipal) {
      setQueixaPrincipal(`Triagem realizada: ${resultado.classificacao}`);
    }
  };

  const handleCondicoesUpdate = async (acao, dados) => {
    try {
      if (acao === 'adicionar') {
        await adicionarCondicao({ ...dados, id_paciente: paciente.id });
      } else if (acao === 'remover') {
        await removerCondicao(dados);
      }
    } catch (error) {
      console.error('Erro ao atualizar condições:', error);
    }
  };

  // Fallback caso acessem a página diretamente sem dados
  if (!paciente) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Paciente não selecionado</h2>
          <p className="text-gray-600 mb-6">Nenhum paciente foi selecionado para atendimento.</p>
          <button 
            onClick={() => navigate('/clientes')}
            className="flex items-center gap-2 mx-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Clientes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex h-screen"
      style={{ background: theme.background }}
    >
      {/* Sidebar */}
      <Sidebar />
      
      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col transition-all duration-300">
        {/* Navbar */}
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
                onClick={() => navigate('/clientes')}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </button>
              <button
                onClick={() => navigate('/clientes')} 
                className="flex items-center gap-2 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all shadow-lg"
              >
                <Save className="w-4 h-4" />
                Salvar Atendimento
              </button>
            </div>
          </div>
        </div>

        {/* Conteúdo com margem para sidebar */}
        <div 
          className="flex-1 overflow-y-auto ml-20 lg:ml-60 p-6"
          style={{ color: theme.textPrimary }}
        >

        {/* Cards de Informações do Paciente */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Dados Pessoais */}
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
                <User className="w-5 h-5" />
                Dados Pessoais
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4" style={{ color: theme.textMuted }} />
                  <span 
                    className="text-sm"
                    style={{ color: theme.textSecondary }}
                  >
                    Nome:
                  </span>
                  <span 
                    className="text-sm font-medium"
                    style={{ color: theme.textPrimary }}
                  >
                    {paciente.nome}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4" style={{ color: theme.textMuted }} />
                  <span 
                    className="text-sm"
                    style={{ color: theme.textSecondary }}
                  >
                    CPF:
                  </span>
                  <span 
                    className="text-sm font-medium"
                    style={{ color: theme.textPrimary }}
                  >
                    {paciente.cpf}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4" style={{ color: theme.textMuted }} />
                  <span 
                    className="text-sm"
                    style={{ color: theme.textSecondary }}
                  >
                    Telefone:
                  </span>
                  <span 
                    className="text-sm font-medium"
                    style={{ color: theme.textPrimary }}
                  >
                    {paciente.telefone}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4" style={{ color: theme.textMuted }} />
                  <span 
                    className="text-sm"
                    style={{ color: theme.textSecondary }}
                  >
                    Email:
                  </span>
                  <span 
                    className="text-sm font-medium"
                    style={{ color: theme.textPrimary }}
                  >
                    {paciente.email}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4" style={{ color: theme.textMuted }} />
                  <span 
                    className="text-sm"
                    style={{ color: theme.textSecondary }}
                  >
                    Endereço:
                  </span>
                  <span 
                    className="text-sm font-medium"
                    style={{ color: theme.textPrimary }}
                  >
                    {paciente.endereco}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Alergias */}
          <div 
            className="rounded-xl shadow-lg border overflow-hidden"
            style={{
              background: theme.backgroundCard,
              borderColor: theme.border
            }}
          >
            <div 
              className="px-6 py-4"
              style={{ background: theme.error }}
            >
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Alergias
              </h2>
            </div>
            <div className="p-6">
              {paciente.alergias?.length > 0 ? (
                <div className="space-y-2">
                  {paciente.alergias.map((alergia, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-3 p-2 rounded-lg"
                      style={{ background: theme.error + '20' }}
                    >
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ background: theme.error }}
                      ></div>
                      <span 
                        className="text-sm font-medium"
                        style={{ color: theme.error }}
                      >
                        {alergia}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2" style={{ color: theme.textMuted }} />
                  <p 
                    className="text-sm"
                    style={{ color: theme.textSecondary }}
                  >
                    Nenhuma alergia registrada
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Medicamentos Contínuos */}
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
                <Pill className="w-5 h-5" />
                Medicamentos
              </h2>
            </div>
            <div className="p-6">
              {paciente.medicamentosContinuos?.length > 0 ? (
                <div className="space-y-2">
                  {paciente.medicamentosContinuos.map((medicamento, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-3 p-2 rounded-lg"
                      style={{ background: theme.success + '20' }}
                    >
                      <Pill className="w-4 h-4" style={{ color: theme.success }} />
                      <span 
                        className="text-sm font-medium"
                        style={{ color: theme.success }}
                      >
                        {medicamento}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Pill className="w-8 h-8 mx-auto mb-2" style={{ color: theme.textMuted }} />
                  <p 
                    className="text-sm"
                    style={{ color: theme.textSecondary }}
                  >
                    Nenhum medicamento contínuo
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Protocolo de Continuidade */}
        <ProtocoloContinuidade 
          paciente={paciente}
          tipoGrafico={tipoGrafico}
          ultimoAtendimento={{data: '15/01/2024', farmaceutico: 'Dr. Silva'}}
        />

        {/* Integração SUS */}
        <IntegracaoSUS paciente={paciente} />

        {/* Serviços ClinicFarma - Acompanhamento de Adesão */}
        <div className="mb-8">
          <div 
            className="rounded-xl shadow-lg border overflow-hidden"
            style={{
              background: theme.backgroundCard,
              borderColor: theme.border
            }}
          >
            <div 
              className="px-6 py-4"
              style={{ background: theme.info }}
            >
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Stethoscope className="w-5 h-5" />
                Serviços ClinicFarma - Acompanhamento de Adesão
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Monitoramento Glicêmico */}
                {(tipoGrafico === 'diabetes' || tipoGrafico === 'ambos') && (
                  <div 
                    className="border rounded-lg p-4"
                    style={{
                      background: theme.primary + '20',
                      borderColor: theme.primary
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Droplets className="w-5 h-5" style={{ color: theme.primary }} />
                      <h3 
                        className="font-semibold"
                        style={{ color: theme.primary }}
                      >
                        Monitoramento Glicêmico
                      </h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span style={{ color: theme.primary }}>Última medição:</span>
                        <span 
                          className="font-medium"
                          style={{ color: theme.textPrimary }}
                        >
                          há 3 dias
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: theme.primary }}>Adesão mensal:</span>
                        <span 
                          className="font-medium"
                          style={{ color: theme.success }}
                        >
                          87%
                        </span>
                      </div>
                      <div className="mt-3">
                        <button 
                          className="w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors hover:opacity-80"
                          style={{
                            background: theme.primary + '30',
                            color: theme.primary
                          }}
                        >
                          Agendar Consulta
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Controle Pressórico */}
                {(tipoGrafico === 'hipertensao' || tipoGrafico === 'ambos') && (
                  <div 
                    className="border rounded-lg p-4"
                    style={{
                      background: theme.error + '20',
                      borderColor: theme.error
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Heart className="w-5 h-5" style={{ color: theme.error }} />
                      <h3 
                        className="font-semibold"
                        style={{ color: theme.error }}
                      >
                        Controle Pressórico
                      </h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span style={{ color: theme.error }}>Última aferição:</span>
                        <span 
                          className="font-medium"
                          style={{ color: theme.textPrimary }}
                        >
                          há 5 dias
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: theme.error }}>Meta atingida:</span>
                        <span 
                          className="font-medium"
                          style={{ color: theme.success }}
                        >
                          92%
                        </span>
                      </div>
                      <div className="mt-3">
                        <button 
                          className="w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors hover:opacity-80"
                          style={{
                            background: theme.error + '30',
                            color: theme.error
                          }}
                        >
                          Verificar Pressão
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Adesão Medicamentosa */}
                <div 
                  className="border rounded-lg p-4"
                  style={{
                    background: theme.success + '20',
                    borderColor: theme.success
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Pill className="w-5 h-5" style={{ color: theme.success }} />
                    <h3 
                      className="font-semibold"
                      style={{ color: theme.success }}
                    >
                      Adesão Medicamentosa
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span style={{ color: theme.success }}>Doses tomadas:</span>
                      <span 
                        className="font-medium"
                        style={{ color: theme.textPrimary }}
                      >
                        28/30
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: theme.success }}>Taxa de adesão:</span>
                      <span 
                        className="font-medium"
                        style={{ color: theme.success }}
                      >
                        93%
                      </span>
                    </div>
                    <div className="mt-3">
                      <button 
                        className="w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors hover:opacity-80"
                        style={{
                          background: theme.success + '30',
                          color: theme.success
                        }}
                      >
                        Revisar Medicações
                      </button>
                    </div>
                  </div>
                </div>

                {/* Consultas Programadas */}
                <div 
                  className="border rounded-lg p-4"
                  style={{
                    background: theme.info + '20',
                    borderColor: theme.info
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-5 h-5" style={{ color: theme.info }} />
                    <h3 
                      className="font-semibold"
                      style={{ color: theme.info }}
                    >
                      Consultas Programadas
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span style={{ color: theme.info }}>Próxima consulta:</span>
                      <span 
                        className="font-medium"
                        style={{ color: theme.textPrimary }}
                      >
                        15/02
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: theme.info }}>Comparecimento:</span>
                      <span 
                        className="font-medium"
                        style={{ color: theme.success }}
                      >
                        95%
                      </span>
                    </div>
                    <div className="mt-3">
                      <button 
                        className="w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors hover:opacity-80"
                        style={{
                          background: theme.info + '30',
                          color: theme.info
                        }}
                      >
                        Reagendar
                      </button>
                    </div>
                  </div>
                </div>

                {/* Exames Laboratoriais */}
                <div 
                  className="border rounded-lg p-4"
                  style={{
                    background: theme.warning + '20',
                    borderColor: theme.warning
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-5 h-5" style={{ color: theme.warning }} />
                    <h3 
                      className="font-semibold"
                      style={{ color: theme.warning }}
                    >
                      Exames Laboratoriais
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span style={{ color: theme.warning }}>Último exame:</span>
                      <span 
                        className="font-medium"
                        style={{ color: theme.textPrimary }}
                      >
                        10/01
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: theme.warning }}>Próximo:</span>
                      <span 
                        className="font-medium"
                        style={{ color: theme.warning }}
                      >
                        10/03
                      </span>
                    </div>
                    <div className="mt-3">
                      <button 
                        className="w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors hover:opacity-80"
                        style={{
                          background: theme.warning + '30',
                          color: theme.warning
                        }}
                      >
                        Solicitar Exames
                      </button>
                    </div>
                  </div>
                </div>

                {/* Orientação Nutricional */}
                <div 
                  className="border rounded-lg p-4"
                  style={{
                    background: theme.warning + '15',
                    borderColor: theme.warning
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-5 h-5" style={{ color: theme.warning }} />
                    <h3 
                      className="font-semibold"
                      style={{ color: theme.warning }}
                    >
                      Orientação Nutricional
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span style={{ color: theme.warning }}>Última consulta:</span>
                      <span 
                        className="font-medium"
                        style={{ color: theme.textPrimary }}
                      >
                        20/01
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: theme.warning }}>Adesão dieta:</span>
                      <span 
                        className="font-medium"
                        style={{ color: theme.success }}
                      >
                        78%
                      </span>
                    </div>
                    <div className="mt-3">
                      <button 
                        className="w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors hover:opacity-80"
                        style={{
                          background: theme.warning + '30',
                          color: theme.warning
                        }}
                      >
                        Agendar Nutricionista
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resumo de Adesão Geral */}
              <div 
                className="mt-6 rounded-lg p-4"
                style={{ background: theme.backgroundSecondary }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 
                    className="font-semibold"
                    style={{ color: theme.textPrimary }}
                  >
                    Resumo de Adesão ao Tratamento
                  </h3>
                  <span 
                    className="text-2xl font-bold"
                    style={{ color: theme.success }}
                  >
                    {resumoContextual.indicadores.adesao}%
                  </span>
                </div>
                <div 
                  className="w-full rounded-full h-3"
                  style={{ background: theme.border }}
                >
                  <div 
                    className="h-3 rounded-full transition-all duration-500"
                    style={{
                      background: `linear-gradient(to right, ${theme.success}, ${theme.success}dd)`,
                      width: `${resumoContextual.indicadores.adesao}%`
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs mt-2">
                  <span style={{ color: theme.textSecondary }}>Baixa Adesão</span>
                  <span style={{ color: theme.textSecondary }}>Alta Adesão</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resumo Contextual e Gráficos de Acompanhamento */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Resumo Contextual IA */}
          <div 
            className="rounded-xl shadow-lg border overflow-hidden"
            style={{
              background: theme.backgroundCard,
              borderColor: theme.border
            }}
          >
            <div 
              className="px-6 py-4"
              style={{ background: theme.info }}
            >
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Target className="w-5 h-5" />
                Resumo Contextual IA
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div 
                  className="border rounded-lg p-4"
                  style={{
                    background: theme.info + '20',
                    borderColor: theme.info
                  }}
                >
                  <h3 
                    className="font-semibold mb-2"
                    style={{ color: theme.info }}
                  >
                    Perfil do Paciente
                  </h3>
                  <p 
                    className="text-sm"
                    style={{ color: theme.textPrimary }}
                  >
                    {resumoContextual.perfil}
                  </p>
                </div>
                
                <div 
                  className="border rounded-lg p-4"
                  style={{
                    background: theme.primary + '20',
                    borderColor: theme.primary
                  }}
                >
                  <h3 
                    className="font-semibold mb-2"
                    style={{ color: theme.primary }}
                  >
                    Padrão de Atendimentos
                  </h3>
                  <p 
                    className="text-sm"
                    style={{ color: theme.textPrimary }}
                  >
                    {resumoContextual.padrao}
                  </p>
                </div>
                
                <div 
                  className="border rounded-lg p-4"
                  style={{
                    background: theme.success + '20',
                    borderColor: theme.success
                  }}
                >
                  <h3 
                    className="font-semibold mb-2"
                    style={{ color: theme.success }}
                  >
                    Indicadores de Saúde
                  </h3>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="text-center">
                      <div 
                        className="text-lg font-bold"
                        style={{ color: theme.success }}
                      >
                        {resumoContextual.indicadores.adesao}%
                      </div>
                      <div 
                        className="text-xs"
                        style={{ color: theme.textSecondary }}
                      >
                        Adesão Medicamentosa
                      </div>
                    </div>
                    <div className="text-center">
                      <div 
                        className="text-lg font-bold"
                        style={{ color: theme.primary }}
                      >
                        {resumoContextual.indicadores.condicao}
                      </div>
                      <div 
                        className="text-xs"
                        style={{ color: theme.textSecondary }}
                      >
                        Condição Geral
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gráficos de Acompanhamento */}
          <div 
            className="rounded-xl shadow-lg border overflow-hidden"
            style={{
              background: theme.backgroundCard,
              borderColor: theme.border
            }}
          >
            <div 
              className="px-6 py-4"
              style={{ background: theme.warning }}
            >
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Acompanhamento Clínico
              </h2>
            </div>
            <div className="p-6">
              {/* Gráfico Específico por Condição */}
              {tipoGrafico === 'diabetes' && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Droplets className="w-4 h-4" style={{ color: theme.primary }} />
                    <h3 
                      className="font-semibold"
                      style={{ color: theme.textPrimary }}
                    >
                      Glicemia (últimos 6 meses)
                    </h3>
                  </div>
                  <div 
                    className="rounded-lg p-4"
                    style={{ background: theme.backgroundSecondary }}
                  >
                    <div className="flex justify-between items-end h-20 mb-2">
                      {['Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'].map((mes, index) => {
                        const altura = Math.max(15, 60 - (index * 8) - Math.random() * 10);
                        const cor = altura > 40 ? 'bg-red-400' : altura > 25 ? 'bg-yellow-400' : 'bg-green-400';
                        return (
                          <div key={mes} className="flex flex-col items-center">
                            <div className={`w-6 ${cor} rounded-t`} style={{height: `${altura}px`}}></div>
                            <span 
                              className="text-xs mt-1"
                              style={{ color: theme.textSecondary }}
                            >
                              {mes}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div 
                      className="text-xs text-center"
                      style={{ color: theme.textSecondary }}
                    >
                      Atual: {acompanhamentoData.especializado.diabetes?.atual} • Meta: {acompanhamentoData.especializado.diabetes?.meta}
                    </div>
                  </div>
                </div>
              )}

              {tipoGrafico === 'hipertensao' && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="w-4 h-4 text-red-500" />
                    <h3 className="font-semibold text-gray-800">Pressão Arterial (últimos 6 meses)</h3>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-end h-20 mb-2">
                      {['Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'].map((mes, index) => {
                        const altura = Math.max(15, 50 - (index * 6) - Math.random() * 8);
                        const cor = altura > 35 ? 'bg-red-400' : altura > 25 ? 'bg-yellow-400' : 'bg-green-400';
                        return (
                          <div key={mes} className="flex flex-col items-center">
                            <div className={`w-6 ${cor} rounded-t`} style={{height: `${altura}px`}}></div>
                            <span className="text-xs text-gray-600 mt-1">{mes}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="text-xs text-gray-500 text-center">
                      Atual: {acompanhamentoData.especializado.hipertensao?.atual} • Meta: {acompanhamentoData.especializado.hipertensao?.meta}
                    </div>
                  </div>
                </div>
              )}

              {tipoGrafico === 'ambos' && (
                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Pressão Arterial */}
                    <div>
                      <div className="flex items-center gap-1 mb-2">
                        <Heart className="w-3 h-3 text-red-500" />
                        <h4 className="text-sm font-semibold" style={{ color: theme.textPrimary }}>Pressão Arterial</h4>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between items-end h-12 mb-1">
                          {[30, 22, 15, 12].map((altura, index) => {
                            const cor = altura > 25 ? 'bg-red-400' : altura > 18 ? 'bg-yellow-400' : 'bg-green-400';
                            return (
                              <div key={index} className={`w-3 ${cor} rounded-t`} style={{height: `${altura}px`}}></div>
                            );
                          })}
                        </div>
                        <div className="text-xs text-gray-500 text-center">{120 + Math.floor(Math.random() * 15)}/{75 + Math.floor(Math.random() * 10)}</div>
                      </div>
                    </div>
                    {/* Glicemia */}
                    <div>
                      <div className="flex items-center gap-1 mb-2">
                        <Droplets className="w-3 h-3 text-blue-500" />
                        <h4 className="text-sm font-semibold" style={{ color: theme.textPrimary }} >Glicemia</h4>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between items-end h-12 mb-1">
                          {[35, 25, 18, 15].map((altura, index) => {
                            const cor = altura > 30 ? 'bg-red-400' : altura > 20 ? 'bg-yellow-400' : 'bg-green-400';
                            return (
                              <div key={index} className={`w-3 ${cor} rounded-t`} style={{height: `${altura}px`}}></div>
                            );
                          })}
                        </div>
                        <div className="text-xs text-gray-500 text-center">{85 + Math.floor(Math.random() * 20)} mg/dL</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {tipoGrafico === 'geral' && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-4 h-4 text-green-500" />
                    <h3 className="font-semibold text-gray-800">Indicadores Gerais de Saúde</h3>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center">
                        <div className={`text-lg font-bold ${Math.random() > 0.3 ? 'text-green-600' : 'text-yellow-600'}`}>
                          {Math.random() > 0.3 ? 'Normal' : 'Atenção'}
                        </div>
                        <div className="text-xs text-gray-600">Peso</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-lg font-bold ${Math.random() > 0.2 ? 'text-blue-600' : 'text-orange-600'}`}>
                          {Math.random() > 0.2 ? 'Bom' : 'Regular'}
                        </div>
                        <div className="text-xs text-gray-600">Sono</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-lg font-bold ${Math.random() > 0.4 ? 'text-green-600' : 'text-red-600'}`}>
                          {Math.random() > 0.4 ? 'Ativo' : 'Sedentário'}
                        </div>
                        <div className="text-xs text-gray-600">Exercício</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Frequência de Consultas */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <h3 className="font-semibold" style={{ color: theme.textPrimary }}>Frequência de Consultas</h3>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-blue-600">{acompanhamentoData.baseData.trimestre}</div>
                    <div className="text-xs text-blue-700">Último Trimestre</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-green-600">{acompanhamentoData.baseData.ano}</div>
                    <div className="text-xs text-green-700">Último Ano</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-purple-600">{acompanhamentoData.baseData.comparecimento}%</div>
                    <div className="text-xs text-purple-700">Comparecimento</div>
                  </div>
                </div>
                
                {/* Mini Gráfico de Tendência */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-600">Tendência (12 meses)</span>
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  </div>
                  <div className="flex justify-between items-end h-8">
                    {Array.from({length: 12}, (_, i) => {
                      const altura = Math.max(8, 20 + Math.sin(i * 0.5) * 8 + Math.random() * 6);
                      return (
                        <div key={i} className="w-1 bg-blue-400 rounded-t" style={{height: `${altura}px`}}></div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid com Chat e Formulário */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Chat de Atendimento */}
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
            <div className="p-0">
              <AtendimentoChat 
                paciente={paciente} 
                onTriagemComplete={handleTriagemComplete}
                onTriagemStart={() => setEmTriagem(true)}
                onTriagemEnd={() => setEmTriagem(false)}
              />
            </div>
          </div>

          {/* Formulário de Atendimento */}
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
        </div>
        </div>
      </div>
    </div>
  );
}