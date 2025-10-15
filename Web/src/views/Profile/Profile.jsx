import React, { useState, useEffect } from "react";
import { User, Mail, Phone, Calendar, MapPin, Stethoscope, Clock, Edit, Award, Activity } from "lucide-react";
import Sidebar from "../../components/SideBarr";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from '../../services/auth/authService';
import { getEnfermeiroById } from '../../services/enfermeirosService';

export default function Profile() {
  const navigate = useNavigate();
  const [enfermeiro, setEnfermeiro] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEnfermeiroData = async () => {
      try {
        // Primeiro tenta pegar do localStorage (dados básicos)
        const userData = getCurrentUser();
        
        if (userData && userData.tipo === 'enfermeiro') {
          // Se já temos dados básicos, usa eles
          setEnfermeiro(userData);
          
          // Opcional: Buscar dados completos do backend
          try {
            const completeData = await getEnfermeiroById(userData.id);
            setEnfermeiro(completeData);
          } catch (error) {
            console.log('Usando dados do localStorage:', error.message);
          }
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

  // Função para formatar a data
  const formatarData = (dataString) => {
    if (!dataString) return 'Não informada';
    
    try {
      const data = new Date(dataString);
      return data.toLocaleDateString('pt-BR');
    } catch {
      return 'Data inválida';
    }
  };

  // Função para calcular tempo de experiência
  const calcularExperiencia = (dataAdmissao) => {
    if (!dataAdmissao) return '2 anos'; // Fallback
    
    try {
      const admissao = new Date(dataAdmissao);
      const hoje = new Date();
      const anos = hoje.getFullYear() - admissao.getFullYear();
      return `${anos} ano${anos !== 1 ? 's' : ''}`;
    } catch {
      return '2 anos';
    }
  };

  // Função para obter iniciais do nome
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
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!enfermeiro) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Erro ao carregar perfil</p>
            <button 
              onClick={() => navigate('/dashboard-enfermeiro')}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col transition-all duration-300">
        
        {/* Navbar */}
        <div className="h-20 bg-sky-600 shadow flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Stethoscope size={28} className="text-white" />
              <h1 className="text-2xl font-bold text-white">Perfil do Enfermeiro</h1>
            </div>
          </div>

          <button 
            onClick={handleEditProfile}
            className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition"
          >
            <Edit size={18} />
            <span>Editar Perfil</span>
          </button>
        </div>

        {/* Conteúdo do perfil */}
        <div className="flex-1 overflow-y-auto ml-20 lg:ml-60 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Card principal */}
            <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
              {/* Linha superior */}
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                {/* Foto de perfil */}
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
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
                  <h2 className="text-2xl font-semibold text-gray-800 mb-1">{enfermeiro.nome}</h2>
                  <p className="text-gray-500 text-lg mb-6">{enfermeiro.cargo}</p>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 text-gray-700 p-3 bg-gray-50 rounded-lg">
                      <Mail size={20} className="text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{enfermeiro.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-gray-700 p-3 bg-gray-50 rounded-lg">
                      <Phone size={20} className="text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Telefone</p>
                        <p className="font-medium">{enfermeiro.telefone || '(11) 95555-1234'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-gray-700 p-3 bg-gray-50 rounded-lg">
                      <Calendar size={20} className="text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Data de Admissão</p>
                        <p className="font-medium">{formatarData(enfermeiro.data_admissao)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-gray-700 p-3 bg-gray-50 rounded-lg">
                      <MapPin size={20} className="text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Unidade</p>
                        <p className="font-medium">{enfermeiro.unidade}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Linha inferior */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                  <p className="text-sm text-blue-600 mb-2 font-medium">Registro COREN</p>
                  <p className="font-semibold text-gray-800 flex items-center gap-2 text-lg">
                    <User size={20} className="text-blue-600" /> 
                    {enfermeiro.registro_coren}
                  </p>
                </div>

                <div className="bg-green-50 p-5 rounded-xl border border-green-100">
                  <p className="text-sm text-green-600 mb-2 font-medium">Turno de Trabalho</p>
                  <p className="font-semibold text-gray-800 flex items-center gap-2 text-lg">
                    <Clock size={20} className="text-green-600" /> 
                    {enfermeiro.turno || 'Noite'}
                  </p>
                </div>

                <div className="bg-purple-50 p-5 rounded-xl border border-purple-100">
                  <p className="text-sm text-purple-600 mb-2 font-medium">Especialidade</p>
                  <p className="font-semibold text-gray-800 flex items-center gap-2 text-lg">
                    <Award size={20} className="text-purple-600" /> 
                    {enfermeiro.especialidade}
                  </p>
                </div>
              </div>

              {/* Informações adicionais */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Informações Profissionais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>Status</span>
                    <span className={`font-medium ${enfermeiro.status === 'Ativo' ? 'text-green-600' : 'text-red-600'}`}>
                      {enfermeiro.status}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>Especialidade</span>
                    <span className="font-medium">{enfermeiro.especialidade}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>Anos de Experiência</span>
                    <span className="font-medium">
                      {enfermeiro.anos_experiencia || calcularExperiencia(enfermeiro.data_admissao)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>Última Atualização</span>
                    <span className="font-medium">{formatarData(enfermeiro.data_atualizacao)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>Data de Cadastro</span>
                    <span className="font-medium">{formatarData(enfermeiro.data_cadastro)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>Conta Ativa</span>
                    <span className={`font-medium ${enfermeiro.ativo ? 'text-green-600' : 'text-red-600'}`}>
                      {enfermeiro.ativo ? 'Sim' : 'Não'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Estatísticas (opcional) */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Atividade Recente</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                    <div className="flex items-center gap-3">
                      <Activity size={24} className="text-orange-600" />
                      <div>
                        <p className="text-sm text-orange-600">Plantões Realizados</p>
                        <p className="text-xl font-bold text-gray-800">24</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <div className="flex items-center gap-3">
                      <Stethoscope size={24} className="text-indigo-600" />
                      <div>
                        <p className="text-sm text-indigo-600">Pacientes Atendidos</p>
                        <p className="text-xl font-bold text-gray-800">156</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                    <div className="flex items-center gap-3">
                      <Calendar size={24} className="text-emerald-600" />
                      <div>
                        <p className="text-sm text-emerald-600">Dias Trabalhados</p>
                        <p className="text-xl font-bold text-gray-800">45</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}