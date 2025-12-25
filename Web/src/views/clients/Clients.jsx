import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import { PageContainer } from "../../components/layout/PageContainer";
import { ClientsFilters } from "../../components/pages/clients/ClientsFilters";
import { ClientsStats } from "../../components/pages/clients/ClientsStats";
import { ClientsList } from "../../components/pages/clients/ClientsList";
import { ClientDetailsModal } from "../../components/pages/clients/ClientDetailsModal";

export default function Clients() {
  const navigate = useNavigate();
  
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroAtivo, setFiltroAtivo] = useState("todos");
  const [clienteSelecionado, setClienteSelecionado] = useState(null);

  // Dados mockados de clientes
  const clientesMock = [
    {
      id: 1,
      nome: "Maria Silva Santos",
      cpf: "123.456.789-00",
      telefone: "(85) 99999-1234",
      email: "maria.silva@email.com",
      dataNascimento: "15/05/1985",
      endereco: "Rua das Flores, 123 - Centro, Fortaleza/CE",
      alergias: ["Penicilina", "Dipirona"],
      medicamentosContinuos: ["Losartana 50mg", "Metformina 850mg"],
      condicoesCronicas: ["Hipertensão", "Diabetes tipo 2"],
      ultimaCompra: "15/01/2024",
      status: "ativo"
    },
    {
      id: 2,
      nome: "João Pereira Oliveira",
      cpf: "987.654.321-00",
      telefone: "(85) 98888-5678",
      email: "joao.pereira@email.com",
      dataNascimento: "20/08/1978",
      endereco: "Av. Beira Mar, 456 - Meireles, Fortaleza/CE",
      alergias: ["Sulfas"],
      medicamentosContinuos: ["Atorvastatina 20mg", "AAS 100mg"],
      condicoesCronicas: [],
      ultimaCompra: "10/01/2024",
      status: "ativo"
    },
    {
      id: 3,
      nome: "Ana Costa Ferreira",
      cpf: "456.789.123-00",
      telefone: "(85) 97777-9012",
      email: "ana.costa@email.com",
      dataNascimento: "03/12/1990",
      endereco: "Rua dos Coqueiros, 789 - Aldeota, Fortaleza/CE",
      alergias: [],
      medicamentosContinuos: ["Anticoncepcional"],
      condicoesCronicas: [],
      ultimaCompra: "08/01/2024",
      status: "ativo"
    },
    {
      id: 4,
      nome: "Carlos Eduardo Lima",
      cpf: "789.123.456-00",
      telefone: "(85) 96666-3456",
      email: "carlos.lima@email.com",
      dataNascimento: "12/03/1965",
      endereco: "Travessa das Palmeiras, 321 - Jacarecanga, Fortaleza/CE",
      alergias: ["Ibuprofeno"],
      medicamentosContinuos: ["Insulina", "Sinvastatina 40mg", "Propranolol 40mg"],
      condicoesCronicas: ["Diabetes tipo 1", "Hipertensão"],
      ultimaCompra: "05/01/2024",
      status: "inativo"
    },
    {
      id: 5,
      nome: "Francisca Almeida Rocha",
      cpf: "321.654.987-00",
      telefone: "(85) 95555-7890",
      email: "francisca.almeida@email.com",
      dataNascimento: "08/11/1952",
      endereco: "Rua São José, 567 - Benfica, Fortaleza/CE",
      alergias: ["Aspirina", "Corantes"],
      medicamentosContinuos: ["Captopril 25mg", "Hidroclorotiazida 25mg", "Omeprazol 20mg"],
      condicoesCronicas: ["Hipertensão", "Gastrite crônica"],
      ultimaCompra: "20/01/2024",
      status: "ativo"
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setClientes(clientesMock);
      setLoading(false);
    }, 1000);
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
    console.log('Editar cliente:', cliente);
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
    </>
  );
}