import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { farmaChatData, gerarContextoIA } from '../data/farmaChatData';

const PacienteDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const pacienteId = parseInt(id);
  
  const paciente = farmaChatData.pacientes[pacienteId];
  const protocolo = farmaChatData.protocolos[pacienteId];
  const historico = farmaChatData.historicoAtendimentos[pacienteId] || [];
  const contextoIA = gerarContextoIA(pacienteId);

  if (!paciente) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900">Paciente não encontrado</h1>
          <button onClick={() => navigate('/dashboard')} className="btn-primary mt-4">
            Voltar ao Dashboard
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header do Paciente */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{paciente.nome}</h1>
            <p className="text-gray-600">{paciente.idade} anos • {paciente.endereco}</p>
            <p className="text-sm text-gray-500">CPF: {paciente.cpf} • Tel: {paciente.telefone}</p>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${
              paciente.scoreAdesao >= 90 ? 'text-green-600' :
              paciente.scoreAdesao >= 75 ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {paciente.scoreAdesao}%
            </div>
            <div className="text-sm text-gray-500">Score de Adesão</div>
            <div className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${
              paciente.risco === 'baixo' ? 'bg-green-100 text-green-800' :
              paciente.risco === 'medio' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              Risco {paciente.risco.charAt(0).toUpperCase() + paciente.risco.slice(1)}
            </div>
          </div>
        </div>

        {/* Sugestão da IA */}
        {contextoIA && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 flex items-center">
              🤖 Assistente IA - Análise Contextual
            </h2>
            <p className="text-blue-100 leading-relaxed">{contextoIA.sugestaoIA}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informações Básicas */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Informações Básicas</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700">Condições Crônicas</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {paciente.condicoesCronicas.map((condicao, index) => (
                    <span key={index} className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                      {condicao}
                    </span>
                  ))}
                </div>
              </div>
              
              {paciente.alergias.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-700">Alergias</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {paciente.alergias.map((alergia, index) => (
                      <span key={index} className="px-2 py-1 text-sm bg-red-100 text-red-800 rounded-full">
                        {alergia}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="font-medium text-gray-700">Farmacêutico Responsável</h3>
                <p className="text-gray-900">{paciente.farmaceuticoResponsavel}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700">Loja Vinculada</h3>
                <p className="text-gray-900">{paciente.lojaVinculada}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700">Último Atendimento</h3>
                <p className="text-gray-900">{paciente.ultimoAtendimento}</p>
              </div>
            </div>
          </div>

          {/* Protocolo Ativo */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Protocolo Ativo</h2>
                  <p className="text-gray-600">{protocolo?.diagnosticoMedico}</p>
                  <p className="text-sm text-gray-500">Médico: {protocolo?.medicoPrescricao}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  protocolo?.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {protocolo?.status}
                </span>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Medicamentos</h3>
                {protocolo?.medicamentos.map((med, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{med.nome}</h4>
                        <p className="text-sm text-gray-600">{med.posologia}</p>
                        <p className="text-xs text-gray-500">{med.duracaoTratamento}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        med.statusAdesao === 'regular' ? 'bg-green-100 text-green-800' :
                        med.statusAdesao === 'irregular' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {med.statusAdesao}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Última compra:</span>
                        <p className="font-medium">{med.ultimaCompra}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Próxima compra:</span>
                        <p className="font-medium">{med.proximaCompra}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Dias restantes:</span>
                        <span className={`font-bold ${
                          med.diasRestantes <= 0 ? 'text-red-600' :
                          med.diasRestantes <= 5 ? 'text-orange-600' :
                          med.diasRestantes <= 10 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {med.diasRestantes <= 0 ? 'SEM MEDICAMENTO' : `${med.diasRestantes} dias`}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className={`h-2 rounded-full ${
                            med.diasRestantes <= 0 ? 'bg-red-500' :
                            med.diasRestantes <= 5 ? 'bg-orange-500' :
                            med.diasRestantes <= 10 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.max(0, Math.min(100, (med.diasRestantes / 30) * 100))}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {protocolo?.observacoes && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2">Observações do Protocolo</h4>
                  <p className="text-yellow-700">{protocolo.observacoes}</p>
                </div>
              )}

              <div className="mt-6 flex justify-between text-sm text-gray-500">
                <span>Protocolo iniciado em: {protocolo?.dataInicio}</span>
                <span>Próxima consulta: {protocolo?.proximaConsulta}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Histórico de Atendimentos */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Histórico de Atendimentos</h2>
          {historico.length > 0 ? (
            <div className="space-y-4">
              {historico.map((atendimento) => (
                <div key={atendimento.id} className="border-l-4 border-blue-500 pl-4 py-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{atendimento.tipo}</h4>
                      <p className="text-sm text-gray-500">
                        {atendimento.data} • {atendimento.loja} • {atendimento.farmaceutico}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">
                      Próximo retorno: {atendimento.proximoRetorno}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-3">{atendimento.observacoes}</p>
                  {atendimento.medicamentosDispensados.length > 0 && (
                    <div>
                      <span className="text-sm text-gray-500">Medicamentos dispensados:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {atendimento.medicamentosDispensados.map((med, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                            {med}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Nenhum atendimento registrado</p>
          )}
        </div>

        {/* Ações */}
        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/chat')}
            className="btn-primary"
          >
            Conversar com IA sobre este Paciente
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-secondary"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default PacienteDetalhes;