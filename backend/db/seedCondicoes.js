const db = require('./db');

const seedCondicoes = async () => {
  try {
    console.log('🌱 Iniciando seed das condições médicas...');

    // Buscar alguns pacientes para exemplo (assumindo que existem)
    const pacientesResult = await db.query('SELECT id FROM paciente LIMIT 5');
    const pacientes = pacientesResult.rows;

    if (pacientes.length === 0) {
      console.log('⚠️ Nenhum paciente encontrado. Criando condições será pulado.');
      return;
    }

    // Condições médicas de exemplo
    const condicoesExemplo = [
      // Paciente 1 - Hipertenso
      {
        id_paciente: pacientes[0]?.id,
        condicao: 'hipertensao',
        severidade: 'moderada',
        data_diagnostico: '2023-01-15',
        medicamentos_uso: ['Losartana 50mg', 'Hidroclorotiazida 25mg'],
        observacoes: 'Pressão controlada com medicação. Paciente aderente ao tratamento.'
      },
      // Paciente 1 - Também diabético
      {
        id_paciente: pacientes[0]?.id,
        condicao: 'diabetes',
        severidade: 'leve',
        data_diagnostico: '2023-06-20',
        medicamentos_uso: ['Metformina 850mg'],
        observacoes: 'Diabetes tipo 2 recém diagnosticado. HbA1c: 7.2%'
      },
      // Paciente 2 - Asmático
      {
        id_paciente: pacientes[1]?.id,
        condicao: 'asma',
        severidade: 'moderada',
        data_diagnostico: '2020-03-10',
        medicamentos_uso: ['Salbutamol spray', 'Budesonida 200mcg'],
        observacoes: 'Asma alérgica. Gatilhos: poeira, perfumes, mudanças climáticas.'
      },
      // Paciente 3 - Cardíaco
      {
        id_paciente: pacientes[2]?.id,
        condicao: 'cardiaco',
        severidade: 'severa',
        data_diagnostico: '2022-11-05',
        medicamentos_uso: ['Carvedilol 25mg', 'Enalapril 10mg', 'AAS 100mg'],
        observacoes: 'Insuficiência cardíaca classe II. Última consulta cardiológica: 15/12/2023'
      },
      // Paciente 4 - Ansiedade
      {
        id_paciente: pacientes[3]?.id,
        condicao: 'ansiedade',
        severidade: 'moderada',
        data_diagnostico: '2023-08-12',
        medicamentos_uso: ['Sertralina 50mg'],
        observacoes: 'Transtorno de ansiedade generalizada. Acompanhamento psicológico semanal.'
      },
      // Paciente 5 - Obesidade
      {
        id_paciente: pacientes[4]?.id,
        condicao: 'obesidade',
        severidade: 'moderada',
        data_diagnostico: '2023-02-28',
        medicamentos_uso: [],
        observacoes: 'IMC: 32.5. Programa de reeducação alimentar iniciado.'
      }
    ];

    // Inserir condições
    for (const condicao of condicoesExemplo) {
      if (!condicao.id_paciente) continue;

      const query = `
        INSERT INTO paciente_condicoes 
        (id_paciente, condicao, severidade, data_diagnostico, medicamentos_uso, observacoes)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id_paciente, condicao) DO UPDATE SET
          severidade = EXCLUDED.severidade,
          medicamentos_uso = EXCLUDED.medicamentos_uso,
          observacoes = EXCLUDED.observacoes
        RETURNING id_condicao, condicao
      `;
      
      const values = [
        condicao.id_paciente,
        condicao.condicao,
        condicao.severidade,
        condicao.data_diagnostico,
        condicao.medicamentos_uso,
        condicao.observacoes
      ];
      
      const result = await db.query(query, values);
      console.log(`✅ Condição criada: ${result.rows[0].condicao} para paciente ${condicao.id_paciente}`);
    }

    console.log('✅ Seed das condições médicas concluído!');
    
  } catch (error) {
    console.error('❌ Erro no seed das condições:', error);
    throw error;
  }
};

module.exports = seedCondicoes;