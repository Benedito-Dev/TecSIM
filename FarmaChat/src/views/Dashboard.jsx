import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { farmaChatData, gerarContextoIA } from '../data/farmaChatData';
import { getPacientes } from '../services/pacienteService';
import { getProtocolos } from '../services/protocoloService';
import { getAlertas } from '../services/alertaService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [contextoIA, setContextoIA] = useState(null);
  const [pacientes, setPacientes] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [estatisticas, setEstatisticas] = useState(farmaChatData.estatisticas);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      const [dadosPacientes, dadosAlertas] = await Promise.all([
        getPacientes(),
        getAlertas()
      ]);
      
      setPacientes(dadosPacientes);
      setAlertas(dadosAlertas.filter(alerta => alerta.status === 'ativo'));
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      // Fallback para dados mockados
      setPacientes(Object.values(farmaChatData.pacientes));
      setAlertas(farmaChatData.alertas.filter(alerta => alerta.status === 'ativo'));
    } finally {
      setCarregando(false);
    }
  };

  const selecionarPaciente = (pacienteId) => {
    setPacienteSelecionado(pacienteId);
    const contexto = gerarContextoIA(pacienteId);
    setContextoIA(contexto);
  };

  const alertasAtivos = alertas;

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header do Dashboard */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard - Protocolo de Cuidado Contínuo
          </h1>
          <p className="text-gray-600">
            Visão geral dos pacientes ativos e alertas do sistema
          </p>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card p-6 border-l-4 border-pague-azul-500">
            <h3 className="text-sm font-medium text-gray-500">Pacientes Ativos</h3>
            <p className="text-3xl font-bold text-pague-azul-600">{estatisticas.totalPacientesProtocolo}</p>
            <p className="text-sm text-green-600 mt-1">+12% este mês</p>
          </div>
          <div className="card p-6 border-l-4 border-green-500">
            <h3 className="text-sm font-medium text-gray-500">Taxa de Adesão</h3>
            <p className="text-3xl font-bold text-green-600">{estatisticas.taxaAdesaoGeral}%</p>
            <p className="text-sm text-green-600 mt-1">+2.3% este mês</p>
          </div>
          <div className="card p-6 border-l-4 border-pague-vermelho-500">
            <h3 className="text-sm font-medium text-gray-500">Economia SUS</h3>
            <p className="text-3xl font-bold text-pague-vermelho-600">{estatisticas.economiaGeradaSUS}</p>
            <p className="text-sm text-green-600 mt-1">+18% este mês</p>
          </div>
          <div className="card p-6 border-l-4 border-yellow-500">
            <h3 className="text-sm font-medium text-gray-500">Intervenções</h3>
            <p className="text-3xl font-bold text-yellow-600">{estatisticas.intervencoesMes}</p>
            <p className="text-sm text-green-600 mt-1">{estatisticas.sucessoIntervencoes}% sucesso</p>
          </div>
        </div>

        {/* Alertas Críticos */}
        {!carregando && alertasAtivos.length > 0 && (
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              🚨 Alertas Críticos ({alertasAtivos.length})
            </h2>
            <div className="space-y-3">
              {alertasAtivos.map((alerta) => (
                <div
                  key={alerta.id}
                  className={`p-4 rounded-lg border-l-4 cursor-pointer hover:bg-gray-50 ${
                    alerta.prioridade === 'alta' ? 'border-red-500 bg-red-50' :
                    alerta.prioridade === 'media' ? 'border-yellow-500 bg-yellow-50' :
                    'border-blue-500 bg-blue-50'
                  }`}
                  onClick={() => navigate(`/paciente/${alerta.pacienteId}`)}
                >
                  <div className="flex justify-between items-start">
                    <p className={`font-medium ${
                      alerta.prioridade === 'alta' ? 'text-red-800' :
                      alerta.prioridade === 'media' ? 'text-yellow-800' :
                      'text-blue-800'
                    }`}>
                      {alerta.mensagem}
                    </p>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      alerta.prioridade === 'alta' ? 'bg-red-200 text-red-800' :
                      alerta.prioridade === 'media' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-blue-200 text-blue-800'
                    }`}>
                      {alerta.prioridade.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Pacientes */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Pacientes Recentes</h2>
              </div>
              <div className="divide-y max-h-96 overflow-y-auto">
                {carregando ? (
                  <div className="p-8 text-center text-gray-500">
                    Carregando pacientes...
                  </div>
                ) : (
                  pacientes.map((paciente) => (
                  <div
                    key={paciente.id}
                    onClick={() => selecionarPaciente(paciente.id)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      pacienteSelecionado === paciente.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{paciente.nome}</h3>
                        <p className="text-sm text-gray-500">{paciente.idade} anos • {paciente.endereco}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            paciente.scoreAdesao >= 90 ? 'bg-green-100 text-green-800' :
                            paciente.scoreAdesao >= 75 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {paciente.scoreAdesao}% adesão
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {paciente.condicoesCronicas.slice(0, 2).map((condicao, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                            >
                              {condicao}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${
                        paciente.risco === 'baixo' ? 'bg-green-400' :
                        paciente.risco === 'medio' ? 'bg-yellow-400' : 'bg-red-400'
                      }`}></div>
                    </div>
                  </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Painel de Contexto IA */}
          <div className="lg:col-span-2">
            {contextoIA ? (
              <div className="space-y-6">
                {/* Sugestão da IA */}
                <div className="pague-menos-gradient text-white p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-3 flex items-center">
                    🤖 Assistente IA - Contexto do Paciente
                  </h2>
                  <p className="text-pague-menos-100 leading-relaxed">{contextoIA.sugestaoIA}</p>
                </div>

                {/* Informações do Paciente */}
                <div className="card">
                  <div className="p-6 border-b">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                          {contextoIA.paciente.nome} - {contextoIA.paciente.idade} anos
                        </h2>
                        <p className="text-gray-600">{contextoIA.protocolo.diagnostico}</p>
                        <p className="text-sm text-gray-500 mt-1">Médico: {contextoIA.protocolo.medico}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${
                          contextoIA.paciente.scoreAdesao >= 90 ? 'text-green-600' :
                          contextoIA.paciente.scoreAdesao >= 75 ? 'text-yellow-600' :
                          'text-pague-vermelho-600'
                        }`}>
                          {contextoIA.paciente.scoreAdesao}%
                        </div>
                        <div className="text-sm text-gray-500">Score de Adesão</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Medicamentos do Protocolo</h3>
                    <div className="space-y-4">
                      {contextoIA.protocolo.medicamentos.map((med, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900">{med.nome}</h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              med.statusAdesao === 'regular' ? 'bg-green-100 text-green-800' :
                              med.statusAdesao === 'irregular' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-pague-vermelho-100 text-pague-vermelho-800'
                            }`}>
                              {med.statusAdesao}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{med.posologia}</p>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Última compra: {med.ultimaCompra}</span>
                            <span className={`font-medium ${
                              med.diasRestantes <= 0 ? 'text-pague-vermelho-600' :
                              med.diasRestantes <= 5 ? 'text-orange-600' :
                              med.diasRestantes <= 10 ? 'text-yellow-600' : 'text-green-600'
                            }`}>
                              {med.diasRestantes <= 0 ? 'SEM MEDICAMENTO' : `${med.diasRestantes} dias restantes`}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Ações Rápidas */}
                <div className="flex space-x-4">
                  <button
                    onClick={() => navigate(`/paciente/${pacienteSelecionado}`)}
                    className="btn-primary"
                  >
                    Ver Detalhes Completos
                  </button>
                  <button
                    onClick={() => navigate('/chat')}
                    className="btn-secondary"
                  >
                    Conversar com IA
                  </button>
                </div>
              </div>
            ) : (
              <div className="card p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Selecione um paciente
                </h3>
                <p className="text-gray-500">
                  Escolha um paciente da lista para ver seu protocolo completo e sugestões da IA
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Ranking de Lojas */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            🏆 Ranking de Eficácia - Lojas Pague Menos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {estatisticas.lojasMaisEficazes.map((loja, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-orange-400' : 'bg-blue-400'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="text-xl font-bold text-blue-600">{loja.score}%</span>
                </div>
                <h3 className="font-medium text-gray-900">{loja.nome}</h3>
                <p className="text-sm text-gray-500">{loja.pacientes} pacientes</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;