const db = require('./db');

const migrateProtocolos = async () => {
  try {
    console.log('🔧 Verificando e adicionando colunas na tabela protocolos...');

    // Verificar se as colunas já existem
    const checkColumns = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'protocolos' 
      AND column_name IN ('condicao_especifica', 'protocolo_pai', 'tipo_protocolo')
    `;
    
    const existingColumns = await db.query(checkColumns);
    const columnNames = existingColumns.rows.map(row => row.column_name);

    // Adicionar colunas que não existem
    if (!columnNames.includes('condicao_especifica')) {
      await db.query('ALTER TABLE protocolos ADD COLUMN condicao_especifica VARCHAR(50)');
      console.log('✅ Coluna condicao_especifica adicionada');
    }

    if (!columnNames.includes('protocolo_pai')) {
      await db.query('ALTER TABLE protocolos ADD COLUMN protocolo_pai INTEGER');
      console.log('✅ Coluna protocolo_pai adicionada');
    }

    if (!columnNames.includes('tipo_protocolo')) {
      await db.query(`ALTER TABLE protocolos ADD COLUMN tipo_protocolo VARCHAR(20) DEFAULT 'geral' CHECK (tipo_protocolo IN ('geral', 'especializado'))`);
      console.log('✅ Coluna tipo_protocolo adicionada');
    }

    // Adicionar foreign key se não existir
    const checkConstraint = `
      SELECT constraint_name 
      FROM information_schema.table_constraints 
      WHERE table_name = 'protocolos' 
      AND constraint_name = 'fk_protocolo_pai'
    `;
    
    const constraintExists = await db.query(checkConstraint);
    
    if (constraintExists.rows.length === 0) {
      await db.query('ALTER TABLE protocolos ADD CONSTRAINT fk_protocolo_pai FOREIGN KEY (protocolo_pai) REFERENCES protocolos(id_protocolo)');
      console.log('✅ Foreign key fk_protocolo_pai adicionada');
    }

    console.log('✅ Migração da tabela protocolos concluída!');
    
  } catch (error) {
    console.error('❌ Erro na migração:', error);
    throw error;
  }
};

module.exports = migrateProtocolos;