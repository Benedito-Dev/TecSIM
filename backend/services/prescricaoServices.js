const prescricaoRepository = require('../repository/prescricaoRepository');
const medicamentoPrescritoRepository = require('../repository/medicamentosPrescritosRepository');
const db = require('../db/db');
const { ConflictError, DatabaseError } = require('../utils/errors');

class PrescricaoService {
  async findAll() {
    return await prescricaoRepository.findAll();
  }

  async findById(id) {
    return await prescricaoRepository.findById(id);
  }

  async findByPacienteId(id_paciente) {
    return await prescricaoRepository.findByPacienteId(id_paciente);
  }

  async findByMedicoCrm(crm) {
    return await prescricaoRepository.findByMedicoCrm(crm);
  }

  /**
   * Cria prescrição junto com medicamentos num único fluxo transacional
   * @param {*} data - { paciente_id, medico_crm, observacoes, medicamentos: [ {...}, {...} ] }
   */
  async create(data) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Cria a prescrição
      const prescricao = await prescricaoRepository.create(data, client);

      // 2. Cria os medicamentos vinculados
      if (data.medicamentos && data.medicamentos.length > 0) {
        const medicamentosComPrescricao = data.medicamentos.map(med => ({
          ...med,
          id_prescricao: prescricao.id
        }));

        await medicamentoPrescritoRepository.createMany(medicamentosComPrescricao, client);
      }

      await client.query('COMMIT');
      return prescricao;
    } catch (err) {
      await client.query('ROLLBACK');
      throw new DatabaseError('Erro ao criar prescrição com medicamentos');
    } finally {
      client.release();
    }
  }

  async update(id, data) {
    return await prescricaoRepository.update(id, data);
  }

  async remove(id) {
    return await prescricaoRepository.remove(id);
  }
}

module.exports = new PrescricaoService();
