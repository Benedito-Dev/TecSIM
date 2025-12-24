import React, { useState, useEffect, useContext } from "react";
import { User, Mail, Phone, Calendar, MapPin, Stethoscope, Clock, Edit, Award, Activity } from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import { PageContainer } from "../../components/layout/PageContainer";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import { getCurrentUser } from '@/services/auth/authService';

export default function Profile() {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const [enfermeiro, setEnfermeiro] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEnfermeiroData = async () => {
      try {
        const userData = getCurrentUser();
        
        if (userData && userData.tipo === 'enfermeiro') {
          setEnfermeiro(userData);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do enfermeiro:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEnfermeiroData();
  }, []);

  const handleGoBack = () => {
    navigate('/dashboard-enfermeiro');
  };

  const handleEditProfile = () => {
    navigate('/perfil/editar');
  };

  const formatarData = (dataString) => {
    if (!dataString) return 'Não informada';
    
    try {
      const data = new Date(dataString);
      return data.toLocaleDateString('pt-BR');
    } catch {
      return 'Data inválida';
    }
  };

  const calcularExperiencia = (dataAdmissao) => {
    if (!dataAdmissao) return '2 anos';
    
    try {
      const admissao = new Date(dataAdmissao);
      const hoje = new Date();
      const anos = hoje.getFullYear() - admissao.getFullYear();
      return `${anos} ano${anos !== 1 ? 's' : ''}`;
    } catch {
      return '2 anos';
    }
  };

  const getIniciais = (nome) => {
    if (!nome) return 'EN';
    const nomes = nome.split(' ');
    if (nomes.length >= 2) {
      return (nomes[0][0] + nomes[1][0]).toUpperCase();
    }
    return nome.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div 
        className="flex h-screen"
        style={{ background: theme.background }}
      >
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div 
              className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
              style={{ borderColor: theme.primary }}
            ></div>
            <p 
              className="mt-4"
              style={{ color: theme.textSecondary }}
            >
              Carregando perfil...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!enfermeiro) {
    return (
      <div 
        className="flex h-screen"
        style={{ background: theme.background }}
      >
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p style={{ color: theme.textSecondary }}>Erro ao carregar perfil</p>
            <button 
              onClick={() => navigate('/dashboard-enfermeiro')}
              className="mt-4 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors"
              style={{ background: theme.primary }}
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <PageContainer 
        title="Perfil do Enfermeiro" 
        icon={Stethoscope}
        buttonText="Editar Perfil"
        onButtonClick={handleEditProfile}
      >
          <div className="max-w-4xl mx-auto">
            {/* Card principal */}
            <div 
              className="shadow-md rounded-2xl p-6 border"
              style={{
                background: theme.backgroundCard,
                borderColor: theme.border
              }}
            >
              {/* Linha superior */}
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                {/* Foto de perfil */}
                <div 
                  className="w-32 h-32 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`
                  }}
                >
                  {enfermeiro.foto_perfil ? (
                    <img 
                      src={enfermeiro.foto_perfil} 
                      alt={enfermeiro.nome}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    getIniciais(enfermeiro.nome)
                  )}
                </div>

                {/* Dados principais */}
                <div className="flex-1">
                  <h2 
                    className="text-2xl font-semibold mb-1"
                    style={{ color: theme.textPrimary }}
                  >
                    {enfermeiro.nome}
                  </h2>
                  <p 
                    className="text-lg mb-6"
                    style={{ color: theme.textSecondary }}
                  >
                    {enfermeiro.cargo}
                  </p>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div 
                      className="flex items-center gap-3 p-3 rounded-lg"
                      style={{
                        background: theme.backgroundSecondary,
                        color: theme.textPrimary
                      }}
                    >
                      <Mail size={20} style={{ color: theme.primary }} />
                      <div>
                        <p 
                          className="text-sm"
                          style={{ color: theme.textSecondary }}
                        >
                          Email
                        </p>
                        <p className="font-medium">{enfermeiro.email}</p>
                      </div>
                    </div>
                    
                    <div 
                      className="flex items-center gap-3 p-3 rounded-lg"
                      style={{
                        background: theme.backgroundSecondary,
                        color: theme.textPrimary
                      }}
                    >
                      <Phone size={20} style={{ color: theme.primary }} />
                      <div>
                        <p 
                          className="text-sm"
                          style={{ color: theme.textSecondary }}
                        >
                          Telefone
                        </p>
                        <p className="font-medium">{enfermeiro.telefone || '(11) 95555-1234'}</p>
                      </div>
                    </div>
                    
                    <div 
                      className="flex items-center gap-3 p-3 rounded-lg"
                      style={{
                        background: theme.backgroundSecondary,
                        color: theme.textPrimary
                      }}
                    >
                      <Calendar size={20} style={{ color: theme.primary }} />
                      <div>
                        <p 
                          className="text-sm"
                          style={{ color: theme.textSecondary }}
                        >
                          Data de Admissão
                        </p>
                        <p className="font-medium">{formatarData(enfermeiro.data_admissao)}</p>
                      </div>
                    </div>
                    
                    <div 
                      className="flex items-center gap-3 p-3 rounded-lg"
                      style={{
                        background: theme.backgroundSecondary,
                        color: theme.textPrimary
                      }}
                    >
                      <MapPin size={20} style={{ color: theme.primary }} />
                      <div>
                        <p 
                          className="text-sm"
                          style={{ color: theme.textSecondary }}
                        >
                          Unidade
                        </p>
                        <p className="font-medium">{enfermeiro.unidade}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Linha inferior */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div 
                  className="p-5 rounded-xl border"
                  style={{
                    background: theme.primaryLight + '20',
                    borderColor: theme.primary,
                    color: theme.textPrimary
                  }}
                >
                  <p 
                    className="text-sm mb-2 font-medium"
                    style={{ color: theme.primary }}
                  >
                    Registro COREN
                  </p>
                  <p className="font-semibold flex items-center gap-2 text-lg">
                    <User size={20} style={{ color: theme.primary }} /> 
                    {enfermeiro.registro_coren}
                  </p>
                </div>

                <div 
                  className="p-5 rounded-xl border"
                  style={{
                    background: theme.success + '20',
                    borderColor: theme.success,
                    color: theme.textPrimary
                  }}
                >
                  <p 
                    className="text-sm mb-2 font-medium"
                    style={{ color: theme.success }}
                  >
                    Turno de Trabalho
                  </p>
                  <p className="font-semibold flex items-center gap-2 text-lg">
                    <Clock size={20} style={{ color: theme.success }} /> 
                    {enfermeiro.turno || 'Noite'}
                  </p>
                </div>

                <div 
                  className="p-5 rounded-xl border"
                  style={{
                    background: theme.info + '20',
                    borderColor: theme.info,
                    color: theme.textPrimary
                  }}
                >
                  <p 
                    className="text-sm mb-2 font-medium"
                    style={{ color: theme.info }}
                  >
                    Especialidade
                  </p>
                  <p className="font-semibold flex items-center gap-2 text-lg">
                    <Award size={20} style={{ color: theme.info }} /> 
                    {enfermeiro.especialidade}
                  </p>
                </div>
              </div>

              {/* Informações adicionais */}
              <div 
                className="mt-8 pt-6 border-t"
                style={{ borderColor: theme.border }}
              >
                <h3 
                  className="text-lg font-semibold mb-4"
                  style={{ color: theme.textPrimary }}
                >
                  Informações Profissionais
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    className="flex justify-between py-2 border-b"
                    style={{ 
                      borderColor: theme.borderLight,
                      color: theme.textSecondary
                    }}
                  >
                    <span>Status</span>
                    <span 
                      className="font-medium"
                      style={{ 
                        color: enfermeiro.status === 'Ativo' ? theme.success : theme.error 
                      }}
                    >
                      {enfermeiro.status}
                    </span>
                  </div>
                  <div 
                    className="flex justify-between py-2 border-b"
                    style={{ 
                      borderColor: theme.borderLight,
                      color: theme.textSecondary
                    }}
                  >
                    <span>Especialidade</span>
                    <span className="font-medium" style={{ color: theme.textPrimary }}>
                      {enfermeiro.especialidade}
                    </span>
                  </div>
                  <div 
                    className="flex justify-between py-2 border-b"
                    style={{ 
                      borderColor: theme.borderLight,
                      color: theme.textSecondary
                    }}
                  >
                    <span>Anos de Experiência</span>
                    <span className="font-medium" style={{ color: theme.textPrimary }}>
                      {enfermeiro.anos_experiencia || calcularExperiencia(enfermeiro.data_admissao)}
                    </span>
                  </div>
                  <div 
                    className="flex justify-between py-2 border-b"
                    style={{ 
                      borderColor: theme.borderLight,
                      color: theme.textSecondary
                    }}
                  >
                    <span>Última Atualização</span>
                    <span className="font-medium" style={{ color: theme.textPrimary }}>
                      {formatarData(enfermeiro.data_atualizacao)}
                    </span>
                  </div>
                  <div 
                    className="flex justify-between py-2 border-b"
                    style={{ 
                      borderColor: theme.borderLight,
                      color: theme.textSecondary
                    }}
                  >
                    <span>Data de Cadastro</span>
                    <span className="font-medium" style={{ color: theme.textPrimary }}>
                      {formatarData(enfermeiro.data_cadastro)}
                    </span>
                  </div>
                  <div 
                    className="flex justify-between py-2 border-b"
                    style={{ 
                      borderColor: theme.borderLight,
                      color: theme.textSecondary
                    }}
                  >
                    <span>Conta Ativa</span>
                    <span 
                      className="font-medium"
                      style={{ 
                        color: enfermeiro.ativo ? theme.success : theme.error 
                      }}
                    >
                      {enfermeiro.ativo ? 'Sim' : 'Não'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Estatísticas */}
              <div 
                className="mt-8 pt-6 border-t"
                style={{ borderColor: theme.border }}
              >
                <h3 
                  className="text-lg font-semibold mb-4"
                  style={{ color: theme.textPrimary }}
                >
                  Atividade Recente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div 
                    className="p-4 rounded-lg border"
                    style={{
                      background: theme.warning + '20',
                      borderColor: theme.warning,
                      color: theme.textPrimary
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Activity size={24} style={{ color: theme.warning }} />
                      <div>
                        <p 
                          className="text-sm"
                          style={{ color: theme.warning }}
                        >
                          Plantões Realizados
                        </p>
                        <p className="text-xl font-bold">24</p>
                      </div>
                    </div>
                  </div>
                  <div 
                    className="p-4 rounded-lg border"
                    style={{
                      background: theme.info + '20',
                      borderColor: theme.info,
                      color: theme.textPrimary
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Stethoscope size={24} style={{ color: theme.info }} />
                      <div>
                        <p 
                          className="text-sm"
                          style={{ color: theme.info }}
                        >
                          Pacientes Atendidos
                        </p>
                        <p className="text-xl font-bold">156</p>
                      </div>
                    </div>
                  </div>
                  <div 
                    className="p-4 rounded-lg border"
                    style={{
                      background: theme.success + '20',
                      borderColor: theme.success,
                      color: theme.textPrimary
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Calendar size={24} style={{ color: theme.success }} />
                      <div>
                        <p 
                          className="text-sm"
                          style={{ color: theme.success }}
                        >
                          Dias Trabalhados
                        </p>
                        <p className="text-xl font-bold">45</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </PageContainer>
    </div>
  );
}