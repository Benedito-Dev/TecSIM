const db = require('../db/db');
const { NotFoundError, DatabaseError } = require('../utils/errors');

class MedicamentoPrescritoRepository {
  async findAll(client = db) {
    try {
      const result = await client.query(`
        SELECT mp.*, m.nome AS nome
        FROM medicamentos_prescritos mp
        JOIN medicamentos m ON mp.id_medicamento = m.id_medicamento
      `);
      return result.rows;
    } catch (err) {
      throw new DatabaseError('Erro ao buscar medicamentos prescritos no banco');
    }
  }

  async findById(id, client = db) {
    try {
      const result = await client.query(
        `
        SELECT mp.*, m.nome AS nome
        FROM medicamentos_prescritos mp
        JOIN medicamentos m ON mp.id_medicamento = m.id_medicamento
        WHERE mp.id = $1
        `,
        [id]
      );
      if (!result.rows[0]) throw new NotFoundError('Medicamento prescrito não encontrado');
      return result.rows[0];
    } catch (err) {
      if (err instanceof NotFoundError) throw err;
      throw new DatabaseError('Erro ao buscar medicamento prescrito no banco');
    }
  }

  async findByPrescricaoId(id_prescricao, client = db) {
    try {
      const result = await client.query(
        `
        SELECT mp.*, m.nome AS nome
        FROM medicamentos_prescritos mp
        JOIN medicamentos m ON mp.id_medicamento = m.id_medicamento
        WHERE mp.id_prescricao = $1
        `,
        [id_prescricao]
      );
      if (!result.rows.length) throw new NotFoundError('Nenhum medicamento encontrado para esta prescrição');
      return result.rows;
    } catch (err) {
      if (err instanceof NotFoundError) throw err;
      throw new DatabaseError('Erro ao buscar medicamentos por prescrição');
    }
  }

  async create(data, client = db) {
    try {
      const result = await client.query(
        `INSERT INTO medicamentos_prescritos
          (id_prescricao, id_medicamento, dosagem, frequencia, duracao_dias, horarios, via)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          data.id_prescricao,
          data.id_medicamento,
          data.dosagem,
          data.frequencia,
          data.duracao_dias,
          data.horarios,
          data.via
        ]
      );

      // pega o nome junto do medicamento
      const created = await this.findById(result.rows[0].id, client);
      return created;
    } catch (err) {
      throw new DatabaseError('Erro ao criar medicamento prescrito no banco');
    }
  }

  async createMany(medicamentos, client = db) {
    try {
      const created = [];
      for (const med of medicamentos) {
        const result = await client.query(
          `INSERT INTO medicamentos_prescritos
            (id_prescricao, id_medicamento, dosagem, frequencia, duracao_dias, horarios, via)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING *`,
          [
            med.id_prescricao,
            med.id_medicamento,
            med.dosagem,
            med.frequencia,
            med.duracao_dias,
            med.horarios,
            med.via
          ]
        );

        // consulta novamente para trazer já com nome
        const fullMed = await this.findById(result.rows[0].id, client);
        created.push(fullMed);
      }
      return created;
    } catch (err) {
      throw new DatabaseError('Erro ao criar múltiplos medicamentos prescritos');
    }
  }

  async update(id, data, client = db) {
    try {
      const result = await client.query(
        `UPDATE medicamentos_prescritos SET
          id_prescricao   = COALESCE($1, id_prescricao),
          id_medicamento  = COALESCE($2, id_medicamento),
          dosagem         = COALESCE($3, dosagem),
          frequencia      = COALESCE($4, frequencia),
          duracao_dias    = COALESCE($5, duracao_dias),
          horarios        = COALESCE($6, horarios),
          via             = COALESCE($7, via)
         WHERE id = $8
         RETURNING *`,
        [
          data.id_prescricao || null,
          data.id_medicamento || null,
          data.dosagem || null,
          data.frequencia || null,
          data.duracao_dias || null,
          data.horarios || null,
          data.via || null,
          id
        ]
      );

      if (!result.rows[0]) throw new NotFoundError('Medicamento prescrito não encontrado para atualização');

      // retorna já com nome
      const updated = await this.findById(result.rows[0].id, client);
      return updated;
    } catch (err) {
      if (err instanceof NotFoundError) throw err;
      throw new DatabaseError('Erro ao atualizar medicamento prescrito');
    }
  }

  async remove(id, client = db) {
    try {
      const result = await client.query(
        'DELETE FROM medicamentos_prescritos WHERE id = $1 RETURNING *',
        [id]
      );
      if (!result.rows[0]) throw new NotFoundError('Medicamento prescrito não encontrado para remoção');
      return result.rows[0];
    } catch (err) {
      if (err instanceof NotFoundError) throw err;
      throw new DatabaseError('Erro ao remover medicamento prescrito');
    }
  }
}

module.exports = new MedicamentoPrescritoRepository();
