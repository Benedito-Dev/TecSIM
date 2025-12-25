import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Sidebar from '../../components/layout/Sidebar';
import { useAtendimentoData } from '../../hooks/pages/atendimento/useAtendimentoData';
import { AtendimentoHeader } from '../../components/pages/atendimento/AtendimentoHeader';
import { DadosPaciente } from '../../components/pages/atendimento/DadosPaciente';
import { ServicosClinicFarma } from '../../components/pages/atendimento/ServicosClinicFarma';
import { ResumoContextual } from '../../components/pages/atendimento/ResumoContextual';
import { GraficosAcompanhamento } from '../../components/pages/atendimento/GraficosAcompanhamento';
import { ChatAtendimento } from '../../components/pages/atendimento/ChatAtendimento';
import { FormularioAtendimento } from '../../components/pages/atendimento/FormularioAtendimento';

export default function AtendimentoPaciente() {
  const location = useLocation();
  const navigate = useNavigate();
  const { paciente } = location.state || {};
  const { theme } = useTheme();
  
  const {
    queixaPrincipal,
    setQueixaPrincipal,
    observacoes,
    setObservacoes,
    resultadoTriagem,
    emTriagem,
    tipoGrafico,
    resumoContextual,
    handleTriagemComplete
  } = useAtendimentoData(paciente);

  const handleVoltar = () => navigate('/clientes');
  const handleSalvar = () => navigate('/clientes');

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
        <AtendimentoHeader 
          paciente={paciente}
          emTriagem={emTriagem}
          onVoltar={handleVoltar}
          onSalvar={handleSalvar}
        />

        {/* Conteúdo com margem para sidebar */}
        <div 
          className="flex-1 overflow-y-auto ml-20 lg:ml-60 p-6"
          style={{ color: theme.textPrimary }}
        >

        <DadosPaciente paciente={paciente} />

        {/* Serviços ClinicFarma */}
        <ServicosClinicFarma 
          tipoGrafico={tipoGrafico}
          resumoContextual={resumoContextual}
        />

        {/* Resumo Contextual e Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ResumoContextual resumoContextual={resumoContextual} />
          <GraficosAcompanhamento 
            tipoGrafico={tipoGrafico}
            paciente={paciente}
          />
        </div>

        {/* Chat e Formulário */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <ChatAtendimento 
            paciente={paciente}
            emTriagem={emTriagem}
          />
          
          <FormularioAtendimento 
            queixaPrincipal={queixaPrincipal}
            setQueixaPrincipal={setQueixaPrincipal}
            observacoes={observacoes}
            setObservacoes={setObservacoes}
            resultadoTriagem={resultadoTriagem}
          />
        </div>
        </div>
      </div>
    </div>
  );
}