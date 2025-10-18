const db = require('./db');

const seedProtocolos = async () => {
  try {
    console.log('🌱 Iniciando seed dos protocolos...');

    // 1. PROTOCOLOS BASE (GERAIS)
    const protocolosBase = [
      {
        nome: 'Cefaleia (Dor de Cabeça)',
        categoria: 'sintoma',
        palavras_chave: JSON.stringify(['dor', 'cabeça', 'cefaleia', 'enxaqueca']),
        perguntas: JSON.stringify([
          {
            id: 1,
            pergunta: "Há quanto tempo você está com essa dor?",
            tipo: "tempo",
            opcoes: ["Menos de 1 hora", "1-24 horas", "1-3 dias", "Mais de 3 dias"]
          },
          {
            id: 2,
            pergunta: "Em uma escala de 0 a 10, quão forte é sua dor?",
            tipo: "intensidade",
            opcoes: ["0-3 (Leve)", "4-6 (Moderada)", "7-8 (Forte)", "9-10 (Muito Forte)"]
          },
          {
            id: 3,
            pergunta: "A dor começou de repente e é a pior da sua vida?",
            tipo: "critico",
            opcoes: ["Sim", "Não"]
          }
        ]),
        criterios_risco: JSON.stringify({
          alto: ["dor_intensa", "inicio_subito"],
          medio: ["dor_moderada", "duracao_prolongada"],
          baixo: ["dor_leve", "duracao_curta"]
        }),
        nivel_complexidade: 'basico',
        requer_enfermeiro: false,
        tempo_estimado: 5,
        tipo_protocolo: 'geral'
      },
      {
        nome: 'Problemas Respiratórios',
        categoria: 'sintoma',
        palavras_chave: JSON.stringify(['respirar', 'falta', 'ar', 'asfixia', 'sufoco']),
        perguntas: JSON.stringify([
          {
            id: 1,
            pergunta: "Você está com falta de ar em repouso?",
            tipo: "critico",
            opcoes: ["Sim", "Não"]
          },
          {
            id: 2,
            pergunta: "Seus lábios ou unhas estão azulados?",
            tipo: "critico",
            opcoes: ["Sim", "Não"]
          },
          {
            id: 3,
            pergunta: "Há quanto tempo está com essa dificuldade?",
            tipo: "tempo",
            opcoes: ["Minutos", "Horas", "Dias"]
          }
        ]),
        criterios_risco: JSON.stringify({
          alto: ["falta_ar_repouso", "cianose"],
          medio: ["falta_ar_esforco"],
          baixo: ["desconforto_leve"]
        }),
        nivel_complexidade: 'intermediario',
        requer_enfermeiro: true,
        tempo_estimado: 7,
        tipo_protocolo: 'geral'
      },
      {
        nome: 'Febre',
        categoria: 'sintoma',
        palavras_chave: JSON.stringify(['febre', 'temperatura', 'calor', 'quente']),
        perguntas: JSON.stringify([
          {
            id: 1,
            pergunta: "Qual é sua temperatura?",
            tipo: "intensidade",
            opcoes: ["Até 38°C", "38-39°C", "Acima de 39°C"]
          },
          {
            id: 2,
            pergunta: "Há quanto tempo está com febre?",
            tipo: "tempo",
            opcoes: ["Menos de 24h", "1-3 dias", "Mais de 3 dias"]
          }
        ]),
        criterios_risco: JSON.stringify({
          alto: ["febre_alta", "duracao_prolongada"],
          medio: ["febre_moderada"],
          baixo: ["febre_baixa"]
        }),
        nivel_complexidade: 'basico',
        requer_enfermeiro: false,
        tempo_estimado: 4,
        tipo_protocolo: 'geral'
      }
    ];

    // Inserir protocolos base
    const protocolosInseridos = [];
    for (const protocolo of protocolosBase) {
      const query = `
        INSERT INTO protocolos (nome, categoria, palavras_chave, perguntas, criterios_risco, 
                               nivel_complexidade, requer_enfermeiro, tempo_estimado, tipo_protocolo, ativo)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)
        RETURNING id_protocolo, nome
      `;
      
      const values = [
        protocolo.nome, protocolo.categoria, protocolo.palavras_chave,
        protocolo.perguntas, protocolo.criterios_risco, protocolo.nivel_complexidade,
        protocolo.requer_enfermeiro, protocolo.tempo_estimado, protocolo.tipo_protocolo
      ];
      
      const result = await db.query(query, values);
      protocolosInseridos.push(result.rows[0]);
      console.log(`✅ Protocolo base criado: ${result.rows[0].nome}`);
    }

    // 2. PROTOCOLOS ESPECIALIZADOS
    const protocolosEspecializados = [
      {
        nome: 'Cefaleia - Paciente Hipertenso',
        categoria: 'sintoma',
        condicao_especifica: 'hipertensao',
        protocolo_pai: protocolosInseridos.find(p => p.nome.includes('Cefaleia')).id_protocolo,
        palavras_chave: JSON.stringify(['dor', 'cabeça', 'cefaleia', 'pressão']),
        perguntas: JSON.stringify([
          {
            id: 1,
            pergunta: "Há quanto tempo você está com essa dor?",
            tipo: "tempo",
            opcoes: ["Menos de 1 hora", "1-24 horas", "1-3 dias", "Mais de 3 dias"]
          },
          {
            id: 2,
            pergunta: "Em uma escala de 0 a 10, quão forte é sua dor?",
            tipo: "intensidade",
            opcoes: ["0-3 (Leve)", "4-6 (Moderada)", "7-8 (Forte)", "9-10 (Muito Forte)"]
          },
          {
            id: 3,
            pergunta: "Verificou sua pressão arterial recentemente?",
            tipo: "critico",
            opcoes: ["Sim, estava normal", "Sim, estava alta", "Não verifiquei"]
          },
          {
            id: 4,
            pergunta: "Está tomando regularmente os medicamentos para pressão?",
            tipo: "medicamento",
            opcoes: ["Sim, todos os dias", "Às vezes esqueço", "Não estou tomando"]
          },
          {
            id: 5,
            pergunta: "Sente palpitações, tontura ou visão turva junto com a dor?",
            tipo: "critico",
            opcoes: ["Sim", "Não"]
          }
        ]),
        criterios_risco: JSON.stringify({
          alto: ["pressao_alta", "sintomas_associados", "medicacao_irregular"],
          medio: ["dor_intensa", "pressao_nao_verificada"],
          baixo: ["dor_leve", "pressao_controlada"]
        }),
        nivel_complexidade: 'avancado',
        requer_enfermeiro: true,
        tempo_estimado: 8,
        tipo_protocolo: 'especializado'
      },
      {
        nome: 'Cefaleia - Paciente Diabético',
        categoria: 'sintoma',
        condicao_especifica: 'diabetes',
        protocolo_pai: protocolosInseridos.find(p => p.nome.includes('Cefaleia')).id_protocolo,
        palavras_chave: JSON.stringify(['dor', 'cabeça', 'cefaleia', 'diabetes']),
        perguntas: JSON.stringify([
          {
            id: 1,
            pergunta: "Há quanto tempo você está com essa dor?",
            tipo: "tempo",
            opcoes: ["Menos de 1 hora", "1-24 horas", "1-3 dias", "Mais de 3 dias"]
          },
          {
            id: 2,
            pergunta: "Em uma escala de 0 a 10, quão forte é sua dor?",
            tipo: "intensidade",
            opcoes: ["0-3 (Leve)", "4-6 (Moderada)", "7-8 (Forte)", "9-10 (Muito Forte)"]
          },
          {
            id: 3,
            pergunta: "Verificou sua glicemia (açúcar no sangue) hoje?",
            tipo: "critico",
            opcoes: ["Sim, estava normal", "Sim, estava alta", "Sim, estava baixa", "Não verifiquei"]
          },
          {
            id: 4,
            pergunta: "Está se alimentando normalmente?",
            tipo: "medicamento",
            opcoes: ["Sim, normalmente", "Pouco apetite", "Não consegui comer"]
          },
          {
            id: 5,
            pergunta: "Sente fraqueza, tremores ou suor excessivo?",
            tipo: "critico",
            opcoes: ["Sim", "Não"]
          }
        ]),
        criterios_risco: JSON.stringify({
          alto: ["glicemia_alterada", "sintomas_hipoglicemia", "jejum_prolongado"],
          medio: ["glicemia_nao_verificada", "apetite_reduzido"],
          baixo: ["glicemia_normal", "alimentacao_normal"]
        }),
        nivel_complexidade: 'avancado',
        requer_enfermeiro: true,
        tempo_estimado: 8,
        tipo_protocolo: 'especializado'
      },
      {
        nome: 'Problemas Respiratórios - Paciente Asmático',
        categoria: 'sintoma',
        condicao_especifica: 'asma',
        protocolo_pai: protocolosInseridos.find(p => p.nome.includes('Respiratórios')).id_protocolo,
        palavras_chave: JSON.stringify(['respirar', 'falta', 'ar', 'asma', 'bombinha']),
        perguntas: JSON.stringify([
          {
            id: 1,
            pergunta: "Está com falta de ar em repouso?",
            tipo: "critico",
            opcoes: ["Sim", "Não"]
          },
          {
            id: 2,
            pergunta: "Usou a bombinha (broncodilatador) hoje?",
            tipo: "medicamento",
            opcoes: ["Sim, melhorou", "Sim, não melhorou", "Não usei", "Não tenho"]
          },
          {
            id: 3,
            pergunta: "Quantas vezes precisou usar a bombinha nas últimas 24h?",
            tipo: "intensidade",
            opcoes: ["Nenhuma", "1-2 vezes", "3-4 vezes", "Mais de 4 vezes"]
          },
          {
            id: 4,
            pergunta: "Está com chiado no peito ou tosse seca?",
            tipo: "critico",
            opcoes: ["Sim", "Não"]
          },
          {
            id: 5,
            pergunta: "Teve contato com algum gatilho conhecido (poeira, perfume, etc.)?",
            tipo: "tempo",
            opcoes: ["Sim", "Não", "Não sei"]
          }
        ]),
        criterios_risco: JSON.stringify({
          alto: ["falta_ar_repouso", "bombinha_ineficaz", "uso_frequente_bombinha"],
          medio: ["chiado_peito", "exposicao_gatilhos"],
          baixo: ["sintomas_leves", "bombinha_eficaz"]
        }),
        nivel_complexidade: 'avancado',
        requer_enfermeiro: true,
        tempo_estimado: 10,
        tipo_protocolo: 'especializado'
      }
    ];

    // Inserir protocolos especializados
    for (const protocolo of protocolosEspecializados) {
      const query = `
        INSERT INTO protocolos (nome, categoria, condicao_especifica, protocolo_pai, palavras_chave, 
                               perguntas, criterios_risco, nivel_complexidade, requer_enfermeiro, 
                               tempo_estimado, tipo_protocolo, ativo)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true)
        RETURNING id_protocolo, nome
      `;
      
      const values = [
        protocolo.nome, protocolo.categoria, protocolo.condicao_especifica,
        protocolo.protocolo_pai, protocolo.palavras_chave, protocolo.perguntas,
        protocolo.criterios_risco, protocolo.nivel_complexidade, protocolo.requer_enfermeiro,
        protocolo.tempo_estimado, protocolo.tipo_protocolo
      ];
      
      const result = await db.query(query, values);
      console.log(`🎯 Protocolo especializado criado: ${result.rows[0].nome}`);
    }

    console.log('✅ Seed dos protocolos concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro no seed dos protocolos:', error);
    throw error;
  }
};

module.exports = seedProtocolos;