const db = require('../../db/db');
const Composition = require('../../models/openEHR/composition');

class CompositionRepository {
  async create(compositionData) {
    try {
      // Gerar composition_id se não fornecido
      if (!compositionData.composition_id) {
        compositionData.composition_id = Composition.generateCompositionId();
      }

      const query = `
        INSERT INTO ehr_compositions 
        (composition_id, paciente_id, template_id, composition_data, version, status, author)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      
      const params = [
        compositionData.composition_id,
        compositionData.paciente_id,
        compositionData.template_id,
        JSON.stringify(compositionData.composition_data),
        compositionData.version || 1,
        compositionData.status || 'active',
        compositionData.author || 'system'
      ];

      const result = await db.query(query, params);
      const row = result.rows[0];
      
      return new Composition({
        id: row.id,
        composition_id: row.composition_id,
        paciente_id: row.paciente_id,
        template_id: row.template_id,
        composition_data: row.composition_data,
        version: row.version,
        status: row.status,
        author: row.author,
        created_at: row.created_at,
        updated_at: row.updated_at
      });

    } catch (error) {
      throw new Error(`Erro ao criar composição: ${error.message}`);
    }
  }

  async findByPatientId(pacienteId, options = {}) {
    try {
      const { limit = 50, offset = 0, templateId, status = 'active' } = options;
      
      let query = `
        SELECT ec.*, p.nome as paciente_nome
        FROM ehr_compositions ec
        INNER JOIN paciente p ON ec.paciente_id = p.id
        WHERE ec.paciente_id = $1 AND ec.status = $2
      `;
      
      const params = [pacienteId, status];
      let paramCount = 2;

      if (templateId) {
        paramCount++;
        query += ` AND ec.template_id = $${paramCount}`;
        params.push(templateId);
      }

      query += ` ORDER BY ec.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
      params.push(limit, offset);

      const result = await db.query(query, params);
      
      return result.rows.map(row => new Composition({
        id: row.id,
        composition_id: row.composition_id,
        paciente_id: row.paciente_id,
        template_id: row.template_id,
        composition_data: row.composition_data,
        version: row.version,
        status: row.status,
        author: row.author,
        created_at: row.created_at,
        updated_at: row.updated_at
      }));

    } catch (error) {
      throw new Error(`Erro ao buscar composições: ${error.message}`);
    }
  }

  async findById(compositionId) {
    try {
      const query = `
        SELECT ec.*, p.nome as paciente_nome
        FROM ehr_compositions ec
        INNER JOIN paciente p ON ec.paciente_id = p.id
        WHERE ec.composition_id = $1
      `;
      
      const result = await db.query(query, [compositionId]);
      
      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return new Composition({
        id: row.id,
        composition_id: row.composition_id,
        paciente_id: row.paciente_id,
        template_id: row.template_id,
        composition_data: row.composition_data,
        version: row.version,
        status: row.status,
        author: row.author,
        created_at: row.created_at,
        updated_at: row.updated_at
      });

    } catch (error) {
      throw new Error(`Erro ao buscar composição: ${error.message}`);
    }
  }

  async update(compositionId, updateData) {
    try {
      // Buscar composição existente
      const existing = await this.findById(compositionId);
      if (!existing) {
        throw new Error('Composição não encontrada');
      }

      // Marcar versão anterior como modificada
      await db.query(
        'UPDATE ehr_compositions SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE composition_id = $2',
        ['modified', compositionId]
      );

      // Criar nova versão
      const newCompositionData = {
        ...existing,
        ...updateData,
        composition_id: Composition.generateCompositionId(),
        version: existing.version + 1,
        previous_version: compositionId,
        status: 'active'
      };

      return await this.create(newCompositionData);

    } catch (error) {
      throw new Error(`Erro ao atualizar composição: ${error.message}`);
    }
  }

  async delete(compositionId) {
    try {
      // Soft delete - marcar como inativa
      const query = `
        UPDATE ehr_compositions 
        SET status = $1, updated_at = CURRENT_TIMESTAMP 
        WHERE composition_id = $2
        RETURNING *
      `;
      
      const result = await db.query(query, ['inactive', compositionId]);
      
      if (result.rows.length === 0) {
        throw new Error('Composição não encontrada');
      }

      const row = result.rows[0];
      return new Composition({
        id: row.id,
        composition_id: row.composition_id,
        paciente_id: row.paciente_id,
        template_id: row.template_id,
        composition_data: row.composition_data,
        version: row.version,
        status: row.status,
        author: row.author,
        created_at: row.created_at,
        updated_at: row.updated_at
      });

    } catch (error) {
      throw new Error(`Erro ao deletar composição: ${error.message}`);
    }
  }

  async getPatientClinicalSummary(pacienteId) {
    try {
      const query = `
        SELECT 
          template_id,
          COUNT(*) as total_records,
          MAX(created_at) as last_record,
          AVG((composition_data->>'systolic')::numeric) as avg_systolic,
          AVG((composition_data->>'diastolic')::numeric) as avg_diastolic,
          AVG((composition_data->>'heart_rate')::numeric) as avg_heart_rate
        FROM ehr_compositions 
        WHERE paciente_id = $1 AND status = 'active'
        GROUP BY template_id
      `;
      
      const result = await db.query(query, [pacienteId]);
      return result.rows;

    } catch (error) {
      throw new Error(`Erro ao buscar resumo clínico: ${error.message}`);
    }
  }

  async findByTemplate(templateId, options = {}) {
    try {
      const { limit = 50, offset = 0, status = 'active' } = options;
      
      const query = `
        SELECT ec.*, p.nome as paciente_nome
        FROM ehr_compositions ec
        INNER JOIN paciente p ON ec.paciente_id = p.id
        WHERE ec.template_id = $1 AND ec.status = $2
        ORDER BY ec.created_at DESC
        LIMIT $3 OFFSET $4
      `;
      
      const result = await db.query(query, [templateId, status, limit, offset]);
      
      return result.rows.map(row => new Composition({
        id: row.id,
        composition_id: row.composition_id,
        paciente_id: row.paciente_id,
        template_id: row.template_id,
        composition_data: row.composition_data,
        version: row.version,
        status: row.status,
        author: row.author,
        created_at: row.created_at,
        updated_at: row.updated_at
      }));

    } catch (error) {
      throw new Error(`Erro ao buscar composições por template: ${error.message}`);
    }
  }
}

module.exports = CompositionRepository;