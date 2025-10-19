import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { farmaChatData } from '../data/farmaChatData';

const Protocolos = () => {
  const navigate = useNavigate();
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [filtroRisco, setFiltroRisco] = useState('todos');

  const protocolos = Object.values(farmaChatData.protocolos).map(protocolo => ({
    ...protocolo,
    paciente: farmaChatData.pacientes[protocolo.pacienteId]
  }));

  const protocolosFiltrados = protocolos.filter(protocolo => {
    const statusMatch = filtroStatus === 'todos' || protocolo.status === filtroStatus;
    const riscoMatch = filtroRisco === 'todos' || protocolo.paciente.risco === filtroRisco;
    return statusMatch && riscoMatch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'pausado': return 'bg-yellow-100 text-yellow-800';
      case 'finalizado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiscoColor = (risco) => {
    switch (risco) {
      case 'baixo': return 'bg-green-100 text-green-800';
      case 'medio': return 'bg-yellow-100 text-yellow-800';
      case 'alto': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Protocolos de Cuidado Contínuo
          </h1>
          <p className="text-gray-600">
            Gerenciamento de todos os protocolos ativos na rede Pague Menos
          </p>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">{protocolos.length}</div>
            <div className="text-gray-600">Total de Protocolos</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {protocolos.filter(p => p.status === 'ativo').length}
            </div>
            <div className="text-gray-600">Protocolos Ativos</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {protocolos.filter(p => p.paciente.risco === 'medio').length}
            </div>
            <div className="text-gray-600">Risco Médio</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-2xl font-bold text-red-600">
              {protocolos.filter(p => p.paciente.risco === 'alto').length}
            </div>
            <div className="text-gray-600">Risco Alto</div>
          </div>
        </div>

        {/* Filtros */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status do Protocolo
              </label>
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todos os Status</option>
                <option value="ativo">Ativo</option>
                <option value="pausado">Pausado</option>
                <option value="finalizado">Finalizado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nível de Risco
              </label>
              <select
                value={filtroRisco}
                onChange={(e) => setFiltroRisco(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todos os Riscos</option>
                <option value="baixo">Risco Baixo</option>
                <option value="medio">Risco Médio</option>
                <option value="alto">Risco Alto</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Protocolos */}
        <div className="card">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Protocolos ({protocolosFiltrados.length})
            </h2>
          </div>
          <div className="divide-y">
            {protocolosFiltrados.map((protocolo) => (
              <div
                key={protocolo.id}
                className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => navigate(`/paciente/${protocolo.pacienteId}`)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {protocolo.paciente.nome}
                      </h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(protocolo.status)}`}>
                        {protocolo.status}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getRiscoColor(protocolo.paciente.risco)}`}>
                        Risco {protocolo.paciente.risco}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{protocolo.diagnosticoMedico}</p>
                    <p className="text-sm text-gray-500">
                      {protocolo.medico} • Iniciado em {protocolo.dataInicio}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      protocolo.paciente.scoreAdesao >= 90 ? 'text-green-600' :
                      protocolo.paciente.scoreAdesao >= 75 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {protocolo.paciente.scoreAdesao}%
                    </div>
                    <div className="text-sm text-gray-500">Adesão</div>
                  </div>
                </div>

                {/* Medicamentos */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Medicamentos ({protocolo.medicamentos.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {protocolo.medicamentos.map((med, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-gray-900 text-sm">{med.nome}</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            med.statusAdesao === 'regular' ? 'bg-green-100 text-green-800' :
                            med.statusAdesao === 'irregular' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {med.statusAdesao}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{med.posologia}</p>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Última: {med.ultimaCompra}</span>
                          <span className={`font-medium ${
                            med.diasRestantes <= 0 ? 'text-red-600' :
                            med.diasRestantes <= 5 ? 'text-orange-600' :
                            med.diasRestantes <= 10 ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {med.diasRestantes <= 0 ? 'SEM MED' : `${med.diasRestantes}d`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Observações */}
                {protocolo.observacoes && (
                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Observações:</strong> {protocolo.observacoes}
                    </p>
                  </div>
                )}

                {/* Próxima Consulta */}
                <div className="mt-3 flex justify-between text-sm text-gray-500">
                  <span>Protocolo: {protocolo.id}</span>
                  <span>Próxima consulta: {protocolo.proximaConsulta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {protocolosFiltrados.length === 0 && (
          <div className="card p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum protocolo encontrado
            </h3>
            <p className="text-gray-500">
              Ajuste os filtros para ver mais protocolos
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Protocolos;