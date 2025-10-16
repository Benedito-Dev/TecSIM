import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Users, 
  Search, 
  Plus, 
  FileText, 
  Pill,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Edit,
  Filter,
  Download,
  Eye
} from "lucide-react";
import Sidebar from "../../components/SideBarr";

import { getPacientes } from '../../services/pacienteService'

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
      ultimaCompra: "05/01/2024",
      status: "inativo"
    }
  ];

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setClientes(clientesMock);
      setLoading(false);
    }, 1000);
  }, []);

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  const handleNovoCliente = () => {
    navigate('/clientes/novo');
  };

  const handleVerDetalhes = (cliente) => {
    setClienteSelecionado(cliente);
  };

  const handleFecharDetalhes = () => {
    setClienteSelecionado(null);
  };

  const filtrarClientes = () => {
    let clientesFiltrados = clientes;

    // Filtro por status
    if (filtroAtivo !== "todos") {
      clientesFiltrados = clientesFiltrados.filter(cliente => 
        cliente.status === filtroAtivo
      );
    }

    // Filtro por busca
    if (searchTerm) {
      const termo = searchTerm.toLowerCase();
      clientesFiltrados = clientesFiltrados.filter(cliente =>
        cliente.nome.toLowerCase().includes(termo) ||
        cliente.cpf.includes(termo) ||
        cliente.telefone.includes(termo) ||
        cliente.email.toLowerCase().includes(termo)
      );
    }

    return clientesFiltrados;
  };

  const clientesFiltrados = filtrarClientes();

  const CardCliente = ({ cliente }) => (
    <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
            {cliente.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-bold text-gray-800 text-lg">{cliente.nome}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                cliente.status === 'ativo' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {cliente.status === 'ativo' ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="font-medium">CPF:</span>
                <span>{cliente.cpf}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} />
                <span>{cliente.telefone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <span>Última compra: {cliente.ultimaCompra}</span>
              </div>
              <div className="flex items-center gap-2">
                <Pill size={14} />
                <span>{cliente.medicamentosContinuos.length} med. contínuos</span>
              </div>
            </div>

            {cliente.alergias.length > 0 && (
              <div className="mt-2">
                <span className="text-xs font-medium text-red-600">⚠️ Alergias: </span>
                <span className="text-xs text-red-600">{cliente.alergias.join(', ')}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleVerDetalhes(cliente)}
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Eye size={14} />
            Detalhes
          </button>
          <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm">
            <Edit size={14} />
            Editar
          </button>
        </div>
      </div>
    </div>
  );

  const ModalDetalhes = ({ cliente, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Detalhes do Cliente</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Informações Pessoais */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4 text-lg">Informações Pessoais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Users size={20} className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Nome Completo</p>
                  <p className="font-medium">{cliente.nome}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FileText size={20} className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">CPF</p>
                  <p className="font-medium">{cliente.cpf}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar size={20} className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Data de Nascimento</p>
                  <p className="font-medium">{cliente.dataNascimento}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone size={20} className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Telefone</p>
                  <p className="font-medium">{cliente.telefone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail size={20} className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{cliente.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg md:col-span-2">
                <MapPin size={20} className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Endereço</p>
                  <p className="font-medium">{cliente.endereco}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Informações Médicas */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4 text-lg">Informações Médicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                <h4 className="font-medium text-red-800 mb-2">Alergias</h4>
                {cliente.alergias.length > 0 ? (
                  <ul className="text-red-700">
                    {cliente.alergias.map((alergia, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span>•</span> {alergia}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-red-700">Nenhuma alergia registrada</p>
                )}
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <h4 className="font-medium text-green-800 mb-2">Medicamentos Contínuos</h4>
                {cliente.medicamentosContinuos.length > 0 ? (
                  <ul className="text-green-700">
                    {cliente.medicamentosContinuos.map((medicamento, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Pill size={14} /> {medicamento}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-green-700">Nenhum medicamento contínuo</p>
                )}
              </div>
            </div>
          </div>

          {/* Histórico */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4 text-lg">Histórico</h3>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-blue-700">
                <strong>Última compra:</strong> {cliente.ultimaCompra}
              </p>
              <p className="text-blue-700 mt-2">
                <strong>Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  cliente.status === 'ativo' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {cliente.status === 'ativo' ? 'Cliente Ativo' : 'Cliente Inativo'}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Fechar
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Imprimir Ficha
          </button>
        </div>
      </div>
    </div>
  );

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
              <Users size={28} className="text-white" />
              <h1 className="text-2xl font-bold text-white">Gestão de Clientes</h1>
            </div>
          </div>

          <button 
            onClick={handleNovoCliente}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={18} />
            <span>Novo Cliente</span>
          </button>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 ml-20 lg:ml-60 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            
            {/* Barra de Ferramentas */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                {/* Busca */}
                <div className="relative flex-1 max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="text-gray-400" size={20} />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar por nome, CPF, telefone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Filtros */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setFiltroAtivo("todos")}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        filtroAtivo === "todos" 
                          ? "bg-white text-blue-600 shadow-sm" 
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      Todos
                    </button>
                    <button
                      onClick={() => setFiltroAtivo("ativo")}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        filtroAtivo === "ativo" 
                          ? "bg-white text-green-600 shadow-sm" 
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      Ativos
                    </button>
                    <button
                      onClick={() => setFiltroAtivo("inativo")}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        filtroAtivo === "inativo" 
                          ? "bg-white text-gray-600 shadow-sm" 
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      Inativos
                    </button>
                  </div>

                  <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                    <Download size={16} />
                    Exportar
                  </button>
                </div>
              </div>
            </div>

            {/* Estatísticas Rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-xl border border-gray-100">
                <div className="text-2xl font-bold text-blue-600">{clientes.length}</div>
                <div className="text-sm text-gray-600">Total de Clientes</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100">
                <div className="text-2xl font-bold text-green-600">
                  {clientes.filter(c => c.status === 'ativo').length}
                </div>
                <div className="text-sm text-gray-600">Clientes Ativos</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100">
                <div className="text-2xl font-bold text-orange-600">
                  {clientes.filter(c => c.alergias.length > 0).length}
                </div>
                <div className="text-sm text-gray-600">Com Alergias</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100">
                <div className="text-2xl font-bold text-purple-600">
                  {clientes.filter(c => c.medicamentosContinuos.length > 0).length}
                </div>
                <div className="text-sm text-gray-600">Med. Contínuos</div>
              </div>
            </div>

            {/* Lista de Clientes */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600">Carregando clientes...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {clientesFiltrados.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                    <Users className="text-gray-300 text-6xl mx-auto mb-4" />
                    <p className="text-gray-500 text-lg mb-4">
                      {searchTerm ? "Nenhum cliente encontrado para sua busca." : "Nenhum cliente cadastrado."}
                    </p>
                    {searchTerm && (
                      <button 
                        onClick={() => setSearchTerm("")}
                        className="text-blue-600 hover:text-blue-700 underline"
                      >
                        Limpar busca
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <p className="text-gray-600 text-sm">
                      {clientesFiltrados.length} cliente(s) encontrado(s)
                      {searchTerm && ` para "${searchTerm}"`}
                    </p>
                    
                    {clientesFiltrados.map((cliente) => (
                      <CardCliente key={cliente.id} cliente={cliente} />
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Detalhes */}
      {clienteSelecionado && (
        <ModalDetalhes 
          cliente={clienteSelecionado} 
          onClose={handleFecharDetalhes} 
        />
      )}
    </div>
  );
}