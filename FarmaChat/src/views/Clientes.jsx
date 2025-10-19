import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { farmaChatData } from '../data/farmaChatData';
import { getPacientes, getPacienteByCpf } from '../services/pacienteService';

const Clientes = () => {
  const navigate = useNavigate();
  const [busca, setBusca] = useState('');
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  // Carrega clientes ao montar o componente
  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    try {
      setCarregando(true);
      const dados = await getPacientes();
      setClientes(dados);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      setErro('Erro ao carregar clientes. Usando dados locais.');
      // Fallback para dados mockados
      setClientes(Object.values(farmaChatData.pacientes));
    } finally {
      setCarregando(false);
    }
  };

  const buscarPorCpf = async (cpf) => {
    if (cpf.length < 11) return;
    
    try {
      setCarregando(true);
      const cliente = await getPacienteByCpf(cpf.replace(/\D/g, ''));
      if (cliente) {
        setClientes([cliente]);
      }
    } catch (error) {
      console.error('Erro ao buscar por CPF:', error);
      // Fallback para busca local
      const clienteLocal = Object.values(farmaChatData.pacientes).find(c => 
        c.cpf.replace(/\D/g, '') === cpf.replace(/\D/g, '')
      );
      if (clienteLocal) {
        setClientes([clienteLocal]);
      }
    } finally {
      setCarregando(false);
    }
  };

  const clientesFiltrados = clientes.filter(cliente => 
    cliente.cpf?.replace(/\D/g, '').includes(busca.replace(/\D/g, '')) ||
    cliente.nome?.toLowerCase().includes(busca.toLowerCase())
  );

  // Busca automática por CPF quando digitado
  useEffect(() => {
    if (busca.replace(/\D/g, '').length === 11) {
      buscarPorCpf(busca);
    } else if (busca === '') {
      carregarClientes();
    }
  }, [busca]);

  const selecionarCliente = (cliente) => {
    setClienteSelecionado(cliente);
  };

  const iniciarAtendimento = (clienteId) => {
    navigate(`/chat?cliente=${clienteId}`);
  };

  const formatarCPF = (cpf) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Clientes Pague Menos
          </h1>
          <p className="text-gray-600">
            Busque e inicie atendimento personalizado com seus clientes
          </p>
        </div>

        {/* Busca */}
        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar Cliente por CPF ou Nome
              </label>
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Digite o CPF (000.000.000-00) ou nome do cliente"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pague-azul-500 focus:border-pague-azul-500"
              />
            </div>
            <button
              onClick={() => {
                setBusca('');
                carregarClientes();
              }}
              className="px-4 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={carregando}
            >
              {carregando ? 'Carregando...' : 'Limpar'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Clientes */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="p-6 border-b pague-menos-gradient text-white rounded-t-lg">
                <h2 className="text-xl font-semibold">
                  Clientes Encontrados ({clientesFiltrados.length})
                </h2>
                {erro && (
                  <p className="text-sm text-pague-azul-100 mt-1">{erro}</p>
                )}
              </div>
              <div className="divide-y max-h-96 overflow-y-auto">
                {clientesFiltrados.map((cliente) => (
                  <div
                    key={cliente.id}
                    onClick={() => selecionarCliente(cliente)}
                    className={`p-4 cursor-pointer hover:bg-pague-azul-50 transition-colors ${
                      clienteSelecionado?.id === cliente.id ? 'bg-pague-azul-100 border-r-4 border-pague-azul-500' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{cliente.nome}</h3>
                        <p className="text-sm text-gray-500">CPF: {cliente.cpf}</p>
                        <p className="text-sm text-gray-500">{cliente.idade} anos • {cliente.endereco}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            cliente.scoreAdesao >= 90 ? 'bg-green-100 text-green-800' :
                            cliente.scoreAdesao >= 75 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-pague-vermelho-100 text-pague-vermelho-800'
                          }`}>
                            {cliente.scoreAdesao}% adesão
                          </span>
                        </div>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${
                        cliente.risco === 'baixo' ? 'bg-green-400' :
                        cliente.risco === 'medio' ? 'bg-yellow-400' : 'bg-pague-vermelho-400'
                      }`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Perfil do Cliente */}
          <div className="lg:col-span-2">
            {clienteSelecionado ? (
              <div className="space-y-6">
                {/* Header do Cliente */}
                <div className="card p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{clienteSelecionado.nome}</h2>
                      <p className="text-gray-600">CPF: {clienteSelecionado.cpf}</p>
                      <p className="text-sm text-gray-500">
                        {clienteSelecionado.idade} anos • {clienteSelecionado.telefone}
                      </p>
                      <p className="text-sm text-gray-500">{clienteSelecionado.endereco}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-3xl font-bold ${
                        clienteSelecionado.scoreAdesao >= 90 ? 'text-green-600' :
                        clienteSelecionado.scoreAdesao >= 75 ? 'text-yellow-600' :
                        'text-pague-vermelho-600'
                      }`}>
                        {clienteSelecionado.scoreAdesao}%
                      </div>
                      <div className="text-sm text-gray-500">Score de Adesão</div>
                      <div className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                        clienteSelecionado.risco === 'baixo' ? 'bg-green-100 text-green-800' :
                        clienteSelecionado.risco === 'medio' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-pague-vermelho-100 text-pague-vermelho-800'
                      }`}>
                        Risco {clienteSelecionado.risco.charAt(0).toUpperCase() + clienteSelecionado.risco.slice(1)}
                      </div>
                    </div>
                  </div>

                  {/* Informações Básicas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Condições Crônicas</h3>
                      <div className="flex flex-wrap gap-2">
                        {clienteSelecionado.condicoesCronicas.map((condicao, index) => (
                          <span key={index} className="px-3 py-1 text-sm bg-pague-azul-100 text-pague-azul-800 rounded-full">
                            {condicao}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Informações do Protocolo</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-gray-500">Status:</span> <span className="font-medium">{clienteSelecionado.statusProtocolo}</span></p>
                        <p><span className="text-gray-500">Farmacêutico:</span> <span className="font-medium">{clienteSelecionado.farmaceuticoResponsavel}</span></p>
                        <p><span className="text-gray-500">Loja:</span> <span className="font-medium">{clienteSelecionado.lojaVinculada}</span></p>
                        <p><span className="text-gray-500">Último atendimento:</span> <span className="font-medium">{clienteSelecionado.ultimoAtendimento}</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Alergias */}
                  {clienteSelecionado.alergias.length > 0 && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h3 className="font-semibold text-red-800 mb-2">⚠️ Alergias</h3>
                      <div className="flex flex-wrap gap-2">
                        {clienteSelecionado.alergias.map((alergia, index) => (
                          <span key={index} className="px-2 py-1 text-sm bg-red-100 text-red-800 rounded-full">
                            {alergia}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Protocolo Ativo */}
                {farmaChatData.protocolos[clienteSelecionado.id] && (
                  <div className="card p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Protocolo Ativo</h3>
                    <div className="space-y-4">
                      {farmaChatData.protocolos[clienteSelecionado.id].medicamentos.map((med, index) => (
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
                )}

                {/* Ações */}
                <div className="flex space-x-4">
                  <button
                    onClick={() => iniciarAtendimento(clienteSelecionado.id)}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <span>🤖</span>
                    <span>Iniciar Atendimento com IA</span>
                  </button>
                  <button
                    onClick={() => navigate(`/paciente/${clienteSelecionado.id}`)}
                    className="btn-secondary"
                  >
                    Ver Histórico Completo
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
                  Selecione um cliente
                </h3>
                <p className="text-gray-500">
                  Use a busca por CPF ou nome para encontrar o cliente e iniciar o atendimento
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card p-6 text-center border-l-4 border-pague-azul-500">
            <div className="text-2xl font-bold text-pague-azul-600">{clientes.length}</div>
            <div className="text-gray-600">Total de Clientes</div>
          </div>
          <div className="card p-6 text-center border-l-4 border-green-500">
            <div className="text-2xl font-bold text-green-600">
              {clientes.filter(c => c.statusProtocolo === 'ativo').length}
            </div>
            <div className="text-gray-600">Protocolos Ativos</div>
          </div>
          <div className="card p-6 text-center border-l-4 border-yellow-500">
            <div className="text-2xl font-bold text-yellow-600">
              {clientes.filter(c => c.risco === 'medio').length}
            </div>
            <div className="text-gray-600">Risco Médio</div>
          </div>
          <div className="card p-6 text-center border-l-4 border-pague-vermelho-500">
            <div className="text-2xl font-bold text-pague-vermelho-600">
              {clientes.filter(c => c.risco === 'alto').length}
            </div>
            <div className="text-gray-600">Risco Alto</div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Clientes;