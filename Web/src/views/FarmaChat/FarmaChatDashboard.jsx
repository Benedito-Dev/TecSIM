import React, { useState, useEffect } from 'react';
import { farmaChatData, gerarContextoIA } from '../../data/farmaChatData';

const FarmaChatDashboard = () => {
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [contextoIA, setContextoIA] = useState(null);
  const [alertas, setAlertas] = useState([]);

  useEffect(() => {
    setAlertas(farmaChatData.alertas.filter(alerta => alerta.status === 'ativo'));
  }, []);

  const selecionarPaciente = (pacienteId) => {
    setPacienteSelecionado(pacienteId);
    const contexto = gerarContextoIA(pacienteId);
    setContextoIA(contexto);
  };

  const estatisticas = farmaChatData.estatisticas;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          FarmaChat - Pague Menos
        </h1>
        <p className="text-gray-600">
          Protocolo de Cuidado Contínuo • Farmacêutico: Ana Silva • Fortaleza Centro
        </p>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500">Pacientes Ativos</h3>
          <p className="text-2xl font-bold text-gray-900">{estatisticas.totalPacientesProtocolo}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-500">Taxa de Adesão</h3>
          <p className="text-2xl font-bold text-green-600">{estatisticas.taxaAdesaoGeral}%</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
          <h3 className="text-sm font-medium text-gray-500">Risco Médio</h3>
          <p className="text-2xl font-bold text-yellow-600">{estatisticas.pacientesRiscoMedio}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500">
          <h3 className="text-sm font-medium text-gray-500">Economia SUS</h3>
          <p className="text-2xl font-bold text-red-600">{estatisticas.economiaGeradaSUS}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de Pacientes */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Pacientes em Protocolo</h2>
            </div>
            <div className="divide-y">
              {Object.values(farmaChatData.pacientes).map((paciente) => (
                <div
                  key={paciente.id}
                  onClick={() => selecionarPaciente(paciente.id)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    pacienteSelecionado === paciente.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{paciente.nome}</h3>
                      <p className="text-sm text-gray-500">{paciente.idade} anos • {paciente.endereco}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {paciente.condicoesCronicas.map((condicao, index) => (
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
              ))}
            </div>
          </div>
        </div>

        {/* Painel Principal */}
        <div className="lg:col-span-2">
          {contextoIA ? (
            <div className="space-y-6">
              {/* IA Contextual */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-3">🤖 Assistente IA - Contexto do Paciente</h2>
                <p className="text-blue-100 leading-relaxed">{contextoIA.sugestaoIA}</p>
              </div>

              {/* Informações do Paciente */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {contextoIA.paciente.nome} - {contextoIA.paciente.idade} anos
                  </h2>
                  <p className="text-gray-600">{contextoIA.protocolo.diagnostico}</p>
                  <p className="text-sm text-gray-500 mt-1">Médico: {contextoIA.protocolo.medico}</p>
                </div>
                
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Medicamentos do Protocolo</h3>
                  <div className="space-y-4">
                    {farmaChatData.protocolos[pacienteSelecionado].medicamentos.map((med, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">{med.nome}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            med.statusAdesao === 'regular' ? 'bg-green-100 text-green-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {med.statusAdesao}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{med.posologia}</p>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Última compra: {med.ultimaCompra}</span>
                          <span className={`font-medium ${
                            med.diasRestantes <= 5 ? 'text-red-600' :
                            med.diasRestantes <= 10 ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {med.diasRestantes} dias restantes
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Histórico de Atendimentos */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold text-gray-900">Histórico de Atendimentos</h2>
                </div>
                <div className="divide-y">
                  {farmaChatData.historicoAtendimentos[pacienteSelecionado]?.map((atendimento) => (
                    <div key={atendimento.id} className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{atendimento.tipo}</h4>
                          <p className="text-sm text-gray-500">{atendimento.data} • {atendimento.loja}</p>
                        </div>
                        <span className="text-sm text-gray-500">
                          {atendimento.farmaceutico}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{atendimento.observacoes}</p>
                      <div className="flex flex-wrap gap-1">
                        {atendimento.medicamentosDispensados.map((med, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                          >
                            {med}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
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

      {/* Alertas Flutuantes */}
      {alertas.length > 0 && (
        <div className="fixed bottom-6 right-6 space-y-2">
          {alertas.slice(0, 3).map((alerta) => (
            <div
              key={alerta.id}
              className={`p-4 rounded-lg shadow-lg max-w-sm ${
                alerta.prioridade === 'alta' ? 'bg-red-500 text-white' :
                alerta.prioridade === 'media' ? 'bg-yellow-500 text-white' :
                'bg-blue-500 text-white'
              }`}
            >
              <p className="text-sm font-medium">{alerta.mensagem}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FarmaChatDashboard;