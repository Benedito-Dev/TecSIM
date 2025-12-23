import { useState, useEffect } from 'react';

export const usePacienteCondicoes = (pacienteId) => {
  const [condicoes, setCondicoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const carregarCondicoes = async () => {
    if (!pacienteId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Simula dados mockados
      const mockData = [];
      setCondicoes(mockData);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao carregar condições:', err);
    } finally {
      setLoading(false);
    }
  };

  const adicionarCondicao = async (novaCondicao) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/pacientes/${pacienteId}/condicoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaCondicao)
      });
      
      if (!response.ok) throw new Error('Erro ao adicionar condição');
      
      const condicaoAdicionada = await response.json();
      setCondicoes(prev => [...prev, condicaoAdicionada]);
      
      return condicaoAdicionada;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const atualizarCondicao = async (idCondicao, dadosAtualizados) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/pacientes/condicoes/${idCondicao}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosAtualizados)
      });
      
      if (!response.ok) throw new Error('Erro ao atualizar condição');
      
      const condicaoAtualizada = await response.json();
      setCondicoes(prev => 
        prev.map(c => c.id_condicao === idCondicao ? condicaoAtualizada : c)
      );
      
      return condicaoAtualizada;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removerCondicao = async (idCondicao) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/pacientes/condicoes/${idCondicao}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Erro ao remover condição');
      
      setCondicoes(prev => prev.filter(c => c.id_condicao !== idCondicao));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarCondicoes();
  }, [pacienteId]);

  return {
    condicoes,
    loading,
    error,
    carregarCondicoes,
    adicionarCondicao,
    atualizarCondicao,
    removerCondicao
  };
};