import { useState, useMemo } from 'react';

export const useAtendimentoData = (paciente) => {
  const [queixaPrincipal, setQueixaPrincipal] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [resultadoTriagem, setResultadoTriagem] = useState(null);
  const [emTriagem, setEmTriagem] = useState(false);

  const tipoGrafico = useMemo(() => {
    const condicoes = paciente?.condicoesCronicas || [];
    const isDiabetico = condicoes.some(c => 
      c.toLowerCase().includes('diabetes') || c.toLowerCase().includes('diabético')
    );
    const isHipertenso = condicoes.some(c => 
      c.toLowerCase().includes('hipertensão') || c.toLowerCase().includes('hipertenso')
    );
    
    if (isDiabetico && isHipertenso) return 'ambos';
    if (isDiabetico) return 'diabetes';
    if (isHipertenso) return 'hipertensao';
    return 'geral';
  }, [paciente?.condicoesCronicas]);

  const resumoContextual = useMemo(() => {
    const idade = paciente?.idade || Math.floor(Math.random() * 40) + 25;
    const temAlergias = paciente?.alergias?.length > 0;
    const temMedicamentos = paciente?.medicamentosContinuos?.length > 0;
    
    const perfis = {
      diabetes: {
        perfil: `Paciente de ${idade} anos com diabetes tipo 2. ${temMedicamentos ? 'Uso regular de medicação.' : 'Controle por dieta.'} HbA1c: ${(Math.random() * 2 + 6.5).toFixed(1)}%.`,
        padrao: `Consultas ${idade > 60 ? 'mensais' : 'bimestrais'} com monitoramento glicêmico.`,
        indicadores: { adesao: Math.floor(Math.random() * 20) + 75, condicao: 'Controlada' }
      },
      hipertensao: {
        perfil: `Paciente de ${idade} anos com hipertensão arterial. PA média: ${120 + Math.floor(Math.random() * 30)}/${80 + Math.floor(Math.random() * 20)} mmHg.`,
        padrao: `Acompanhamento ${temMedicamentos ? 'trimestral' : 'semestral'} com MAPA quando necessário.`,
        indicadores: { adesao: Math.floor(Math.random() * 25) + 70, condicao: 'Estável' }
      },
      ambos: {
        perfil: `Paciente de ${idade} anos com síndrome metabólica (DM2 + HAS). Risco cardiovascular ${idade > 55 ? 'alto' : 'moderado'}.`,
        padrao: `Protocolo intensivo com consultas mensais. Equipe multidisciplinar envolvida.`,
        indicadores: { adesao: Math.floor(Math.random() * 15) + 80, condicao: 'Multimorbidade' }
      },
      geral: {
        perfil: `Paciente de ${idade} anos em acompanhamento ${idade < 30 ? 'preventivo jovem' : 'de rotina'}.`,
        padrao: `Check-ups ${idade > 50 ? 'semestrais' : 'anuais'} com foco preventivo.`,
        indicadores: { adesao: Math.floor(Math.random() * 10) + 90, condicao: 'Preventivo' }
      }
    };
    
    return perfis[tipoGrafico] || perfis.geral;
  }, [paciente, tipoGrafico]);

  const handleTriagemComplete = (resultado) => {
    setResultadoTriagem(resultado);
    if (!queixaPrincipal) {
      setQueixaPrincipal(`Triagem realizada: ${resultado.classificacao}`);
    }
  };

  return {
    queixaPrincipal,
    setQueixaPrincipal,
    observacoes,
    setObservacoes,
    resultadoTriagem,
    emTriagem,
    setEmTriagem,
    tipoGrafico,
    resumoContextual,
    handleTriagemComplete
  };
};