import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { farmaChatData } from '../data/farmaChatData';

const Alertas = () => {
  const navigate = useNavigate();
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroPrioridade, setFiltroPrioridade] = useState('todos');

  const alertas = farmaChatData.alertas.map(alerta => ({
    ...alerta,
    paciente: farmaChatData.pacientes[alerta.pacienteId]
  }));

  const alertasFiltrados = alertas.filter(alerta => {
    const tipoMatch = filtroTipo === 'todos' || alerta.tipo === filtroTipo;
    const prioridadeMatch = filtroPrioridade === 'todos' || alerta.prioridade === filtroPrioridade;
    return tipoMatch && prioridadeMatch;
  });

  const getPrioridadeColor = (prioridade) => {
    switch (prioridade) {
      case 'alta': return 'bg-red-100 text-red-800 border-red-200';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baixa': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPrioridadeIcon = (prioridade) => {
    switch (prioridade) {
      case 'alta': return '🚨';
      case 'media': return '⚠️';
      case 'baixa': return 'ℹ️';
      default: return '📋';
    }
  };

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'critico': return '🔴';
      case 'adesaoIrregular': return '📊';
      case 'proximaCompra': return '🛒';
      case 'interacao': return '⚗️';
      default: return '📋';
    }
  };

  const marcarComoResolvido = (alertaId) => {
    // Em uma aplicação real, isso faria uma chamada à API
    console.log(`Alerta ${alertaId} marcado como resolvido`);
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Central de Alertas
          </h1>
          <p className="text-gray-600">
            Monitoramento inteligente de situações que requerem atenção farmacêutica
          </p>
        </div>

        {/* Estatísticas de Alertas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card p-6 text-center border-l-4 border-red-500">
            <div className="text-2xl font-bold text-red-600">
              {alertas.filter(a => a.prioridade === 'alta').length}
            </div>
            <div className="text-gray-600">Alta Prioridade</div>
          </div>
          <div className="card p-6 text-center border-l-4 border-yellow-500">
            <div className="text-2xl font-bold text-yellow-600">
              {alertas.filter(a => a.prioridade === 'media').length}
            </div>
            <div className="text-gray-600">Média Prioridade</div>
          </div>
          <div className="card p-6 text-center border-l-4 border-blue-500">
            <div className="text-2xl font-bold text-blue-600">
              {alertas.filter(a => a.tipo === 'critico').length}
            </div>
            <div className="text-gray-600">Alertas Críticos</div>
          </div>
          <div className="card p-6 text-center border-l-4 border-green-500">
            <div className="text-2xl font-bold text-green-600">
              {alertas.filter(a => a.status === 'ativo').length}
            </div>
            <div className="text-gray-600">Alertas Ativos</div>
          </div>
        </div>

        {/* Filtros */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Alerta
              </label>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todos os Tipos</option>
                <option value="critico">Crítico</option>
                <option value="adesaoIrregular">Adesão Irregular</option>
                <option value="proximaCompra">Próxima Compra</option>
                <option value="interacao">Interação Medicamentosa</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridade
              </label>
              <select
                value={filtroPrioridade}
                onChange={(e) => setFiltroPrioridade(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todas as Prioridades</option>
                <option value="alta">Alta Prioridade</option>
                <option value="media">Média Prioridade</option>
                <option value="baixa">Baixa Prioridade</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Alertas */}
        <div className="space-y-4">
          {alertasFiltrados.map((alerta) => (
            <div
              key={alerta.id}
              className={`card p-6 border-l-4 ${
                alerta.prioridade === 'alta' ? 'border-red-500' :
                alerta.prioridade === 'media' ? 'border-yellow-500' :
                'border-blue-500'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">
                    {getTipoIcon(alerta.tipo)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {alerta.paciente.nome}
                      </h3>
                      <span className={`px-3 py-1 text-sm rounded-full font-medium ${getPrioridadeColor(alerta.prioridade)}`}>
                        {getPrioridadeIcon(alerta.prioridade)} {alerta.prioridade.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{alerta.mensagem}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>📅 {alerta.dataAlerta}</span>
                      <span>🏪 {alerta.paciente.lojaVinculada}</span>
                      <span>👨‍⚕️ {alerta.paciente.farmaceuticoResponsavel}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/paciente/${alerta.pacienteId}`)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Ver Paciente
                  </button>
                  <button
                    onClick={() => marcarComoResolvido(alerta.id)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Resolver
                  </button>
                </div>
              </div>

              {/* Informações Adicionais do Paciente */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Idade:</span>
                    <span className="ml-2 font-medium">{alerta.paciente.idade} anos</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Score de Adesão:</span>
                    <span className={`ml-2 font-bold ${
                      alerta.paciente.scoreAdesao >= 90 ? 'text-green-600' :
                      alerta.paciente.scoreAdesao >= 75 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {alerta.paciente.scoreAdesao}%
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Risco:</span>
                    <span className={`ml-2 font-medium ${
                      alerta.paciente.risco === 'baixo' ? 'text-green-600' :
                      alerta.paciente.risco === 'medio' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {alerta.paciente.risco.charAt(0).toUpperCase() + alerta.paciente.risco.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="mt-3">
                  <span className="text-gray-500 text-sm">Condições:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {alerta.paciente.condicoesCronicas.map((condicao, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {condicao}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ações Recomendadas */}
              {alerta.tipo === 'critico' && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">🚨 Ações Urgentes Recomendadas:</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Contatar paciente imediatamente</li>
                    <li>• Verificar disponibilidade de medicamentos</li>
                    <li>• Orientar sobre riscos da interrupção</li>
                    <li>• Agendar atendimento presencial urgente</li>
                  </ul>
                </div>
              )}

              {alerta.tipo === 'adesaoIrregular' && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Estratégias de Intervenção:</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Investigar barreiras à adesão</li>
                    <li>• Reforçar orientações sobre importância do tratamento</li>
                    <li>• Considerar lembretes ou organizadores</li>
                    <li>• Agendar acompanhamento em 15 dias</li>
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {alertasFiltrados.length === 0 && (
          <div className="card p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum alerta encontrado
            </h3>
            <p className="text-gray-500">
              Ajuste os filtros para ver mais alertas ou todos os alertas foram resolvidos
            </p>
          </div>
        )}

        {/* Resumo de Ações */}
        <div className="card p-6 bg-gradient-to-r from-blue-50 to-purple-50">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            📊 Resumo de Ações Necessárias
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 mb-2">
                {alertas.filter(a => a.tipo === 'critico').length}
              </div>
              <div className="text-gray-700">Intervenções Urgentes</div>
              <div className="text-sm text-gray-500 mt-1">Contato imediato necessário</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-2">
                {alertas.filter(a => a.tipo === 'adesaoIrregular').length}
              </div>
              <div className="text-gray-700">Acompanhamento de Adesão</div>
              <div className="text-sm text-gray-500 mt-1">Reforço de orientações</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {alertas.filter(a => a.tipo === 'proximaCompra').length}
              </div>
              <div className="text-gray-700">Lembretes de Compra</div>
              <div className="text-sm text-gray-500 mt-1">Continuidade do tratamento</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Alertas;