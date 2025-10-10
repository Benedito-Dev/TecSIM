const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar tabelas (opcional - cuidado em produção!)
//   if (process.env.NODE_ENV === 'development') {
//     console.log('🧹 Limpando tabelas...');
//     await prisma.$executeRaw`TRUNCATE TABLE paciente, medicos, medicamentos, prescricoes CASCADE;`;
//   }

  // Criar medicamentos de exemplo
//   const medicamentos = await prisma.medicamento.createMany({
//     data: [
//       {
//         nome: "Paracetamol",
//         tipo: "Analgésico",
//         descricao: "Analgésico e antitérmico",
//         dosagem_padrao: "500mg"
//       },
//       {
//         nome: "Ibuprofeno",
//         tipo: "Anti-inflamatório",
//         descricao: "Anti-inflamatório não esteroidal",
//         dosagem_padrao: "400mg"
//       }
//     ]
//   });

  // Criar médico de exemplo
  const medico = await prisma.medico.create({
    data: {
      nome: "Dr. João Silva",
      crm: "CRM/SP 123456",
      especialidade: "Clínico Geral",
      email: "dr.joao@email.com",
      senha: "$2b$10$examplehashedpassword", // Senha hashada
      telefone: "(11) 99999-9999"
    }
  });

  console.log('✅ Seed concluído com sucesso!');
  console.log(`📦 ${medicamentos.count} medicamentos criados`);
  console.log(`👨‍⚕️ Médico criado: ${medico.nome}`);
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });