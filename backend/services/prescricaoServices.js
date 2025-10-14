const prescricaoRepository = require('../repository/prescricaoRepository');
const medicamentoPrescritoRepository = require('../repository/medicamentosPrescritosRepository');
const db = require('../db/db');
const { ConflictError, DatabaseError, NotFoundError } = require('../utils/errors');

class PrescricaoService {

  async findAll() {
    return await prescricaoRepository.findAll();
  }

  async findById(id) {
    const prescricao = await prescricaoRepository.findById(id);

    if (!prescricao) {
      throw new NotFoundError('Prescrição não encontrada');
    }

    // Buscar Medicamentos
    const medicamentos = await medicamentoPrescritoRepository.findByPrescricaoId(prescricao.id_prescricao);

    return {
      ...prescricao,
      medicamentos
    };
  }

  async findByPacienteId(id) {
    const prescricoes = await prescricaoRepository.findByPacienteId(id);

    // Para cada prescrição, buscar os medicamentos associados
    const prescricoesComMedicamentos = await Promise.all(
      prescricoes.map(async (prescricao) => {
        const medicamentos = await medicamentoPrescritoRepository.findByPrescricaoId(prescricao.id_prescricao);
        return {
          ...prescricao,
          medicamentos
        };
      })
    );

    return prescricoesComMedicamentos;
  }

  async findByMedicoCrm(crm) {
    return await prescricaoRepository.findByMedicoCrm(crm);
  }

  /**
   * Cria prescrição junto com medicamentos num único fluxo transacional
   * @param {*} data - { id_paciente, crm, diagnostico, observacoes, data_prescricao, medicamentos: [ {...}, {...} ] }
   */
  async create(data) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Cria a prescrição
      const prescricao = await prescricaoRepository.create(data, client);
      console.log("DEBUG - prescrição criada:", prescricao);

      // Garantir que id_prescricao exista
      prescricao.id_prescricao = prescricao.id_prescricao || prescricao.id;

      // 2. Garante que medicamentos seja array
      const medicamentos = Array.isArray(data.medicamentos) ? data.medicamentos : [];

      // 3. Cria os medicamentos vinculados
      const medicamentosComPrescricao = medicamentos.map(med => ({
        ...med,
        id_prescricao: prescricao.id_prescricao
      }));

      for (const med of medicamentosComPrescricao) {
        console.log("DEBUG - inserindo medicamento:", med);
        await medicamentoPrescritoRepository.create(med, client);
      }

      await client.query('COMMIT');

      // Retornar prescrição completa com medicamentos
      const medicamentosCriados = await medicamentoPrescritoRepository.findByPrescricaoId(prescricao.id_prescricao);
      return {
        ...prescricao,
        medicamentos: medicamentosCriados
      };
    } catch (err) {
      await client.query('ROLLBACK');
      console.error("Erro real ao criar prescrição:", err);
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
