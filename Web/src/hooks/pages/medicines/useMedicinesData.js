import { useState, useEffect, useCallback } from 'react';
import api from '../../../api/api';

export const useMedicinesData = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchMedicamentos = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await api.get('/medicamentos');
        setMedicamentos(response.data);
      } catch (err) {
        console.error('Erro ao buscar medicamentos:', err);
        setError('Erro ao carregar medicamentos. Usando dados de exemplo.');
        
        // Fallback para dados mock
        const mockMedicamentos = [
          {
            id_medicamento: 1,
            nome: "Paracetamol",
            tipo: "Analgésico",
            descricao: "Medicamento para dor e febre",
            composicao: "Paracetamol 500mg",
            dosagem_padrao: "1 comprimido",
            faixa_etaria_minima: 12,
            faixa_etaria_maxima: 65,
            contraindicacoes: "Problemas hepáticos",
            interacoes_comuns: "Warfarina"
          }
        ];
        setMedicamentos(mockMedicamentos);
      } finally {
        setIsLoading(false);
      }
    };

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

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleItemsPerPageChange = useCallback((value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  }, []);

  const handleAddMedicamento = useCallback((medicamento) => {
    console.log("Medicamento adicionado:", medicamento);
    alert(`${medicamento.nome} adicionado à sua lista!`);
  }, []);

  const formatPrice = (medicamento) => {
    const priceMap = {
      "Analgésico": "R$ 12,00",
      "Anti-inflamatório": "R$ 15,00", 
      "Antibiótico": "R$ 25,00",
      "Antialérgico": "R$ 18,00"
    };
    return priceMap[medicamento.tipo] || "R$ 20,00";
  };

  return {
    medicamentos,
    search,
    setSearch,
    isLoading,
    error,
    currentPage,
    itemsPerPage,
    filteredMedicamentos,
    currentMedicamentos,
    totalPages,
    handlePageChange,
    handleItemsPerPageChange,
    handleAddMedicamento,
    formatPrice
  };
};