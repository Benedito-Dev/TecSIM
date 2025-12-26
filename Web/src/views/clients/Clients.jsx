import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import { PageContainer } from "../../components/layout/PageContainer";
import { ClientsFilters } from "../../components/pages/clients/ClientsFilters";
import { ClientsStats } from "../../components/pages/clients/ClientsStats";
import { ClientsList } from "../../components/pages/clients/ClientsList";
import { ClientDetailsModal } from "../../components/pages/clients/ClientDetailsModal";
import { ClientEditModal } from "../../components/pages/clients/ClientEditModal";
import pacientesService from "../../services/pacientesService";

export default function Clients() {
  const navigate = useNavigate();
  
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroAtivo, setFiltroAtivo] = useState("todos");
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [error, setError] = useState(null);

  const formatarData = (dataISO) => {
    if (!dataISO) return 'Não informado';
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR');
  };

  const mapearPaciente = (paciente) => ({
    id: paciente.id,
    nome: paciente.nome || 'Não informado',
    cpf: paciente.cpf || 'Não informado',
    telefone: paciente.telefone || 'Não informado',
    email: paciente.email || 'Não informado',
    dataNascimento: formatarData(paciente.data_nascimento),
    endereco: paciente.endereco || 'Não informado',
    alergias: Array.isArray(paciente.alergias) ? paciente.alergias : [],
    medicamentosContinuos: Array.isArray(paciente.medicacoes) ? paciente.medicacoes : [],
    condicoesCronicas: Array.isArray(paciente.condicoes) ? paciente.condicoes : [],
    ultimaCompra: 'Não informado',
    status: paciente.ativo ? 'ativo' : 'inativo',
    genero: paciente.genero || 'Não informado',
    data_cadastro: formatarData(paciente.data_cadastro)
  });

  const carregarClientes = async () => {
    try {
      setLoading(true);
      setError(null);
      const dados = await pacientesService.getAll();
      const clientesMapeados = dados.map(mapearPaciente);
      setClientes(clientesMapeados);
    } catch (err) {
      console.error('Erro ao carregar clientes:', err);
      setError('Erro ao carregar clientes. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  const handleNovoCliente = () => navigate('/novocliente');
  const handleVerDetalhes = (cliente) => setClienteSelecionado(cliente);
  const handleFecharDetalhes = () => setClienteSelecionado(null);
  
  const handleIniciarAtendimento = (paciente) => {
    navigate('/atendimento', { 
      state: { paciente }
    });
  };
  
  const handleEditarCliente = (cliente) => {
    setClienteEditando(cliente);
  };

  const handleSalvarEdicao = async (dadosAtualizados) => {
    try {
      await pacientesService.update(clienteEditando.id, dadosAtualizados);
      await carregarClientes();
      setClienteEditando(null);
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Erro ao atualizar cliente');
    }
  };

  const handleVerLembretes = (cliente) => {
    navigate(`/lembretes/paciente/${cliente.id}`, {
      state: { paciente: cliente }
    });
  };

  const clientesFiltrados = clientes.filter(cliente => {
    // Filtro por status
    if (filtroAtivo !== "todos" && cliente.status !== filtroAtivo) {
      return false;
    }
    
    // Filtro por busca
    if (searchTerm) {
      const termo = searchTerm.toLowerCase();
      return (
        cliente.nome.toLowerCase().includes(termo) ||
        cliente.cpf.includes(termo) ||
        cliente.telefone.includes(termo) ||
        cliente.email.toLowerCase().includes(termo)
      );
    }
    
    return true;
  });

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <PageContainer title="Gestão de Clientes" icon={Users}>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Carregando clientes...</p>
          </div>
        </PageContainer>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <PageContainer title="Gestão de Clientes" icon={Users}>
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={carregarClientes}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Tentar Novamente
            </button>
          </div>
        </PageContainer>
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen">
        <Sidebar />
        
        <PageContainer 
          title="Gestão de Clientes" 
          icon={Users}
          buttonText="Novo Cliente"
          onButtonClick={handleNovoCliente}
        >
          <div className="max-w-7xl mx-auto">
            <ClientsFilters 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filtroAtivo={filtroAtivo}
              setFiltroAtivo={setFiltroAtivo}
            />

            <ClientsStats clientes={clientes} />

            <ClientsList 
              clientes={clientesFiltrados}
              searchTerm={searchTerm}
              onIniciarAtendimento={handleIniciarAtendimento}
              onVerDetalhes={handleVerDetalhes}
              onEditar={handleEditarCliente}
              onVerLembretes={handleVerLembretes}
              onClearSearch={() => setSearchTerm("")}
            />
          </div>
        </PageContainer>
      </div>

      {clienteSelecionado && (
        <ClientDetailsModal 
          cliente={clienteSelecionado} 
          onClose={handleFecharDetalhes}
          onIniciarAtendimento={handleIniciarAtendimento}
        />
      )}

      {clienteEditando && (
        <ClientEditModal
          cliente={clienteEditando}
          onClose={() => setClienteEditando(null)}
          onSave={handleSalvarEdicao}
        />
      )}
    </>
  );
}