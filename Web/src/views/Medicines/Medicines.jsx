// src/pages/Medicamentos.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "../../components/SideBarr";
import { FaPills, FaSearch, FaSpinner } from "react-icons/fa";

import { getMedicamentos } from '../../services/medicamentosService';

const Medicamentos = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const formatPrice = (medicamento) => {
    // Simulação de preço baseada no tipo do medicamento
    const priceMap = {
      "Analgésico": "R$ 12,00",
      "Anti-inflamatório": "R$ 15,00", 
      "Antibiótico": "R$ 25,00",
      "Antialérgico": "R$ 18,00"
    };
    return priceMap[medicamento.tipo] || "R$ 20,00";
  };

  const handleAddMedicamento = (medicamento) => {
    // Aqui você pode implementar a lógica para adicionar ao carrinho ou lista pessoal
    console.log("Medicamento adicionado:", medicamento);
    alert(`${medicamento.nome} adicionado à sua lista!`);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col transition-all  duration-300">
        {/* Navbar */}
        <div className="h-20 bg-sky-600 shadow flex items-center px-6 sticky top-0 z-10">
          <h1 className="text-3xl font-bold text-white">Medicamentos</h1>
        </div>

        {/* Conteúdo da lista */}
        <div className="p-6 overflow-y-auto flex-1 ml-20 lg:ml-60">
          {/* Barra de busca */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nome, tipo ou descrição..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <FaSpinner className="animate-spin text-sky-600 text-4xl mb-4" />
              <p className="text-gray-600 text-lg">Carregando medicamentos...</p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <p className="text-red-600 font-medium">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Tentar Novamente
              </button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredMedicamentos.length === 0 && (
            <div className="text-center py-12">
              <FaPills className="text-gray-300 text-6xl mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {search ? "Nenhum medicamento encontrado para sua busca." : "Nenhum medicamento cadastrado."}
              </p>
              {search && (
                <button 
                  onClick={() => setSearch("")}
                  className="mt-2 text-sky-600 hover:text-sky-700 underline"
                >
                  Limpar busca
                </button>
              )}
            </div>
          )}

          {/* Lista de Medicamentos */}
          {!isLoading && !error && filteredMedicamentos.length > 0 && (
            <div className="space-y-4">
              <p className="text-gray-600 text-sm">
                {filteredMedicamentos.length} medicamento(s) encontrado(s)
                {search && ` para "${search}"`}
              </p>
              
              {filteredMedicamentos.map((med) => (
                <div
                  key={med.id_medicamento}
                  className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="text-sky-600 text-2xl mt-1">
                        <FaPills />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-xl text-gray-900">{med.nome}</h3>
                          <span className="bg-sky-100 text-sky-800 text-xs font-medium px-2 py-1 rounded-full">
                            {med.tipo}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{med.descricao}</p>
                        
                        {/* Informações detalhadas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-500">
                          <div>
                            <span className="font-medium">Composição:</span> {med.composicao}
                          </div>
                          <div>
                            <span className="font-medium">Dosagem:</span> {med.dosagem_padrao}
                          </div>
                          <div>
                            <span className="font-medium">Faixa Etária:</span> {med.faixa_etaria_minima} - {med.faixa_etaria_maxima} anos
                          </div>
                          {med.contraindicacoes && (
                            <div>
                              <span className="font-medium text-red-600">Cuidado:</span> {med.contraindicacoes}
                            </div>
                          )}
                        </div>

                        {/* Interações */}
                        {med.interacoes_comuns && (
                          <div className="mt-2">
                            <span className="font-medium text-orange-600 text-sm">Interações:</span> 
                            <span className="text-sm text-gray-600 ml-1">{med.interacoes_comuns}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 ml-4">
                      <span className="font-bold text-xl text-gray-900">
                        {formatPrice(med)}
                      </span>
                      <button 
                        onClick={() => handleAddMedicamento(med)}
                        className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors font-medium flex items-center gap-2"
                      >
                        <FaPills size={14} />
                        Adicionar
                      </button>
                      {med.bula_detalhada && (
                        <a 
                          href={med.bula_detalhada}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-600 hover:text-sky-700 text-sm underline"
                        >
                          Ver bula completa
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Medicamentos;