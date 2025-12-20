// src/pages/Medicamentos.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "../../components/SideBarr";
import { FaPills, FaSearch, FaSpinner, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { getMedicamentos } from '../../services/medicamentosService';

const Medicamentos = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { theme, mode } = useTheme();

  useEffect(() => {
    async function fetchMedicamentos() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getMedicamentos();
        if (Array.isArray(response)) {
          setMedicamentos(response);
        } else {
          console.error("Resposta inesperada:", response);
          setError("Formato de dados inválido recebido do servidor.");
        }
      } catch (error) {
        console.error("Erro ao buscar medicamentos:", error);
        setError("Erro ao carregar medicamentos. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchMedicamentos();
  }, []);

  const filteredMedicamentos = medicamentos.filter(
    (med) =>
      med.nome.toLowerCase().includes(search.toLowerCase()) ||
      med.tipo.toLowerCase().includes(search.toLowerCase()) ||
      med.descricao.toLowerCase().includes(search.toLowerCase())
  );

  // Cálculos de paginação
  const totalPages = Math.ceil(filteredMedicamentos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMedicamentos = filteredMedicamentos.slice(startIndex, endIndex);

  // Reset página quando filtro muda
  useEffect(() => {
    setCurrentPage(1);
  }, [search, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const formatPrice = (medicamento) => {
    const priceMap = {
      "Analgésico": "R$ 12,00",
      "Anti-inflamatório": "R$ 15,00", 
      "Antibiótico": "R$ 25,00",
      "Antialérgico": "R$ 18,00"
    };
    return priceMap[medicamento.tipo] || "R$ 20,00";
  };

  const handleAddMedicamento = (medicamento) => {
    console.log("Medicamento adicionado:", medicamento);
    alert(`${medicamento.nome} adicionado à sua lista!`);
  };

  return (
    <div 
      className="flex h-screen"
      style={{ background: theme.background }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col transition-all duration-300">
        {/* Navbar */}
        <div 
          className="h-20 shadow flex items-center px-6 sticky top-0 z-10"
          style={{ 
            background: theme.primary,
            color: theme.textOnPrimary
          }}
        >
          <h1 className="text-3xl font-bold">Medicamentos</h1>
        </div>

        {/* Conteúdo da lista */}
        <div 
          className="p-6 overflow-y-auto flex-1 ml-20 lg:ml-60"
          style={{ color: theme.textPrimary }}
        >
          {/* Barra de busca */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch style={{ color: theme.textMuted }} />
            </div>
            <input
              type="text"
              placeholder="Buscar por nome, tipo ou descrição..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: theme.backgroundCard,
                border: `1px solid ${theme.border}`,
                color: theme.textPrimary
              }}
              className="w-full pl-10 p-3 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200"
            />
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <FaSpinner 
                className="animate-spin text-4xl mb-4" 
                style={{ color: theme.primary }}
              />
              <p style={{ color: theme.textSecondary }}>
                Carregando medicamentos...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div 
              className="border rounded-xl p-6 text-center"
              style={{
                background: theme.backgroundSecondary,
                borderColor: theme.error,
                color: theme.textPrimary
              }}
            >
              <p style={{ color: theme.error }} className="font-medium">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                style={{
                  background: theme.error,
                  color: theme.textOnError
                }}
                className="mt-3 px-4 py-2 rounded-lg hover:opacity-90 transition-colors"
              >
                Tentar Novamente
              </button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredMedicamentos.length === 0 && (
            <div className="text-center py-12">
              <FaPills 
                className="text-6xl mx-auto mb-4"
                style={{ color: theme.textMuted }}
              />
              <p style={{ color: theme.textSecondary }}>
                {search ? "Nenhum medicamento encontrado para sua busca." : "Nenhum medicamento cadastrado."}
              </p>
              {search && (
                <button 
                  onClick={() => setSearch("")}
                  style={{ color: theme.primary }}
                  className="mt-2 hover:opacity-80 underline transition-colors"
                >
                  Limpar busca
                </button>
              )}
            </div>
          )}

          {/* Lista de Medicamentos */}
          {!isLoading && !error && filteredMedicamentos.length > 0 && (
            <div className="space-y-6">
              {/* Controles de paginação superior */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <p 
                    className="text-sm"
                    style={{ color: theme.textSecondary }}
                  >
                    {filteredMedicamentos.length} medicamento(s) encontrado(s)
                    {search && ` para "${search}"`}
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-sm font-medium"
                      style={{ color: theme.textPrimary }}
                    >
                      Itens por página:
                    </span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                      style={{
                        background: theme.backgroundCard,
                        border: `1px solid ${theme.border}`,
                        color: theme.textPrimary
                      }}
                      className="px-3 py-1 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={30}>30</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>

                {/* Indicador de página */}
                <div className="flex items-center gap-4">
                  <span 
                    className="text-sm"
                    style={{ color: theme.textSecondary }}
                  >
                    Página {currentPage} de {totalPages}
                  </span>
                  
                  {/* Botões de navegação */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      style={{
                        background: currentPage === 1 ? theme.backgroundSecondary : theme.primary,
                        color: currentPage === 1 ? theme.textMuted : theme.textOnPrimary,
                        opacity: currentPage === 1 ? 0.5 : 1
                      }}
                      className="p-2 rounded-lg transition-all duration-200 hover:opacity-80 disabled:cursor-not-allowed"
                    >
                      <FaChevronLeft size={14} />
                    </button>
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      style={{
                        background: currentPage === totalPages ? theme.backgroundSecondary : theme.primary,
                        color: currentPage === totalPages ? theme.textMuted : theme.textOnPrimary,
                        opacity: currentPage === totalPages ? 0.5 : 1
                      }}
                      className="p-2 rounded-lg transition-all duration-200 hover:opacity-80 disabled:cursor-not-allowed"
                    >
                      <FaChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Lista paginada */}
              <div className="space-y-4">
                {currentMedicamentos.map((med) => (
                <div
                  key={med.id_medicamento}
                  style={{
                    background: theme.backgroundCard,
                    border: `1px solid ${theme.border}`,
                    color: theme.textPrimary
                  }}
                  className="p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div 
                        className="text-2xl mt-1"
                        style={{ color: theme.primary }}
                      >
                        <FaPills />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 
                            className="font-bold text-xl"
                            style={{ color: theme.textPrimary }}
                          >
                            {med.nome}
                          </h3>
                          <span 
                            className="text-xs font-medium px-2 py-1 rounded-full"
                            style={{
                              background: theme.primaryLight,
                              color: theme.primary
                            }}
                          >
                            {med.tipo}
                          </span>
                        </div>
                        <p 
                          className="mb-3"
                          style={{ color: theme.textSecondary }}
                        >
                          {med.descricao}
                        </p>
                        
                        {/* Informações detalhadas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div style={{ color: theme.textSecondary }}>
                            <span style={{ color: theme.textPrimary }} className="font-medium">Composição:</span> {med.composicao}
                          </div>
                          <div style={{ color: theme.textSecondary }}>
                            <span style={{ color: theme.textPrimary }} className="font-medium">Dosagem:</span> {med.dosagem_padrao}
                          </div>
                          <div style={{ color: theme.textSecondary }}>
                            <span style={{ color: theme.textPrimary }} className="font-medium">Faixa Etária:</span> {med.faixa_etaria_minima} - {med.faixa_etaria_maxima} anos
                          </div>
                          {med.contraindicacoes && (
                            <div style={{ color: theme.error }}>
                              <span className="font-medium">Cuidado:</span> {med.contraindicacoes}
                            </div>
                          )}
                        </div>

                        {/* Interações */}
                        {med.interacoes_comuns && (
                          <div className="mt-2">
                            <span 
                              className="font-medium text-sm"
                              style={{ color: theme.warning }}
                            >
                              Interações:
                            </span> 
                            <span 
                              className="text-sm ml-1"
                              style={{ color: theme.textSecondary }}
                            >
                              {med.interacoes_comuns}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 ml-4">
                      <span 
                        className="font-bold text-xl"
                        style={{ color: theme.textPrimary }}
                      >
                        {formatPrice(med)}
                      </span>
                      <button 
                        onClick={() => handleAddMedicamento(med)}
                        style={{
                          background: theme.primary,
                          color: theme.textOnPrimary
                        }}
                        className="px-4 py-2 rounded-lg hover:opacity-90 transition-colors font-medium flex items-center gap-2"
                      >
                        <FaPills size={14} />
                        Adicionar
                      </button>
                      {med.bula_detalhada && (
                        <a 
                          href={med.bula_detalhada}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: theme.primary }}
                          className="hover:opacity-80 text-sm underline transition-colors"
                        >
                          Ver bula completa
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              </div>

              {/* Controles de paginação inferior */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 pt-6">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{
                      background: currentPage === 1 ? theme.backgroundSecondary : theme.primary,
                      color: currentPage === 1 ? theme.textMuted : theme.textOnPrimary,
                      opacity: currentPage === 1 ? 0.5 : 1
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-80 disabled:cursor-not-allowed"
                  >
                    <FaChevronLeft size={14} />
                    Anterior
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-sm font-medium"
                      style={{ color: theme.textPrimary }}
                    >
                      Página
                    </span>
                    <span 
                      className="px-3 py-1 rounded-lg font-bold"
                      style={{
                        background: theme.primary,
                        color: theme.textOnPrimary
                      }}
                    >
                      {currentPage}
                    </span>
                    <span 
                      className="text-sm"
                      style={{ color: theme.textSecondary }}
                    >
                      de {totalPages}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{
                      background: currentPage === totalPages ? theme.backgroundSecondary : theme.primary,
                      color: currentPage === totalPages ? theme.textMuted : theme.textOnPrimary,
                      opacity: currentPage === totalPages ? 0.5 : 1
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-80 disabled:cursor-not-allowed"
                  >
                    Próxima
                    <FaChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Medicamentos;