const createTables = require('./dbinit');
const migrateProtocolos = require('./migrateProtocolos');
const seedProtocolos = require('./seedProtocolos');
const seedCondicoes = require('./seedCondicoes');

const runAllSeeds = async () => {
  try {
    console.log('🚀 Iniciando processo completo de seed...\n');

    // 1. Criar tabelas primeiro
    console.log('📊 Criando/verificando tabelas...');
    await createTables();
    console.log('✅ Tabelas prontas!\n');

    // 2. Migrar tabela protocolos
    console.log('🔧 Migrando tabela protocolos...');
    await migrateProtocolos();
    console.log('✅ Migração concluída!\n');

    // 3. Inserir protocolos
    console.log('🩺 Inserindo protocolos de triagem...');
    await seedProtocolos();
    console.log('✅ Protocolos inseridos!\n');

    // 4. Inserir condições de exemplo
    console.log('🏥 Inserindo condições médicas de exemplo...');
    await seedCondicoes();
    console.log('✅ Condições inseridas!\n');

    console.log('🎉 Processo de seed concluído com sucesso!');
    console.log('\n📋 Resumo:');
    console.log('   • Tabelas criadas/verificadas');
    console.log('   • Migração de protocolos executada');
    console.log('   • 3 protocolos base inseridos');
    console.log('   • 3 protocolos especializados inseridos');
    console.log('   • Condições médicas de exemplo inseridas');
    console.log('\n🚀 Sistema pronto para uso!');

  } catch (error) {
    console.error('❌ Erro durante o processo de seed:', error);
    process.exit(1);
  }
};

// Executar se chamado diretamente
if (require.main === module) {
  runAllSeeds()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('❌ Falha crítica:', error);
      process.exit(1);
    });
}

module.exports = runAllSeeds;