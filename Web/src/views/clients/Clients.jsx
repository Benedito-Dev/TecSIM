import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { 
  MessageSquare, 
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
  Download,
  Eye,
  Stethoscope,
  Sun,
  Moon
} from "lucide-react";
import Sidebar from "../../components/SideBarr";
import { ThemeContext } from "../../context/ThemeContext";

import { getPacientes } from '../../services/pacienteService'

export default function Clients() {
  const navigate = useNavigate();
  const { theme, toggleTheme, isDark } = useContext(ThemeContext);
  
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
    },
    {
      id: 6,
      nome: "Roberto Santos Mendes",
      cpf: "654.321.789-00",
      telefone: "(85) 94444-5678",
      email: "roberto.mendes@email.com",
      dataNascimento: "25/07/1988",
      endereco: "Av. Dom Luís, 890 - Meireles, Fortaleza/CE",
      alergias: [],
      medicamentosContinuos: ["Gliclazida 80mg", "Metformina 1000mg"],
      condicoesCronicas: ["Diabetes tipo 2"],
      ultimaCompra: "18/01/2024",
      status: "ativo"
    },
    {
      id: 7,
      nome: "Luiza Fernandes Costa",
      cpf: "147.258.369-00",
      telefone: "(85) 93333-9012",
      email: "luiza.fernandes@email.com",
      dataNascimento: "14/02/1995",
      endereco: "Rua Major Facundo, 234 - Centro, Fortaleza/CE",
      alergias: ["Látex"],
      medicamentosContinuos: [],
      condicoesCronicas: ["Asma"],
      ultimaCompra: "12/01/2024",
      status: "ativo"
    },
    {
      id: 8,
      nome: "Antônio José Silva",
      cpf: "258.369.147-00",
      telefone: "(85) 92222-3456",
      email: "antonio.silva@email.com",
      dataNascimento: "30/09/1960",
      endereco: "Rua Coronel Correia, 445 - Jacarecanga, Fortaleza/CE",
      alergias: ["Penicilina", "Sulfa"],
      medicamentosContinuos: ["Amlodipina 10mg", "Atenolol 50mg", "Sinvastatina 20mg"],
      condicoesCronicas: ["Hipertensão", "Dislipidemia"],
      ultimaCompra: "22/01/2024",
      status: "ativo"
    },
    {
      id: 9,
      nome: "Cláudia Regina Souza",
      cpf: "369.147.258-00",
      telefone: "(85) 91111-7890",
      email: "claudia.souza@email.com",
      dataNascimento: "19/06/1975",
      endereco: "Av. Antônio Sales, 678 - Dionisio Torres, Fortaleza/CE",
      alergias: [],
      medicamentosContinuos: ["Levotiroxina 75mcg", "Cálcio + Vitamina D"],
      condicoesCronicas: ["Hipotireoidismo", "Osteopenia"],
      ultimaCompra: "16/01/2024",
      status: "ativo"
    },
    {
      id: 10,
      nome: "Pedro Henrique Oliveira",
      cpf: "741.852.963-00",
      telefone: "(85) 90000-1234",
      email: "pedro.oliveira@email.com",
      dataNascimento: "11/04/1992",
      endereco: "Rua Nogueira Acioli, 123 - Cocó, Fortaleza/CE",
      alergias: ["Dipirona"],
      medicamentosContinuos: [],
      condicoesCronicas: [],
      ultimaCompra: "25/01/2024",
      status: "ativo"
    },
    {
      id: 11,
      nome: "Rosângela Batista Lima",
      cpf: "852.963.741-00",
      telefone: "(85) 98765-4321",
      email: "rosangela.lima@email.com",
      dataNascimento: "07/12/1968",
      endereco: "Rua Padre Antônio Tomás, 789 - Aldeota, Fortaleza/CE",
      alergias: ["Iodo", "Frutos do mar"],
      medicamentosContinuos: ["Insulina NPH", "Insulina Regular", "Losartana 100mg"],
      condicoesCronicas: ["Diabetes tipo 1", "Hipertensão", "Nefropatia diabética"],
      ultimaCompra: "23/01/2024",
      status: "ativo"
    },
    {
      id: 12,
      nome: "Márcio Andrade Santos",
      cpf: "963.741.852-00",
      telefone: "(85) 97654-3210",
      email: "marcio.santos@email.com",
      dataNascimento: "28/01/1983",
      endereco: "Av. Washington Soares, 1456 - Edson Queiroz, Fortaleza/CE",
      alergias: [],
      medicamentosContinuos: ["Fluoxetina 20mg", "Clonazepam 2mg"],
      condicoesCronicas: ["Depressão", "Ansiedade"],
      ultimaCompra: "14/01/2024",
      status: "ativo"
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
    navigate('/novocliente');
  };

  const handleVerDetalhes = (cliente) => {
    setClienteSelecionado(cliente);
  };

  const handleFecharDetalhes = () => {
    setClienteSelecionado(null);
  };

  // NOVA FUNÇÃO: Iniciar atendimento
  const handleIniciarAtendimento = (paciente) => {
    navigate('/atendimento', { 
      state: { 
        paciente: paciente // Passa o objeto completo do paciente
      }
    });
  };

  // FUNÇÃO para editar cliente (se quiser implementar depois)
  const handleEditarCliente = (cliente) => {
    // Exemplo para edição - você pode implementar depois
    console.log('Editar cliente:', cliente);
    // navigate(`/editar-cliente/${cliente.id}`, { state: { cliente } });
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

  // ATUALIZEI o CardCliente para incluir o botão de atendimento
  const CardCliente = ({ cliente, onIniciarAtendimento, onVerDetalhes, onEditar }) => (
    <div className="rounded-xl p-6 border hover:shadow-md transition-all duration-200" style={{ backgroundColor: theme.backgroundCard, borderColor: theme.border }}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: theme.primaryLight, color: theme.primary }}>
            {cliente.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-bold text-lg" style={{ color: theme.textPrimary }}>{cliente.nome}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                cliente.status === 'ativo' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {cliente.status === 'ativo' ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm" style={{ color: theme.textSecondary }}>
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

            {cliente.condicoesCronicas?.length > 0 && (
              <div className="mt-2">
                <span className="text-xs font-medium" style={{ color: theme.warning }}>🏥 Patologias: </span>
                <span className="text-xs" style={{ color: theme.warning }}>{cliente.condicoesCronicas.join(', ')}</span>
              </div>
            )}

            {cliente.alergias.length > 0 && (
              <div className="mt-2">
                <span className="text-xs font-medium" style={{ color: theme.error }}>⚠️ Alergias: </span>
                <span className="text-xs" style={{ color: theme.error }}>{cliente.alergias.join(', ')}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {/* BOTÃO INICIAR ATENDIMENTO - NOVO */}
          <button
            onClick={() => onIniciarAtendimento(cliente)}
            className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            <Stethoscope size={14} />
            Atendimento
          </button>
          
          <button
            onClick={() => onVerDetalhes(cliente)}
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Eye size={14} />
            Detalhes
          </button>
          
          <button 
            onClick={() => onEditar(cliente)}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            <Edit size={14} />
            Editar
          </button>
        </div>
      </div>
    </div>
  );

  // ATUALIZEI o ModalDetalhes para incluir botão de atendimento também
  const ModalDetalhes = ({ cliente, onClose, onIniciarAtendimento }) => (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: theme.overlay }}>
      <div className="rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{ backgroundColor: theme.backgroundCard }}>
        <div className="p-6" style={{ borderBottom: `1px solid ${theme.border}` }}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold" style={{ color: theme.textPrimary }}>Detalhes do Cliente</h2>
            <button
              onClick={onClose}
              className="transition-colors"
              style={{ color: theme.textMuted }}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Informações Pessoais */}
          <div>
            <h3 className="font-semibold mb-4 text-lg" style={{ color: theme.textPrimary }}>Informações Pessoais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: theme.backgroundSecondary }}>
                <Users size={20} style={{ color: theme.primary }} />
                <div>
                  <p className="text-sm" style={{ color: theme.textMuted }}>Nome Completo</p>
                  <p className="font-medium" style={{ color: theme.textPrimary }}>{cliente.nome}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: theme.backgroundSecondary }}>
                <FileText size={20} style={{ color: theme.primary }} />
                <div>
                  <p className="text-sm" style={{ color: theme.textMuted }}>CPF</p>
                  <p className="font-medium" style={{ color: theme.textPrimary }}>{cliente.cpf}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: theme.backgroundSecondary }}>
                <Calendar size={20} style={{ color: theme.primary }} />
                <div>
                  <p className="text-sm" style={{ color: theme.textMuted }}>Data de Nascimento</p>
                  <p className="font-medium" style={{ color: theme.textPrimary }}>{cliente.dataNascimento}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: theme.backgroundSecondary }}>
                <Phone size={20} style={{ color: theme.primary }} />
                <div>
                  <p className="text-sm" style={{ color: theme.textMuted }}>Telefone</p>
                  <p className="font-medium" style={{ color: theme.textPrimary }}>{cliente.telefone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: theme.backgroundSecondary }}>
                <Mail size={20} style={{ color: theme.primary }} />
                <div>
                  <p className="text-sm" style={{ color: theme.textMuted }}>Email</p>
                  <p className="font-medium" style={{ color: theme.textPrimary }}>{cliente.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg md:col-span-2" style={{ backgroundColor: theme.backgroundSecondary }}>
                <MapPin size={20} style={{ color: theme.primary }} />
                <div>
                  <p className="text-sm" style={{ color: theme.textMuted }}>Endereço</p>
                  <p className="font-medium" style={{ color: theme.textPrimary }}>{cliente.endereco}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Informações Médicas */}
          <div>
            <h3 className="font-semibold mb-4 text-lg" style={{ color: theme.textPrimary }}>Informações Médicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                <h4 className="font-medium text-purple-800 mb-2">Patologias</h4>
                {cliente.condicoesCronicas?.length > 0 ? (
                  <ul className="text-purple-700">
                    {cliente.condicoesCronicas.map((condicao, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span>•</span> {condicao}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-purple-700">Nenhuma patologia registrada</p>
                )}
              </div>
              
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
            <h3 className="font-semibold mb-4 text-lg" style={{ color: theme.textPrimary }}>Histórico</h3>
            <div className="p-4 rounded-lg" style={{ backgroundColor: theme.primaryLight, border: `1px solid ${theme.border}` }}>
              <p style={{ color: theme.textPrimary }}>
                <strong>Última compra:</strong> {cliente.ultimaCompra}
              </p>
              <p style={{ color: theme.textPrimary }} className="mt-2">
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

        <div className="p-6 flex justify-between gap-3" style={{ borderTop: `1px solid ${theme.border}` }}>
          {/* BOTÃO INICIAR ATENDIMENTO NO MODAL */}
          <button
            onClick={() => {
              onIniciarAtendimento(cliente);
              onClose();
            }}
            className="flex items-center gap-2 text-white px-4 py-2 rounded-lg transition-colors"
            style={{ backgroundColor: theme.success }}
          >
            <Stethoscope size={16} />
            Iniciar Atendimento
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg transition-colors"
              style={{ 
                border: `1px solid ${theme.border}`, 
                color: theme.textPrimary,
                backgroundColor: theme.backgroundCard
              }}
            >
              Fechar
            </button>
            <button className="px-4 py-2 text-white rounded-lg transition-colors" style={{ backgroundColor: theme.primary }}>
              Imprimir Ficha
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen" style={{ backgroundColor: theme.background }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col transition-all duration-300">
        
        {/* Navbar */}
        <div className="h-20 shadow flex items-center justify-between px-6 sticky top-0 z-10" style={{ backgroundColor: theme.primary }}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Users size={28} className="text-white" />
              <h1 className="text-2xl font-bold text-white">Gestão de Clientes</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-colors"
              style={{ 
                backgroundColor: theme.backgroundCard, 
                color: theme.textPrimary,
                border: `1px solid ${theme.border}`
              }}
              title={isDark ? "Modo Claro" : "Modo Escuro"}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <button 
              onClick={handleNovoCliente}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition text-white"
              style={{ backgroundColor: theme.primary }}
            >
              <Plus size={18} />
              <span>Novo Cliente</span>
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 ml-20 lg:ml-60 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            
            {/* Barra de Ferramentas */}
            <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: theme.backgroundCard, border: `1px solid ${theme.border}` }}>
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
                    className="w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ 
                      backgroundColor: theme.backgroundCard,
                      border: `1px solid ${theme.border}`,
                      color: theme.textPrimary,
                      focusRingColor: theme.primary
                    }}
                  />
                </div>

                {/* Filtros */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 rounded-lg p-1" style={{ backgroundColor: theme.backgroundSecondary }}>
                    <button
                      onClick={() => setFiltroAtivo("todos")}
                      className="px-3 py-1 rounded-md text-sm font-medium transition-colors"
                      style={{
                        backgroundColor: filtroAtivo === "todos" ? theme.backgroundCard : 'transparent',
                        color: filtroAtivo === "todos" ? theme.primary : theme.textSecondary,
                        boxShadow: filtroAtivo === "todos" ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                      }}
                    >
                      Todos
                    </button>
                    <button
                      onClick={() => setFiltroAtivo("ativo")}
                      className="px-3 py-1 rounded-md text-sm font-medium transition-colors"
                      style={{
                        backgroundColor: filtroAtivo === "ativo" ? theme.backgroundCard : 'transparent',
                        color: filtroAtivo === "ativo" ? theme.success : theme.textSecondary,
                        boxShadow: filtroAtivo === "ativo" ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                      }}
                    >
                      Ativos
                    </button>
                    <button
                      onClick={() => setFiltroAtivo("inativo")}
                      className="px-3 py-1 rounded-md text-sm font-medium transition-colors"
                      style={{
                        backgroundColor: filtroAtivo === "inativo" ? theme.backgroundCard : 'transparent',
                        color: filtroAtivo === "inativo" ? theme.textPrimary : theme.textSecondary,
                        boxShadow: filtroAtivo === "inativo" ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                      }}
                    >
                      Inativos
                    </button>
                  </div>

                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors" style={{ backgroundColor: theme.backgroundSecondary, color: theme.textPrimary }}>
                    <Download size={16} />
                    Exportar
                  </button>
                </div>
              </div>
            </div>

            {/* Estatísticas Rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-xl" style={{ backgroundColor: theme.backgroundCard, border: `1px solid ${theme.border}` }}>
                <div className="text-2xl font-bold" style={{ color: theme.primary }}>{clientes.length}</div>
                <div className="text-sm" style={{ color: theme.textSecondary }}>Total de Clientes</div>
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: theme.backgroundCard, border: `1px solid ${theme.border}` }}>
                <div className="text-2xl font-bold" style={{ color: theme.success }}>
                  {clientes.filter(c => c.status === 'ativo').length}
                </div>
                <div className="text-sm" style={{ color: theme.textSecondary }}>Clientes Ativos</div>
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: theme.backgroundCard, border: `1px solid ${theme.border}` }}>
                <div className="text-2xl font-bold" style={{ color: theme.warning }}>
                  {clientes.filter(c => c.alergias.length > 0).length}
                </div>
                <div className="text-sm" style={{ color: theme.textSecondary }}>Com Alergias</div>
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: theme.backgroundCard, border: `1px solid ${theme.border}` }}>
                <div className="text-2xl font-bold" style={{ color: theme.info }}>
                  {clientes.filter(c => c.condicoesCronicas?.length > 0).length}
                </div>
                <div className="text-sm" style={{ color: theme.textSecondary }}>Com Patologias</div>
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
                  <div className="text-center py-12 rounded-2xl" style={{ backgroundColor: theme.backgroundCard, border: `1px solid ${theme.border}` }}>
                    <Users className="text-6xl mx-auto mb-4" style={{ color: theme.textMuted }} />
                    <p className="text-lg mb-4" style={{ color: theme.textSecondary }}>
                      {searchTerm ? "Nenhum cliente encontrado para sua busca." : "Nenhum cliente cadastrado."}
                    </p>
                    {searchTerm && (
                      <button 
                        onClick={() => setSearchTerm("")}
                        className="underline"
                        style={{ color: theme.primary }}
                      >
                        Limpar busca
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <p className="text-sm" style={{ color: theme.textSecondary }}>
                      {clientesFiltrados.length} cliente(s) encontrado(s)
                      {searchTerm && ` para "${searchTerm}"`}
                    </p>
                    
                    {/* ATUALIZEI o map para passar as funções como props */}
                    {clientesFiltrados.map((cliente) => (
                      <CardCliente 
                        key={cliente.id} 
                        cliente={cliente}
                        onIniciarAtendimento={handleIniciarAtendimento}
                        onVerDetalhes={handleVerDetalhes}
                        onEditar={handleEditarCliente}
                      />
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Detalhes - ATUALIZEI para passar a função de atendimento */}
      {clienteSelecionado && (
        <ModalDetalhes 
          cliente={clienteSelecionado} 
          onClose={handleFecharDetalhes}
          onIniciarAtendimento={handleIniciarAtendimento}
        />
      )}
    </div>
  );
}