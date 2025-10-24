import { gerarContextoFarmaceutico, calcularDiasUltimaCompra } from '../data/mockAdesaoData';

export const gerarResumoContextual = (paciente, condicoes = []) => {
  const contextoAdesao = gerarContextoFarmaceutico(paciente.id);
  const idade = calcularIdade(paciente.dataNascimento);
  const nivelRisco = determinarNivelRisco(condicoes, contextoAdesao);
  
  // Resumo COMPACTO para ganhar tempo
  const resumoRapido = gerarResumoRapido(paciente, contextoAdesao, nivelRisco, idade);
  
  return {
    resumoCompleto: resumoRapido,
    nivelRisco,
    contextoAdesao,
    sugestoesEspecificas: gerarSugestoesEspecificas(paciente, contextoAdesao)
  };
};

const gerarResumoRapido = (paciente, contextoAdesao, nivelRisco, idade) => {
  const nome = paciente.nome.split(' ')[0]; // Só primeiro nome
  
  if (!contextoAdesao) {
    return `👋 Olá! Atendimento para **${nome}** (${idade} anos)\n\n⚠️ Sem histórico de medicação registrado.\n\n💬 Como posso ajudar hoje?`;
  }
  
  const { ultimaCompra, diasUltimaCompra, scoreAdesao, risco } = contextoAdesao;
  const medicamento = contextoAdesao.medicamentosAtivos[0]?.nome || 'medicação';
  const diasRestantes = contextoAdesao.medicamentosAtivos[0]?.diasRestantes || 0;
  
  // Mensagem baseada no risco
  let statusMsg = '';
  let abordagem = '';
  
  if (risco === 'baixo') {
    statusMsg = `✅ Adesão regular (${scoreAdesao}%)`;
    abordagem = 'Parabenize a regularidade';
  } else if (risco === 'medio') {
    statusMsg = `⚠️ Adesão irregular (${scoreAdesao}%)`;
    abordagem = 'Investigue dificuldades';
  } else {
    statusMsg = `🚨 Risco alto (${scoreAdesao}%)`;
    abordagem = 'Intervenção necessária';
  }
  
  return `👋 **${nome}** • ${ultimaCompra.loja} há ${diasUltimaCompra} dias\n\n💊 ${medicamento} - ${diasRestantes} dias restantes\n${statusMsg}\n\n🎯 ${abordagem}\n\n💬 Como posso ajudar?`;
};

const calcularIdade = (dataNascimento) => {
  if (!dataNascimento) return 'idade não informada';
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  const idade = hoje.getFullYear() - nascimento.getFullYear();
  const mesAtual = hoje.getMonth();
  const mesNascimento = nascimento.getMonth();
  
  if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
    return idade - 1;
  }
  return idade;
};

const determinarNivelRisco = (condicoes, contextoAdesao) => {
  let pontuacaoRisco = 0;
  let fatoresRisco = [];
  
  // Análise das condições médicas
  condicoes.forEach(condicao => {
    switch (condicao.condicao) {
      case 'hipertensao':
        pontuacaoRisco += condicao.severidade === 'severa' ? 3 : condicao.severidade === 'moderada' ? 2 : 1;
        fatoresRisco.push('Hipertensão');
        break;
      case 'diabetes':
        pontuacaoRisco += condicao.severidade === 'severa' ? 3 : condicao.severidade === 'moderada' ? 2 : 1;
        fatoresRisco.push('Diabetes');
        break;
      case 'cardiaco':
        pontuacaoRisco += 4;
        fatoresRisco.push('Cardiopatia');
        break;
      case 'asma':
        pontuacaoRisco += condicao.severidade === 'severa' ? 2 : 1;
        fatoresRisco.push('Asma');
        break;
    }
  });
  
  // Análise da adesão
  if (contextoAdesao) {
    if (contextoAdesao.scoreAdesao < 70) {
      pontuacaoRisco += 3;
      fatoresRisco.push('Baixa adesão');
    } else if (contextoAdesao.scoreAdesao < 85) {
      pontuacaoRisco += 1;
      fatoresRisco.push('Adesão irregular');
    }
    
    if (contextoAdesao.diasUltimaCompra > 35) {
      pontuacaoRisco += 2;
      fatoresRisco.push('Compra atrasada');
    }
  }
  
  // Classificação final
  if (pontuacaoRisco >= 6) {
    return {
      nivel: 'ALTO',
      cor: 'red',
      justificativa: fatoresRisco.join(', '),
      pontuacao: pontuacaoRisco
    };
  } else if (pontuacaoRisco >= 3) {
    return {
      nivel: 'MÉDIO',
      cor: 'yellow',
      justificativa: fatoresRisco.join(', '),
      pontuacao: pontuacaoRisco
    };
  } else {
    return {
      nivel: 'BAIXO',
      cor: 'green',
      justificativa: 'Perfil estável',
      pontuacao: pontuacaoRisco
    };
  }
};

// Funções removidas para simplificar - agora tudo no resumo rápido

const gerarSugestoesEspecificas = (paciente, contextoAdesao) => {
  const sugestoes = [];
  
  if (contextoAdesao) {
    contextoAdesao.medicamentosAtivos.forEach(med => {
      if (med.diasRestantes <= 7) {
        sugestoes.push(`⚠️ ${med.nome} acabando em ${med.diasRestantes} dias - verificar necessidade de nova receita`);
      }
      
      if (med.alertas > 0) {
        sugestoes.push(`🚨 ${med.nome} com ${med.alertas} alerta(s) - investigar irregularidade`);
      }
    });
  }
  
  return sugestoes;
};