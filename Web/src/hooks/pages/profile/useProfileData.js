import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/services/auth/authService';

export const useProfileData = () => {
  const [enfermeiro, setEnfermeiro] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEnfermeiroData = async () => {
      try {
        const userData = getCurrentUser();
        
        if (userData && userData.tipo === 'enfermeiro') {
          setEnfermeiro(userData);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do enfermeiro:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEnfermeiroData();
  }, []);

  const formatarData = (dataString) => {
    if (!dataString) return 'Não informada';
    
    try {
      const data = new Date(dataString);
      return data.toLocaleDateString('pt-BR');
    } catch {
      return 'Data inválida';
    }
  };

  const calcularExperiencia = (dataAdmissao) => {
    if (!dataAdmissao) return '2 anos';
    
    try {
      const admissao = new Date(dataAdmissao);
      const hoje = new Date();
      const anos = hoje.getFullYear() - admissao.getFullYear();
      return `${anos} ano${anos !== 1 ? 's' : ''}`;
    } catch {
      return '2 anos';
    }
  };

  const getIniciais = (nome) => {
    if (!nome) return 'EN';
    const nomes = nome.split(' ');
    if (nomes.length >= 2) {
      return (nomes[0][0] + nomes[1][0]).toUpperCase();
    }
    return nome.substring(0, 2).toUpperCase();
  };

  return {
    enfermeiro,
    loading,
    formatarData,
    calcularExperiencia,
    getIniciais
  };
};